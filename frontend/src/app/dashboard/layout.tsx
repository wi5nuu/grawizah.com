'use client';

import { useState } from 'react';
import DashboardSidebar from '@/components/ui/DashboardSidebar';
import { ChatWidget } from '@/components/ChatWidget';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background dark:bg-dark-background">
      <DashboardSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main Content */}
      <div
        className={`
          flex-1 min-h-screen transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${collapsed ? 'md:ml-[72px]' : 'md:ml-64'}
        `}
      >
        {/* Mobile Top Bar */}
        <header className="md:hidden sticky top-0 z-30 h-16 bg-surface/80 dark:bg-dark-surface/80 backdrop-blur-md border-b border-surface-variant/30 dark:border-dark-surface-variant/30 flex items-center justify-between px-4">
          <button
            onClick={() => setMobileOpen(true)}
            className="w-10 h-10 rounded-lg bg-surface-container-low dark:bg-dark-surface-container flex items-center justify-center text-on-surface dark:text-dark-on-surface hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <span className="text-lg font-display font-bold gradient-text">Grawizah</span>
          <button className="w-10 h-10 rounded-lg bg-surface-container-low dark:bg-dark-surface-container flex items-center justify-center text-on-surface dark:text-dark-on-surface">
            <span className="material-symbols-outlined">notifications</span>
          </button>
        </header>

        <main className="flex-1 overflow-auto animate-fade-in">
          {children}
        </main>
      </div>

      <ChatWidget />
    </div>
  );
}
