import { IProductRepository } from '@/interfaces/IRepository';
import { Product } from '@/types/product';
import { PaginatedResponse, PaginationParams } from '@/types';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase Product Repository
 * Implements IProductRepository (Abstraction)
 * Hides Supabase implementation details from services
 */
export class SupabaseProductRepository implements IProductRepository {
  private client: SupabaseClient;

  constructor() {
    this.client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  async findById(id: string): Promise<Product | null> {
    const { data, error } = await this.client
      .from('products')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (error) throw error;
    return data;
  }

  async findAll(params?: PaginationParams): Promise<PaginatedResponse<Product>> {
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await this.client
      .from('products')
      .select('*', { count: 'exact' })
      .is('deleted_at', null)
      .range(from, to)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return {
      data: data || [],
      total: count || 0,
      page,
      limit,
      hasMore: (count || 0) > to + 1,
    };
  }

  async findByCategory(category: string, params?: PaginationParams): Promise<PaginatedResponse<Product>> {
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await this.client
      .from('products')
      .select('*', { count: 'exact' })
      .eq('category', category)
      .is('deleted_at', null)
      .range(from, to);

    if (error) throw error;

    return {
      data: data || [],
      total: count || 0,
      page,
      limit,
      hasMore: (count || 0) > to + 1,
    };
  }

  async findByCompany(companyId: string): Promise<Product[]> {
    const { data, error } = await this.client
      .from('products')
      .select('*')
      .eq('company_id', companyId)
      .is('deleted_at', null);

    if (error) throw error;
    return data || [];
  }

  async searchProducts(query: string, filters?: any): Promise<Product[]> {
    let queryBuilder = this.client
      .from('products')
      .select('*')
      .is('deleted_at', null);

    // Text search
    if (query) {
      queryBuilder = queryBuilder.or(`name.ilike.%${query}%,description.ilike.%${query}%`);
    }

    // Apply filters
    if (filters?.category) {
      queryBuilder = queryBuilder.eq('category', filters.category);
    }
    if (filters?.country_origin) {
      queryBuilder = queryBuilder.eq('country_origin', filters.country_origin);
    }

    const { data, error } = await queryBuilder;

    if (error) throw error;
    return data || [];
  }

  async create(data: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    const { data: product, error } = await this.client
      .from('products')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return product;
  }

  async update(id: string, data: Partial<Product>): Promise<Product> {
    const { data: product, error } = await this.client
      .from('products')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return product;
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await this.client
      .from('products')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
    return true;
  }
}
