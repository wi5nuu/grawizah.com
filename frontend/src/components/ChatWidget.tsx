'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  Send, 
  X, 
  Minimize2, 
  Languages, 
  Bot, 
  Clock, 
  ShieldCheck, 
  MoreVertical,
  Maximize2,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { TranslatorService } from '@/services/TranslatorService';
import { ChatService } from '@/services/ChatService';
import { GeneralAIService } from '@/services/AIService';
import { supabase } from '@/lib/supabase';

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
  const [autoTranslate, setAutoTranslate] = useState(false);
  const [targetLang, setTargetLang] = useState('en');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const translatorService = new TranslatorService();
  const chatService = new ChatService();
  const aiGeneralService = new GeneralAIService();

  const effectiveSupplierId = supplierId || 'system-ai-bot';

  useEffect(() => {
    if (isOpen && user) {
      loadChatHistory();
      setUnreadCount(0);
    }
    
    let subscription: any;
    if (user) {
      subscription = setupRealtimeListener();
    }
    
    return () => {
      subscription?.unsubscribe();
    };
  }, [isOpen, user, supplierId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isMinimized]);

  const loadChatHistory = async () => {
    if (!user) return;
    try {
      const history = await chatService.getChatHistory(effectiveSupplierId, user.id);
      if (history && history.messages) {
        const formattedMessages: Message[] = history.messages.map((m: any) => ({
          id: m.id,
          sender: m.senderId === user.id ? 'user' : 'supplier',
          message: m.message,
          timestamp: new Date(m.createdAt),
          read: m.isRead,
        }));
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  };

  const setupRealtimeListener = () => {
    if (!supabase || !user) return null;
    const channel = supabase
      .channel(`chat:${effectiveSupplierId}:${user.id}`)
      .on(
        'postgres_changes' as any,
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `supplier_id=eq.${effectiveSupplierId}&buyer_id=eq.${user.id}`,
        },
        (payload: any) => {
          const incoming = payload.new;
          if (incoming.sender_id !== user.id) {
            const formattedMessage: Message = {
              id: incoming.id,
              sender: 'supplier',
              message: incoming.message,
              timestamp: new Date(incoming.created_at),
              read: incoming.is_read,
            };
            setMessages((prev) => [...prev, formattedMessage]);
            if (!isOpen) setUnreadCount((prev) => prev + 1);
          }
        }
      )
      .subscribe();

    return channel;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    const messageToSend = newMessage;
    const tempId = Date.now().toString();
    const message: Message = {
      id: tempId,
      sender: 'user',
      message: messageToSend,
      timestamp: new Date(),
      read: false,
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage('');

    try {
      // Get real (or RAG-mock) response from AI
      const aiResponse = await aiGeneralService.chat(messageToSend);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'supplier',
        message: aiResponse,
        timestamp: new Date(),
        read: false,
      };
      setMessages((prev) => [...prev, aiMessage]);

      // Also record the message in the chat history
      await chatService.sendMessage({
        supplierId: effectiveSupplierId,
        buyerId: user.id,
        senderId: user.id,
        productId,
        message: message.message,
        channel: 'chat',
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      // Fallback response if everything fails
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'supplier',
        message: "Maaf, sistem intelijen kami sedang sibuk. Silakan coba beberapa saat lagi.",
        timestamp: new Date(),
        read: false,
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 bg-gray-900 dark:bg-white text-white dark:text-gray-900 p-5 rounded-[1.5rem] shadow-2xl hover:scale-110 active:scale-95 transition-all z-50 group border border-white/10"
      >
        <MessageCircle className="w-6 h-6 group-hover:rotate-12 transition-transform" />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-black rounded-full w-6 h-6 flex items-center justify-center border-4 border-[#fafafa] dark:border-dark-background">
            {unreadCount}
          </span>
        )}
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-8 right-8 bg-white dark:bg-dark-surface-container-low rounded-[2rem] shadow-2xl z-50 transition-all duration-300 overflow-hidden flex flex-col border border-gray-100 dark:border-dark-surface-variant/20 ${
        isMinimized ? 'w-72 h-16' : 'w-96 h-[580px]'
      }`}
    >
      {/* Premium Header */}
      <div className="bg-gray-900 dark:bg-dark-surface-container p-4 flex items-center justify-between text-white border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/20 relative">
             <Bot className="w-5 h-5 text-primary" />
             <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-gray-900" />
          </div>
          <div>
            <span className="text-xs font-black uppercase tracking-widest block leading-none">Intelligence Bot</span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Verified Supplier Node</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="hover:bg-white/10 p-2 rounded-xl transition-colors"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="hover:bg-white/10 p-2 rounded-xl transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30 dark:bg-dark-background/10">
            {messages.length === 0 && (
               <div className="flex flex-col items-center justify-center h-full opacity-30 text-center px-10">
                  <MessageCircle className="w-10 h-10 mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Initialization Required</p>
                  <p className="text-[9px] font-bold mt-1 uppercase">Commence communication with your verified trade partner.</p>
               </div>
            )}
            {messages.map((msg, idx) => {
              const isUser = msg.sender === 'user';
              return (
                <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`max-w-[85%] p-4 rounded-2xl text-[13px] font-medium leading-relaxed shadow-sm relative ${
                      isUser
                        ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-tr-none'
                        : msg.sender === 'system'
                        ? 'bg-gray-100 dark:bg-dark-surface-container text-gray-500 text-[11px] font-black uppercase text-center w-full shadow-none border-none px-0'
                        : 'bg-white dark:bg-dark-surface-container text-gray-900 dark:text-white border border-gray-100 dark:border-dark-surface-variant/20 rounded-tl-none'
                    }`}
                  >
                    {msg.message}
                    {msg.sender !== 'system' && (
                       <div className={`mt-2 flex items-center gap-1 text-[9px] font-black uppercase tracking-tighter opacity-50 ${isUser ? 'justify-end' : 'justify-start'}`}>
                          <Clock className="w-2.5 h-2.5" />
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                       </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Action Footer */}
          <div className="p-5 bg-white dark:bg-dark-surface-container-low border-t border-gray-100 dark:border-dark-surface-variant/10">
            
            {/* Intelligence Translator Row */}
            <div 
              onClick={() => setAutoTranslate(!autoTranslate)}
              className="flex items-center justify-between mb-4 p-2 bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/10 cursor-pointer hover:bg-primary/10 transition-colors group/sync"
            >
               <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-white dark:bg-dark-surface rounded-lg shadow-sm group-hover/sync:scale-110 transition-transform">
                     <Languages className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest">Neural Sync</span>
               </div>
               <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <select
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                    className="bg-white dark:bg-dark-surface border-none text-[10px] font-black uppercase tracking-tighter rounded-lg px-2 py-1 outline-none ring-1 ring-gray-100 dark:ring-dark-surface-variant/30"
                  >
                    {translatorService.getSupportedLanguages().map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name.toUpperCase()}
                      </option>
                    ))}
                  </select>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setAutoTranslate(!autoTranslate); }}
                    className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${autoTranslate ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-dark-surface text-gray-400'}`}
                  >
                     {autoTranslate ? 'Active' : 'Sync'}
                  </button>
               </div>
            </div>

            <div className="flex gap-3 items-center">
              <div className="flex-1 relative group">
                 <input
                   type="text"
                   value={newMessage}
                   onChange={(e) => setNewMessage(e.target.value)}
                   onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                   placeholder="Transmit intelligence..."
                   className="w-full bg-gray-50 dark:bg-dark-surface border border-transparent focus:border-primary/20 focus:bg-white text-xs font-semibold px-5 py-3.5 rounded-[1.2rem] outline-none transition-all pr-12"
                 />
                 <button
                    onClick={handleSendMessage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg"
                 >
                    <Send className="w-3.5 h-3.5" />
                 </button>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-4 opacity-40">
               <div className="flex items-center gap-1 text-[8px] font-black uppercase tracking-[0.2em]">
                  <ShieldCheck className="w-2.5 h-2.5" /> E2E Encrypted
               </div>
               <div className="flex items-center gap-1 text-[8px] font-black uppercase tracking-[0.2em]">
                  <Sparkles className="w-2.5 h-2.5" /> AI Augmented
               </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
