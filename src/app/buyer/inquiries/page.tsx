'use client';

import React, { useState, useEffect } from 'react';
import { InquiryService } from '@/services/InquiryService';
import { TranslatorService } from '@/services/TranslatorService';
import { Inquiry } from '@/types/inquiry';
import { MessageSquare, Languages, Send, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function BuyerInquiryManagerPage() {
  const { user } = useAuth();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [translating, setTranslating] = useState(false);
  const [targetLang, setTargetLang] = useState('en');
  
  const inquiryService = new InquiryService();
  const translatorService = new TranslatorService();

  useEffect(() => {
    loadInquiries();
  }, []);

  const loadInquiries = async () => {
    try {
      setLoading(true);
      if (user) {
        const data = await inquiryService.getByBuyerId(user.id);
        setInquiries(data);
      }
    } catch (error) {
      console.error('Failed to load inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTranslate = async () => {
    if (!replyMessage) return;

    try {
      setTranslating(true);
      const translated = await translatorService.translate({
        text: replyMessage,
        targetLang: targetLang,
      });
      setReplyMessage(translated.translatedText);
    } catch (error) {
      console.error('Translation failed:', error);
    } finally {
      setTranslating(false);
    }
  };

  const handleSendReply = async () => {
    if (!selectedInquiry || !replyMessage) return;

    try {
      await inquiryService.respond(selectedInquiry.id, replyMessage);
      setReplyMessage('');
      setSelectedInquiry(null);
      loadInquiries();
    } catch (error) {
      console.error('Failed to send reply:', error);
    }
  };

  const stats = {
    total: inquiries.length,
    pending: inquiries.filter(i => i.status === 'open').length,
    responded: inquiries.filter(i => i.status === 'responded').length,
    converted: inquiries.filter(i => i.converted_to_deal).length,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Inquiry Manager</h1>
          <p className="text-gray-600 mt-1">Track and manage your supplier inquiries</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-primary-600" />
              <div>
                <p className="text-sm text-gray-600">Total Inquiries</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Pending Response</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Responded</p>
                <p className="text-2xl font-bold text-blue-600">{stats.responded}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Converted to Deal</p>
                <p className="text-2xl font-bold text-green-600">{stats.converted}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Inquiries List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Inquiries</h2>
            
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading inquiries...</div>
            ) : inquiries.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No inquiries yet. Start browsing suppliers!
              </div>
            ) : (
              <div className="space-y-4">
                {inquiries.map((inquiry) => (
                  <div
                    key={inquiry.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedInquiry(inquiry)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            Supplier: {inquiry.supplier_id}
                          </h3>
                          <span className={`badge ${
                            inquiry.status === 'open' ? 'badge-warning' :
                            inquiry.status === 'responded' ? 'badge-primary' :
                            'badge-success'
                          }`}>
                            {inquiry.status}
                          </span>
                          {inquiry.converted_to_deal && (
                            <span className="badge badge-success">Deal Closed</span>
                          )}
                        </div>
                        <p className="text-gray-700 mb-2">{inquiry.message}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Product: {inquiry.product_id}</span>
                          <span>Source: {inquiry.source_type}</span>
                          <span>{new Date(inquiry.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Reply Modal with AI Translator */}
        {selectedInquiry && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Reply to Inquiry
                </h3>

                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Original Message:</p>
                  <p className="text-gray-900">{selectedInquiry.message}</p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Reply
                  </label>
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    rows={6}
                    className="input-field"
                    placeholder="Type your reply..."
                  />
                </div>

                {/* AI Translator */}
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Languages className="w-5 h-5 text-blue-600" />
                    <h4 className="font-semibold text-blue-900">AI Translator</h4>
                  </div>
                  <div className="flex items-center gap-3">
                    <select
                      value={targetLang}
                      onChange={(e) => setTargetLang(e.target.value)}
                      className="input-field flex-1"
                    >
                      {translatorService.getSupportedLanguages().map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.name}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleTranslate}
                      disabled={translating || !replyMessage}
                      className="btn-secondary flex items-center gap-2"
                    >
                      <Languages className="w-4 h-4" />
                      {translating ? 'Translating...' : 'Translate'}
                    </button>
                  </div>
                  <p className="text-xs text-blue-700 mt-2">
                    💡 Translate your message to supplier's language for better communication
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleSendReply}
                    disabled={!replyMessage}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Send Reply
                  </button>
                  <button
                    onClick={() => {
                      setSelectedInquiry(null);
                      setReplyMessage('');
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
