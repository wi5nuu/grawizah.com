'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, Minimize2, Languages } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { TranslatorService } from '@/services/TranslatorService';

interface Message {
  id: string;
  sender: 'user' | 'supplier' | 'system';
  message: string;
  timestamp: Date;
  read: boolean;
}

interface ChatWidgetProps {
  supplierId?: string;
  productId?: string;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ supplierId, productId }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [targetLang, setTargetLang] = useState('en');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const translatorService = new TranslatorService();

  useEffect(() => {
    // Load chat history
    loadChatHistory();
    
    // Setup real-time listener (Supabase Realtime)
    const subscription = setupRealtimeListener();
    
    return () => {
      subscription?.unsubscribe();
    };
  }, [supplierId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChatHistory = async () => {
    // TODO: Load from Supabase
    const mockMessages: Message[] = [
      {
        id: '1',
        sender: 'system',
        message: 'Welcome to Grawizah Chat! How can we help you today?',
        timestamp: new Date(),
        read: true,
      },
    ];
    setMessages(mockMessages);
  };

  const setupRealtimeListener = () => {
    // TODO: Setup Supabase Realtime subscription
    return {
      unsubscribe: () => {},
    };
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    let messageToSend = newMessage;

    // Auto-translate if enabled
    if (autoTranslate && targetLang !== 'en') {
      try {
        const translated = await translatorService.translate({
          text: newMessage,
          targetLang: targetLang,
        });
        messageToSend = translated.translatedText;
      } catch (error) {
        console.error('Translation failed:', error);
      }
    }

    const message: Message = {
      id: Date.now().toString(),
      sender: 'user',
      message: messageToSend,
      timestamp: new Date(),
      read: false,
    };

    setMessages([...messages, message]);
    setNewMessage('');

    // TODO: Send to backend and WhatsApp Bridge
    await sendMessageToBackend(message);
  };

  const sendMessageToBackend = async (message: Message) => {
    try {
      // Send to API
      const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supplierId,
          productId,
          message: message.message,
          channel: 'chat',
        }),
      });

      if (response.ok) {
        // Also send via WhatsApp Bridge if enabled
        await sendViaWhatsApp(message);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const sendViaWhatsApp = async (message: Message) => {
    // TODO: Integrate with WhatsApp Business API
    try {
      await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: supplierId,
          message: message.message,
        }),
      });
    } catch (error) {
      console.error('WhatsApp send failed:', error);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-primary-600 text-white p-4 rounded-full shadow-lg hover:bg-primary-700 transition-all z-50"
      >
        <MessageCircle className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 bg-white rounded-lg shadow-2xl z-50 transition-all ${
        isMinimized ? 'w-80 h-14' : 'w-96 h-[500px]'
      }`}
    >
      {/* Header */}
      <div className="bg-primary-600 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          <span className="font-semibold">Chat with Supplier</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="hover:bg-primary-700 p-1 rounded"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="hover:bg-primary-700 p-1 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="h-[380px] overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    msg.sender === 'user'
                      ? 'bg-primary-600 text-white'
                      : msg.sender === 'system'
                      ? 'bg-gray-100 text-gray-700'
                      : 'bg-blue-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{msg.message}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {msg.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t p-3">
            {/* AI Translator Toggle */}
            <div className="flex items-center justify-between mb-2 p-2 bg-blue-50 rounded">
              <div className="flex items-center gap-2">
                <Languages className="w-4 h-4 text-blue-600" />
                <span className="text-xs text-blue-900">AI Translator</span>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                  className="text-xs border rounded px-2 py-1"
                >
                  {translatorService.getSupportedLanguages().map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoTranslate}
                    onChange={(e) => setAutoTranslate(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                onClick={handleSendMessage}
                className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              💬 Messages also sent via WhatsApp
            </p>
          </div>
        </>
      )}
    </div>
  );
};
