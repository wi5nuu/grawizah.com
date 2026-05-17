package services

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
	"time"
)

// groqTimeout is the maximum time we wait for a single Groq API call.
const groqTimeout = 30 * time.Second

// groqRetryDelays defines wait durations between retries (exponential backoff).
var groqRetryDelays = []time.Duration{1 * time.Second, 2 * time.Second}

type AIService struct {
	groqAPIKey string
	apiURL     string
	model      string
	httpClient *http.Client // [H-02] shared client with timeout
}

// NewAIService creates a new AIService.
// [H-07] Falls back to well-known defaults so the service never fails silently.
func NewAIService(groqAPIKey string) *AIService {
	// [H-07] Default API URL
	apiURL := os.Getenv("GROQ_API_URL")
	if apiURL == "" {
		apiURL = "https://api.groq.com/openai/v1"
	}

	// [H-07] Default model
	model := os.Getenv("GROQ_MODEL")
	if model == "" {
		model = "llama-3.3-70b-versatile"
	}

	// [H-07] Startup warning — not fatal so the server still starts in mock mode
	if groqAPIKey == "" {
		log.Println("⚠️  WARNING: GROQ_API_KEY is not set. AI features will run in mock/fallback mode.")
		log.Println("   Get your free API key at: https://console.groq.com/keys")
	}

	return &AIService{
		groqAPIKey: groqAPIKey,
		apiURL:     apiURL,
		model:      model,
		// [H-02] Shared HTTP client with a hard 30-second timeout.
		// This prevents goroutines from hanging forever when Groq is slow.
		httpClient: &http.Client{
			Timeout: groqTimeout,
		},
	}
}

// callGroq sends a prompt to Groq and returns the text response.
// [H-02] Implements:
//   - Per-request context deadline (25 s, slightly under the client timeout)
//   - Max 2 retries with exponential backoff (1 s, 2 s)
//   - Explicit handling of context.DeadlineExceeded
func (s *AIService) callGroq(prompt string) (string, error) {
	var lastErr error

	for attempt := 0; attempt <= len(groqRetryDelays); attempt++ {
		if attempt > 0 {
			delay := groqRetryDelays[attempt-1]
			log.Printf("🔄 Groq retry %d/%d after %s (prev error: %v)", attempt, len(groqRetryDelays), delay, lastErr)
			time.Sleep(delay)
		}

		result, err := s.doGroqCall(prompt)
		if err == nil {
			return result, nil
		}

		// Don't retry on context cancellation from the caller
		if errors.Is(err, context.Canceled) {
			return "", err
		}

		lastErr = err
	}

	return "", fmt.Errorf("groq API failed after %d attempts: %w", len(groqRetryDelays)+1, lastErr)
}

// doGroqCall executes a single Groq API call with a 25-second deadline.
func (s *AIService) doGroqCall(prompt string) (string, error) {
	// [H-02] 25-second deadline — slightly under the 30s client timeout
	// so context expiry fires before the transport-level timeout.
	ctx, cancel := context.WithTimeout(context.Background(), 25*time.Second)
	defer cancel()

	payload := map[string]interface{}{
		"model": s.model,
		"messages": []map[string]string{
			{"role": "user", "content": prompt},
		},
		"temperature": 0.7,
	}

	jsonData, err := json.Marshal(payload)
	if err != nil {
		return "", fmt.Errorf("failed to marshal request: %w", err)
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, s.apiURL+"/chat/completions", bytes.NewBuffer(jsonData))
	if err != nil {
		return "", fmt.Errorf("failed to build request: %w", err)
	}
	req.Header.Set("Authorization", "Bearer "+s.groqAPIKey)
	req.Header.Set("Content-Type", "application/json")

	resp, err := s.httpClient.Do(req)
	if err != nil {
		// [H-02] Explicit deadline-exceeded handling
		if errors.Is(err, context.DeadlineExceeded) || errors.Is(ctx.Err(), context.DeadlineExceeded) {
			return "", fmt.Errorf("AI request timed out after 25s — Groq API may be slow, please retry")
		}
		return "", fmt.Errorf("HTTP request failed: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("failed to read response: %w", err)
	}

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("groq API returned status %d: %s", resp.StatusCode, string(body))
	}

	var groqResp struct {
		Choices []struct {
			Message struct {
				Content string `json:"content"`
			} `json:"message"`
		} `json:"choices"`
	}

	if err := json.Unmarshal(body, &groqResp); err != nil {
		return "", fmt.Errorf("failed to parse response JSON: %w", err)
	}

	if len(groqResp.Choices) == 0 {
		return "", fmt.Errorf("groq returned empty choices list")
	}

	return groqResp.Choices[0].Message.Content, nil
}

