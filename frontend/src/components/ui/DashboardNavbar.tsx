'use client';

import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/components/ThemeProvider';
import { 
  Bell, 
  Search, 
  Menu, 
  Sun, 
  Moon, 
  User,
  ChevronDown,
  LayoutDashboard
} from 'lucide-react';

interface DashboardNavbarProps {
  onMenuClick: () => void;
}

export default function DashboardNavbar({ onMenuClick }: DashboardNavbarProps) {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 h-16 bg-white/80 dark:bg-dark-surface-container-low/80 backdrop-blur-md border-b border-gray-100 dark:border-dark-surface-variant/30 flex items-center justify-between px-6 md:px-10">
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

      {/* Center: Search (Optional) */}
      <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
        <div className="w-full relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search intelligence nodes..." 
            className="w-full bg-gray-50 dark:bg-dark-surface-container border border-transparent focus:border-primary/20 focus:bg-white dark:focus:bg-dark-surface-container-high text-sm font-medium px-10 py-2 rounded-xl outline-none transition-all"
          />
        </div>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="w-10 h-10 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-surface-container flex items-center justify-center text-gray-500 dark:text-dark-on-surface transition-all"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notifications */}
        <button className="relative w-10 h-10 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-surface-container flex items-center justify-center text-gray-500 dark:text-dark-on-surface transition-all">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-white dark:border-dark-surface-container-low" />
        </button>

        {/* Profile Dropdown (Simplified for now) */}
        <div className="flex items-center gap-3 pl-2 md:pl-4 border-l border-gray-100 dark:border-dark-surface-variant/30">
           <div className="hidden md:flex flex-col items-end">
              <p className="text-[11px] font-black text-gray-900 dark:text-white leading-none mb-1 uppercase tracking-wider">{user?.role?.replace('_', ' ') || 'Guest'}</p>
              <p className="text-[10px] font-bold text-gray-400 leading-none">{user?.email || 'N/A'}</p>
           </div>
           <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary p-0.5 flex items-center justify-center shadow-lg shadow-primary/20 group cursor-pointer">
              <div className="w-full h-full bg-white dark:bg-dark-surface rounded-[10px] flex items-center justify-center overflow-hidden">
                 <User className="w-5 h-5 text-primary" />
              </div>
           </div>
           <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
        </div>
      </div>
    </header>
  );
}
