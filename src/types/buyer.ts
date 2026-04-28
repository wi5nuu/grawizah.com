import { BaseEntity } from './index';

export interface Buyer extends BaseEntity {
  company_name: string;
  country: string;
  buy_score: number;
  import_history?: ImportHistory[];
  verified: boolean;
  last_import_date?: string;
  data_source: 'comtrade' | 'customs' | 'estimated';
}

export interface ImportHistory {
  date: string;
  product_category: string;
  volume: number;
  value_usd: number;
  frequency: number;
}

export interface BuyerQualityScore {
  buyer_id: string;
  verified_status: boolean;
  buy_history_count: number;
  response_seriousness: number;
  overall_score: number;
}

export interface LeadScoringResult {
  buyer_id: string;
  conversion_probability: number;
  factors: {
    import_frequency: number;
    volume_trend: number;
    category_match: number;
    country_affinity: number;
  };
}
