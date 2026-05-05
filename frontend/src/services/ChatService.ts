import { BaseService } from './BaseService';

export interface ChatMessage {
  supplierId?: string;
  productId?: string;
  message: string;
  channel?: string;
}

export interface WhatsAppMessage {
  to?: string;
  message: string;
}

export class ChatService extends BaseService {
  private readonly chatEndpoint = '/api/chat';
  private readonly whatsappEndpoint = '/api/whatsapp';

  async sendMessage(data: ChatMessage): Promise<any> {
    return this.post<any>(`${this.chatEndpoint}/send`, data);
  }

  async getChatHistory(supplierId: string): Promise<any> {
    return this.get<any>(`${this.chatEndpoint}/history/${supplierId}`);
  }

  async sendWhatsAppMessage(data: WhatsAppMessage): Promise<any> {
    return this.post<any>(`${this.whatsappEndpoint}/send`, data);
  }
}
