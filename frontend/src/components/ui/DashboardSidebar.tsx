'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/components/ThemeProvider';
import { 
  LayoutDashboard, 
  Bot, 
  Mail, 
  Package, 
  BarChart3, 
  Settings, 
  ChevronRight, 
  ChevronLeft,
  Moon,
  Sun,
  HelpCircle,
  LogOut,
  Zap,
  ShoppingBag,
  Search,
  Truck,
  BookOpen
} from 'lucide-react';

const supplierLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/intelligence', label: 'Intelligence', icon: Bot },
  { href: '/dashboard/inquiries', label: 'Inquiries', icon: Mail },
  { href: '/dashboard/products', label: 'My Products', icon: Package },
  { href: '/dashboard/documents', label: 'Document Vault', icon: BookOpen },
  { href: '/dashboard/leaderboard', label: 'Leaderboard', icon: BarChart3 },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

const buyerLinks = [
  { href: '/buyer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/catalog', label: 'Sourcing Hub', icon: Search },
  { href: '/buyer/rfq', label: 'My RFQs', icon: Package },
  { href: '/buyer/inquiries', label: 'My Inquiries', icon: Mail },
  { href: '/buyer/documents', label: 'Document Vault', icon: BookOpen },
  { href: '/buyer/settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function DashboardSidebar({
  collapsed = false,
  onToggle = () => {},
  mobileOpen = false,
  onMobileClose = () => {},
}: SidebarProps) {
  const pathname = usePathname();
  const { signOut, user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden animate-fade-in"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          h-screen fixed left-0 top-0 z-50 flex flex-col
          bg-white dark:bg-dark-surface-container-low
          border-r border-gray-100 dark:border-dark-surface-variant/30
          transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${collapsed ? 'w-[80px]' : 'w-72'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Brand Header */}
        <div className={`flex items-center ${collapsed ? 'justify-center py-8' : 'px-8 py-8'}`}>
          {!collapsed ? (
            <div className="overflow-hidden animate-fade-in flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-dark-surface-container flex items-center justify-center shadow-md shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-dark-surface-variant/20 overflow-hidden">
                 <img src="/images/android-chrome-192x192.png" className="w-7 h-7 object-contain" alt="Grawizah Logo" />
              </div>
              <div>
                <Link href="/" className="text-xl font-black text-gray-900 dark:text-white block leading-none tracking-tight">Grawizah</Link>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mt-1">Intelligence</p>
              </div>
            </div>
          ) : (
             <Link href="/" className="w-10 h-10 rounded-xl bg-white dark:bg-dark-surface-container flex items-center justify-center shadow-md shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-dark-surface-variant/20 overflow-hidden">
               <img src="/images/android-chrome-192x192.png" className="w-7 h-7 object-contain" alt="Grawizah Logo" />
             </Link>
          )}
        </div>

        {/* Navigation */}
        <nav className={`flex-1 flex flex-col gap-1 overflow-y-auto py-4 ${collapsed ? 'px-3' : 'px-6'}`}>
          {(user?.role === 'buyer' ? buyerLinks : supplierLinks).map((link) => {
            const active = isActive(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => mobileOpen && onMobileClose()}
                className={`
                  flex items-center gap-4 transition-all duration-200
                  ${active 
                    ? 'bg-primary/5 text-primary border border-primary/10' 
                    : 'text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5'}
                  ${collapsed ? 'justify-center px-0 py-4' : 'px-4 py-3.5'}
                  rounded-2xl group
                `}
                title={collapsed ? link.label : undefined}
              >
                <Icon className={`w-5 h-5 shrink-0 ${active ? 'text-primary' : 'group-hover:scale-110 transition-transform'}`} />
                {!collapsed && (
                  <span className={`text-[13px] font-black uppercase tracking-widest ${active ? 'opacity-100' : 'opacity-70'}`}>{link.label}</span>
                )}
                {!collapsed && active && (
                   <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className={`mt-auto ${collapsed ? 'px-3' : 'px-6'} py-8 space-y-6`}>
          
          {/* Upgrade Plan (FIXED: Added Link & Functionality) */}
          <Link 
            href="/pricing"
            className={`
              w-full flex items-center justify-center gap-3
              bg-gray-900 dark:bg-white text-white dark:text-gray-900 
              font-black text-[10px] uppercase tracking-[0.2em]
              transition-all duration-300 shadow-xl hover:opacity-90 active:scale-95
              ${collapsed ? 'p-4 rounded-xl' : 'py-4 px-6 rounded-2xl'}
            `}
          >
            <Zap className="w-4 h-4 fill-current" />
            {!collapsed && <span>Upgrade Plan</span>}
          </Link>

          {/* Theme & Meta Links */}
          <div className="flex flex-col gap-1">
            <button 
              onClick={toggleTheme} 
              className={`flex items-center gap-4 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors ${collapsed ? 'justify-center p-4' : 'px-4 py-3'} rounded-xl`}
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              {!collapsed && <span className="text-[12px] font-black uppercase tracking-widest">{theme === 'dark' ? 'Solar Mode' : 'Lunar Mode'}</span>}
            </button>
            
            <Link 
              href="/info/support" 
              className={`flex items-center gap-4 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors ${collapsed ? 'justify-center p-4' : 'px-4 py-3'} rounded-xl`}
              title="Help Center"
            >
              <HelpCircle className="w-5 h-5" />
              {!collapsed && <span className="text-[12px] font-black uppercase tracking-widest">Protocol Support</span>}
            </Link>

            <button 
              onClick={signOut} 
              className={`flex items-center gap-4 text-gray-400 hover:text-red-500 transition-colors ${collapsed ? 'justify-center p-4' : 'px-4 py-3'} rounded-xl group`}
              title="Logout"
            >
              <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              {!collapsed && <span className="text-[12px] font-black uppercase tracking-widest">Terminate Session</span>}
            </button>
          </div>

          {/* Profile Quick Snapshot (Collapsed Only) */}
          {collapsed && (
             <div className="flex justify-center pt-4 border-t border-gray-100 dark:border-white/5">
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] font-black text-primary">
                   {user?.email?.[0].toUpperCase()}
                </div>
             </div>
          )}
        </div>

        {/* Toggle (Internal) */}
        <button
          onClick={onToggle}
          className={`
            absolute -right-4 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center
            w-8 h-8 rounded-full bg-white dark:bg-dark-surface-container border border-gray-100 dark:border-dark-surface-variant/30
            text-gray-400 hover:text-primary shadow-lg transition-all z-[60]
          `}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </aside>
    </>
  );
}
