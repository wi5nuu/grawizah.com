import { BaseEntity, InquirySourceType, InquiryStatus } from './index';

export interface Inquiry extends BaseEntity {
  buyer_id: string;
  supplier_id: string;
  product_id: string;
  message: string;
  source_type?: InquirySourceType;
  source?: string; // alias for source_type used in display
  source_metadata?: Record<string, any>;
  status: 'open' | 'responded' | 'closed' | InquiryStatus;
  response_time_hours?: number;
  converted_to_deal: boolean;
  buyer_rating?: number;
  // Display fields (joined from buyer/product tables)
  buyer_name?: string;
  buyer_company?: string;
  buyer_country?: string;
  product_name?: string;
}

export interface InquiryAnalytics {
  total_inquiries: number;
  response_rate: number;
  conversion_rate: number;
  repeat_buyer_rate: number;
  avg_response_time_hours: number;
}

export interface AIResponseSuggestion {
  inquiry_id: string;
  suggested_response: string;
  language: string;
  context: {
    product_name: string;
    buyer_country: string;
    inquiry_type: string;
  };
}
