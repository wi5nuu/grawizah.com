'use client';

import { useState, useEffect } from 'react';
import DashboardSidebar from '@/components/ui/DashboardSidebar';
import DashboardNavbar from '@/components/ui/DashboardNavbar';
import { ChatWidget } from '@/components/ChatWidget';
import { NotificationToast } from '@/components/NotificationToast';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/components/ThemeProvider';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-dark-background">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background dark:bg-dark-background">
      <DashboardSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main Content Area - Material 3 Nested Container Style */}
      <div
        className={`
          flex-1 min-h-screen transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${collapsed ? 'md:ml-[80px]' : 'md:ml-72'}
          flex flex-col
        `}
      >
        <DashboardNavbar onMenuClick={() => setMobileOpen(true)} />

        {/* The "Box/Card" for all pages with inner padding */}
        <div className="flex-1 flex flex-col p-2 md:p-4">
          <main className="flex-1 overflow-auto animate-fade-in bg-white dark:bg-dark-surface-container-low rounded-3xl md:rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-dark-surface-variant/20 relative">
            <div className="absolute inset-0 overflow-auto rounded-3xl md:rounded-[2.5rem]">
              {children}
            </div>
          </main>
        </div>
      </div>

      <ChatWidget />
      <NotificationToast />
    </div>
  );
}
