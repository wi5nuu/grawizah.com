'use client';

import { useState } from 'react';
import { FileText, Plus, Clock, CheckCircle, Send } from 'lucide-react';
import { PRODUCT_CATEGORIES, COUNTRIES } from '@/lib/constants';

const MOCK_RFQS = [
  { id: '1', product: 'Virgin Coconut Oil - Organic', quantity: '20 MT', country_origin: 'Indonesia', budget: '$16,000 - $24,000', deadline: '2026-06-01', status: 'active', responses: 3 },
  { id: '2', product: 'Arabica Coffee Beans Grade 1', quantity: '500 kg', country_origin: 'Indonesia', budget: '$1,750 - $2,500', deadline: '2026-05-20', status: 'active', responses: 5 },
  { id: '3', product: 'Teak Wood Planks KD', quantity: '50 m³', country_origin: 'Indonesia', budget: '$30,000 - $45,000', deadline: '2026-05-15', status: 'closed', responses: 7 },
];

export default function RFQPage() {
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-6 h-6 text-primary-700" /> RFQ Manager
            </h1>
            <p className="text-gray-500 mt-1">Create and manage your Requests for Quotation</p>
          </div>
          <button onClick={() => setShowCreate(!showCreate)} className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" /> New RFQ
          </button>
        </div>

        {/* Create RFQ Form */}
        {showCreate && (
          <div className="card mb-6 animate-slide-up">
            <h2 className="text-lg font-semibold mb-4">Create New RFQ</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                <input className="input-field" placeholder="e.g. Virgin Coconut Oil" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select className="select-field">
                  <option value="">Select category</option>
                  {PRODUCT_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input className="input-field" placeholder="e.g. 20 MT" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Budget Range (USD)</label>
                <input className="input-field" placeholder="e.g. $16,000 - $24,000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Origin</label>
                <select className="select-field">
                  <option value="">Any</option>
                  {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                <input type="date" className="input-field" />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
              <textarea className="input-field h-20 resize-none" placeholder="Specify certifications, quality standards, packaging requirements..." />
            </div>
            <div className="mt-4 flex justify-end gap-3">
              <button onClick={() => setShowCreate(false)} className="btn-ghost">Cancel</button>
              <button className="btn-primary flex items-center gap-2"><Send className="w-4 h-4" /> Submit RFQ</button>
            </div>
          </div>
        )}

        {/* RFQ List */}
        <div className="space-y-4">
          {MOCK_RFQS.map((rfq) => (
            <div key={rfq.id} className="card hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{rfq.product}</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span>Qty: {rfq.quantity}</span>
                    <span>Origin: {rfq.country_origin}</span>
                    <span>Budget: {rfq.budget}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`badge text-xs capitalize ${rfq.status === 'active' ? 'badge-success' : 'bg-gray-100 text-gray-500'}`}>
                    {rfq.status === 'active' ? <><Clock className="w-3 h-3 mr-1" /> Active</> : <><CheckCircle className="w-3 h-3 mr-1" /> Closed</>}
                  </span>
                  <p className="text-sm text-gray-500 mt-1">{rfq.responses} responses</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                <span>Deadline: {rfq.deadline}</span>
                <button className="text-primary-600 font-medium hover:underline">View Details →</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
