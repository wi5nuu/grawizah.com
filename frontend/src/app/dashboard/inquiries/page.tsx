'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Search, Clock, CheckCircle, XCircle, Send, Bot, TrendingUp, Award, Filter, Inbox } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { InquiryService } from '@/services/InquiryService';
import { Inquiry, InquiryAnalytics as IAnalytics } from '@/types/inquiry';
import { InquiryAnalytics } from '@/components/InquiryAnalytics';

const inquiryService = new InquiryService();

const MOCK_INQUIRIES: Inquiry[] = [
  { id: '1', supplier_id: 'u1', buyer_id: 'b1', product_id: 'p1', buyer_name: 'Global Foods Inc', buyer_country: 'USA', product_name: 'Virgin Coconut Oil', message: 'We are interested in purchasing 20MT of your virgin coconut oil. Please share your FOB price and available certifications.', status: 'open', source: 'chat', created_at: '2026-05-08T10:00:00Z', updated_at: '2026-05-08T10:00:00Z', response_time_hours: 0, converted_to_deal: false },
  { id: '2', supplier_id: 'u1', buyer_id: 'b2', product_id: 'p2', buyer_name: 'Shanghai Trading Co', buyer_country: 'China', product_name: 'Arabica Coffee', message: 'Looking for Grade 1 Arabica coffee beans, 500kg sample first. What is your MOQ for regular orders?', status: 'responded', source: 'whatsapp', created_at: '2026-05-07T08:00:00Z', updated_at: '2026-05-07T12:30:00Z', response_time_hours: 4.5, converted_to_deal: false },
  { id: '3', supplier_id: 'u1', buyer_id: 'b3', product_id: 'p3', buyer_name: 'Euro Import GmbH', buyer_country: 'Germany', product_name: 'Organic Turmeric', message: 'Do you have EU Organic certification for your turmeric powder? We need 5MT monthly supply.', status: 'open', source: 'email', created_at: '2026-05-07T14:00:00Z', updated_at: '2026-05-07T14:00:00Z', response_time_hours: 0, converted_to_deal: false },
  { id: '4', supplier_id: 'u1', buyer_id: 'b4', product_id: 'p4', buyer_name: 'Tokyo Mart Ltd', buyer_country: 'Japan', product_name: 'Teak Wood Planks', message: 'Requesting quotes for KD teak planks, 50 cubic meters. JAS certification required.', status: 'closed', source: 'rfq', created_at: '2026-05-06T06:00:00Z', updated_at: '2026-05-06T08:06:00Z', response_time_hours: 2.1, converted_to_deal: true },
  { id: '5', supplier_id: 'u1', buyer_id: 'b5', product_id: 'p5', buyer_name: 'Australian Organics', buyer_country: 'Australia', product_name: 'Virgin Coconut Oil', message: 'We are looking for USDA organic certified coconut oil. Can you provide private label services?', status: 'responded', source: 'chat', created_at: '2026-05-05T12:00:00Z', updated_at: '2026-05-05T18:18:00Z', response_time_hours: 6.3, converted_to_deal: false },
];

const MOCK_ANALYTICS: IAnalytics = {
  total_inquiries: 5,
  response_rate: 80.0,
  conversion_rate: 20.0,
  repeat_buyer_rate: 15.0,
  avg_response_time_hours: 4.3,
};

