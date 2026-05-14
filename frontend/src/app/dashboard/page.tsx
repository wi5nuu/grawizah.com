'use client';

import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

// Animated counter hook
function useCountUp(end: number, duration: number = 1500) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const startTime = performance.now();
        const animate = (currentTime: number) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
          setCount(Math.floor(eased * end));
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      }
    }, { threshold: 0.3 });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return { count, ref };
}

export default function DashboardPage() {
  const { user, isBuyer } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user) return;
      
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';
        
        if (user.role === 'buyer') {
          // Mock data for Buyer (In real app, fetch from /api/buyer/stats)
          setStats([
            { label: 'Active RFQs', value: '12', change: '+2 since last week', icon: 'request_quote', iconBg: 'bg-[#dbeafe]', iconColor: 'text-[#2563eb]', changeColor: 'text-[#2563eb]' },
            { label: 'Verified Sources', value: '148', change: '9 new verified this month', icon: 'verified', iconBg: 'bg-[#d1fae5]', iconColor: 'text-[#047857]', changeColor: 'text-[#047857]' },
            { label: 'Sourcing Savings', value: '$12.4k', change: '15% optimized via AI', icon: 'payments', iconBg: 'bg-[#ece5ff]', iconColor: 'text-[#5300b7]', changeColor: 'text-[#5300b7]' },
            { label: 'Risk Alerts', value: '2', change: 'Check Logistics Routing', icon: 'warning', iconBg: 'bg-[#fee2e2]', iconColor: 'text-[#dc2626]', changeColor: 'text-[#dc2626]' },
          ]);

          setActivities([
            { supplier: 'Inquiry response from GlobalTech', email: 'sales@globaltech.com', status: 'Quoted', date: 'Today', amount: '$45,000', icon: 'business', statusColor: 'bg-emerald-100 text-emerald-700' },
            { supplier: 'New Supplier Match: IndoLogistics', email: 'verify@indolog.id', status: 'Verified', date: 'Yesterday', amount: 'N/A', icon: 'person_search', statusColor: 'bg-blue-100 text-blue-700' },
            { supplier: 'RFQ #TR-902 submitted', email: 'system@grawizah.com', status: 'Pending', date: '2 days ago', amount: '$12,800', icon: 'description', statusColor: 'bg-amber-100 text-amber-700' },
          ]);
        } else {
          // Supplier logic (Existing)
          const supplierId = user.id; 
          const response = await fetch(`${apiUrl}/api/inquiries/supplier/${supplierId}`);
          const inquiries = await response.json();
          
          const pending = inquiries.filter((i: any) => i.status === 'open').length;
          const converted = inquiries.filter((i: any) => i.converted_to_deal).length;
          
          setStats([
            { label: 'Active Orders', value: converted.toString(), change: '+0% vs last month', icon: 'inventory_2', iconBg: 'bg-[#ece5ff]', iconColor: 'text-[#5300b7]', changeColor: 'text-gray-500' },
            { label: 'Pending Inquiries', value: pending.toString(), change: `${pending} require attention`, icon: 'mail', iconBg: 'bg-[#dbeafe]', iconColor: 'text-[#2563eb]', changeColor: 'text-red-500' },
            { label: 'Market Visibility', value: 'High', change: 'Ranking #4 in category', icon: 'visibility', iconBg: 'bg-[#ffedd5]', iconColor: 'text-[#ea580c]', changeColor: 'text-[#ea580c]' },
            { label: 'Intelligence Score', value: '94', change: 'Top 5% in reliability', icon: 'psychology', iconBg: 'bg-[#d1fae5]', iconColor: 'text-[#047857]', changeColor: 'text-[#047857]' },
          ]);

          const formattedActivities = inquiries.slice(0, 4).map((i: any) => ({
            supplier: `Inquiry from ${i.buyer_id.substring(0, 8)}...`,
            email: 'buyer@example.com',
            status: i.status === 'open' ? 'Pending' : 'Responded',
            date: new Date(i.created_at).toLocaleDateString(),
            amount: '$0.00',
            icon: 'mail',
            statusColor: i.status === 'open' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
          }));
          
          setActivities(formattedActivities);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fafafa] dark:bg-dark-background">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const displayName = user?.email?.split('@')[0] || 'User';

  return (
    <div className="p-8 max-w-[1440px] mx-auto bg-[#fafafa] dark:bg-dark-background min-h-screen font-sans">
      {/* Header */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1 tracking-tight">
            {user?.role === 'buyer' ? 'Buyer Command Center' : 'Supplier Intelligence Hub'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-[14px]">Welcome back, <span className="font-bold text-primary">{displayName}</span>. Overview of your {user?.role} activities.</p>
        </div>
        <div className="text-[11px] font-bold uppercase tracking-widest text-gray-400 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 px-3 py-1 rounded-sm">
          {user?.role} ACCOUNT
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-black/40 backdrop-blur-md p-6 rounded-sm border border-gray-100 dark:border-white/10 shadow-sm flex flex-col group hover:border-primary/30 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <p className="text-gray-500 dark:text-gray-400 font-bold text-[11px] uppercase tracking-wider">{stat.label}</p>
              <div className={`w-10 h-10 rounded-sm ${stat.iconBg} ${stat.iconColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <span className="material-symbols-outlined text-[20px]">{stat.icon}</span>
              </div>
            </div>
            <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tighter">{stat.value}</h3>
            <p className={`text-[12px] font-bold ${stat.changeColor}`}>
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-black/40 backdrop-blur-md rounded-sm border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 dark:border-white/10 flex justify-between items-center">
              <h2 className="text-[14px] font-black text-gray-900 dark:text-white uppercase tracking-wider">
                {user?.role === 'buyer' ? 'Recent Quotations' : 'Recent Inquiries'}
              </h2>
              <Link href="/dashboard/inquiries" className="text-[11px] font-bold text-primary hover:underline">VIEW ALL</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 dark:bg-white/5 text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">
                    <th className="px-6 py-4 font-black border-b border-gray-100 dark:border-white/5">{user?.role === 'buyer' ? 'PARTNER' : 'BUYER'}</th>
                    <th className="px-6 py-4 font-black border-b border-gray-100 dark:border-white/5">STATUS</th>
                    <th className="px-6 py-4 font-black border-b border-gray-100 dark:border-white/5">DATE</th>
                    <th className="px-6 py-4 font-black border-b border-gray-100 dark:border-white/5 text-right">VALUE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                  {activities.map((activity, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/80 dark:hover:bg-white/5 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-sm bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-400 dark:text-gray-500">
                            <span className="material-symbols-outlined text-[18px]">{activity.icon}</span>
                          </div>
                          <div>
                            <p className="font-bold text-[13px] text-gray-900 dark:text-white leading-none">{activity.supplier}</p>
                            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">{activity.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-widest ${activity.statusColor}`}>
                          {activity.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-[12px] text-gray-500 dark:text-gray-400 font-medium">
                        {activity.date}
                      </td>
                      <td className="px-6 py-5 text-right font-black text-[13px] text-gray-900 dark:text-white">
                        {activity.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Actions - Role Based */}
        <div>
          <h2 className="text-[14px] font-black text-gray-900 dark:text-white uppercase tracking-wider mb-4">Strategic Actions</h2>
          <div className="space-y-4">
            {user?.role === 'buyer' ? (
              <>
                <div className="bg-white dark:bg-black/40 p-6 rounded-sm border border-gray-100 dark:border-white/10 shadow-sm">
                  <div className="flex items-start gap-4 mb-6">
                    <span className="material-symbols-outlined text-primary text-3xl">public</span>
                    <div>
                      <h3 className="font-bold text-sm text-gray-900 dark:text-white">Discover Suppliers</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Use AI to find verified manufacturing partners globally.</p>
                    </div>
                  </div>
                  <Link href="/catalog" className="block text-center bg-black dark:bg-white text-white dark:text-black py-2 rounded-sm font-bold text-xs hover:opacity-90 transition-all uppercase tracking-widest">Explore Catalog</Link>
                </div>
                <div className="bg-white dark:bg-black/40 p-6 rounded-sm border border-gray-100 dark:border-white/10 shadow-sm">
                  <div className="flex items-start gap-4 mb-6">
                    <span className="material-symbols-outlined text-emerald-500 text-3xl">security</span>
                    <div>
                      <h3 className="font-bold text-sm text-gray-900 dark:text-white">Verify Supplier</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Run an instant background and compliance check.</p>
                    </div>
                  </div>
                  <Link href="/dashboard/intelligence" className="block text-center border border-emerald-500 text-emerald-500 py-2 rounded-sm font-bold text-xs hover:bg-emerald-500 hover:text-white transition-all uppercase tracking-widest">Start Verification</Link>
                </div>
              </>
            ) : (
              <>
                <div className="bg-white dark:bg-black/40 p-6 rounded-sm border border-gray-100 dark:border-white/10 shadow-sm">
                  <div className="flex items-start gap-4 mb-6">
                    <span className="material-symbols-outlined text-primary text-3xl">insights</span>
                    <div>
                      <h3 className="font-bold text-sm text-gray-900 dark:text-white">Market Intelligence</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Analyze demand trends and competitor positioning.</p>
                    </div>
                  </div>
                  <Link href="/dashboard/intelligence" className="block text-center bg-black dark:bg-white text-white dark:text-black py-2 rounded-sm font-bold text-xs hover:opacity-90 transition-all uppercase tracking-widest">Open Analytics</Link>
                </div>
                <div className="bg-white dark:bg-black/40 p-6 rounded-sm border border-gray-100 dark:border-white/10 shadow-sm">
                  <div className="flex items-start gap-4 mb-6">
                    <span className="material-symbols-outlined text-purple-500 text-3xl">inventory_2</span>
                    <div>
                      <h3 className="font-bold text-sm text-gray-900 dark:text-white">Manage Listings</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Optimize your product catalog with AI suggestions.</p>
                    </div>
                  </div>
                  <Link href="/dashboard/catalog" className="block text-center border border-purple-500 text-purple-500 py-2 rounded-sm font-bold text-xs hover:bg-purple-500 hover:text-white transition-all uppercase tracking-widest">Update Catalog</Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}