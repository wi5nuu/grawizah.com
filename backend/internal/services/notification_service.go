package services

import (
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
	// TODO: Integrate with SendGrid or AWS SES
	return nil
}

func (s *EmailSender) Supports(channel string) bool {
	return channel == "email" || channel == "all"
}

// WhatsAppSender implements NotificationSender for WhatsApp
type WhatsAppSender struct{}

func (s *WhatsAppSender) Send(notif Notification) error {
	log.Printf("[WHATSAPP] Sending to %s: %s - %s", notif.UserID, notif.Title, notif.Message)
	// TODO: Integrate with Twilio WhatsApp API
	return nil
}

func (s *WhatsAppSender) Supports(channel string) bool {
	return channel == "whatsapp" || channel == "all"
}

// InAppSender implements NotificationSender for In-App DB logs
type InAppSender struct{}

func (s *InAppSender) Send(notif Notification) error {
	log.Printf("[IN-APP] Logging notification for %s: %s", notif.UserID, notif.Title)
	// TODO: Insert into notification_logs table
	return nil
}

func (s *InAppSender) Supports(channel string) bool {
	return channel == "inapp" || channel == "all"
}

// NotificationService manages all notification senders
type NotificationService struct {
	senders []NotificationSender
}

// NewNotificationService initializes the service with all default senders
func NewNotificationService() *NotificationService {
	return &NotificationService{
		senders: []NotificationSender{
			&EmailSender{},
			&WhatsAppSender{},
			&InAppSender{},
		},
	}
}

// Dispatch sends a notification through all matching channels
func (s *NotificationService) Dispatch(notif Notification) error {
	var errs []error
	deliveredCount := 0

	for _, sender := range s.senders {
		if sender.Supports(notif.Channel) {
			if err := sender.Send(notif); err != nil {
				errs = append(errs, err)
			} else {
				deliveredCount++
			}
		}
	}

	if len(errs) > 0 {
		return fmt.Errorf("failed to deliver to some channels: %v", errs)
	}

	if deliveredCount == 0 {
		return fmt.Errorf("no matching channel found for %s", notif.Channel)
	}

	return nil
}
