'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { createContext, useContext, useState, useEffect } from 'react';

// Context for sidebar state (shared with layout)
export const SidebarContext = createContext<{
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}>({
  collapsed: false,
  setCollapsed: () => {},
  mobileOpen: false,
  setMobileOpen: () => {},
});

export function useSidebar() {
  return useContext(SidebarContext);
}

const sidebarLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { href: '/dashboard/intelligence', label: 'Intelligence', icon: 'insights' },
  { href: '/dashboard/inquiries', label: 'Orders', icon: 'receipt_long' },
  { href: '/dashboard/products', label: 'Suppliers', icon: 'handshake' },
  { href: '/catalog/suppliers', label: 'Directory', icon: 'menu_book' },
  { href: '/dashboard/leaderboard', label: 'Leaderboard', icon: 'leaderboard' },
  { href: '/dashboard/settings', label: 'Settings', icon: 'settings' },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { signOut } = useAuth();
  const { collapsed, setCollapsed, mobileOpen, setMobileOpen } = useSidebar();

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          h-screen fixed left-0 top-0 z-50 flex flex-col
          bg-surface-container-lowest border-r border-surface-variant/30
          transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${collapsed ? 'w-[72px]' : 'w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
        style={{ boxShadow: mobileOpen ? '4px 0 24px rgba(0,0,0,0.1)' : undefined }}
      >
        {/* Brand Header */}
        <div className={`flex items-center ${collapsed ? 'justify-center py-5 px-2' : 'px-4 py-5 gap-3'} border-b border-surface-variant/20`}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-on-primary font-bold text-lg shrink-0 shadow-lg shadow-primary/20 animate-pulse-glow">
            G
          </div>
          {!collapsed && (
            <div className="overflow-hidden animate-fade-in">
              <Link href="/" className="text-lg font-display font-extrabold text-primary block leading-tight">Grawizah</Link>
              <p className="text-[10px] text-on-surface-variant font-medium tracking-wider uppercase">Global Trade</p>
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => {
            setCollapsed(!collapsed);
            if (mobileOpen) setMobileOpen(false);
          }}
          className={`
            hidden md:flex items-center justify-center
            absolute -right-3 top-[72px]
            w-6 h-6 rounded-full
            bg-surface-container-lowest border border-surface-variant
            text-on-surface-variant hover:text-primary hover:border-primary
            shadow-sm hover:shadow-md
            transition-all duration-300 z-50
          `}
          data-tooltip={collapsed ? 'Expand' : 'Collapse'}
        >
          <span
            className="material-symbols-outlined text-[16px] transition-transform duration-300"
            style={{ transform: collapsed ? 'rotate(0deg)' : 'rotate(180deg)' }}
          >
            chevron_right
          </span>
        </button>

        {/* Navigation Links */}
        <nav className={`flex-1 flex flex-col gap-1 overflow-y-auto py-4 ${collapsed ? 'px-2' : 'px-3'} stagger-children`}>
          {sidebarLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => mobileOpen && setMobileOpen(false)}
                className={`
                  ripple-effect
                  ${active ? 'sidebar-link-active' : 'sidebar-link'}
                  ${collapsed ? 'justify-center px-0' : ''}
                  group
                `}
                data-tooltip={collapsed ? link.label : undefined}
              >
                <span
                  className={`material-symbols-outlined text-[22px] shrink-0 transition-all duration-300 ${
                    active ? '' : 'group-hover:scale-110 group-hover:text-primary'
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

        {/* CTA & Footer */}
        <div className={`border-t border-surface-variant/20 ${collapsed ? 'px-2 py-4' : 'px-3 py-4'} flex flex-col gap-2`}>
          {/* Upgrade Button */}
          <button className={`
            w-full rounded-lg bg-gradient-to-r from-primary to-secondary text-on-primary font-bold
            shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300
            ${collapsed ? 'p-2.5' : 'py-3 px-4'}
            relative overflow-hidden
          `}>
            {collapsed ? (
              <span className="material-symbols-outlined text-[20px]">upgrade</span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[18px]">star</span>
                Upgrade Plan
              </span>
            )}
          </button>

          {/* Help & Logout */}
          <Link
            href="#"
            className={`sidebar-link ${collapsed ? 'justify-center px-0' : ''}`}
            data-tooltip={collapsed ? 'Help Center' : undefined}
          >
            <span className="material-symbols-outlined text-[20px]">help</span>
            {!collapsed && <span>Help Center</span>}
          </Link>
          <button
            onClick={signOut}
            className={`sidebar-link w-full text-left ${collapsed ? 'justify-center px-0' : ''}`}
            data-tooltip={collapsed ? 'Logout' : undefined}
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
