package handlers

import (
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/grawizah/backend/internal/models"
	"github.com/grawizah/backend/internal/repository"
	"github.com/grawizah/backend/internal/services"
)

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

	// Validate file size (max 10MB)
	if header.Size > 10*1024*1024 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "file size exceeds 10MB limit"})
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

	// Save encrypted file to disk
	safeFilename := strings.ReplaceAll(header.Filename, " ", "_")
	encFilename := buyerID + "_" + safeFilename + ".enc"
	encPath := filepath.Join(h.uploadDir, encFilename)

	if err := os.WriteFile(encPath, []byte(encryptedData), 0600); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to save encrypted file"})
		return
	}

	// Create document record
	doc := models.NewDocument(buyerID, header.Filename, encPath, header.Size, header.Header.Get("Content-Type"))

	if err := h.docRepo.Create(doc); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create document record"})
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

	// Serve file
	c.Header("Content-Disposition", "attachment; filename=\""+doc.Filename+"\"")
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
