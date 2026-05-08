'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Package, MessageSquare, Trophy, Brain,
  Settings, Globe, ChevronLeft, ChevronRight, LogOut, Crown
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

const sidebarLinks = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/products', icon: Package, label: 'Products' },
  { href: '/dashboard/inquiries', icon: MessageSquare, label: 'Inquiries' },
  { href: '/dashboard/leaderboard', icon: Trophy, label: 'Leaderboard' },
  { href: '/dashboard/intelligence', icon: Brain, label: 'Intelligence', premium: true },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { user, signOut, isPremium } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
        collapsed ? 'w-[72px]' : 'w-64'
      } min-h-screen sticky top-0`}
    >
      {/* Logo */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        {!collapsed && (
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-700 to-accent-500 rounded-lg flex items-center justify-center">
              <Globe className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-primary-700">Grawizah</span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {sidebarLinks.map((link) => {
          const active = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative ${
                active
                  ? 'bg-primary-50 text-primary-700 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
              title={collapsed ? link.label : undefined}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-primary-700' : 'text-gray-400 group-hover:text-gray-600'}`} />
              {!collapsed && (
                <>
                  <span>{link.label}</span>
                  {link.premium && (
                    <Crown className="w-3.5 h-3.5 text-amber-500 ml-auto" />
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-3 border-t border-gray-100">
        {!collapsed && isPremium && (
          <div className="mb-3 px-3 py-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-semibold text-amber-800">Premium Active</span>
            </div>
          </div>
        )}
        {!collapsed ? (
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">{user?.email?.[0]?.toUpperCase() || 'U'}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.email?.split('@')[0]}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role?.replace('_', ' ')}</p>
            </div>
            <button onClick={signOut} className="p-1.5 text-gray-400 hover:text-red-500 transition" title="Sign Out">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button onClick={signOut} className="w-full p-2 flex justify-center text-gray-400 hover:text-red-500 transition" title="Sign Out">
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>
    </aside>
  );
}
