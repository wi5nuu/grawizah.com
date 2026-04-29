import { BaseService } from './BaseService';

interface TranslationRequest {
  text: string;
  sourceLang?: string;
  targetLang: string;
}

interface TranslationResponse {
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  confidence: number;
}

export class TranslatorService extends BaseService {
  /**
   * Translate text using AI
   */
  async translate(request: TranslationRequest): Promise<TranslationResponse> {
    try {
      const response = await this.post<TranslationResponse>('/ai/translate', request);
      return response;
    } catch (error) {
      console.error('Translation failed:', error);
      throw error;
    }
  }

  /**
   * Detect language of text
   */
  async detectLanguage(text: string): Promise<string> {
    try {
      const response = await this.post<{ language: string }>('/ai/detect-language', { text });
      return response.language;
    } catch (error) {
      console.error('Language detection failed:', error);
      return 'en'; // Default to English
    }
  }

  /**
   * Get supported languages
   */
  getSupportedLanguages(): { code: string; name: string }[] {
    return [
      { code: 'en', name: 'English' },
      { code: 'id', name: 'Indonesian' },
      { code: 'zh', name: 'Chinese' },
      { code: 'ja', name: 'Japanese' },
      { code: 'ko', name: 'Korean' },
      { code: 'ar', name: 'Arabic' },
      { code: 'es', name: 'Spanish' },
      { code: 'fr', name: 'French' },
      { code: 'de', name: 'German' },
      { code: 'pt', name: 'Portuguese' },
      { code: 'ru', name: 'Russian' },
      { code: 'hi', name: 'Hindi' },
      { code: 'th', name: 'Thai' },
      { code: 'vi', name: 'Vietnamese' },
      { code: 'ms', name: 'Malay' },
    ];
  }

  /**
   * Translate inquiry message automatically
   */
  async translateInquiry(
    message: string,
    buyerLanguage: string,
    supplierLanguage: string
  ): Promise<string> {
    if (buyerLanguage === supplierLanguage) {
      return message;
    }

    const result = await this.translate({
      text: message,
      sourceLang: buyerLanguage,
      targetLang: supplierLanguage,
    });

    return result.translatedText;
  }
}
