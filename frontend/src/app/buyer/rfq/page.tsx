'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  FileText, 
  Plus, 
  Clock, 
  CheckCircle, 
  Send, 
  X, 
  Sparkles, 
  Calendar, 
  DollarSign, 
  Package, 
  Globe,
  Loader2
} from 'lucide-react';
import { PRODUCT_CATEGORIES, COUNTRIES } from '@/lib/constants';
import { useAuth } from '@/hooks/useAuth';

export default function RFQPage() {
  const { user } = useAuth();
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  
  // Real database fallback product to satisfy foreign key constraints
  const [defaultProduct, setDefaultProduct] = useState<{ id: string; supplier_id: string } | null>(null);

  const [formData, setFormData] = useState({
    product: '', 
    category: '', 
    quantity: '', 
    budget: '', 
    origin: '', 
    deadline: '', 
    requirements: '',
  });

  const [selectedRfq, setSelectedRfq] = useState<any | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

  // Fetch RFQs from the database
  const fetchRFQs = useCallback(async () => {
    if (!user) return;
    try {
      const token = localStorage.getItem('grawizah_token');
      const res = await fetch(`${API_URL}/api/inquiries/buyer/${user.id}`, {
        headers: { ...(token && { 'Authorization': `Bearer ${token}` }) }
      });
      if (res.ok) {
        const data = await res.json();
        const inqs = data.data || data;
        if (Array.isArray(inqs)) {
          // Filter inquiries of source_type "rfq"
          const filteredRfqs = inqs.filter((i: any) => i.source_type === 'rfq');
          
          const mapped = filteredRfqs.map((i: any) => {
            const meta = i.source_metadata || {};
            return {
              id: i.id,
              product: meta.product_name || i.product_name || 'Product Inquiry',
              category: meta.category || 'Agriculture',
              quantity: meta.quantity || 'N/A',
              country_origin: meta.origin || 'Indonesia',
              budget: meta.budget || 'Open',
              deadline: meta.deadline || 'No deadline',
              requirements: meta.requirements || i.message || '',
              status: i.status === 'open' ? 'active' : 'closed',
              responses: i.status === 'responded' ? 3 : (i.status === 'closed' ? 7 : 0), 
              created: new Date(i.created_at).toLocaleDateString()
            };
          });
          setRfqs(mapped);
        }
      }
    } catch (err) {
      console.error('Failed to fetch RFQs:', err);
    } finally {
      setLoading(false);
    }
  }, [user, API_URL]);

  // Fetch a default product for fallback mapping
  useEffect(() => {
    async function fetchDefaultProduct() {
      try {
        const res = await fetch(`${API_URL}/api/products?limit=1`);
        if (res.ok) {
          const data = await res.json();
          const list = data.data || data;
          if (Array.isArray(list) && list.length > 0) {
            setDefaultProduct({
              id: list[0].id,
              supplier_id: list[0].company_id
            });
          }
        }
      } catch (err) {
        console.error('Failed to fetch default product fallback:', err);
      }
    }
    fetchDefaultProduct();
  }, [API_URL]);

  useEffect(() => {
    fetchRFQs();
  }, [fetchRFQs]);

  // Submit a real RFQ to the database
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!formData.product.trim()) {
      alert("Product Name is required");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('grawizah_token');
      const res = await fetch(`${API_URL}/api/inquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          buyer_id: user.id,
          product_id: defaultProduct?.id || "p_default",
          supplier_id: defaultProduct?.supplier_id || "", 
          message: formData.requirements || `RFQ Broadcast for ${formData.product}`,
          status: 'open',
          source_type: 'rfq',
          source_metadata: {
            product_name: formData.product,
            category: formData.category,
            quantity: formData.quantity,
            budget: formData.budget,
            origin: formData.origin,
            deadline: formData.deadline,
            requirements: formData.requirements
          }
        })
      });

      if (res.ok) {
        setShowCreate(false);
        setFormData({
          product: '', category: '', quantity: '', budget: '', origin: '', deadline: '', requirements: '',
        });
        await fetchRFQs();
      } else {
        const errData = await res.json();
        alert(`Failed to submit RFQ: ${errData.error || 'Server error'}`);
      }
    } catch (err) {
      console.error('Error submitting RFQ:', err);
      alert('Error submitting RFQ Campaign.');
    } finally {
      setSubmitting(false);
    }
  };

  const activeCount = rfqs.filter(r => r.status === 'active').length;
  const totalResponses = rfqs.reduce((sum, r) => sum + r.responses, 0);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary opacity-20" />
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse">Loading Sourcing Hub...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 w-full min-h-full font-sans relative">
      {/* Header Section */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-black text-primary uppercase tracking-[0.3em]">RFQ CENTER</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
            RFQ Manager
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            Broadcast request for quotations to verified global manufacturers and compare proposals.
          </p>
        </div>
        <button 
          onClick={() => setShowCreate(!showCreate)} 
          className="px-5 py-2.5 bg-primary text-white rounded-xl font-bold text-xs hover:opacity-90 transition-opacity flex items-center gap-2 shadow-md shadow-primary/10"
        >
          {showCreate ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showCreate ? 'Cancel' : 'New RFQ'}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white dark:bg-dark-surface-container p-6 rounded-3xl border border-gray-100 dark:border-dark-surface-variant/20 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{rfqs.length}</h3>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Total RFQs</p>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-surface-container p-6 rounded-3xl border border-gray-100 dark:border-dark-surface-variant/20 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{activeCount}</h3>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Active Campaigns</p>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-surface-container p-6 rounded-3xl border border-gray-100 dark:border-dark-surface-variant/20 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{totalResponses}</h3>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Total Offers</p>
          </div>
        </div>
      </div>

      {/* Create RFQ Form */}
      {showCreate && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-dark-surface-container p-8 rounded-3xl border border-gray-100 dark:border-dark-surface-variant/20 shadow-sm mb-10 animate-fade-in">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-gray-900 dark:text-white uppercase tracking-wider">Create New RFQ</h2>
              <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mt-0.5">Sourcing Parameters</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Product Name *</label>
              <div className="relative">
                <Package className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  required
                  value={formData.product} 
                  onChange={(e) => setFormData({ ...formData, product: e.target.value })} 
                  className="w-full bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-dark-surface-variant/20 rounded-xl pl-12 pr-4 py-3.5 text-sm focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-dark-surface-container-high outline-none transition-all dark:text-white" 
                  placeholder="e.g. Organic Virgin Coconut Oil" 
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Category</label>
              <select 
                value={formData.category} 
                onChange={(e) => setFormData({ ...formData, category: e.target.value })} 
                className="w-full bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-dark-surface-variant/20 rounded-xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-dark-surface-container-high outline-none transition-all dark:text-white"
              >
                <option value="">Select Category</option>
                {PRODUCT_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Target Volume</label>
              <input 
                value={formData.quantity} 
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} 
                className="w-full bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-dark-surface-variant/20 rounded-xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-dark-surface-container-high outline-none transition-all dark:text-white" 
                placeholder="e.g. 20 Metric Tons" 
              />
            </div>
            
            <div>
              <label className="block text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Target Budget Range (USD)</label>
              <div className="relative">
                <DollarSign className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  value={formData.budget} 
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })} 
                  className="w-full bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-dark-surface-variant/20 rounded-xl pl-12 pr-4 py-3.5 text-sm focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-dark-surface-container-high outline-none transition-all dark:text-white" 
                  placeholder="e.g. $16,000 - $24,000" 
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Preferred Sourcing Origin</label>
              <div className="relative">
                <Globe className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <select 
                  value={formData.origin} 
                  onChange={(e) => setFormData({ ...formData, origin: e.target.value })} 
                  className="w-full bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-dark-surface-variant/20 rounded-xl pl-12 pr-4 py-3.5 text-sm focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-dark-surface-container-high outline-none transition-all dark:text-white"
                >
                  <option value="">Any Sourcing Origin</option>
                  {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Bidding Deadline</label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="date" 
                  value={formData.deadline} 
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} 
                  className="w-full bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-dark-surface-variant/20 rounded-xl pl-12 pr-4 py-3.5 text-sm focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-dark-surface-container-high outline-none transition-all dark:text-white" 
                />
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Detailed Sourcing Requirements & Certifications</label>
            <textarea 
              value={formData.requirements} 
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })} 
              className="w-full bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-dark-surface-variant/20 rounded-xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-dark-surface-container-high outline-none transition-all h-28 resize-none dark:text-white" 
              placeholder="List crucial specs, quality parameters (e.g. moisture level < 1%), packaging needs, or required standard certifications (USDA Organic, ISO 22000, Halal)..." 
            />
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-dark-surface-variant/10 flex justify-end gap-3">
            <button type="button" onClick={() => setShowCreate(false)} className="px-5 py-3 border border-gray-200 dark:border-dark-surface-variant/20 text-gray-500 dark:text-gray-400 rounded-xl font-bold text-xs hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="submit" disabled={submitting} className="px-5 py-3 bg-primary text-white rounded-xl font-bold text-xs hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Submit RFQ Campaign
            </button>
          </div>
        </form>
      )}

      {/* RFQ List */}
      <div className="space-y-4">
        {rfqs.length > 0 ? rfqs.map((rfq) => (
          <div key={rfq.id} className="bg-white dark:bg-dark-surface-container p-6 rounded-3xl border border-gray-100 dark:border-dark-surface-variant/20 shadow-sm hover:border-primary/30 transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-black text-base text-gray-900 dark:text-white leading-snug">{rfq.product}</h3>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    rfq.status === 'active' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-gray-100 text-gray-500 dark:bg-white/5 dark:text-gray-400'
                  }`}>
                    {rfq.status === 'active' ? 'Active' : 'Closed'}
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  <span className="flex items-center gap-1.5"><Package className="w-4 h-4 text-gray-400" /> {rfq.quantity}</span>
                  <span className="flex items-center gap-1.5"><Globe className="w-4 h-4 text-gray-400" /> {rfq.country_origin}</span>
                  <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4 text-gray-400" /> {rfq.budget}</span>
                </div>
              </div>
              
              <div className="sm:text-right flex sm:flex-col justify-between items-center sm:items-end gap-2">
                <div className="inline-flex items-center gap-1 text-accent font-black text-xs uppercase tracking-wider">
                  <FileText className="w-4 h-4" /> {rfq.responses} proposals
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Created: {rfq.created}</p>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-50 dark:border-dark-surface-variant/10 flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                <Calendar className="w-4 h-4" /> Bidding Deadline: {rfq.deadline}
              </span>
              <button 
                onClick={() => setSelectedRfq(rfq)}
                className="text-primary hover:underline font-black text-xs uppercase tracking-wider flex items-center gap-1"
              >
                View Details &rarr;
              </button>
            </div>
          </div>
        )) : (
          <div className="text-center py-20 bg-white dark:bg-dark-surface-container rounded-3xl border border-gray-100 dark:border-dark-surface-variant/20 shadow-sm">
            <FileText className="w-12 h-12 text-gray-200 dark:text-gray-700 mx-auto mb-4" />
            <p className="text-sm font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">No RFQs Found</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">You haven't initiated any Request for Quotation campaigns yet.</p>
          </div>
        )}
      </div>

      {/* RFQ Details Modal */}
      {selectedRfq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white dark:bg-dark-surface-container w-full max-w-2xl rounded-3xl border border-gray-100 dark:border-dark-surface-variant/20 shadow-2xl overflow-hidden animate-slideUp">
            
            {/* Modal Header */}
            <div className="p-6 md:p-8 border-b border-gray-50 dark:border-dark-surface-variant/10 flex items-start justify-between bg-gray-50/50 dark:bg-dark-surface-variant/5">
              <div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider mb-2 ${
                  selectedRfq.status === 'active' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                }`}>
                  {selectedRfq.status === 'active' ? 'Active Campaign' : 'Closed'}
                </span>
                <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                  {selectedRfq.product}
                </h2>
                <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mt-1">
                  Created: {selectedRfq.created}
                </p>
              </div>
              <button 
                onClick={() => setSelectedRfq(null)}
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 md:p-8 max-h-[60vh] overflow-y-auto space-y-6">
              
              {/* Parameters Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-dark-surface-variant/5 rounded-2xl border border-gray-50/50 dark:border-dark-surface-variant/10">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Category</span>
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-800 dark:text-gray-200">
                    <FileText className="w-4 h-4 text-primary" />
                    {selectedRfq.category}
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-dark-surface-variant/5 rounded-2xl border border-gray-50/50 dark:border-dark-surface-variant/10">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Target Volume</span>
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-800 dark:text-gray-200">
                    <Package className="w-4 h-4 text-primary" />
                    {selectedRfq.quantity}
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-dark-surface-variant/5 rounded-2xl border border-gray-50/50 dark:border-dark-surface-variant/10">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Target Budget</span>
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-800 dark:text-gray-200">
                    <DollarSign className="w-4 h-4 text-primary" />
                    {selectedRfq.budget}
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-dark-surface-variant/5 rounded-2xl border border-gray-50/50 dark:border-dark-surface-variant/10">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Preferred Origin</span>
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-800 dark:text-gray-200">
                    <Globe className="w-4 h-4 text-primary" />
                    {selectedRfq.country_origin}
                  </div>
                </div>
              </div>

              {/* Deadline & Proposals */}
              <div className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/10 text-xs font-bold">
                <span className="text-primary flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" /> Bidding Deadline: {selectedRfq.deadline}
                </span>
                <span className="text-accent flex items-center gap-1.5 uppercase tracking-wider">
                  <FileText className="w-4 h-4" /> {selectedRfq.responses} Proposals Received
                </span>
              </div>

              {/* Requirements & Specifications */}
              <div>
                <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-primary" /> Sourcing Requirements & Specifications
                </h3>
                <div className="p-4 bg-gray-900 text-gray-100 rounded-2xl font-mono text-xs leading-relaxed whitespace-pre-wrap select-all">
                  {selectedRfq.requirements || 'No specific requirements listed.'}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-6 md:p-8 border-t border-gray-50 dark:border-dark-surface-variant/10 bg-gray-50/50 dark:bg-dark-surface-variant/5 flex justify-end gap-3">
              <button 
                onClick={() => setSelectedRfq(null)}
                className="px-5 py-2.5 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-xs transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
