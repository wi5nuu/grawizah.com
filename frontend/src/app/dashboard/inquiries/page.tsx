'use client';

import React, { useState, useEffect } from 'react';
import { InquiryService } from '@/services/InquiryService';
import { Inquiry } from '@/types/inquiry';
import { MessageSquare, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function InquiriesManagementPage() {
  const { user } = useAuth();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'open' | 'responded' | 'closed'>('all');
  const inquiryService = new InquiryService();

  useEffect(() => {
    loadInquiries();
  }, [filter]);

  const loadInquiries = async () => {
    try {
      setLoading(true);
      const data = await inquiryService.getInquiriesBySupplier(user?.id || '');
      setInquiries(data);
    } catch (error) {
      console.error('Failed to load inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (id: string) => {
    const response = prompt('Enter your response:');
    if (!response) return;

    try {
      await inquiryService.respondToInquiry(id, response);
      loadInquiries();
    } catch (error) {
      console.error('Failed to respond:', error);
    }
  };

  const handleAISuggestion = async (inquiry: Inquiry) => {
    try {
      const { ResponseSuggestionService } = await import('@/services/AIService');
      const aiService = new ResponseSuggestionService();
      setLoading(true);
      
      const result = await aiService.analyze({
        inquiry_message: inquiry.message,
        product_name: inquiry.product_id || 'Our Product', // In real app, fetch product name
        buyer_country: 'Unknown', // Need to pass buyer country if available
      });

      setLoading(false);
      
      if (result.success && result.data?.suggested_response) {
        const response = prompt('AI Suggested Response (Edit as needed):', result.data.suggested_response);
        if (response) {
          await inquiryService.respondToInquiry(inquiry.id, response);
          loadInquiries();
        }
      } else {
        alert('Failed to generate AI suggestion');
      }
    } catch (error) {
      setLoading(false);
      console.error('AI suggestion failed:', error);
      alert('Error generating suggestion');
    }
  };

  const filteredInquiries = filter === 'all' 
    ? inquiries 
    : inquiries.filter(i => i.status === filter);

  const stats = {
    total: inquiries.length,
    open: inquiries.filter(i => i.status === 'open').length,
    responded: inquiries.filter(i => i.status === 'responded').length,
    converted: inquiries.filter(i => i.converted_to_deal).length,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Inquiry Management</h1>
          <p className="text-gray-600 mt-1">Manage and respond to buyer inquiries</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-primary-600" />
              <div>
                <p className="text-sm text-gray-600">Total Inquiries</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Open</p>
                <p className="text-2xl font-bold text-orange-600">{stats.open}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Responded</p>
                <p className="text-2xl font-bold text-blue-600">{stats.responded}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Converted</p>
                <p className="text-2xl font-bold text-green-600">{stats.converted}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {['all', 'open', 'responded', 'closed'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab as any)}
                  className={`px-6 py-3 text-sm font-medium capitalize ${
                    filter === tab
                      ? 'border-b-2 border-primary-600 text-primary-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Inquiries List */}
        <div className="space-y-4">
          {loading ? (
            <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
              Loading inquiries...
            </div>
          ) : filteredInquiries.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
              No inquiries found
            </div>
          ) : (
            filteredInquiries.map((inquiry) => (
              <div key={inquiry.id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {inquiry.buyer_id}
                      </h3>
                      <span className={`badge ${
                        inquiry.status === 'open' ? 'badge-warning' :
                        inquiry.status === 'responded' ? 'badge-primary' :
                        'badge-success'
                      }`}>
                        {inquiry.status}
                      </span>
                      {inquiry.converted_to_deal && (
                        <span className="badge badge-success">Converted</span>
                      )}
                    </div>
                    <p className="text-gray-700 mb-3">{inquiry.message}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Source: {inquiry.source_type}</span>
                      <span>Product: {inquiry.product_id}</span>
                      <span>{new Date(inquiry.created_at).toLocaleDateString()}</span>
                      {inquiry.response_time_hours && (
                        <span>Response: {inquiry.response_time_hours}h</span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {inquiry.status === 'open' && (
                      <>
                        <button
                          onClick={() => handleRespond(inquiry.id)}
                          className="btn-primary text-sm"
                        >
                          Respond
                        </button>
                        <button
                          onClick={() => handleAISuggestion(inquiry)}
                          className="btn-outline text-sm flex items-center justify-center gap-1 border-purple-200 text-purple-700 hover:bg-purple-50"
                        >
                          <TrendingUp className="w-4 h-4" />
                          AI Suggest
                        </button>
                      </>
                    )}
                    {!inquiry.converted_to_deal && inquiry.status === 'responded' && (
                      <button
                        onClick={() => inquiryService.markAsConverted(inquiry.id)}
                        className="btn-success text-sm"
                      >
                        Mark as Deal
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
