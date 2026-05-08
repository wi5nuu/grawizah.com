'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { ShoppingCart, FileText, GitCompare, Lock, Search, MessageSquare, TrendingUp, ArrowUpRight } from 'lucide-react';

export default function BuyerDashboardPage() {
  const { user } = useAuth();

  const stats = [
    { label: 'Active RFQs', value: '5', icon: FileText, change: '+2', color: 'primary' },
    { label: 'Suppliers Contacted', value: '12', icon: MessageSquare, change: '+4', color: 'accent' },
    { label: 'Products Viewed', value: '87', icon: Search, change: '+15', color: 'green' },
    { label: 'Deals Closed', value: '3', icon: TrendingUp, change: '+1', color: 'amber' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Buyer Dashboard — <span className="gradient-text">{user?.email?.split('@')[0] || 'Buyer'}</span>
          </h1>
          <p className="text-gray-500 mt-1">Manage your procurement, RFQs, and supplier relationships</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-card hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  stat.color === 'primary' ? 'bg-primary-100' :
                  stat.color === 'accent' ? 'bg-accent-100' :
                  stat.color === 'green' ? 'bg-green-100' : 'bg-amber-100'
                }`}>
                  <stat.icon className={`w-5 h-5 ${
                    stat.color === 'primary' ? 'text-primary-700' :
                    stat.color === 'accent' ? 'text-accent-600' :
                    stat.color === 'green' ? 'text-green-600' : 'text-amber-600'
                  }`} />
                </div>
                <span className="text-xs font-medium text-green-600 flex items-center gap-0.5">
                  <ArrowUpRight className="w-3.5 h-3.5" /> {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mt-3">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { href: '/catalog', icon: Search, title: 'Browse Catalog', desc: 'Discover verified suppliers', color: 'from-primary-500 to-primary-700' },
            { href: '/buyer/rfq', icon: FileText, title: 'Create RFQ', desc: 'Request for quotation', color: 'from-accent-500 to-accent-700' },
            { href: '/buyer/comparison', icon: GitCompare, title: 'Compare Suppliers', desc: 'AI-powered comparison', color: 'from-green-500 to-green-700' },
            { href: '/buyer/documents', icon: Lock, title: 'Document Vault', desc: 'Encrypted storage', color: 'from-amber-500 to-amber-700' },
          ].map((action) => (
            <Link key={action.href} href={action.href} className="card-hover group">
              <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
              <p className="text-sm text-gray-500">{action.desc}</p>
            </Link>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {[
              { action: 'Sent inquiry to PT Nusantara Agro for Virgin Coconut Oil', time: '2h ago', type: 'inquiry' },
              { action: 'Created RFQ for Arabica Coffee Beans - 500MT', time: '5h ago', type: 'rfq' },
              { action: 'Received quotation from Java Spice Trading', time: '1d ago', type: 'quote' },
              { action: 'Uploaded trade compliance documents', time: '2d ago', type: 'document' },
            ].map((activity, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition">
                <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0" />
                <p className="text-sm text-gray-600 flex-1">{activity.action}</p>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
