package services

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
)

type AIService struct {
	groqAPIKey string
	apiURL     string
	model      string
}

func NewAIService(groqAPIKey string) *AIService {
	return &AIService{
		groqAPIKey: groqAPIKey,
		apiURL:     os.Getenv("GROQ_API_URL"),
		model:      os.Getenv("GROQ_MODEL"),
	}
}

func (s *AIService) callGroq(prompt string) (string, error) {
	payload := map[string]interface{}{
		"model": s.model,
		"messages": []map[string]string{
			{"role": "user", "content": prompt},
		},
		"temperature": 0.7,
	}

	jsonData, _ := json.Marshal(payload)
	req, _ := http.NewRequest("POST", s.apiURL+"/chat/completions", bytes.NewBuffer(jsonData))
	req.Header.Set("Authorization", "Bearer "+s.groqAPIKey)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	var groqResp struct {
		Choices []struct {
			Message struct {
				Content string `json:"content"`
			} `json:"message"`
		} `json:"choices"`
	}

	if err := json.Unmarshal(body, &groqResp); err != nil {
		return "", err
	}

	if len(groqResp.Choices) == 0 {
		return "", fmt.Errorf("no response from AI")
	}

	return groqResp.Choices[0].Message.Content, nil
}

// ClassifyHSCode uses Groq AI to classify HS Code
func (s *AIService) ClassifyHSCode(ctx context.Context, description string, category string) (map[string]interface{}, error) {
	prompt := fmt.Sprintf(`As an international trade expert, classify the HS Code for:
Description: %s
Category: %s
Return ONLY a JSON object with: hs_code, confidence (0.0-1.0), description, and regulation_notes.`, description, category)

	response, err := s.callGroq(prompt)
	if err != nil {
		return nil, err
	}

	var result map[string]interface{}
	json.Unmarshal([]byte(response), &result)
	return result, nil
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
		// Special cases for better demo
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
// ... (rest of existing TranslateText code)

	response, err := s.callGroq(prompt)
	if err != nil {
		return nil, err
	}

	var result map[string]interface{}
	if err := json.Unmarshal([]byte(response), &result); err != nil {
		// If Groq doesn't return valid JSON, wrap the raw response
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
		// If Groq doesn't return valid JSON, return a fallback
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
