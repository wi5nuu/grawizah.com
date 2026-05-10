'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { ShoppingCart, FileText, GitCompare, Lock, Search, MessageSquare, TrendingUp, ArrowUpRight, Bell, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function BuyerDashboardPage() {
  const { user } = useAuth();

  const stats = [
    { label: 'Active RFQs', value: '5', icon: FileText, change: '+2', color: 'primary' },
    { label: 'Suppliers Contacted', value: '12', icon: MessageSquare, change: '+4', color: 'accent' },
    { label: 'Products Viewed', value: '87', icon: Search, change: '+15', color: 'green' },
    { label: 'Deals Closed', value: '3', icon: TrendingUp, change: '+1', color: 'amber' },
  ];

  const recentActivity = [
    { action: 'Sent inquiry to PT Nusantara Agro for Virgin Coconut Oil', time: '2h ago', type: 'inquiry', icon: MessageSquare, color: 'text-primary-500 dark:text-primary-400' },
    { action: 'Created RFQ for Arabica Coffee Beans - 500MT', time: '5h ago', type: 'rfq', icon: FileText, color: 'text-accent-500 dark:text-accent-400' },
    { action: 'Received quotation from Java Spice Trading', time: '1d ago', type: 'quote', icon: CheckCircle2, color: 'text-green-500 dark:text-green-400' },
    { action: 'Uploaded trade compliance documents', time: '2d ago', type: 'document', icon: Lock, color: 'text-amber-500 dark:text-amber-400' },
  ];

  const pendingActions = [
    { label: 'Respond to 3 new supplier quotations', urgency: 'high', link: '/buyer/rfq' },
    { label: 'Complete supplier comparison for Coffee Beans', urgency: 'medium', link: '/buyer/comparison' },
    { label: 'Upload import license for new shipment', urgency: 'low', link: '/buyer/documents' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-background">
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-on-surface">
              Buyer Dashboard
            </h1>
            <p className="text-gray-500 dark:text-dark-on-surface-variant mt-1">Welcome back, <span className="gradient-text font-medium">{user?.email?.split('@')[0] || 'Buyer'}</span></p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2.5 bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-surface-variant/30 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-surface-container transition">
              <Bell className="w-5 h-5 text-gray-500 dark:text-dark-on-surface-variant" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">3</span>
            </button>
            <Link href="/buyer/rfq" className="btn-primary flex items-center gap-2">
              <FileText className="w-4 h-4" /> New RFQ
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-surface-variant/30 rounded-2xl p-6 hover:shadow-md dark:hover:border-dark-surface-variant/60 transition">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  stat.color === 'primary' ? 'bg-primary-100 dark:bg-primary-900/20' :
                  stat.color === 'accent' ? 'bg-accent-100 dark:bg-accent-900/20' :
                  stat.color === 'green' ? 'bg-green-100 dark:bg-green-900/20' : 'bg-amber-100 dark:bg-amber-900/20'
                  }`}>
                  <stat.icon className={`w-5 h-5 ${
                    stat.color === 'primary' ? 'text-primary-700 dark:text-primary-400' :
                    stat.color === 'accent' ? 'text-accent-600 dark:text-accent-400' :
                    stat.color === 'green' ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'
                    }`} />
                </div>
                <span className="text-xs font-medium text-green-600 dark:text-green-400 flex items-center gap-0.5 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">
                  <ArrowUpRight className="w-3 h-3" /> {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-dark-on-surface">{stat.value}</p>
              <p className="text-sm text-gray-500 dark:text-dark-on-surface-variant">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-on-surface mb-4">Quick Actions</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { href: '/catalog', icon: Search, title: 'Browse Catalog', desc: 'Discover verified suppliers', color: 'from-primary-500 to-primary-700' },
                { href: '/buyer/rfq', icon: FileText, title: 'Create RFQ', desc: 'Request for quotation', color: 'from-accent-500 to-accent-700' },
                { href: '/buyer/comparison', icon: GitCompare, title: 'Compare Suppliers', desc: 'AI-powered comparison', color: 'from-green-500 to-green-700' },
                { href: '/buyer/documents', icon: Lock, title: 'Document Vault', desc: 'Encrypted storage', color: 'from-amber-500 to-amber-700' },
              ].map((action) => (
                <Link key={action.href} href={action.href} className="bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-surface-variant/30 rounded-2xl p-6 hover:shadow-md dark:hover:border-dark-surface-variant/60 transition group">
                  <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-dark-on-surface mb-1">{action.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-dark-on-surface-variant">{action.desc}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Pending Actions */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-on-surface mb-4">Pending Actions</h2>
            <div className="bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-surface-variant/30 rounded-2xl p-6 space-y-3">
              {pendingActions.map((item, i) => (
                <Link key={i} href={item.link} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-surface-container transition group">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${item.urgency === 'high' ? 'bg-red-500' : item.urgency === 'medium' ? 'bg-amber-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition">{item.label}</p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-primary-500 transition flex-shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-surface-variant/30 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-on-surface">Recent Activity</h2>
            <button className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 font-medium">View All</button>
          </div>
          <div className="space-y-1">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-surface-container transition">
                <div className={`w-8 h-8 rounded-lg bg-gray-50 dark:bg-dark-surface-container-high flex items-center justify-center flex-shrink-0`}>
                  <activity.icon className={`w-4 h-4 ${activity.color}`} />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 flex-1">{activity.action}</p>
                <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
