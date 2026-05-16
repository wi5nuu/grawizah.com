// Core Types & Enums

export enum UserRole {
  GUEST = 'guest',
  FREE_TRADER = 'free_trader',
  PREMIUM_TRADER = 'premium_trader',
  BUYER = 'buyer',
  ADMIN = 'admin',
}

export enum InquirySourceType {
  CHAT = 'chat',
  WHATSAPP = 'whatsapp',
  EMAIL = 'email',
  RFQ = 'rfq',
}

export enum InquiryStatus {
  PENDING = 'pending',
  OPEN = 'open',
  RESPONDED = 'responded',
  CONVERTED = 'converted',
  CLOSED = 'closed',
}

export enum NotificationChannel {
  EMAIL = 'email',
  WHATSAPP = 'whatsapp',
  IN_APP = 'inapp',
}

export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface AIResult {
  success: boolean;
  data: any;
  confidence?: number;
  error?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
