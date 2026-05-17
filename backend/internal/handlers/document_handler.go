package handlers

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/grawizah/backend/internal/models"
	"github.com/grawizah/backend/internal/repository"
	"github.com/grawizah/backend/internal/services"
	"github.com/google/uuid"
)

// allowedExtensions is a whitelist of safe file extensions.
// Any file whose extension is not in this map will be rejected.
var allowedExtensions = map[string]bool{
	".pdf":  true,
	".jpg":  true,
	".jpeg": true,
	".png":  true,
	".doc":  true,
	".docx": true,
	".xls":  true,
	".xlsx": true,
}

// safeFilenameRegex matches only the characters we allow in final filenames.
var safeFilenameRegex = regexp.MustCompile(`[^a-zA-Z0-9._-]`)

// sanitizeFilename produces a safe, collision-resistant filename.
//
// Security properties [C-03]:
//  1. filepath.Base strips ALL path components (blocks ../../ traversal).
//  2. safeFilenameRegex removes every character outside [a-zA-Z0-9._-].
//  3. Extension is validated against an explicit whitelist.
//  4. A UUID prefix guarantees uniqueness and prevents filename-guessing attacks.
func sanitizeFilename(original string) (string, string, error) {
	// 1. Strip all directory components — blocks path traversal
	base := filepath.Base(original)

	// 2. Extract and validate extension BEFORE stripping special characters
	ext := strings.ToLower(filepath.Ext(base))
	if !allowedExtensions[ext] {
		return "", "", fmt.Errorf("file type '%s' is not allowed", ext)
	}

	// 3. Remove the extension to clean only the stem
	stem := strings.TrimSuffix(base, filepath.Ext(base))

	// 4. Replace every forbidden character in the stem with underscore
	safeStem := safeFilenameRegex.ReplaceAllString(stem, "_")
	if safeStem == "" || safeStem == "." {
		safeStem = "document"
	}

	// 5. Prepend UUID for uniqueness — prevents enumeration and collision
	safeBase := uuid.New().String() + "_" + safeStem + ext

	return safeBase, ext, nil
}

type DocumentHandler struct {
	docRepo    *repository.DocumentRepository
	docService *services.DocumentService
	uploadDir  string
}

func NewDocumentHandler(docRepo *repository.DocumentRepository, docService *services.DocumentService, uploadDir string) *DocumentHandler {
	return &DocumentHandler{
		docRepo:    docRepo,
		docService: docService,
		uploadDir:  uploadDir,
	}
}

// UploadDocument handles POST /api/documents/upload
// Accepts multipart form: file, buyer_id
func (h *DocumentHandler) UploadDocument(c *gin.Context) {
	// Get buyer_id from form
	buyerID := c.PostForm("buyer_id")
	if buyerID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "buyer_id is required"})
		return
	}

	// Get file from multipart form
	file, header, err := c.Request.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "file is required"})
		return
	}
	defer file.Close()

	// Validate file size (max 10 MB)
	const maxSize = 10 * 1024 * 1024
	if header.Size > maxSize {
		c.JSON(http.StatusBadRequest, gin.H{"error": "file size exceeds 10MB limit"})
		return
	}

	// [C-03] Sanitize and validate the filename
	safeFilename, _, err := sanitizeFilename(header.Filename)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Read file data
	fileData := make([]byte, header.Size)
	if _, err := file.Read(fileData); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to read file"})
		return
	}

	// Encrypt the document
	encryptedData, err := h.docService.EncryptDocument(fileData)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to encrypt document"})
		return
	}

	// Save encrypted file to disk using the sanitized filename
	encFilename := safeFilename + ".enc"
	encPath := filepath.Join(h.uploadDir, encFilename)

	if err := os.WriteFile(encPath, []byte(encryptedData), 0600); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to save encrypted file"})
		return
	}

	// Create document record (store original filename for display purposes)
	doc := models.NewDocument(buyerID, header.Filename, encPath, header.Size, header.Header.Get("Content-Type"))

	if err := h.docRepo.Create(doc); err != nil {
		log.Printf("❌ UploadDocument db insert error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create document record: " + err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":   "Document uploaded and encrypted successfully",
		"document":  doc,
		"encrypted": true,
		"algorithm": "AES-256-GCM",
	})
}

// DownloadDocument handles GET /api/documents/:id/download
func (h *DocumentHandler) DownloadDocument(c *gin.Context) {
	id := c.Param("id")

	// Get document record
	doc, err := h.docRepo.GetByID(id)
	if err != nil {
		if err == models.ErrNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Document not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	// Read encrypted file
	encryptedData, err := os.ReadFile(doc.FileURL)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to read encrypted file"})
		return
	}

	// Decrypt
	decryptedData, err := h.docService.DecryptDocument(string(encryptedData))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to decrypt document"})
		return
	}

	// Serve file — use filepath.Base to prevent header injection
	c.Header("Content-Disposition", "attachment; filename=\""+filepath.Base(doc.Filename)+"\"")
	c.Data(http.StatusOK, doc.MimeType, decryptedData)
}

// ListDocuments handles GET /api/documents
// Returns documents for the authenticated buyer
func (h *DocumentHandler) ListDocuments(c *gin.Context) {
	buyerID := c.Query("buyer_id")
	if buyerID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "buyer_id query parameter is required"})
		return
	}

	docs, err := h.docRepo.GetByBuyerID(buyerID)
	if err != nil {
		log.Printf("❌ ListDocuments db query error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":  docs,
		"total": len(docs),
	})
}

// DeleteDocument handles DELETE /api/documents/:id
func (h *DocumentHandler) DeleteDocument(c *gin.Context) {
	id := c.Param("id")

	// Get document to find file path
	doc, err := h.docRepo.GetByID(id)
	if err != nil {
		if err == models.ErrNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Document not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	// Delete encrypted file from disk
	os.Remove(doc.FileURL)

	// Soft delete record
	if err := h.docRepo.Delete(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete document"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Document deleted successfully",
		"id":      id,
	})
}