// HealthCheck pings the Groq API and returns an error if it is unreachable.
// [H-07] Used by GET /api/health/ai
func (s *AIService) HealthCheck() error {
	if s.groqAPIKey == "" || s.groqAPIKey == "gsk_your_api_key" {
		return fmt.Errorf("GROQ_API_KEY not configured")
	}
	_, err := s.doGroqCall("Reply with the single word: OK")
	if err != nil {
		return fmt.Errorf("groq health check failed: %w", err)
	}
	return nil
}

// ClassifyHSCode uses Groq AI to classify HS Code
func (s *AIService) ClassifyHSCode(ctx context.Context, description string, category string) (map[string]interface{}, error) {
	// Fallback/Mock mode for demo if API key is not set or rate limited
	if s.groqAPIKey == "" || s.groqAPIKey == "gsk_your_api_key" {
		return s.mockHSCode(description), nil
	}

	prompt := fmt.Sprintf(`As an international trade expert, classify the HS Code for:
Description: %s
Category: %s
Return ONLY a valid JSON object with: "hs_code" (string), "confidence" (number 0.0-1.0), "description" (string), and "regulation_notes" (string). Do not include markdown formatting or any other text.`, description, category)

	response, err := s.callGroq(prompt)
	if err != nil {
		// If real API fails (e.g. rate limit), use the mock so the demo never breaks
		log.Printf("⚠️ Groq API failed for HS Code, using mock fallback: %v", err)
		return s.mockHSCode(description), nil
	}

	// Clean up markdown if Llama decides to add ```json
	cleanJSON := strings.TrimSpace(response)
	cleanJSON = strings.TrimPrefix(cleanJSON, "```json")
	cleanJSON = strings.TrimPrefix(cleanJSON, "```")
	cleanJSON = strings.TrimSuffix(cleanJSON, "```")
	cleanJSON = strings.TrimSpace(cleanJSON)

	var result map[string]interface{}
	if err := json.Unmarshal([]byte(cleanJSON), &result); err != nil {
		log.Printf("⚠️ Groq JSON parsing failed: %v. Raw: %s", err, response)
		return s.mockHSCode(description), nil
	}
	return result, nil
}

func (s *AIService) mockHSCode(description string) map[string]interface{} {
	desc := strings.ToLower(description)
	if strings.Contains(desc, "kopi") || strings.Contains(desc, "coffee") {
		return map[string]interface{}{"hs_code": "0901.11.00", "confidence": 0.98, "description": "Coffee, not roasted, not decaffeinated", "regulation_notes": "SPS certification required."}
	} else if strings.Contains(desc, "kakao") || strings.Contains(desc, "cocoa") {
		return map[string]interface{}{"hs_code": "1801.00.00", "confidence": 0.95, "description": "Cocoa beans, whole or broken, raw or roasted", "regulation_notes": "Phytosanitary certificate required."}
	} else if strings.Contains(desc, "kemiri") || strings.Contains(desc, "candlenut") {
		return map[string]interface{}{"hs_code": "0802.90.00", "confidence": 0.92, "description": "Other nuts, fresh or dried, whether or not shelled or peeled", "regulation_notes": "Standard agricultural export protocols."}
	}
	return map[string]interface{}{
		"hs_code":          "3926.90.99",
		"confidence":       0.85,
		"description":      "Other articles of plastics",
		"regulation_notes": "Standard commercial invoice required.",
	}
}

