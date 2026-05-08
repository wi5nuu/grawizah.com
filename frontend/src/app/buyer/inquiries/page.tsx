'use client';

import { useState } from 'react';
import { MessageSquare, Search, Clock, CheckCircle } from 'lucide-react';

const MOCK_INQUIRIES = [
  { id: '1', supplier: 'PT Nusantara Agro', product: 'Virgin Coconut Oil', message: 'Interested in 20MT organic coconut oil with USDA certification', status: 'responded', date: '2026-05-08' },
  { id: '2', supplier: 'Java Spice Trading', product: 'Arabica Coffee', message: 'Need samples for 500kg order evaluation', status: 'open', date: '2026-05-07' },
  { id: '3', supplier: 'Borneo Wood Export', product: 'Teak Wood Planks', message: 'FSC certified teak for furniture manufacturing', status: 'open', date: '2026-05-06' },
];

export default function BuyerInquiriesPage() {
  const [filter, setFilter] = useState('all');

  const filtered = MOCK_INQUIRIES.filter(i => filter === 'all' || i.status === filter);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-accent-600" /> My Inquiries
          </h1>
          <p className="text-gray-500 mt-1">Track your inquiries sent to suppliers</p>
        </div>

        <div className="flex gap-2 mb-6">
          {['all', 'open', 'responded'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${filter === f ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {f}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map(inq => (
            <div key={inq.id} className="card hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{inq.supplier}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">Re: {inq.product}</p>
                  <p className="text-sm text-gray-600 mt-2">{inq.message}</p>
                </div>
                <span className={`badge text-xs capitalize ${inq.status === 'responded' ? 'badge-success' : 'badge-warning'}`}>
                  {inq.status === 'responded' ? <CheckCircle className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                  {inq.status}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-3">{inq.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
