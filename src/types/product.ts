import { BaseEntity } from './index';

export interface Product extends BaseEntity {
  company_id: string;
  name: string;
  description: string;
  hs_code?: string;
  hs_code_confidence?: number;
  price_range_min?: number;
  price_range_max?: number;
  currency: string;
  moq?: number;
  images: string[];
  category: string;
  country_origin: string;
  listing_score?: number;
  view_count: number;
  inquiry_count: number;
}

export interface ProductListingOptimization {
  score: number;
  suggestions: {
    title?: string;
    description?: string;
    hs_code?: string;
    keywords?: string[];
  };
}

export interface HSCodeClassification {
  hs_code: string;
  confidence: number;
  description: string;
  regulation_notes?: string;
}
