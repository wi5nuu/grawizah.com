'use client';

import React, { useState, useEffect } from 'react';
import { BuyerService } from '@/services/BuyerService';
import { InquiryService } from '@/services/InquiryService';
import { ShoppingCart, FileText, TrendingUp, Clock } from 'lucide-react';

export default function BuyerDashboardPage() {
  const [stats, setStats] = useState({
    activeRFQs: 0,
    savedSuppliers: 0,
    documents: 0,
    pendingQuotes: 0,
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Buyer Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your sourcing activities</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-100 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active RFQs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeRFQs}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Saved Suppliers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.savedSuppliers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Documents</p>
                <p className="text-2xl font-bold text-gray-900">{stats.documents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending Quotes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingQuotes}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <a href="/buyer/rfq" className="bg-gradient-to-r from-primary-600 to-blue-600 text-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold mb-2">Create RFQ</h3>
            <p className="text-sm opacity-90">Send request for quotation to suppliers</p>
          </a>

          <a href="/buyer/suppliers" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold mb-2">Find Suppliers</h3>
            <p className="text-sm opacity-90">Search and compare verified suppliers</p>
          </a>

          <a href="/buyer/documents" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold mb-2">Document Vault</h3>
            <p className="text-sm opacity-90">Secure storage for trade documents</p>
          </a>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">New quote received</p>
                <p className="text-sm text-gray-500">From PT Supplier Indonesia - 2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">RFQ sent</p>
                <p className="text-sm text-gray-500">Palm Oil - 5 suppliers - 1 day ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Document uploaded</p>
                <p className="text-sm text-gray-500">Import License - 3 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
