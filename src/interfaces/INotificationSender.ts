import { NotificationChannel } from '@/types';

/**
 * Notification Sender Interface
 * Implements Polymorphism - different channels implement same interface
 */
export interface INotificationSender {
  channel: NotificationChannel;
  send(recipient: string, message: string, metadata?: any): Promise<boolean>;
}
