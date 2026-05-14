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

      {/* Main Content */}
      <div
        className={`
          flex-1 min-h-screen transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${collapsed ? 'md:ml-[72px]' : 'md:ml-64'}
          flex flex-col
        `}
      >
        <DashboardNavbar onMenuClick={() => setMobileOpen(true)} />

        <main className="flex-1 overflow-auto animate-fade-in">
          {children}
        </main>
      </div>

      <ChatWidget />
      <NotificationToast />
    </div>
  );
}
