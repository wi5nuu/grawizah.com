'use client';

import React, { useState } from 'react';
import { Send, Plus, X } from 'lucide-react';

export default function RFQManagerPage() {
  const [rfqForm, setRfqForm] = useState({
    productName: '',
    hsCode: '',
    quantity: '',
    targetPrice: '',
    deliveryDate: '',
    specifications: '',
    certifications: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('RFQ submitted:', rfqForm);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">RFQ Manager</h1>
          <p className="text-gray-600 mt-1">Create and manage your requests for quotation</p>
        </div>

        {/* RFQ Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Create New RFQ</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="e.g., Crude Palm Oil"
                  value={rfqForm.productName}
                  onChange={(e) => setRfqForm({ ...rfqForm, productName: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  HS Code
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g., 1511.10"
                  value={rfqForm.hsCode}
                  onChange={(e) => setRfqForm({ ...rfqForm, hsCode: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity *
                </label>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="e.g., 1000 MT"
                  value={rfqForm.quantity}
                  onChange={(e) => setRfqForm({ ...rfqForm, quantity: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Price (USD)
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g., 850 per MT"
                  value={rfqForm.targetPrice}
                  onChange={(e) => setRfqForm({ ...rfqForm, targetPrice: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Date *
                </label>
                <input
                  type="date"
                  required
                  className="input-field"
                  value={rfqForm.deliveryDate}
                  onChange={(e) => setRfqForm({ ...rfqForm, deliveryDate: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Required Certifications
                </label>
                <select className="input-field">
                  <option>RSPO</option>
                  <option>ISCC</option>
                  <option>ISO 9001</option>
                  <option>Halal</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Specifications & Requirements *
              </label>
              <textarea
                required
                rows={6}
                className="input-field"
                placeholder="Describe your product specifications, quality requirements, packaging, shipping terms, etc."
                value={rfqForm.specifications}
                onChange={(e) => setRfqForm({ ...rfqForm, specifications: e.target.value })}
              />
            </div>

            <div className="flex items-center gap-4">
              <button type="submit" className="btn-primary flex items-center gap-2">
                <Send className="w-4 h-4" />
                Send RFQ to Suppliers
              </button>
              <button type="button" className="btn-secondary">
                Save as Draft
              </button>
            </div>
          </form>
        </div>

        {/* Active RFQs */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Active RFQs</h2>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Crude Palm Oil - 1000 MT</h3>
                  <p className="text-sm text-gray-500 mt-1">Sent to 5 suppliers • 3 quotes received</p>
                  <p className="text-sm text-gray-500">Created: April 25, 2026</p>
                </div>
                <span className="badge badge-success">Active</span>
              </div>
              <div className="mt-4 flex gap-2">
                <button className="btn-primary text-sm">View Quotes</button>
                <button className="btn-secondary text-sm">Edit RFQ</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