// GenerateResponseSuggestion uses Groq AI to generate inquiry response
func (s *AIService) GenerateResponseSuggestion(ctx context.Context, inquiryMessage, productName, buyerCountry, buyerLanguage string) (map[string]interface{}, error) {
	prompt := fmt.Sprintf(`Generate a professional export inquiry response for:
Product: %s
Buyer Message: %s
Buyer Country: %s
Language: %s
Include a polite greeting, answers to typical trade questions (MOQ, lead time), and a call to action.`, productName, inquiryMessage, buyerCountry, buyerLanguage)

	response, err := s.callGroq(prompt)
	if err != nil {
		return nil, err
	}

	return map[string]interface{}{
		"suggested_response": response,
		"language":           buyerLanguage,
	}, nil
}

// OptimizeListing analyzes product listing and provides suggestions
func (s *AIService) OptimizeListing(ctx context.Context, product interface{}) (map[string]interface{}, error) {
	prodJSON, _ := json.Marshal(product)
	prompt := fmt.Sprintf(`Analyze this product listing for global export readiness:
%s
Return a JSON object with: score (0-100) and an object of suggestions for title, description, and keywords.`, string(prodJSON))

	response, err := s.callGroq(prompt)
	if err != nil {
		return nil, err
	}

	var result map[string]interface{}
	json.Unmarshal([]byte(response), &result)
	return result, nil
}

// TranslateText uses Groq AI to translate text to a target language
func (s *AIService) TranslateText(ctx context.Context, text, targetLang string) (map[string]interface{}, error) {
	// If Groq key is a placeholder, use mock translation
	if s.groqAPIKey == "" || s.groqAPIKey == "gsk_your_api_key" {
		mockTranslated := fmt.Sprintf("[Neural Sync: %s] %s", targetLang, text)
		if targetLang == "id" && strings.Contains(strings.ToLower(text), "hello") {
			mockTranslated = "Halo! Saya adalah Bot Intelijen Grawizah."
		} else if targetLang == "en" && strings.Contains(strings.ToLower(text), "bantu") {
			mockTranslated = "Can you help me with HS classification?"
		}

		return map[string]interface{}{
			"translated_text": mockTranslated,
			"source_language": "auto",
			"target_language": targetLang,
		}, nil
	}

	prompt := fmt.Sprintf(`Translate the following text to %s.
Return ONLY a JSON object with: translated_text (the translated text in %s), source_language (detected source language), and target_language (%s).
Text to translate: %s`, targetLang, targetLang, targetLang, text)

	response, err := s.callGroq(prompt)
	if err != nil {
		return nil, err
	}

	var result map[string]interface{}
	if err := json.Unmarshal([]byte(response), &result); err != nil {
		result = map[string]interface{}{
			"translated_text": response,
			"target_language": targetLang,
		}
	}

	return result, nil
}

// DetectLanguage uses Groq AI to detect the language of the given text
func (s *AIService) DetectLanguage(ctx context.Context, text string) (map[string]interface{}, error) {
	prompt := fmt.Sprintf(`Detect the language of the following text.
Return ONLY a JSON object with: language (the full English name of the language, e.g. "French", "Indonesian", "Arabic"), language_code (ISO 639-1 code, e.g. "fr", "id", "ar"), and confidence (0.0-1.0).
Text: %s`, text)

	response, err := s.callGroq(prompt)
	if err != nil {
		return nil, err
	}

	var result map[string]interface{}
	if err := json.Unmarshal([]byte(response), &result); err != nil {
		result = map[string]interface{}{
			"language":   response,
			"confidence": 0.8,
		}
	}

	return result, nil
}

// Chat handles general AI chat with Grawizah knowledge
func (s *AIService) Chat(ctx context.Context, message string) (string, error) {
	// If Groq key is a placeholder, use intelligent fallback
	if s.groqAPIKey == "" || s.groqAPIKey == "gsk_your_api_key" {
		return s.getKnowledgeBaseResponse(message), nil
	}

	prompt := fmt.Sprintf(`You are the Grawizah Intelligence Bot, an expert in international trade and export-import regulations.
User asked: %s
Provide a helpful, professional response focused on trade data, HS codes, or export logistics. If you don't know the specific answer, provide general trade advice.`, message)

	return s.callGroq(prompt)
}

