import { IAIService } from '@/interfaces/IAIService';
import { AIResult } from '@/types';
import { BaseService } from './BaseService';

/**
 * HS Code AI Classifier
 * Implements IAIService interface (Polymorphism)
 */
export class HSCodeAIService extends BaseService implements IAIService {
  async analyze(input: { description: string; category?: string }): Promise<AIResult> {
    try {
      const response = await this.post<any>('/api/ai/hs-code', input);
      return {
        success: true,
        data: response,
        confidence: response.confidence,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

/**
 * AI Lead Scoring Service
 * Uses backend endpoint /api/buyers/:id/lead-score
 */
export class LeadScoringService extends BaseService implements IAIService {
  async analyze(input: {
    buyer_id: string;
    buyer_country: string;
    product_category: string;
    import_history?: any[];
    inquiry_message?: string;
  }): Promise<AIResult> {
    try {
      const response = await this.post<any>(
        `/api/buyers/${input.buyer_id}/lead-score`,
        { product_category: input.product_category }
      );
      return {
        success: true,
        data: response,
        confidence: response.score ? response.score / 100 : undefined,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

/**
 * AI Response Suggestion Service
 * Uses backend endpoint /api/ai/response-suggestion
 */
export class ResponseSuggestionService extends BaseService implements IAIService {
  async analyze(input: {
    inquiry_message: string;
    product_name: string;
    buyer_country: string;
    buyer_language?: string;
  }): Promise<AIResult> {
    try {
      const response = await this.post<any>('/api/ai/response-suggestion', input);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

/**
 * Listing Optimizer Service
 * Uses backend endpoint /api/ai/optimize-listing
 */
export class ListingOptimizerService extends BaseService implements IAIService {
  async analyze(input: {
    product_id: string;
    current_description: string;
    product_name: string;
  }): Promise<AIResult> {
    try {
      const response = await this.post<any>('/api/ai/optimize-listing', input);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
