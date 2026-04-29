import { BaseService } from './BaseService';
import { LeaderboardScore } from '@/types/company';

export class LeaderboardService extends BaseService {
  private readonly endpoint = '/api/leaderboard';

  async getLeaderboard(category?: string): Promise<LeaderboardScore[]> {
    return this.get<LeaderboardScore[]>(this.endpoint, { 
      params: category ? { category } : undefined 
    });
  }

  async getMyScore(companyId: string): Promise<LeaderboardScore> {
    return this.get<LeaderboardScore>(`${this.endpoint}/company/${companyId}`);
  }

  async getTopPerformers(limit: number = 10): Promise<LeaderboardScore[]> {
    return this.get<LeaderboardScore[]>(`${this.endpoint}/top`, { params: { limit } });
  }

  async getScoreBreakdown(companyId: string): Promise<{
    conversion_rate: number;
    repeat_buyer_rate: number;
    response_rate: number;
    buyer_rating: number;
    catalog_completeness: number;
    fulfillment_success: number;
  }> {
    return this.get(`${this.endpoint}/company/${companyId}/breakdown`);
  }

  async hideFromLeaderboard(companyId: string): Promise<void> {
    await this.put(`${this.endpoint}/company/${companyId}/hide`, {});
  }

  async showInLeaderboard(companyId: string): Promise<void> {
    await this.put(`${this.endpoint}/company/${companyId}/show`, {});
  }
}
