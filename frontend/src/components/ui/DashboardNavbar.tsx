'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/components/ThemeProvider';
import {
  Search,
  Menu,
  Sun,
  Moon,
  LayoutDashboard
} from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';
import ProfileDropdown from './ProfileDropdown';

interface DashboardNavbarProps {
  onMenuClick: () => void;
}

export default function DashboardNavbar({ onMenuClick }: DashboardNavbarProps) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/dashboard/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 h-16 bg-white/85 dark:bg-dark-surface-container-low/85 backdrop-blur-md border-b border-gray-100 dark:border-dark-surface-variant/30 flex items-center justify-between px-6 md:px-8 w-full">
      {/* Left: Mobile Menu & Breadcrumbs */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden w-10 h-10 rounded-xl bg-gray-50 dark:bg-dark-surface-container flex items-center justify-center text-gray-500 dark:text-dark-on-surface hover:bg-gray-100 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden md:flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
           <LayoutDashboard className="w-3.5 h-3.5" />
           <span>Dashboard</span>
           <span className="mx-1">/</span>
           <span className="text-gray-900 dark:text-white">Overview</span>
        </div>
      </div>

      {/* Center: Search */}
      <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
        <div className="w-full relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search intelligence nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="w-full bg-gray-50 dark:bg-dark-surface-container border border-transparent focus:border-primary/20 focus:bg-white dark:focus:bg-dark-surface-container-high text-sm font-medium px-10 py-2 rounded-xl outline-none transition-all"
          />
        </div>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-surface-container flex items-center justify-center text-gray-500 dark:text-dark-on-surface transition-all"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notifications */}
        <NotificationDropdown />

        {/* Profile Dropdown */}
        <ProfileDropdown />
      </div>
    </header>
  );
}
