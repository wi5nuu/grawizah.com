import { BaseService } from './BaseService';
import { Company, Certification } from '@/types/company';

export class CompanyService extends BaseService {
  private readonly endpoint = '/api/companies';

  async getCompanyById(id: string): Promise<Company> {
    return this.get<Company>(`${this.endpoint}/${id}`);
  }

  async getMyCompany(): Promise<Company> {
    return this.get<Company>(`${this.endpoint}/me`);
  }

  async updateCompany(id: string, data: Partial<Company>): Promise<Company> {
    return this.put<Company>(`${this.endpoint}/${id}`, data);
  }

  async addCertification(companyId: string, cert: Certification): Promise<Company> {
    return this.post<Company>(`${this.endpoint}/${companyId}/certifications`, cert);
  }

  async removeCertification(companyId: string, certId: string): Promise<void> {
    await this.delete(`${this.endpoint}/${companyId}/certifications/${certId}`);
  }

  async verifyCompany(companyId: string): Promise<Company> {
    return this.put<Company>(`${this.endpoint}/${companyId}/verify`, {});
  }

  async getCompanyProducts(companyId: string): Promise<any[]> {
    return this.get<any[]>(`${this.endpoint}/${companyId}/products`);
  }

  async getCompanyStats(companyId: string): Promise<{
    total_products: number;
    total_inquiries: number;
    conversion_rate: number;
    avg_response_time: number;
  }> {
    return this.get(`${this.endpoint}/${companyId}/stats`);
  }
}
