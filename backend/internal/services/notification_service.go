package services

import (
	"database/sql"
	"fmt"
	"log"
)

// Notification holds the data for any outgoing notification
type Notification struct {
	UserID  string
	Title   string
	Message string
	Channel string // "email", "whatsapp", "inapp"
}

// NotificationSender defines the polymorphic delivery interface
type NotificationSender interface {
	Send(notif Notification) error
	Supports(channel string) bool
}

// EmailSender implements NotificationSender for Email
type EmailSender struct{}

func (s *EmailSender) Send(notif Notification) error {
	log.Printf("[EMAIL] Sending to %s: %s - %s", notif.UserID, notif.Title, notif.Message)
	return nil
}

func (s *EmailSender) Supports(channel string) bool {
	return channel == "email" || channel == "all"
}

// WhatsAppSender implements NotificationSender for WhatsApp
type WhatsAppSender struct{}

func (s *WhatsAppSender) Send(notif Notification) error {
	log.Printf("[WHATSAPP] Sending to %s: %s - %s", notif.UserID, notif.Title, notif.Message)
	return nil
}

func (s *WhatsAppSender) Supports(channel string) bool {
	return channel == "whatsapp" || channel == "all"
}

// InAppSender implements NotificationSender for In-App DB logs
type InAppSender struct {
	db *sql.DB
}

func (s *InAppSender) Send(notif Notification) error {
	log.Printf("[IN-APP] Logging notification for %s: %s", notif.UserID, notif.Title)
	
	query := `
		INSERT INTO notification_logs (user_id, channel, payload)
		VALUES ($1, $2, $3)
	`
	payload := fmt.Sprintf(`{"title": "%s", "message": "%s"}`, notif.Title, notif.Message)
	
	_, err := s.db.Exec(query, notif.UserID, notif.Channel, payload)
	return err
}

func (s *InAppSender) Supports(channel string) bool {
	return channel == "inapp" || channel == "all"
}

// NotificationService manages all notification senders
type NotificationService struct {
	senders []NotificationSender
}

// NewNotificationService initializes the service with all default senders
func NewNotificationService(db *sql.DB) *NotificationService {
	return &NotificationService{
		senders: []NotificationSender{
			&EmailSender{},
			&WhatsAppSender{},
			&InAppSender{db: db},
		},
	}
}

// Dispatch sends a notification through all matching channels
func (s *NotificationService) Dispatch(notif Notification) error {
	for _, sender := range s.senders {
		if sender.Supports(notif.Channel) {
			if err := sender.Send(notif); err != nil {
				log.Printf("Failed to send notification via %T: %v", sender, err)
			}
		}
	}
	return nil
}
