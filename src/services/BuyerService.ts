import { BaseService } from './BaseService';
import { Buyer, LeadScoringResult } from '@/types/buyer';

export class BuyerService extends BaseService {
  private readonly endpoint = '/api/buyers';

  async getBuyerRadar(filters?: {
    country?: string;
    min_score?: number;
    category?: string;
  }): Promise<Buyer[]> {
    return this.get<Buyer[]>(`${this.endpoint}/radar`, { params: filters });
  }

  async getBuyerById(id: string): Promise<Buyer> {
    return this.get<Buyer>(`${this.endpoint}/${id}`);
  }

  async searchBuyers(query: string): Promise<Buyer[]> {
    return this.post<Buyer[]>(`${this.endpoint}/search`, { query });
  }

  async getLeadScore(buyerId: string, productCategory: string): Promise<LeadScoringResult> {
    return this.post<LeadScoringResult>(`${this.endpoint}/${buyerId}/lead-score`, {
      product_category: productCategory
    });
  }

  async getBuyersByCountry(country: string): Promise<Buyer[]> {
    return this.get<Buyer[]>(`${this.endpoint}/country/${country}`);
  }

  async getTopBuyers(limit: number = 10): Promise<Buyer[]> {
    return this.get<Buyer[]>(`${this.endpoint}/top`, { params: { limit } });
  }
}
