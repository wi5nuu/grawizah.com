'use client';

import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, isPremium } = useAuth();

  const stats = [
    { label: 'Total Products', value: '12', icon: 'inventory_2', change: '+2', up: true, bg: 'bg-primary-fixed text-primary' },
    { label: 'Active Inquiries', value: '8', icon: 'mail', change: '+3', up: true, bg: 'bg-secondary-fixed text-secondary' },
    { label: 'Total Views', value: '2,847', icon: 'visibility', change: '+12%', up: true, bg: 'bg-tertiary-fixed text-tertiary' },
    { label: 'Conversion Rate', value: '18.5%', icon: 'trending_up', change: '+2.1%', up: true, bg: 'bg-primary-fixed text-primary' },
  ];

  const recentInquiries = [
    { id: '1', buyerName: 'Global Foods Inc', product: 'Virgin Coconut Oil', country: 'USA', status: 'pending', time: '2h ago' },
    { id: '2', buyerName: 'Shanghai Trading Co', product: 'Arabica Coffee Beans', country: 'China', status: 'responded', time: '5h ago' },
    { id: '3', buyerName: 'Euro Import GmbH', product: 'Organic Turmeric', country: 'Germany', status: 'pending', time: '1d ago' },
    { id: '4', buyerName: 'Tokyo Mart Ltd', product: 'Teak Wood Planks', country: 'Japan', status: 'converted', time: '2d ago' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-error-container/20 text-error';
      case 'responded': return 'bg-primary-container/20 text-primary';
      case 'converted': return 'bg-tertiary-container/20 text-tertiary-container';
      default: return 'bg-surface-variant text-on-surface-variant';
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-on-surface">
          Welcome back, <span className="gradient-text">{user?.email?.split('@')[0] || 'Trader'}</span>
        </h1>
        <p className="text-on-surface-variant mt-1">Here&apos;s what&apos;s happening with your trade activity today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-surface-container-lowest p-6 rounded-[16px] border border-surface-container-high shadow-ambient hover-lift transition-all">
            <div className="flex items-center justify-between mb-4">
              <p className="text-on-surface-variant text-sm font-medium">{stat.label}</p>
              <span className={`material-symbols-outlined ${stat.bg} p-2 rounded-lg`}>{stat.icon}</span>
            </div>
            <h3 className="text-3xl font-bold text-on-surface">{stat.value}</h3>
            <p className={`text-sm flex items-center mt-2 font-medium ${stat.up ? 'text-secondary' : 'text-error'}`}>
              <span className="material-symbols-outlined text-[16px] mr-1">{stat.up ? 'trending_up' : 'trending_down'}</span>
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Inquiries */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-on-surface">Recent Inquiries</h2>
              <Link href="/dashboard/inquiries" className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
                View All <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
            <div className="space-y-3">
              {recentInquiries.map((inq) => (
                <div key={inq.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-container-low transition">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">{inq.buyerName[0]}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-on-surface">{inq.buyerName}</p>
                      <p className="text-xs text-on-surface-variant">{inq.product} • {inq.country}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`badge text-xs capitalize ${getStatusBadge(inq.status)}`}>{inq.status}</span>
                    <span className="text-xs text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">schedule</span> {inq.time}
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
            <h2 className="text-lg font-semibold text-on-surface mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link href="/dashboard/products" className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition text-primary font-medium text-sm">
                <span className="material-symbols-outlined">inventory_2</span> Add New Product
              </Link>
              <Link href="/dashboard/inquiries" className="flex items-center gap-3 p-3 rounded-lg bg-secondary/5 hover:bg-secondary/10 transition text-secondary font-medium text-sm">
                <span className="material-symbols-outlined">mail</span> Manage Inquiries
              </Link>
              <Link href="/dashboard/leaderboard" className="flex items-center gap-3 p-3 rounded-lg bg-tertiary/5 hover:bg-tertiary/10 transition text-tertiary font-medium text-sm">
                <span className="material-symbols-outlined">leaderboard</span> View Leaderboard
              </Link>
              {isPremium && (
                <Link href="/dashboard/intelligence" className="flex items-center gap-3 p-3 rounded-lg bg-surface-tint/5 hover:bg-surface-tint/10 transition text-surface-tint font-medium text-sm">
                  <span className="material-symbols-outlined">insights</span> Buyer Radar
                </Link>
              )}
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold text-on-surface mb-4">Performance</h2>
            <div className="space-y-4">
              {[
                { label: 'Response Rate', value: 85, color: 'bg-secondary' },
                { label: 'Conversion Rate', value: 18, color: 'bg-primary' },
                { label: 'Catalog Score', value: 72, color: 'bg-surface-tint' },
              ].map((metric) => (
                <div key={metric.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-on-surface-variant">{metric.label}</span>
                    <span className="font-semibold text-on-surface">{metric.value}%</span>
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
