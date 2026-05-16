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
	prompt := fmt.Sprintf(`Translate the following text to %s.
Return ONLY a JSON object with: translated_text (the translated text in %s), source_language (detected source language), and target_language (%s).
Text to translate: %s`, targetLang, targetLang, targetLang, text)

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
	// Simple keyword-based intelligent fallback
	q := strings.ToLower(query)
	
	if strings.Contains(q, "apa itu grawizah") || strings.Contains(q, "what is grawizah") {
		return "Grawizah adalah platform intelijen pra-transaksi untuk perdagangan global. Kami membantu UKM Indonesia melakukan ekspor dengan data pasar yang mendalam, optimasi produk berbasis AI, dan verifikasi partner dagang."
	}
	if strings.Contains(q, "hs code") || strings.Contains(q, "kode hs") {
		return "Grawizah menggunakan AI untuk mengklasifikasi HS Code (Harmonized System) dengan akurasi tinggi. Anda bisa mengunggah deskripsi produk dan kami akan memberikan kode 6-digit serta catatan regulasi terkait."
	}
	if strings.Contains(q, "bantu") || strings.Contains(q, "help") || strings.Contains(q, "fitur") {
		return "Saya bisa membantu Anda dalam beberapa hal: 1. Klasifikasi HS Code otomatis. 2. Optimasi listing produk ekspor. 3. Analisis skor kualitas pembeli (Buyer Quality Score). 4. Pemantauan harga kompetitor global secara real-time."
	}
	if strings.Contains(q, "ekspor") || strings.Contains(q, "export") {
		return "Untuk memulai ekspor, Anda perlu menyiapkan NIB, NPWP, dan izin ekspor khusus produk. Grawizah mempermudah pencarian buyer internasional yang terverifikasi agar transaksi Anda lebih aman."
	}
	if strings.Contains(q, "halo") || strings.Contains(q, "hi") || strings.Contains(q, "pagi") || strings.Contains(q, "siang") {
		return "Halo! Saya Grawizah Intelligence Bot. Ada yang bisa saya bantu terkait intelijen pasar atau persiapan ekspor Anda hari ini?"
	}

	return "Terima kasih atas pertanyaannya. Sebagai AI Grawizah, saya bisa memberikan info mengenai HS Code, analisis pasar global, dan verifikasi supplier/buyer. Bisa tolong spesifikkan apa yang ingin Anda ketahui?"
}
