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
  { href: '/dashboard/catalog', label: 'Catalog', icon: 'inventory_2' },
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
          bg-[#faf8ff] dark:bg-dark-surface-container-low
          border-r border-surface-variant/30 dark:border-dark-surface-variant/30
          transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${collapsed ? 'w-[72px]' : 'w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
        style={{ boxShadow: mobileOpen ? '4px 0 24px rgba(0,0,0,0.15)' : 'none' }}
      >
        {/* Brand Header */}
        <div className={`flex items-center ${collapsed ? 'justify-center py-6' : 'px-6 py-6'} border-b border-transparent`}>
          {!collapsed ? (
            <div className="overflow-hidden animate-fade-in flex items-center gap-2">
              <img src="/images/android-chrome-192x192.png" alt="Logo" className="w-8 h-8 object-contain shrink-0" />
              <div>
                <Link href="/" className="text-[22px] font-display font-extrabold text-[#5300b7] dark:text-dark-primary block leading-tight">Grawizah</Link>
                <p className="text-[11px] text-on-surface-variant dark:text-dark-on-surface-variant mt-1">Global Trade Platform</p>
              </div>
            </div>
          ) : (
             <Link href="/">
               <img src="/images/android-chrome-192x192.png" alt="Logo" className="w-8 h-8 object-contain" />
             </Link>
          )}
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={onToggle}
          className={`
            hidden md:flex items-center justify-center
            absolute -right-3 top-[32px]
            w-6 h-6 rounded-full
            bg-surface-container-lowest dark:bg-dark-surface-container
            border border-surface-variant dark:border-dark-surface-variant
            text-on-surface-variant dark:text-dark-on-surface-variant
            hover:text-primary dark:hover:text-dark-primary
            hover:border-primary shadow-sm
            transition-all duration-300 z-50
          `}
        >
          <span
            className="material-symbols-outlined text-[14px] transition-transform duration-300"
            style={{ transform: collapsed ? 'rotate(0deg)' : 'rotate(180deg)' }}
          >
            chevron_right
          </span>
        </button>

        {/* Navigation */}
        <nav className={`flex-1 flex flex-col gap-1 overflow-y-auto py-2 ${collapsed ? 'px-2' : 'px-4'}`}>
          {sidebarLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => mobileOpen && onMobileClose()}
                className={`
                  ${active ? 'sidebar-link-active' : 'sidebar-link text-[#6b7280]'}
                  ${collapsed ? 'justify-center px-0 py-3' : 'px-3 py-2.5'}
                  group rounded-md
                `}
                title={collapsed ? link.label : undefined}
              >
                <span
                  className={`material-symbols-outlined text-[20px] shrink-0 transition-colors duration-200 ${
                    active ? '' : 'group-hover:text-primary dark:group-hover:text-dark-primary'
                  }`}
                  style={active ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {link.icon}
                </span>
                {!collapsed && (
                  <span className="whitespace-nowrap overflow-hidden text-[13px]">{link.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className={`px-4 py-6 flex flex-col gap-4 mt-auto`}>
          {/* Upgrade */}
          <button className={`
            w-full rounded-md bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-medium
            transition-colors duration-200 shadow-sm
            ${collapsed ? 'p-2 flex items-center justify-center' : 'py-2.5 px-4'}
          `}>
            {collapsed ? (
              <span className="material-symbols-outlined text-[18px]">upgrade</span>
            ) : (
              <span className="text-sm">Upgrade Plan</span>
            )}
          </button>

          {/* Help, Theme & Logout */}
          <div className="flex flex-col gap-1 mt-2">
            <button onClick={toggleTheme} className={`flex items-center gap-3 text-[#6b7280] dark:text-[#a1a1aa] hover:text-[#374151] dark:hover:text-[#e4e4e7] transition-colors ${collapsed ? 'justify-center p-2' : 'px-2 py-1.5'} rounded-md`} title="Toggle Theme">
              <span className="material-symbols-outlined text-[18px]">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
              {!collapsed && <span className="text-[13px] font-medium">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
            </button>
            <Link href="#" className={`flex items-center gap-3 text-[#6b7280] dark:text-[#a1a1aa] hover:text-[#374151] dark:hover:text-[#e4e4e7] transition-colors ${collapsed ? 'justify-center p-2' : 'px-2 py-1.5'} rounded-md`} title="Help Center">
              <span className="material-symbols-outlined text-[18px]">help_outline</span>
              {!collapsed && <span className="text-[13px] font-medium">Help Center</span>}
            </Link>
            <button onClick={signOut} className={`flex items-center gap-3 text-[#6b7280] dark:text-[#a1a1aa] hover:text-[#ef4444] dark:hover:text-[#ef4444] transition-colors ${collapsed ? 'justify-center p-2' : 'px-2 py-1.5'} rounded-md`} title="Logout">
              <span className="material-symbols-outlined text-[18px]">logout</span>
              {!collapsed && <span className="text-[13px] font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