func (s *AIService) getKnowledgeBaseResponse(query string) string {
	q := strings.ToLower(query)

	if strings.Contains(q, "apa itu grawizah") || strings.Contains(q, "tentang grawizah") {
		return "Grawizah (Grawizah Otw Juara) adalah platform 'Pre-Transaction Intelligence' pertama di Indonesia. Fokus kami adalah meminimalkan risiko ekspor bagi UKM melalui validasi data real-time, AI Listing Optimization, dan HS Code Classification otomatis. Kami ingin UKM Indonesia tidak hanya 'bisa ekspor', tapi 'paham strategi ekspor'."
	}
	if strings.Contains(q, "hs code") || strings.Contains(q, "kode hs") || strings.Contains(q, "klasifikasi") {
		return "Klasifikasi HS Code kami bekerja dengan menganalisis parameter teknis produk Anda secara otomatis. Untuk produk pertanian (Chapter 01-24), kami menyediakan detail regulasi tambahan seperti Sanitary & Phytosanitary (SPS). Silakan berikan deskripsi produk Anda yang paling detail untuk akurasi optimal."
	}
	if strings.Contains(q, "bantu") || strings.Contains(q, "help") || strings.Contains(q, "fitur") || strings.Contains(q, "apa yang bisa kamu lakukan") {
		return "Saya adalah Intelijen Perdagangan Anda. Saya bisa membantu:\n1. 🔍 **HS Code Genius**: Menentukan kode pajak internasional.\n2. 📈 **Market Benchmark**: Menganalisis harga kompetitor di negara target.\n3. 🛡️ **Buyer Radar**: Memvalidasi kualitas dan track record pembeli.\n4. 🚀 **Neural Sync**: Komunikasi lintas bahasa secara real-time."
	}
	if strings.Contains(q, "moq") || strings.Contains(q, "minimum order") {
		return "Dalam perdagangan global, Minimum Order Quantity (MOQ) sangat krusial untuk efisiensi logistik. Grawizah membantu Anda menghitung titik impas (break-even) antara biaya produksi dan biaya pengiriman (FOB/CIF) untuk menentukan MOQ yang kompetitif."
	}
	if strings.Contains(q, "lead time") || strings.Contains(q, "waktu kirim") {
		return "Berdasarkan data logistik global kami, rata-rata lead time dari pelabuhan utama Indonesia ke Eropa adalah 35-45 hari, sementara ke Asia Timur adalah 10-15 hari. Kami menyarankan penambahan buffer 5 hari untuk proses custom clearance."
	}
	if strings.Contains(q, "ekspor") || strings.Contains(q, "pembeli") || strings.Contains(q, "buyer") {
		return "Pencarian pembeli di Grawizah didasarkan pada 'Buyer Quality Score'. Kami memfilter pembeli berdasarkan frekuensi impor mereka, rekam jejak pembayaran, dan stabilitas permintaan. Ini memastikan Anda hanya berurusan dengan partner yang serius."
	}
	if strings.Contains(q, "neural sync") || strings.Contains(q, "terjemah") || strings.Contains(q, "bahasa") {
		return "Neural Sync adalah teknologi inti kami yang memungkinkan Anda mengobrol dengan pembeli dari mana pun (Cina, Jerman, Korea) dalam bahasa Indonesia. Pesan mereka otomatis diterjemahkan ke bahasa Anda, dan sebaliknya, secara instan."
	}

	return "Saya mengerti Anda bertanya tentang '" + query + "'. Sebagai AI Intelijen Grawizah, saya bisa memberikan insight mendalam mengenai strategi ekspor, regulasi HS Code, atau audit kualitas buyer. Bisa tolong spesifikkan kebutuhan bisnis Anda?"
}