export default function InquiriesPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState<string | null>(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [inquiries, setInquiries] = useState<Inquiry[]>(MOCK_INQUIRIES);
  const [analytics, setAnalytics] = useState<IAnalytics>(MOCK_ANALYTICS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const supplierId = user?.id || 'u1';
    inquiryService.getInquiriesBySupplier(supplierId)
      .then(data => { if (Array.isArray(data) && data.length > 0) setInquiries(data); })
      .catch(() => { });
    inquiryService.getAnalytics(supplierId)
      .then(data => { if (data && data.total_inquiries !== undefined) setAnalytics(data); })
      .catch(() => { });
  }, [user]);

  const filteredInquiries = inquiries.filter((inq) => {
    const matchFilter = filter === 'all' || inq.status === filter;
    const matchSearch = !searchQuery || (inq.buyer_name || '').toLowerCase().includes(searchQuery.toLowerCase()) || (inq.product_name || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleRespond = async (inquiryId: string) => {
    if (!responseMessage.trim()) return;
    setLoading(true);
    try {
      await inquiryService.respondToInquiry(inquiryId, responseMessage);
      setInquiries(prev => prev.map(inq => inq.id === inquiryId ? { ...inq, status: 'responded' } : inq));
      setSelectedInquiry(null);
      setResponseMessage('');
    } catch (err) {
      console.error('Failed to respond:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkConverted = async (inquiryId: string) => {
    try {
      await inquiryService.markAsConverted(inquiryId);
      setInquiries(prev => prev.map(inq => inq.id === inquiryId ? { ...inq, converted_to_deal: true, status: 'closed' } : inq));
    } catch (err) {
      console.error('Failed to mark as converted:', err);
    }
  };

  const handleGetAISuggestion = async (inq: Inquiry) => {
    try {
      const res = await fetch('http://localhost:8080/api/ai/response-suggestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('grawizah_token')}` },
        body: JSON.stringify({ inquiry_message: inq.message, product_name: inq.product_name, buyer_country: inq.buyer_country }),
      });
      const data = await res.json();
      setResponseMessage(data.data?.suggested_response || data.suggested_response || '');
    } catch (err) {
      console.error('Failed to get AI suggestion:', err);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <Clock className="w-4 h-4 text-amber-500" />;
      case 'responded': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'closed': return <XCircle className="w-4 h-4 text-gray-400" />;
      default: return null;
    }
  };

  const getSourceBadge = (source: string) => {
    const colors: Record<string, string> = { chat: 'badge-primary', whatsapp: 'badge-success', email: 'badge-accent', rfq: 'badge-warning' };
    return colors[source] || 'badge';
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Inquiry Management</h1>
        <p className="text-gray-500 mt-1">Track and respond to buyer inquiries across all channels</p>
      </div>

      {/* Analytics Cards */}
      <div className="mb-6">
        <InquiryAnalytics analytics={analytics} />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search buyer or product..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input-field pl-10" />
        </div>
        <div className="flex gap-2">
          {['all', 'open', 'responded', 'closed'].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg text-sm font-medium transition capitalize ${filter === f ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiry List */}
      <div className="space-y-3">
        {filteredInquiries.map((inq) => (
          <div key={inq.id} className="card hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm font-bold text-primary-700">{(inq.buyer_name || 'B')[0]}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold text-gray-900">{inq.buyer_name}</h3>
                    <span className="text-xs text-gray-400">• {inq.buyer_country}</span>
                    <span className={`badge text-[10px] capitalize ${getSourceBadge(inq.source || 'chat')}`}>{inq.source || 'chat'}</span>
                    {inq.converted_to_deal && (
                      <span className="badge bg-amber-50 text-amber-700 text-[10px] flex items-center gap-0.5">
                        <Award className="w-3 h-3" /> Converted
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mb-2">Re: <span className="font-medium text-gray-700">{inq.product_name}</span></p>
                  <p className="text-sm text-gray-600 leading-relaxed">{inq.message}</p>
                  {inq.response_time_hours && inq.response_time_hours > 0 && (
                    <p className="text-xs text-gray-400 mt-2">⏱ Responded in {inq.response_time_hours.toFixed(1)}h</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                {getStatusIcon(inq.status)}
                <span className={`badge text-xs capitalize ${inq.status === 'open' ? 'badge-warning' : inq.status === 'responded' ? 'badge-success' : 'bg-gray-100 text-gray-500'}`}>{inq.status}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              {inq.status === 'open' && (
                selectedInquiry === inq.id ? (
                  <div className="space-y-3">
                    <textarea value={responseMessage} onChange={(e) => setResponseMessage(e.target.value)} className="input-field h-24 resize-none" placeholder="Type your response..." />
                    <div className="flex items-center justify-between">
                      <button onClick={() => handleGetAISuggestion(inq)} className="btn-ghost btn-sm flex items-center gap-1 text-accent-600">
                        <Bot className="w-4 h-4" /> AI Suggestion
                      </button>
                      <div className="flex gap-2">
                        <button onClick={() => setSelectedInquiry(null)} className="btn-ghost btn-sm">Cancel</button>
                        <button onClick={() => handleRespond(inq.id)} disabled={loading} className="btn-primary btn-sm flex items-center gap-1">
                          <Send className="w-4 h-4" /> Send
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setSelectedInquiry(inq.id)} className="btn-primary btn-sm flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" /> Respond
                  </button>
                )
              )}

              {inq.status === 'responded' && !inq.converted_to_deal && (
                <div className="flex gap-2">
                  <button onClick={() => handleMarkConverted(inq.id)} className="btn-sm flex items-center gap-1 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg px-3 py-1.5 text-xs font-medium transition">
                    <TrendingUp className="w-3.5 h-3.5" /> Mark as Converted
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredInquiries.length === 0 && (
          <div className="text-center py-16">
            <Inbox className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500 mb-1">No inquiries found</p>
            <p className="text-sm text-gray-400">When buyers contact you, they&apos;ll appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
