'use client';

import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Mail, 
  ArrowUpRight,
  RefreshCcw,
  Package,
  TrendingUp,
  ShieldCheck,
  Mail as MailIcon,
  Eye,
  Layers,
  Search,
  LayoutDashboard
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [score, setScore] = useState(94);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user) return;
      try {
        // Fetch real Inquiries
        const res = await fetch(`${API_URL}/api/inquiries/supplier/${user.id}`);
        const data = await res.json();
        const inquiriesList = Array.isArray(data) ? data : (data.data || []);
        setInquiries(inquiriesList);
        
        // Calculate real stats
        const pending = inquiriesList.filter((i: any) => i.status === 'open').length;
        const converted = inquiriesList.filter((i: any) => i.converted_to_deal).length;
        
        // Fetch real Intelligence Score
        const scoreRes = await fetch(`${API_URL}/api/leaderboard/company/${user.id}`);
        const scoreData = await scoreRes.json();
        const realScore = scoreData?.total_score ? Math.round(scoreData.total_score) : 94;
        setScore(realScore);

        setStats([
          { label: 'Active Orders', value: converted.toString(), change: '+0% vs last month', icon: Package, iconBg: 'bg-[#ece5ff]', iconColor: 'text-[#5300b7]', changeColor: 'text-gray-500' },
          { label: 'Pending Inquiries', value: pending.toString(), change: `${pending} require attention`, icon: MailIcon, iconBg: 'bg-[#dbeafe]', iconColor: 'text-[#2563eb]', changeColor: 'text-red-500' },
          { label: 'Market Visibility', value: 'High', change: 'Ranking #4 in category', icon: Eye, iconBg: 'bg-[#ffedd5]', iconColor: 'text-[#ea580c]', changeColor: 'text-[#ea580c]' },
          { label: 'Intelligence Score', value: realScore.toString(), change: 'Top 5% in reliability', icon: ShieldCheck, iconBg: 'bg-[#d1fae5]', iconColor: 'text-[#047857]', changeColor: 'text-[#047857]' },
        ]);

      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, [user, API_URL]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <RefreshCcw className="w-8 h-8 animate-spin text-primary opacity-20" />
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse">Loading Authenticated Data...</p>
      </div>
    );
  }

  const displayName = user?.email?.split('@')[0] || 'User';

  return (
    <div className="p-6 md:p-10 w-full bg-[#fafafa] dark:bg-dark-background min-h-screen font-sans relative">
      {/* Header Section */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
            Supplier Intelligence Hub
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            Welcome back, <span className="font-bold text-primary">{displayName}</span>. Overview of your authenticated activities.
          </p>
        </div>
        <div className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 px-4 py-2 rounded-xl shadow-sm">
          {user?.role?.replace('_', ' ')} ACCOUNT
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-dark-surface-container-low p-7 rounded-3xl border border-gray-100 dark:border-dark-surface-variant/20 shadow-sm flex flex-col group hover:border-primary/30 transition-all duration-300">
            <div className="flex items-start justify-between mb-5">
              <p className="text-gray-400 dark:text-gray-500 font-black text-[10px] uppercase tracking-widest">{stat.label}</p>
              <div className={`w-12 h-12 rounded-2xl ${stat.iconBg} ${stat.iconColor} dark:bg-opacity-10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tighter">{stat.value}</h3>
            <p className={`text-[11px] font-bold ${stat.changeColor}`}>
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Inquiries Table */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-dark-surface-container-low rounded-[2rem] border border-gray-100 dark:border-dark-surface-variant/20 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 dark:border-dark-surface-variant/10 flex justify-between items-center">
              <h2 className="text-[12px] font-black text-gray-900 dark:text-white uppercase tracking-[0.15em]">
                Recent Inquiries
              </h2>
              <Link href="/dashboard/inquiries" className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest">View All</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 dark:bg-white/5 text-[9px] text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">
                    <th className="px-8 py-5 font-black">Buyer Entity</th>
                    <th className="px-8 py-5 font-black text-center">Status</th>
                    <th className="px-8 py-5 font-black">Timestamp</th>
                    <th className="px-8 py-5 font-black text-right">Target Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                  {inquiries.length > 0 ? inquiries.slice(0, 5).map((activity, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/80 dark:hover:bg-white/5 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-dark-surface flex items-center justify-center text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-dark-surface-variant/20 group-hover:bg-primary group-hover:text-white transition-all">
                            <span className="text-[14px] font-black">{activity.buyer_id.substring(0, 2).toUpperCase()}</span>
                          </div>
                          <div>
                            <p className="font-black text-[13px] text-gray-900 dark:text-white leading-none">Inquiry #{activity.id.substring(0, 6).toUpperCase()}</p>
                            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1.5 font-medium">Buyer: {activity.buyer_id.substring(0, 12)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          activity.status === 'open' 
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' 
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        }`}>
                          {activity.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-[12px] text-gray-500 dark:text-gray-400 font-bold">
                        {new Date(activity.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-6 text-right font-black text-[13px] text-gray-900 dark:text-white">
                        $0.00
                      </td>
                    </tr>
                  )) : (
                    <tr>
                       <td colSpan={4} className="px-8 py-12 text-center text-gray-400 font-medium text-sm">No recent inquiries found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Strategic Actions Sidebar */}
        <div className="space-y-6">
          <h2 className="text-[12px] font-black text-gray-900 dark:text-white uppercase tracking-[0.15em] mb-4">Strategic Actions</h2>
          
          <div className="bg-white dark:bg-dark-surface-container-low p-8 rounded-[2rem] border border-gray-100 dark:border-dark-surface-variant/20 shadow-sm group hover:border-primary/30 transition-all">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-[14px] text-gray-900 dark:text-white">Market Intelligence</h3>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 font-medium">Analyze demand trends and global positioning.</p>
              </div>
            </div>
            <Link href="/dashboard/intelligence" className="block text-center bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:opacity-90 transition-all shadow-lg shadow-gray-200 dark:shadow-none">Open Analytics</Link>
          </div>

          <div className="bg-white dark:bg-dark-surface-container-low p-8 rounded-[2rem] border border-gray-100 dark:border-dark-surface-variant/20 shadow-sm group hover:border-purple-500/30 transition-all">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-[14px] text-gray-900 dark:text-white">Manage Listings</h3>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 font-medium">Optimize your catalog with AI suggestions.</p>
              </div>
            </div>
            <Link href="/dashboard/products" className="block text-center border-2 border-purple-500 text-purple-500 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-purple-500 hover:text-white transition-all">Update Catalog</Link>
          </div>
        </div>
      </div>
    </div>
  );
}