import { AIResult } from '@/types';

/**
 * Base interface for all AI services
 * Implements Polymorphism - different AI features implement same interface
 */
export interface IAIService {
  analyze(input: any): Promise<AIResult>;
}

/**
 * AI Provider interface for different LLM backends
 */
export interface IAIProvider {
  name: string;
  isAvailable(): Promise<boolean>;
  call(prompt: string, options?: any): Promise<any>;
}
