import { BaseService } from './BaseService';
import { Inquiry, InquiryAnalytics, AIResponseSuggestion } from '@/types/inquiry';

export class InquiryService extends BaseService {
  private readonly endpoint = '/api/inquiries';

  async getInquiriesBySupplier(supplierId: string): Promise<Inquiry[]> {
    return this.get<Inquiry[]>(`${this.endpoint}/supplier/${supplierId}`);
  }

  async getInquiriesByBuyer(buyerId: string): Promise<Inquiry[]> {
    return this.get<Inquiry[]>(`${this.endpoint}/buyer/${buyerId}`);
  }

  async getInquiryById(id: string): Promise<Inquiry> {
    return this.get<Inquiry>(`${this.endpoint}/${id}`);
  }

  async createInquiry(data: Partial<Inquiry>): Promise<Inquiry> {
    return this.post<Inquiry>(this.endpoint, data);
  }

  async respondToInquiry(inquiryId: string, message: string): Promise<Inquiry> {
    return this.put<Inquiry>(`${this.endpoint}/${inquiryId}/respond`, { message });
  }

  async markAsConverted(inquiryId: string): Promise<void> {
    await this.put(`${this.endpoint}/${inquiryId}/convert`, {});
  }

  async getAnalytics(supplierId: string): Promise<InquiryAnalytics> {
    return this.get<InquiryAnalytics>(`${this.endpoint}/analytics/${supplierId}`);
  }

  async getAIResponseSuggestion(inquiryId: string): Promise<AIResponseSuggestion> {
    return this.post<AIResponseSuggestion>(`${this.endpoint}/${inquiryId}/ai-suggest`, {});
  }

  async rateInquiry(inquiryId: string, rating: number): Promise<void> {
    await this.put(`${this.endpoint}/${inquiryId}/rate`, { rating });
  }
}
