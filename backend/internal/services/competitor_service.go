package services

import "math/rand"

type CompetitorService struct{}

func NewCompetitorService() *CompetitorService {
	return &CompetitorService{}
}

type PricePoint struct {
	Source string  `json:"source"`
	Price  float64 `json:"price"`
	Region string  `json:"region"`
}

type BenchmarkResult struct {
	ProductName string       `json:"productName"`
	AvgPrice    float64      `json:"avgPrice"`
	MinPrice    float64      `json:"minPrice"`
	MaxPrice    float64      `json:"maxPrice"`
	Prices      []PricePoint `json:"prices"`
}

// GetBenchmarkData generates competitive pricing data for a product
func (s *CompetitorService) GetBenchmarkData(productName string) (*BenchmarkResult, error) {
	// In a real scenario, this would query a global trade database
	sources := []string{"Alibaba", "Global Sources", "Made-in-China", "Amazon Business", "Direct Factory"}
	regions := []string{"East Asia", "Southeast Asia", "North America", "Europe"}

	basePrice := 100.0 + rand.Float64()*500.0
	prices := make([]PricePoint, 5)
	var sum, min, max float64

	for i := 0; i < 5; i++ {
		p := basePrice + (rand.Float64() - 0.5)*50.0
		prices[i] = PricePoint{
			Source: sources[i],
			Price:  p,
			Region: regions[rand.Intn(len(regions))],
		}
		sum += p
		if i == 0 || p < min {
			min = p
		}
		if i == 0 || p > max {
			max = p
		}
	}

	return &BenchmarkResult{
		ProductName: productName,
		AvgPrice:    sum / 5.0,
		MinPrice:    min,
		MaxPrice:    max,
		Prices:      prices,
	}, nil
}
