'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Package, MessageSquare, TrendingUp, Eye, Users, ArrowUpRight, ArrowDownRight, BarChart3, Clock } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, isPremium } = useAuth();

  const stats = [
    { label: 'Total Products', value: '12', icon: Package, change: '+2', up: true, color: 'primary' },
    { label: 'Active Inquiries', value: '8', icon: MessageSquare, change: '+3', up: true, color: 'accent' },
    { label: 'Total Views', value: '2,847', icon: Eye, change: '+12%', up: true, color: 'green' },
    { label: 'Conversion Rate', value: '18.5%', icon: TrendingUp, change: '+2.1%', up: true, color: 'amber' },
  ];

  const recentInquiries = [
    { id: '1', buyerName: 'Global Foods Inc', product: 'Virgin Coconut Oil', country: 'USA', status: 'open', time: '2h ago' },
    { id: '2', buyerName: 'Shanghai Trading Co', product: 'Arabica Coffee Beans', country: 'China', status: 'responded', time: '5h ago' },
    { id: '3', buyerName: 'Euro Import GmbH', product: 'Organic Turmeric', country: 'Germany', status: 'open', time: '1d ago' },
    { id: '4', buyerName: 'Tokyo Mart Ltd', product: 'Teak Wood Planks', country: 'Japan', status: 'closed', time: '2d ago' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open': return 'badge-warning';
      case 'responded': return 'badge-accent';
      case 'closed': return 'badge-success';
      default: return 'badge';
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, <span className="gradient-text">{user?.email?.split('@')[0] || 'Trader'}</span>
        </h1>
        <p className="text-gray-500 mt-1">Here&apos;s what&apos;s happening with your trade activity today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card hover:shadow-md transition-shadow">
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
              <div className={`flex items-center gap-1 text-xs font-medium ${stat.up ? 'text-green-600' : 'text-red-500'}`}>
                {stat.up ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                {stat.change}
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-3">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Inquiries */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-900">Recent Inquiries</h2>
              <Link href="/dashboard/inquiries" className="text-sm text-primary-600 font-medium hover:underline">
                View All →
              </Link>
            </div>
            <div className="space-y-3">
              {recentInquiries.map((inq) => (
                <div key={inq.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-primary-700">{inq.buyerName[0]}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{inq.buyerName}</p>
                      <p className="text-xs text-gray-500">{inq.product} • {inq.country}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`badge text-xs capitalize ${getStatusBadge(inq.status)}`}>{inq.status}</span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {inq.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions & Performance */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link href="/dashboard/products" className="flex items-center gap-3 p-3 rounded-lg bg-primary-50 hover:bg-primary-100 transition text-primary-700 font-medium text-sm">
                <Package className="w-5 h-5" /> Add New Product
              </Link>
              <Link href="/dashboard/inquiries" className="flex items-center gap-3 p-3 rounded-lg bg-accent-50 hover:bg-accent-100 transition text-accent-700 font-medium text-sm">
                <MessageSquare className="w-5 h-5" /> Manage Inquiries
              </Link>
              <Link href="/dashboard/leaderboard" className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 hover:bg-amber-100 transition text-amber-700 font-medium text-sm">
                <BarChart3 className="w-5 h-5" /> View Leaderboard
              </Link>
              {isPremium && (
                <Link href="/dashboard/intelligence" className="flex items-center gap-3 p-3 rounded-lg bg-green-50 hover:bg-green-100 transition text-green-700 font-medium text-sm">
                  <Users className="w-5 h-5" /> Buyer Radar
                </Link>
              )}
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance</h2>
            <div className="space-y-4">
              {[
                { label: 'Response Rate', value: 85, color: 'bg-green-500' },
                { label: 'Conversion Rate', value: 18, color: 'bg-primary-500' },
                { label: 'Catalog Score', value: 72, color: 'bg-accent-500' },
              ].map((metric) => (
                <div key={metric.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{metric.label}</span>
                    <span className="font-semibold text-gray-900">{metric.value}%</span>
                  </div>
                  <div className="progress-bar h-2">
                    <div className={`progress-bar-fill ${metric.color}`} style={{ width: `${metric.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
