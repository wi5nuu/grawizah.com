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
  const { user, isPremium } = useAuth();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const counter1 = useCountUp(12);
  const counter2 = useCountUp(8);
  const counter3 = useCountUp(2847, 2000);
  const counter4 = useCountUp(185); // 18.5%

  const stats = [
    { label: 'Total Products', value: counter1.count.toString(), ref: counter1.ref, icon: 'inventory_2', change: '+2 this week', up: true, bg: 'bg-primary-fixed text-primary', glow: 'shadow-primary/10' },
    { label: 'Active Inquiries', value: counter2.count.toString(), ref: counter2.ref, icon: 'mail', change: '+3 new', up: true, bg: 'bg-secondary-fixed text-secondary', glow: 'shadow-secondary/10' },
    { label: 'Total Views', value: counter3.count.toLocaleString(), ref: counter3.ref, icon: 'visibility', change: '+12% vs last month', up: true, bg: 'bg-emerald-100 text-emerald-600', glow: 'shadow-emerald-500/10' },
    { label: 'Conversion Rate', value: `${(counter4.count / 10).toFixed(1)}%`, ref: counter4.ref, icon: 'trending_up', change: '+2.1% improvement', up: true, bg: 'bg-amber-100 text-amber-600', glow: 'shadow-amber-500/10' },
  ];

  const recentInquiries = [
    { id: '1', buyerName: 'Global Foods Inc', product: 'Virgin Coconut Oil', country: '🇺🇸 USA', status: 'pending', time: '2h ago', avatar: 'G' },
    { id: '2', buyerName: 'Shanghai Trading Co', product: 'Arabica Coffee Beans', country: '🇨🇳 China', status: 'responded', time: '5h ago', avatar: 'S' },
    { id: '3', buyerName: 'Euro Import GmbH', product: 'Organic Turmeric', country: '🇩🇪 Germany', status: 'pending', time: '1d ago', avatar: 'E' },
    { id: '4', buyerName: 'Tokyo Mart Ltd', product: 'Teak Wood Planks', country: '🇯🇵 Japan', status: 'converted', time: '2d ago', avatar: 'T' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return { cls: 'bg-amber-100 text-amber-700 border border-amber-200', dot: 'bg-amber-500' };
      case 'responded': return { cls: 'bg-blue-100 text-blue-700 border border-blue-200', dot: 'bg-blue-500' };
      case 'converted': return { cls: 'bg-emerald-100 text-emerald-700 border border-emerald-200', dot: 'bg-emerald-500' };
      default: return { cls: 'bg-surface-variant text-on-surface-variant', dot: 'bg-gray-400' };
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-in-up">
        <div className="flex items-center gap-2 text-on-surface-variant text-sm mb-2 font-medium">
          <div className="live-dot" />
          <span>Live Dashboard</span>
        </div>
        <h1 className="text-3xl font-bold text-on-surface">
          {greeting}, <span className="gradient-text">{user?.email?.split('@')[0] || 'Trader'}</span> 👋
        </h1>
        <p className="text-on-surface-variant mt-1">Here&apos;s what&apos;s happening with your trade activity today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8 stagger-children">
        {stats.map((stat) => (
          <div
            key={stat.label}
            ref={stat.ref}
            className={`bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high hover-lift tilt-hover ${stat.glow}`}
            style={{ boxShadow: '0 4px 20px rgba(109, 40, 217, 0.06)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-on-surface-variant text-sm font-medium">{stat.label}</p>
              <div className={`${stat.bg} p-2.5 rounded-xl transition-transform duration-300 hover:scale-110`}>
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>{stat.icon}</span>
              </div>
            </div>
            <h3 className="text-3xl font-extrabold text-on-surface tabular-nums">{stat.value}</h3>
            <p className={`text-sm flex items-center mt-2 font-medium ${stat.up ? 'text-emerald-600' : 'text-error'}`}>
              <span className="material-symbols-outlined text-[16px] mr-1">{stat.up ? 'trending_up' : 'trending_down'}</span>
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Inquiries */}
        <div className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'backwards' }}>
          <div className="card">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-on-surface">Recent Inquiries</h2>
                <span className="badge badge-pulse text-xs">
                  <div className="live-dot mr-2" style={{ width: 6, height: 6 }} />
                  Live
                </span>
              </div>
              <Link href="/dashboard/inquiries" className="text-sm text-primary font-medium hover:underline flex items-center gap-1 group">
                View All <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
            </div>
            <div className="space-y-2 stagger-children">
              {recentInquiries.map((inq) => {
                const status = getStatusBadge(inq.status);
                return (
                  <div key={inq.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-container-low transition-all duration-300 group cursor-pointer ripple-effect">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <span className="text-sm font-bold text-primary">{inq.avatar}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">{inq.buyerName}</p>
                        <p className="text-xs text-on-surface-variant">{inq.product} • {inq.country}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${status.cls}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                        {inq.status}
                      </span>
                      <span className="text-xs text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">schedule</span> {inq.time}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Actions & Performance */}
        <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'backwards' }}>
          <div className="card">
            <h2 className="text-lg font-semibold text-on-surface mb-4">Quick Actions</h2>
            <div className="space-y-2 stagger-children">
              {[
                { href: '/dashboard/products', icon: 'add_box', label: 'Add New Product', color: 'primary' },
                { href: '/dashboard/inquiries', icon: 'mark_email_read', label: 'Manage Inquiries', color: 'secondary' },
                { href: '/dashboard/leaderboard', icon: 'leaderboard', label: 'View Leaderboard', color: 'surface-tint' },
                ...(isPremium ? [{ href: '/dashboard/intelligence', icon: 'psychology', label: 'Buyer Radar', color: 'tertiary' as const }] : []),
              ].map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className={`flex items-center gap-3 p-3 rounded-xl bg-${action.color}/5 hover:bg-${action.color}/10 transition-all duration-300 text-${action.color} font-medium text-sm group ripple-effect`}
                >
                  <span className="material-symbols-outlined group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">{action.icon}</span>
                  <span>{action.label}</span>
                  <span className="material-symbols-outlined text-[16px] ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">arrow_forward</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold text-on-surface mb-4">Performance</h2>
            <div className="space-y-4">
              {[
                { label: 'Response Rate', value: 85, color: 'bg-emerald-500', text: 'text-emerald-600' },
                { label: 'Conversion Rate', value: 18, color: 'bg-primary', text: 'text-primary' },
                { label: 'Catalog Score', value: 72, color: 'bg-secondary', text: 'text-secondary' },
              ].map((metric) => (
                <div key={metric.label} className="group">
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-on-surface-variant">{metric.label}</span>
                    <span className={`font-bold ${metric.text} tabular-nums`}>{metric.value}%</span>
                  </div>
                  <div className="progress-bar h-2 group-hover:h-3 transition-all duration-300">
                    <div
                      className={`progress-bar-fill ${metric.color}`}
                      style={{ width: `${metric.value}%` }}
                    />
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
