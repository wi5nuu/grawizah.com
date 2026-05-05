import { BaseEntityModel } from './BaseEntity';
import { Product as IProduct } from '@/types/product';

/**
 * Product Model
 * Implements Encapsulation & Inheritance (extends BaseEntityModel)
 */
export class ProductModel extends BaseEntityModel {
  private _company_id: string;
  private _name: string;
  private _description: string;
  private _hs_code?: string;
  private _hs_code_confidence?: number;
  private _price_range_min?: number;
  private _price_range_max?: number;
  private _currency: string;
  private _moq?: number;
  private _images: string[];
  private _category: string;
  private _country_origin: string;
  private _listing_score?: number;
  private _view_count: number;
  private _inquiry_count: number;

  constructor(data: IProduct) {
    super(data);
    this._company_id = data.company_id;
    this._name = data.name;
    this._description = data.description;
    this._hs_code = data.hs_code;
    this._hs_code_confidence = data.hs_code_confidence;
    this._price_range_min = data.price_range_min;
    this._price_range_max = data.price_range_max;
    this._currency = data.currency || 'USD';
    this._moq = data.moq;
    this._images = data.images || [];
    this._category = data.category;
    this._country_origin = data.country_origin;
    this._listing_score = data.listing_score;
    this._view_count = data.view_count || 0;
    this._inquiry_count = data.inquiry_count || 0;
  }

  // Getters (Encapsulation)
  get companyId(): string {
    return this._company_id;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get hsCode(): string | undefined {
    return this._hs_code;
  }

  get priceRange(): string {
    if (!this._price_range_min || !this._price_range_max) {
      return 'Contact for pricing';
    }
    return `${this._currency} ${this._price_range_min.toLocaleString()} - ${this._price_range_max.toLocaleString()}`;
  }

  get listingScore(): number {
    return this._listing_score || 0;
  }

  get images(): string[] {
    return this._images;
  }

  get category(): string {
    return this._category;
  }

  // Setters (Encapsulation with validation)
  setHSCode(code: string, confidence: number): void {
    this._hs_code = code;
    this._hs_code_confidence = confidence;
  }

  setPriceRange(min: number, max: number, currency: string = 'USD'): void {
    if (min > max) {
      throw new Error('Minimum price cannot be greater than maximum price');
    }
    this._price_range_min = min;
    this._price_range_max = max;
    this._currency = currency;
  }

  incrementViewCount(): void {
    this._view_count++;
  }

  incrementInquiryCount(): void {
    this._inquiry_count++;
  }

  // Business logic methods
  isListingComplete(): boolean {
    return !!(
      this._name &&
      this._description &&
      this._hs_code &&
      this._images.length > 0 &&
      this._price_range_min &&
      this._price_range_max
    );
  }

  calculateListingScore(): number {
    let score = 0;
    
    if (this._name && this._name.length > 10) score += 20;
    if (this._description && this._description.length > 50) score += 20;
    if (this._hs_code) score += 20;
    if (this._images.length >= 3) score += 20;
    if (this._price_range_min && this._price_range_max) score += 20;

    this._listing_score = score;
    return score;
  }

  toJSON(): IProduct {
    return {
      id: this._id,
      created_at: this._created_at,
      updated_at: this._updated_at,
      deleted_at: this._deleted_at,
      company_id: this._company_id,
      name: this._name,
      description: this._description,
      hs_code: this._hs_code,
      hs_code_confidence: this._hs_code_confidence,
      price_range_min: this._price_range_min,
      price_range_max: this._price_range_max,
      currency: this._currency,
      moq: this._moq,
      images: this._images,
      category: this._category,
      country_origin: this._country_origin,
      listing_score: this._listing_score,
      view_count: this._view_count,
      inquiry_count: this._inquiry_count,
    };
  }
}
