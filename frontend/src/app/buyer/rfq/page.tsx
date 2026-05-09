'use client';

import { useState } from 'react';
import { FileText, Plus, Clock, CheckCircle, Send, X, Sparkles, AlertCircle, Calendar, DollarSign, Package, Globe } from 'lucide-react';
import { PRODUCT_CATEGORIES, COUNTRIES } from '@/lib/constants';

const MOCK_RFQS = [
  { id: '1', product: 'Virgin Coconut Oil - Organic', quantity: '20 MT', country_origin: 'Indonesia', budget: '$16,000 - $24,000', deadline: '2026-06-01', status: 'active', responses: 3, created: '2026-05-01' },
  { id: '2', product: 'Arabica Coffee Beans Grade 1', quantity: '500 kg', country_origin: 'Indonesia', budget: '$1,750 - $2,500', deadline: '2026-05-20', status: 'active', responses: 5, created: '2026-05-03' },
  { id: '3', product: 'Teak Wood Planks KD', quantity: '50 m³', country_origin: 'Indonesia', budget: '$30,000 - $45,000', deadline: '2026-05-15', status: 'closed', responses: 7, created: '2026-04-20' },
];

export default function RFQPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [formData, setFormData] = useState({
    product: '', category: '', quantity: '', budget: '', origin: '', deadline: '', requirements: '',
  });

  const activeCount = MOCK_RFQS.filter(r => r.status === 'active').length;
  const totalResponses = MOCK_RFQS.reduce((sum, r) => sum + r.responses, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-6 h-6 text-primary-700" /> RFQ Manager
            </h1>
            <p className="text-gray-500 mt-1">Create and manage your Requests for Quotation</p>
          </div>
          <button onClick={() => setShowCreate(!showCreate)} className="btn-primary flex items-center gap-2">
            {showCreate ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            {showCreate ? 'Cancel' : 'New RFQ'}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="stat-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center"><FileText className="w-5 h-5 text-primary-700" /></div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{MOCK_RFQS.length}</p>
                <p className="text-xs text-gray-500">Total RFQs</p>
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center"><Clock className="w-5 h-5 text-green-600" /></div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{activeCount}</p>
                <p className="text-xs text-gray-500">Active</p>
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent-100 rounded-xl flex items-center justify-center"><CheckCircle className="w-5 h-5 text-accent-600" /></div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalResponses}</p>
                <p className="text-xs text-gray-500">Total Responses</p>
              </div>
            </div>
          </div>
        </div>

        {/* Create RFQ Form */}
        {showCreate && (
          <div className="card mb-6 animate-slide-up border border-primary-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-700" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Create New RFQ</h2>
                <p className="text-sm text-gray-500">Fill in details to receive supplier quotations</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Name *</label>
                <div className="relative">
                  <Package className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input value={formData.product} onChange={(e) => setFormData({ ...formData, product: e.target.value })} className="input-field pl-10" placeholder="e.g. Virgin Coconut Oil" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="select-field">
                  <option value="">Select category</option>
                  {PRODUCT_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Quantity</label>
                <input value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} className="input-field" placeholder="e.g. 20 MT" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Budget Range (USD)</label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input value={formData.budget} onChange={(e) => setFormData({ ...formData, budget: e.target.value })} className="input-field pl-10" placeholder="e.g. $16,000 - $24,000" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Preferred Origin</label>
                <div className="relative">
                  <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select value={formData.origin} onChange={(e) => setFormData({ ...formData, origin: e.target.value })} className="select-field pl-10">
                    <option value="">Any</option>
                    {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Deadline</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="date" value={formData.deadline} onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} className="input-field pl-10" />
                </div>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Requirements</label>
              <textarea value={formData.requirements} onChange={(e) => setFormData({ ...formData, requirements: e.target.value })} className="input-field h-24 resize-none" placeholder="Specify certifications, quality standards, packaging requirements..." />
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setShowCreate(false)} className="btn-ghost">Cancel</button>
              <button className="btn-primary flex items-center gap-2"><Send className="w-4 h-4" /> Submit RFQ</button>
            </div>
          </div>
        )}

        {/* RFQ List */}
        <div className="space-y-4">
          {MOCK_RFQS.map((rfq) => (
            <div key={rfq.id} className="card hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{rfq.product}</h3>
                    <span className={`badge text-[10px] capitalize ${rfq.status === 'active' ? 'badge-success' : 'bg-gray-100 text-gray-500'}`}>
                      {rfq.status === 'active' ? <><Clock className="w-3 h-3 mr-0.5" /> Active</> : <><CheckCircle className="w-3 h-3 mr-0.5" /> Closed</>}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Package className="w-3.5 h-3.5" /> {rfq.quantity}</span>
                    <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> {rfq.country_origin}</span>
                    <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" /> {rfq.budget}</span>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="flex items-center gap-1 text-accent-600 font-semibold text-sm">
                    <MessageSquare className="w-4 h-4" /> {rfq.responses} responses
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Created: {rfq.created}</p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Deadline: {rfq.deadline}
                </span>
                <button className="text-primary-600 font-medium text-sm hover:underline flex items-center gap-1">
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>

        {MOCK_RFQS.length === 0 && (
          <div className="text-center py-16">
            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500 mb-2">No RFQs yet</p>
            <button onClick={() => setShowCreate(true)} className="btn-primary">Create Your First RFQ</button>
          </div>
        )}
      </div>
    </div>
  );
}

function MessageSquare(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
