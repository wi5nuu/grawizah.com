package services

import (
	"context"
	"fmt"

	"github.com/grawizah/backend/internal/interfaces"
	"github.com/grawizah/backend/internal/models"
)

type InquiryService struct {
	inquiryRepo         interfaces.InquiryRepository
	notificationService *NotificationService
}

func NewInquiryService(inquiryRepo interfaces.InquiryRepository, notificationService *NotificationService) *InquiryService {
	return &InquiryService{
		inquiryRepo:         inquiryRepo,
		notificationService: notificationService,
	}
}

func (s *InquiryService) GetInquiryByID(ctx context.Context, id string) (*models.Inquiry, error) {
	return s.inquiryRepo.GetByID(id)
}

func (s *InquiryService) GetInquiriesBySupplier(ctx context.Context, supplierID string) ([]models.InquiryDetail, error) {
	return s.inquiryRepo.GetBySupplierID(supplierID)
}

func (s *InquiryService) GetInquiriesByBuyer(ctx context.Context, buyerID string) ([]models.InquiryDetail, error) {
	return s.inquiryRepo.GetByBuyerID(buyerID)
}

func (s *InquiryService) CreateInquiry(ctx context.Context, inquiry *models.Inquiry) error {
	err := s.inquiryRepo.Create(inquiry)
	if err == nil {
		// Send real-time notification to supplier
		s.notificationService.Dispatch(Notification{
			UserID:  inquiry.SupplierID,
			Title:   "New Inquiry Received",
			Message: fmt.Sprintf("You have a new inquiry for product %s", inquiry.ProductID),
			Channel: "inapp",
		})
	}
	return err
}

func (s *InquiryService) RespondToInquiry(ctx context.Context, inquiryID string, message string) error {
	inquiry, err := s.inquiryRepo.GetByID(inquiryID)
	if err != nil {
		return err
	}

	inquiry.Respond(message)

	return s.inquiryRepo.Update(inquiry)
}

func (s *InquiryService) GetAnalytics(ctx context.Context, supplierID string) (map[string]interface{}, error) {
	analytics, err := s.inquiryRepo.GetAnalytics(supplierID)
	if err != nil {
		return nil, err
	}

	return map[string]interface{}{
		"total_inquiries":         analytics.TotalInquiries,
		"response_rate":           analytics.ResponseRate,
		"conversion_rate":         analytics.ConversionRate,
		"repeat_buyer_rate":       analytics.RepeatBuyerRate,
		"avg_response_time_hours": analytics.AvgResponseTimeHours,
	}, nil
}

func (s *InquiryService) MarkAsConverted(ctx context.Context, inquiryID string) error {
	inquiry, err := s.inquiryRepo.GetByID(inquiryID)
	if err != nil {
		return err
	}

	inquiry.ConvertedToDeal = true
	return s.inquiryRepo.Update(inquiry)
}

// RateInquiry saves a buyer rating (1–5) for a completed inquiry. [M-02]
func (s *InquiryService) RateInquiry(ctx context.Context, inquiryID string, rating int) error {
	if rating < 1 || rating > 5 {
		return fmt.Errorf("rating must be between 1 and 5")
	}
	return s.inquiryRepo.RateInquiry(inquiryID, rating)
}
