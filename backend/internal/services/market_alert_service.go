package services

import (
	"math/rand"
	"time"
)

type MarketAlertService struct{}

func NewMarketAlertService() *MarketAlertService {
	return &MarketAlertService{}
}

type MarketAlert struct {
	ID        string    `json:"id"`
	Type      string    `json:"type"` // "demand_surge", "new_buyer", "price_drop"
	Title     string    `json:"title"`
	Message   string    `json:"message"`
	Country   string    `json:"country"`
	Product   string    `json:"product"`
	Timestamp time.Time `json:"timestamp"`
}

// GetMarketAlerts fetches active alerts for a supplier's niche
func (s *MarketAlertService) GetMarketAlerts(category string) ([]MarketAlert, error) {
	// Mock alerts
	alerts := []MarketAlert{
		{
			ID:        "a1",
			Type:      "demand_surge",
			Title:     "Demand Surge in Vietnam",
			Message:   "15% increase in searches for Industrial Valves in the last 48 hours.",
			Country:   "Vietnam",
			Product:   "Industrial Valves",
			Timestamp: time.Now().Add(-2 * time.Hour),
		},
		{
			ID:        "a2",
			Type:      "new_buyer",
			Title:     "Verified Buyer from UAE",
			Message:   "A new Tier-1 buyer from UAE is looking for sustainable textile suppliers.",
			Country:   "UAE",
			Product:   "Sustainable Textiles",
			Timestamp: time.Now().Add(-5 * time.Hour),
		},
		{
			ID:        "a3",
			Type:      "price_drop",
			Title:     "Competitor Price Shift",
			Message:   "Major competitors in the Electronics category have lowered prices by 5% in the EU market.",
			Country:   "EU",
			Product:   "Electronics",
			Timestamp: time.Now().Add(-24 * time.Hour),
		},
	}

	// In a real app, we would filter by supplier category
	return alerts, nil
}
