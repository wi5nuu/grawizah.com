'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Search, Clock, CheckCircle, RefreshCcw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function BuyerInquiriesPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchInquiries = async (showSpinner = false) => {
    if (!user) return;
    if (showSpinner) setRefreshing(true);
    try {
      const token = localStorage.getItem('grawizah_token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';
      const res = await fetch(`${API_URL}/api/inquiries/buyer/${user.id}`, {
        headers: { ...(token && { 'Authorization': `Bearer ${token}` }) }
      });
      if (res.ok) {
        const data = await res.json();
        const inqs = data.data || data;
        if (Array.isArray(inqs)) {
          setInquiries(inqs);
        }
      }
    } catch (err) {
      console.error('Failed to fetch buyer inquiries:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInquiries(true);

    // Background polling every 5 seconds for full real-time feel
    const interval = setInterval(() => {
      fetchInquiries(false);
    }, 5000);

    return () => clearInterval(interval);
  }, [user]);

  const filtered = inquiries.filter(i => filter === 'all' || i.status === filter);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <RefreshCcw className="w-8 h-8 animate-spin text-primary opacity-20" />
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse">Loading Communications...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 w-full min-h-full font-sans relative">
      {/* Header Section */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-black text-accent uppercase tracking-[0.3em]">COMMUNICATION HUB</span>
            {refreshing && (
              <span className="text-[9px] font-bold text-accent animate-pulse bg-accent/5 px-2 py-0.5 rounded-full uppercase tracking-[0.15em]">
                Syncing
              </span>
            )}
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
            My Inquiries
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            Track and manage all direct RFQ and sourcing inquiries sent to verified global suppliers.
          </p>
        </div>

        <button 
          onClick={() => fetchInquiries(true)} 
          disabled={refreshing}
          className="px-4 py-2.5 bg-white dark:bg-dark-surface-container text-gray-700 dark:text-gray-300 rounded-xl font-bold text-xs hover:bg-gray-50 dark:hover:bg-dark-surface-container-high transition border border-gray-100 dark:border-dark-surface-variant/20 flex items-center gap-2 shadow-sm disabled:opacity-80"
        >
          <RefreshCcw className={`w-4 h-4 ${refreshing ? 'animate-spin text-primary' : 'text-gray-400'}`} />
          {refreshing ? 'Syncing...' : 'Sync Hub'}
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {['all', 'open', 'responded', 'converted'].map(f => (
          <button 
            key={f} 
            onClick={() => setFilter(f)} 
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition ${
              filter === f 
                ? 'bg-primary text-white shadow-md shadow-primary/10' 
                : 'bg-white dark:bg-dark-surface-container text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-dark-surface-variant/20 hover:bg-gray-50'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Inquiry List */}
      <div className="space-y-4">
        {filtered.length > 0 ? filtered.map((inq: any) => (
          <div key={inq.id} className="bg-white dark:bg-dark-surface-container p-6 rounded-3xl border border-gray-100 dark:border-dark-surface-variant/20 shadow-sm hover:border-primary/30 transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h3 className="font-black text-base text-gray-900 dark:text-white mb-1">
                  {inq.product_name || 'Product Inquiry'}
                </h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Supplier Ref: #{inq.supplier_id ? inq.supplier_id.substring(0, 8).toUpperCase() : 'BROADCAST'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-4 leading-relaxed bg-gray-50 dark:bg-dark-surface-container-high p-4 rounded-2xl border border-gray-100 dark:border-dark-surface-variant/10">
                  {inq.message}
                </p>
                {inq.response_message && (
                  <div className="mt-4">
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">
                      Supplier Response:
                    </p>
                    <p className="text-sm text-gray-800 dark:text-gray-100 leading-relaxed bg-primary/5 dark:bg-primary/10 p-4 rounded-2xl border border-primary/20">
                      {inq.response_message}
                    </p>
                  </div>
                )}
              </div>
              <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest self-start ${
                inq.status === 'responded' 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                  : inq.status === 'converted' 
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' 
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
              }`}>
                {inq.status === 'responded' ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                {inq.status}
              </span>
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-4">
              Sent: {new Date(inq.created_at).toLocaleString()}
            </p>
          </div>
        )) : (
          <div className="text-center py-20 bg-white dark:bg-dark-surface-container rounded-3xl border border-gray-100 dark:border-dark-surface-variant/20 shadow-sm">
            <MessageSquare className="w-12 h-12 text-gray-200 dark:text-gray-700 mx-auto mb-4" />
            <p className="text-sm font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">No Inquiries Found</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">You haven't initiated any inquiries matching this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
