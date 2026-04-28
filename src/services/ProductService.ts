import { BaseService } from './BaseService';
import { Product, ProductListingOptimization } from '@/types/product';
import { PaginatedResponse, PaginationParams } from '@/types';

/**
 * Product Service
 * Implements Inheritance (extends BaseService)
 */
export class ProductService extends BaseService {
  private readonly endpoint = '/api/products';

  async getProducts(params?: PaginationParams): Promise<PaginatedResponse<Product>> {
    return this.get<PaginatedResponse<Product>>(this.endpoint, { params });
  }

  async getProductById(id: string): Promise<Product> {
    return this.get<Product>(`${this.endpoint}/${id}`);
  }

  async searchProducts(query: string, filters?: any): Promise<Product[]> {
    return this.post<Product[]>(`${this.endpoint}/search`, { query, filters });
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return this.get<Product[]>(`${this.endpoint}/category/${category}`);
  }

  async createProduct(data: Partial<Product>): Promise<Product> {
    return this.post<Product>(this.endpoint, data);
  }

  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    return this.put<Product>(`${this.endpoint}/${id}`, data);
  }

  async deleteProduct(id: string): Promise<boolean> {
    await this.delete(`${this.endpoint}/${id}`);
    return true;
  }

  async getListingOptimization(productId: string): Promise<ProductListingOptimization> {
    return this.get<ProductListingOptimization>(`${this.endpoint}/${productId}/optimize`);
  }

  async incrementViewCount(productId: string): Promise<void> {
    await this.post(`${this.endpoint}/${productId}/view`);
  }
}
