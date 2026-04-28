import { BaseEntity, UserRole } from './index';

export interface Company extends BaseEntity {
  owner_id: string;
  name: string;
  country: string;
  verified: boolean;
  role: UserRole;
  nib?: string;
  npwp?: string;
  export_license?: string;
  certifications: Certification[];
  export_experience_years?: number;
  export_countries: string[];
}

export interface Certification {
  type: string;
  name: string;
  issuer: string;
  issue_date: string;
  expiry_date?: string;
  document_url?: string;
}

export interface LeaderboardScore extends BaseEntity {
  company_id: string;
  conversion_rate: number;
  repeat_buyer_rate: number;
  response_rate: number;
  buyer_rating: number;
  catalog_completeness: number;
  fulfillment_success: number;
  total_score: number;
  rank?: number;
  trend_7d?: number;
}
