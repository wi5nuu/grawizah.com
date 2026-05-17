'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  Settings,
  LogOut,
  ChevronDown,
  Shield,
  CreditCard,
  HelpCircle,
  Bell
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function ProfileDropdown() {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setIsOpen(false);
    await signOut();
    router.push('/login');
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'buyer': return 'Global Buyer';
      case 'admin': return 'Administrator';
      case 'premium_trader': return 'Pro Supplier';
      case 'free_trader': return 'Starter';
      default: return 'Strategic Supplier';
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'premium_trader':
        return (
          <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-[9px] font-black uppercase tracking-widest border border-amber-200 dark:border-amber-800/50">
            Pro
          </span>
        );
      case 'admin':
        return (
          <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-[9px] font-black uppercase tracking-widest border border-purple-200 dark:border-purple-800/50">
            Enterprise
          </span>
        );
      case 'free_trader':
        return (
          <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[9px] font-black uppercase tracking-widest border border-slate-200 dark:border-slate-700">
            Starter
          </span>
        );
      default:
        return null;
    }
  };

  const settingsPath = user?.role === 'buyer' ? '/buyer/settings' : '/dashboard/settings';

  const menuItems = [
    { icon: User, label: 'My Profile', href: settingsPath, desc: 'Personal info & preferences' },
    { icon: Settings, label: 'Settings', href: settingsPath, desc: 'Account configuration' },
    { icon: Bell, label: 'Notifications', href: '#', desc: 'Notification preferences' },
    { icon: CreditCard, label: 'Billing & Plans', href: '/pricing', desc: 'Manage subscription' },
    { icon: Shield, label: 'Security', href: settingsPath, desc: 'Password & 2FA' },
    { icon: HelpCircle, label: 'Help Center', href: '/info', desc: 'Support & documentation' },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 pl-2 md:pl-4 border-l border-gray-100 dark:border-dark-surface-variant/30 hover:opacity-90 transition-opacity"
      >
        <div className="hidden md:flex flex-col items-end">
          <div className="flex items-center gap-2 mb-0.5">
            {getRoleBadge(user?.role || '')}
            <p className="text-[11px] font-black text-gray-900 dark:text-white leading-none uppercase tracking-wider">
              {getRoleLabel(user?.role || '')}
            </p>
          </div>
          <p className="text-[10px] font-bold text-gray-400 leading-none truncate max-w-[180px]">
            {user?.email || 'N/A'}
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary p-0.5 flex items-center justify-center shadow-lg shadow-primary/20">
          <div className="w-full h-full bg-white dark:bg-dark-surface rounded-[10px] flex items-center justify-center overflow-hidden">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-5 h-5 text-primary" />
            )}
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 hidden sm:block transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-72 bg-white dark:bg-dark-surface-container-low rounded-2xl shadow-2xl border border-gray-100 dark:border-dark-surface-variant/20 z-[100] overflow-hidden animate-scale-in">
          {/* User Info Header */}
          <div className="p-4 border-b border-gray-100 dark:border-dark-surface-variant/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary p-0.5 flex items-center justify-center shadow-lg shadow-primary/20">
                <div className="w-full h-full bg-white dark:bg-dark-surface rounded-[10px] flex items-center justify-center overflow-hidden">
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-lg font-black text-primary">
                      {user?.email?.[0].toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {getRoleBadge(user?.role || '')}
                </div>
                <p className="text-[12px] font-black text-gray-900 dark:text-white truncate mt-1">
                  {user?.email || 'N/A'}
                </p>
                <p className="text-[10px] text-gray-400 font-bold">
                  {getRoleLabel(user?.role || '')}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2 max-h-80 overflow-y-auto">
            {menuItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setIsOpen(false);
                  if (item.href !== '#') {
                    router.push(item.href);
                  }
                }}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-surface-container transition-colors group text-left"
              >
                <div className="w-9 h-9 rounded-lg bg-gray-50 dark:bg-dark-surface-container flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <item.icon className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold text-gray-900 dark:text-white leading-none">
                    {item.label}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5 leading-none">
                    {item.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Sign Out */}
          <div className="p-2 border-t border-gray-100 dark:border-dark-surface-variant/20">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors group text-left"
            >
              <div className="w-9 h-9 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                <LogOut className="w-4 h-4 text-red-500" />
              </div>
              <div>
                <p className="text-[12px] font-bold text-red-600 dark:text-red-400 leading-none">
                  Sign Out
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5 leading-none">
                  End your session
                </p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
