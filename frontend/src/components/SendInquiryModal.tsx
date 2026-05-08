'use client';

import { useState } from 'react';
import { MessageSquare, Send, X } from 'lucide-react';

interface SendInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  supplierName?: string;
}

export default function SendInquiryModal({ isOpen, onClose, productId, productName, supplierName }: SendInquiryModalProps) {
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
      await fetch('http://localhost:8080/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('grawizah_token')}`,
        },
        body: JSON.stringify({
          product_id: productId,
          product_name: productName,
          message: message,
          source: channel,
        }),
      });

      // Also send via chat if channel is chat
      if (channel === 'chat' || channel === 'whatsapp') {
        await fetch('http://localhost:8080/api/chat/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('grawizah_token')}`,
          },
          body: JSON.stringify({
            supplierId: 'default',
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
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary-700" />
            <h2 className="text-xl font-bold text-gray-900">Send Inquiry</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {sent ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Inquiry Sent!</h3>
            <p className="text-gray-500">The supplier will be notified via {channel}</p>
          </div>
        ) : (
          <>
            <div className="p-6 space-y-4">
              <div className="p-3 bg-primary-50 rounded-lg">
                <p className="text-xs text-primary-600">Product</p>
                <p className="text-sm font-semibold text-primary-800">{productName}</p>
                {supplierName && <p className="text-xs text-primary-600 mt-0.5">Supplier: {supplierName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Message *</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="input-field h-32 resize-none"
                  placeholder="Hello, I'm interested in your product. Could you share pricing for [quantity]? We are looking for [specifications]..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Send via</label>
                <div className="flex gap-2">
                  {[
                    { value: 'chat', label: '💬 In-App Chat' },
                    { value: 'whatsapp', label: '📱 WhatsApp' },
                    { value: 'email', label: '📧 Email' },
                  ].map((ch) => (
                    <button
                      key={ch.value}
                      onClick={() => setChannel(ch.value)}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition border ${
                        channel === ch.value
                          ? 'bg-primary-50 border-primary-300 text-primary-700'
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {ch.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={onClose} className="btn-ghost">Cancel</button>
              <button onClick={handleSend} disabled={!message.trim() || sending} className="btn-primary flex items-center gap-2 disabled:opacity-50">
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
