import { IAIService, IAIProvider } from '@/interfaces/IAIService';
import { AIResult } from '@/types';
import Groq from 'groq-sdk';

/**
 * Groq AI Provider
 * Implements IAIProvider interface (Polymorphism)
 */
export class GroqProvider implements IAIProvider {
  name = 'groq';
  private client: Groq;

  constructor(apiKey: string) {
    this.client = new Groq({ apiKey, dangerouslyAllowBrowser: true });
  }

  async isAvailable(): Promise<boolean> {
    try {
      await this.client.chat.completions.create({
        messages: [{ role: 'user', content: 'test' }],
        model: 'llama3-8b-8192',
        max_tokens: 10,
      });
      return true;
    } catch {
      return false;
    }
  }

  async call(prompt: string, options?: any): Promise<any> {
    const response = await this.client.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: options?.model || 'llama3-70b-8192',
      temperature: options?.temperature || 0.7,
      max_tokens: options?.max_tokens || 1024,
    });

    return response.choices[0]?.message?.content || '';
  }
}

/**
 * HS Code AI Classifier
 * Implements IAIService interface (Polymorphism)
 */
export class HSCodeAIService implements IAIService {
  private provider: IAIProvider;

  constructor(provider: IAIProvider) {
    this.provider = provider;
  }

  async analyze(input: { description: string; category?: string }): Promise<AIResult> {
    const prompt = `You are an expert in HS Code classification for international trade.

Product Description: ${input.description}
${input.category ? `Category: ${input.category}` : ''}

Provide the most accurate HS Code (6-digit) for this product. Respond in JSON format:
{
  "hs_code": "123456",
  "confidence": 0.95,
  "description": "Brief description of the HS code",
  "regulation_notes": "Any relevant import/export regulations"
}`;

    try {
      const result = await this.provider.call(prompt, { temperature: 0.3 });
      const parsed = JSON.parse(result);
      
      return {
        success: true,
        data: parsed,
        confidence: parsed.confidence,
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
 * Implements IAIService interface (Polymorphism)
 */
export class LeadScoringService implements IAIService {
  private provider: IAIProvider;

  constructor(provider: IAIProvider) {
    this.provider = provider;
  }

  async analyze(input: {
    buyer_country: string;
    product_category: string;
    import_history?: any[];
    inquiry_message?: string;
  }): Promise<AIResult> {
    const prompt = `Analyze this buyer lead and provide a conversion probability score (0-100).

Buyer Country: ${input.buyer_country}
Product Category: ${input.product_category}
Import History: ${JSON.stringify(input.import_history || [])}
Inquiry Message: ${input.inquiry_message || 'N/A'}

Respond in JSON format:
{
  "buy_score": 82,
  "conversion_probability": 0.82,
  "factors": {
    "import_frequency": 0.85,
    "volume_trend": 0.78,
    "category_match": 0.90,
    "country_affinity": 0.75
  },
  "reasoning": "Brief explanation"
}`;

    try {
      const result = await this.provider.call(prompt, { temperature: 0.5 });
      const parsed = JSON.parse(result);
      
      return {
        success: true,
        data: parsed,
        confidence: parsed.conversion_probability,
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
 * Implements IAIService interface (Polymorphism)
 */
export class ResponseSuggestionService implements IAIService {
  private provider: IAIProvider;

  constructor(provider: IAIProvider) {
    this.provider = provider;
  }

  async analyze(input: {
    inquiry_message: string;
    product_name: string;
    buyer_country: string;
    buyer_language?: string;
  }): Promise<AIResult> {
    const language = input.buyer_language || 'English';
    
    const prompt = `Generate a professional response to this buyer inquiry in ${language}.

Product: ${input.product_name}
Buyer Country: ${input.buyer_country}
Inquiry: ${input.inquiry_message}

Generate a professional, friendly response that:
1. Thanks the buyer for their interest
2. Confirms product availability
3. Asks for specific requirements (quantity, delivery terms)
4. Offers to provide quotation and samples
5. Provides contact information

Respond in JSON format:
{
  "suggested_response": "The complete response text",
  "language": "${language}",
  "tone": "professional"
}`;

    try {
      const result = await this.provider.call(prompt, { temperature: 0.7 });
      const parsed = JSON.parse(result);
      
      return {
        success: true,
        data: parsed,
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
