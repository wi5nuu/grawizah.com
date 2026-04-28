import { BaseEntity, PaginationParams, PaginatedResponse } from '@/types';

/**
 * Generic Repository Interface
 * Implements Abstraction - hides database implementation details
 */
export interface IRepository<T extends BaseEntity> {
  findById(id: string): Promise<T | null>;
  findAll(params?: PaginationParams): Promise<PaginatedResponse<T>>;
  create(data: Omit<T, keyof BaseEntity>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<boolean>;
}

/**
 * Product-specific repository interface
 */
export interface IProductRepository extends IRepository<any> {
  findByCategory(category: string, params?: PaginationParams): Promise<PaginatedResponse<any>>;
  findByCompany(companyId: string): Promise<any[]>;
  searchProducts(query: string, filters?: any): Promise<any[]>;
}

/**
 * Inquiry-specific repository interface
 */
export interface IInquiryRepository extends IRepository<any> {
  findBySupplier(supplierId: string): Promise<any[]>;
  findByBuyer(buyerId: string): Promise<any[]>;
  getAnalytics(supplierId: string): Promise<any>;
}
