package services

import (
	"math/rand"
	"sort"
)

type RankingService struct{}

func NewRankingService() *RankingService {
	return &RankingService{}
}

type SupplierScore struct {
	SupplierID         string  `json:"supplier_id"`
	RelevanceMatch     float64 `json:"relevance_match"`     // 0-1
	DealProbability    float64 `json:"deal_probability"`    // 0-1
	CatalogCompleteness float64 `json:"catalog_completeness"` // 0-1
	ResponseRate       float64 `json:"response_rate"`       // 0-1
	FinalScore         float64 `json:"final_score"`
}

// RankSuppliers applies weighted scoring to a list of suppliers
func (s *RankingService) RankSuppliers(suppliers []map[string]interface{}, query string) []map[string]interface{} {
	// Weights for different factors
	const (
		W_Relevance   = 0.4
		W_DealProb    = 0.3
		W_Catalog     = 0.15
		W_Response    = 0.15
	)

	scoredSuppliers := make([]map[string]interface{}, len(suppliers))
	for i, supplier := range suppliers {
		// Mock calculations for each factor
		// In production, RelevanceMatch would come from pgvector similarity search
		rel := 0.5 + (rand.Float64() * 0.5) 
		deal := 0.4 + (rand.Float64() * 0.6)
		cat := 0.8 + (rand.Float64() * 0.2)
		resp := 0.7 + (rand.Float64() * 0.3)

		finalScore := (rel * W_Relevance) + (deal * W_DealProb) + (cat * W_Catalog) + (resp * W_Response)
		
		supplier["ai_score"] = finalScore
		supplier["ai_metrics"] = map[string]float64{
			"relevance": rel,
			"deal_probability": deal,
			"catalog_completeness": cat,
			"response_rate": resp,
		}
		scoredSuppliers[i] = supplier
	}

	// Sort by final score descending
	sort.Slice(scoredSuppliers, func(i, j int) bool {
		return scoredSuppliers[i]["ai_score"].(float64) > scoredSuppliers[j]["ai_score"].(float64)
	})

	return scoredSuppliers
}
