'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/components/ThemeProvider';

const sidebarLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { href: '/dashboard/intelligence', label: 'Intelligence', icon: 'insights' },
  { href: '/dashboard/inquiries', label: 'Orders', icon: 'receipt_long' },
  { href: '/dashboard/products', label: 'Suppliers', icon: 'handshake' },
  { href: '/catalog/suppliers', label: 'Directory', icon: 'menu_book' },
  { href: '/dashboard/leaderboard', label: 'Leaderboard', icon: 'leaderboard' },
  { href: '/dashboard/settings', label: 'Settings', icon: 'settings' },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function DashboardSidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
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
          bg-surface-container-lowest dark:bg-dark-surface-container-low
          border-r border-surface-variant/30 dark:border-dark-surface-variant/30
          transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${collapsed ? 'w-[72px]' : 'w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
        style={{ boxShadow: mobileOpen ? '4px 0 24px rgba(0,0,0,0.15)' : '1px 0 8px rgba(0,0,0,0.04)' }}
      >
        {/* Brand Header */}
        <div className={`flex items-center ${collapsed ? 'justify-center py-5 px-2' : 'px-4 py-5 gap-3'} border-b border-surface-variant/20 dark:border-dark-surface-variant/30`}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-on-primary font-bold text-lg shrink-0 shadow-lg shadow-primary/20">
            G
          </div>
          {!collapsed && (
            <div className="overflow-hidden animate-fade-in">
              <Link href="/" className="text-lg font-display font-extrabold text-primary dark:text-dark-primary block leading-tight">Grawizah</Link>
              <p className="text-[10px] text-on-surface-variant dark:text-dark-on-surface-variant font-medium tracking-wider uppercase">Global Trade Platform</p>
            </div>
          )}
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={onToggle}
          className={`
            hidden md:flex items-center justify-center
            absolute -right-3 top-[72px]
            w-6 h-6 rounded-full
            bg-surface-container-lowest dark:bg-dark-surface-container
            border border-surface-variant dark:border-dark-surface-variant
            text-on-surface-variant dark:text-dark-on-surface-variant
            hover:text-primary dark:hover:text-dark-primary
            hover:border-primary shadow-sm hover:shadow-md
            transition-all duration-300 z-50
          `}
        >
          <span
            className="material-symbols-outlined text-[16px] transition-transform duration-300"
            style={{ transform: collapsed ? 'rotate(0deg)' : 'rotate(180deg)' }}
          >
            chevron_right
          </span>
        </button>

        {/* Navigation */}
        <nav className={`flex-1 flex flex-col gap-1 overflow-y-auto py-4 ${collapsed ? 'px-2' : 'px-3'}`}>
          {sidebarLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => mobileOpen && onMobileClose()}
                className={`
                  ${active ? 'sidebar-link-active' : 'sidebar-link'}
                  ${collapsed ? 'justify-center px-0' : ''}
                  group
                `}
                title={collapsed ? link.label : undefined}
              >
                <span
                  className={`material-symbols-outlined text-[22px] shrink-0 transition-all duration-300 ${
                    active ? '' : 'group-hover:scale-110 group-hover:text-primary dark:group-hover:text-dark-primary'
                  }`}
                  style={active ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {link.icon}
                </span>
                {!collapsed && (
                  <span className="whitespace-nowrap overflow-hidden">{link.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className={`border-t border-surface-variant/20 dark:border-dark-surface-variant/30 ${collapsed ? 'px-2 py-4' : 'px-3 py-4'} flex flex-col gap-2`}>
          {/* Upgrade */}
          <button className={`
            w-full rounded-lg bg-gradient-to-r from-primary to-secondary text-on-primary font-bold
            shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300
            ${collapsed ? 'p-2.5' : 'py-3 px-4'}
          `}>
            {collapsed ? (
              <span className="material-symbols-outlined text-[20px]">star</span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                Upgrade Plan
              </span>
            )}
          </button>

          {/* User Account */}
          {!collapsed && (
            <div className="flex items-center gap-3 px-2 py-2 mt-1">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-primary dark:text-dark-primary">{user?.email?.[0]?.toUpperCase() || 'U'}</span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-on-surface dark:text-dark-on-surface truncate">{user?.email?.split('@')[0] || 'User'}</p>
                <p className="text-[10px] text-on-surface-variant dark:text-dark-on-surface-variant">Supplier Account</p>
              </div>
            </div>
          )}

          {/* Theme + Help + Logout */}
          <div className={`flex ${collapsed ? 'flex-col items-center gap-2' : 'items-center gap-1'}`}>
            <button
              onClick={toggleTheme}
              className={`sidebar-link ${collapsed ? 'justify-center px-0 w-full' : 'flex-1'}`}
              title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            >
              <span className="material-symbols-outlined text-[20px]">
                {theme === 'dark' ? 'light_mode' : 'dark_mode'}
              </span>
              {!collapsed && <span className="text-xs">{theme === 'dark' ? 'Light' : 'Dark'}</span>}
            </button>
            <Link href="#" className={`sidebar-link ${collapsed ? 'justify-center px-0 w-full' : ''}`} title="Help">
              <span className="material-symbols-outlined text-[20px]">help</span>
              {!collapsed && <span className="text-xs">Help</span>}
            </Link>
            <button onClick={signOut} className={`sidebar-link ${collapsed ? 'justify-center px-0 w-full' : ''}`} title="Logout">
              <span className="material-symbols-outlined text-[20px]">logout</span>
              {!collapsed && <span className="text-xs">Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
