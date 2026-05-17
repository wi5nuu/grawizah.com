'use client';

import { useState } from 'react';
import { MessageSquare, Send, X } from 'lucide-react';

interface SendInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  supplierId: string;
  supplierName?: string;
}

export default function SendInquiryModal({ isOpen, onClose, productId, productName, supplierId, supplierName }: SendInquiryModalProps) {
  const [message, setMessage] = useState('');
  const [channel, setChannel] = useState('chat');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!message.trim()) return;
    setSending(true);
    try {
      // POST /api/inquiries – create inquiry
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081'}/api/inquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('grawizah_token')}`,
        },
        body: JSON.stringify({
          product_id: productId,
          supplier_id: supplierId, // Send correct supplier ID
          message: message,
          source_type: channel, // Map correctly to models.Inquiry's source_type!
        }),
      });

      // Also send via chat if channel is chat or whatsapp
      if (channel === 'chat' || channel === 'whatsapp') {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081'}/api/chat/send`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('grawizah_token')}`,
          },
          body: JSON.stringify({
            supplierId: supplierId, // Send real supplier ID
            productId: productId,
            message: message,
            channel: channel,
          }),
        }).catch(() => {});
      }

      setSent(true);
      setTimeout(() => {
        onClose();
        setSent(false);
        setMessage('');
      }, 2000);
    } catch (err) {
      console.error('Failed to send inquiry:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 transition-opacity duration-300" onClick={onClose}>
      <div className="bg-white dark:bg-dark-surface border dark:border-dark-surface-variant/20 rounded-2xl shadow-2xl w-full max-w-lg animate-slide-up text-gray-900 dark:text-dark-on-surface overflow-hidden transition-all duration-300" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100 dark:border-dark-surface-variant/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Send Inquiry</h2>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 dark:hover:bg-dark-surface-variant/30 rounded-lg transition text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        {sent ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-950/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Inquiry Sent!</h3>
            <p className="text-gray-500 dark:text-gray-400">The supplier will be notified via {channel}</p>
          </div>
        ) : (
          <>
            <div className="p-6 space-y-4">
              <div className="p-3.5 bg-primary-50 dark:bg-primary/10 rounded-lg border dark:border-primary/20">
                <p className="text-xs text-primary-600 dark:text-primary-300 font-semibold uppercase tracking-wider">Product</p>
                <p className="text-sm font-bold text-primary-800 dark:text-white mt-0.5">{productName}</p>
                {supplierName && <p className="text-xs text-primary-600 dark:text-primary-300 mt-1">Supplier: {supplierName}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-350 mb-1.5">Your Message *</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-dark-surface-variant/40 rounded-lg bg-transparent text-sm font-medium focus:outline-none text-gray-900 dark:text-white h-32 resize-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="Hello, I'm interested in your product. Could you share pricing for [quantity]? We are looking for [specifications]..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-350 mb-1.5">Send via</label>
                <div className="flex gap-2 flex-col sm:flex-row">
                  {[
                    { value: 'chat', label: '💬 In-App Chat' },
                    { value: 'whatsapp', label: '📱 WhatsApp' },
                    { value: 'email', label: '📧 Email' },
                  ].map((ch) => (
                    <button
                      key={ch.value}
                      onClick={() => setChannel(ch.value)}
                      className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-bold transition border ${
                        channel === ch.value
                          ? 'bg-primary border-primary text-white shadow-sm'
                          : 'bg-white dark:bg-dark-surface-container border-gray-200 dark:border-dark-surface-variant/30 text-gray-650 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-surface-variant/10'
                      }`}
                    >
                      {ch.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 dark:border-dark-surface-variant/20 flex justify-end gap-3">
              <button onClick={onClose} className="py-2 px-5 rounded-full text-sm font-bold text-gray-600 dark:text-gray-350 hover:bg-gray-100 dark:hover:bg-dark-surface-variant/20 transition">Cancel</button>
              <button onClick={handleSend} disabled={!message.trim() || sending} className="btn-primary flex items-center gap-2 disabled:opacity-50 font-bold">
                {sending ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
                Send Inquiry
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
