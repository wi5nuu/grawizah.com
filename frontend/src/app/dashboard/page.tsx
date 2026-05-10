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
  const stats = [
    { label: 'Active Orders', value: '24', change: '+12% vs last month', icon: 'inventory_2', iconBg: 'bg-[#ece5ff]', iconColor: 'text-[#5300b7]', changeColor: 'text-gray-500' },
    { label: 'Pending Inquiries', value: '12', change: '3 require immediate attention', icon: 'mail', iconBg: 'bg-[#dbeafe]', iconColor: 'text-[#2563eb]', changeColor: 'text-red-500' },
    { label: 'Compliance Alerts', value: '2', change: 'Review new EU regulations', icon: 'gavel', iconBg: 'bg-[#ffedd5]', iconColor: 'text-[#ea580c]', changeColor: 'text-gray-500' },
    { label: 'Network Health', value: '98%', change: 'All tier-1 suppliers verified', icon: 'monitoring', iconBg: 'bg-[#d1fae5]', iconColor: 'text-[#047857]', changeColor: 'text-gray-500' },
  ];

  const recentActivity = [
    { supplier: 'TechCorp Global Mfg.', email: 'orders@techcorpglobal.com', status: 'In Transit', date: 'Oct 24, 2023', amount: '$45,000', icon: 'factory', statusColor: 'bg-blue-100 text-blue-700' },
    { supplier: 'Nexus Robotics Ltd.', email: 'sales@nexusrobotics.de', status: 'Under Review', date: 'Oct 23, 2023', amount: '$128,500', icon: 'precision_manufacturing', statusColor: 'bg-amber-100 text-amber-700' },
    { supplier: 'CloudNet Infrastructure', email: 'enterprise@cloudnet.io', status: 'Completed', date: 'Oct 21, 2023', amount: '$85,000', icon: 'dns', statusColor: 'bg-emerald-100 text-emerald-700' },
    { supplier: 'Apex Materials Co.', email: 'supply@apexmaterials.com', status: 'In Transit', date: 'Oct 19, 2023', amount: '$32,400', icon: 'architecture', statusColor: 'bg-blue-100 text-blue-700' },
  ];

  return (
    <div className="p-8 max-w-[1440px] mx-auto bg-[#fafafa] dark:bg-dark-background min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-dark-on-surface mb-1">Dashboard Overview</h1>
        <p className="text-gray-500 dark:text-dark-on-surface-variant text-[15px]">Welcome back, James. Here&apos;s what&apos;s happening with your supply chain.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-dark-surface-container-low p-5 rounded-xl border border-gray-200 dark:border-dark-surface-variant/30 shadow-sm flex flex-col">
            <div className="flex items-start justify-between mb-2">
              <p className="text-gray-600 dark:text-dark-on-surface-variant font-bold text-[13px]">{stat.label}</p>
              <div className={`w-10 h-10 rounded-full ${stat.iconBg} ${stat.iconColor} flex items-center justify-center`}>
                <span className="material-symbols-outlined text-[20px]">{stat.icon}</span>
              </div>
            </div>
            <h3 className="text-3xl font-extrabold text-gray-900 dark:text-dark-on-surface mb-2">{stat.value}</h3>
            <p className={`text-[12px] font-medium mt-auto ${stat.changeColor}`}>
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-dark-surface-container-low rounded-xl border border-gray-200 dark:border-dark-surface-variant/30 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 dark:border-dark-surface-variant/30">
              <h2 className="text-[15px] font-extrabold text-gray-900 dark:text-dark-on-surface">Recent Activity</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-dark-surface-container text-[12px] text-gray-500 dark:text-dark-on-surface-variant uppercase tracking-wider">
                    <th className="px-5 py-3 font-bold border-b border-gray-100 dark:border-dark-surface-variant/30">Supplier</th>
                    <th className="px-5 py-3 font-bold border-b border-gray-100 dark:border-dark-surface-variant/30">Status</th>
                    <th className="px-5 py-3 font-bold border-b border-gray-100 dark:border-dark-surface-variant/30">Date</th>
                    <th className="px-5 py-3 font-bold border-b border-gray-100 dark:border-dark-surface-variant/30 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-dark-surface-variant/30">
                  {recentActivity.map((activity, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-dark-surface-container transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-md bg-gray-100 dark:bg-dark-surface-container-high flex items-center justify-center text-gray-500 dark:text-dark-on-surface-variant">
                            <span className="material-symbols-outlined text-[20px]">{activity.icon}</span>
                          </div>
                          <div>
                            <p className="font-extrabold text-[14px] text-gray-900 dark:text-dark-on-surface leading-tight">{activity.supplier}</p>
                            <p className="text-[12px] text-gray-500 dark:text-dark-on-surface-variant mt-0.5">{activity.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider ${activity.statusColor}`}>
                          {activity.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-[13px] text-gray-600 dark:text-dark-on-surface-variant font-medium">
                        {activity.date}
                      </td>
                      <td className="px-5 py-4 text-right font-extrabold text-[14px] text-gray-900 dark:text-dark-on-surface">
                        {activity.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-[15px] font-extrabold text-gray-900 dark:text-dark-on-surface mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <div className="bg-white dark:bg-dark-surface-container-low rounded-xl border border-gray-200 dark:border-dark-surface-variant/30 p-5 shadow-sm flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#ece5ff] text-[#5300b7] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">search</span>
                </div>
                <div>
                  <h3 className="font-extrabold text-[14px] text-gray-900 dark:text-dark-on-surface">New Supplier Search</h3>
                  <p className="text-[13px] text-gray-500 dark:text-dark-on-surface-variant mt-0.5">Find and verify new partners across our global network.</p>
                </div>
              </div>
              <button className="w-full border-2 border-[#5300b7] text-[#5300b7] hover:bg-[#5300b7] hover:text-white py-2 rounded-md font-bold text-[13px] transition-colors">
                Search Directory
              </button>
            </div>

            <div className="bg-white dark:bg-dark-surface-container-low rounded-xl border border-gray-200 dark:border-dark-surface-variant/30 p-5 shadow-sm flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#dbeafe] text-[#2563eb] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">send</span>
                </div>
                <div>
                  <h3 className="font-extrabold text-[14px] text-gray-900 dark:text-dark-on-surface">Submit RFQ</h3>
                  <p className="text-[13px] text-gray-500 dark:text-dark-on-surface-variant mt-0.5">Request quotes from AI-matched suppliers instantly.</p>
                </div>
              </div>
              <button className="w-full border-2 border-[#5300b7] text-[#5300b7] hover:bg-[#5300b7] hover:text-white py-2 rounded-md font-bold text-[13px] transition-colors">
                Create RFQ
              </button>
            </div>

            <div className="bg-white dark:bg-dark-surface-container-low rounded-xl border border-gray-200 dark:border-dark-surface-variant/30 p-5 shadow-sm flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#d1fae5] text-[#047857] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">verified_user</span>
                </div>
                <div>
                  <h3 className="font-extrabold text-[14px] text-gray-900 dark:text-dark-on-surface">Compliance Check</h3>
                  <p className="text-[13px] text-gray-500 dark:text-dark-on-surface-variant mt-0.5">Run automated background checks on existing partners.</p>
                </div>
              </div>
              <button className="w-full border-2 border-[#5300b7] text-[#5300b7] hover:bg-[#5300b7] hover:text-white py-2 rounded-md font-bold text-[13px] transition-colors">
                Run Check
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
