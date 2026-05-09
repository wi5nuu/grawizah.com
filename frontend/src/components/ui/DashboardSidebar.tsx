'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

const sidebarLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { href: '/dashboard/intelligence', label: 'Intelligence', icon: 'insights' },
  { href: '/dashboard/inquiries', label: 'Orders', icon: 'receipt_long' },
  { href: '/dashboard/products', label: 'Suppliers', icon: 'handshake' },
  { href: '/catalog/suppliers', label: 'Directory', icon: 'menu_book' },
  { href: '/dashboard/settings', label: 'Settings', icon: 'settings' },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { signOut } = useAuth();

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 bg-surface-container-low border-r border-surface-variant/30 flex-col p-4 gap-2 z-40 hidden md:flex">
      {/* Brand Header */}
      <div className="mb-8 px-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-on-primary font-bold text-lg">
          G
        </div>
        <div>
          <Link href="/" className="text-xl font-display font-extrabold text-primary block">Grawizah</Link>
          <p className="text-xs text-on-surface-variant">Global Trade Platform</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 flex flex-col gap-2 font-body text-sm">
        {sidebarLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={
              isActive(link.href)
                ? 'sidebar-link-active'
                : 'sidebar-link'
            }
          >
            <span
              className="material-symbols-outlined"
              style={isActive(link.href) ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              {link.icon}
            </span>
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>

      {/* CTA & Footer Nav */}
      <div className="mt-auto flex flex-col gap-4">
        <button className="w-full py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-on-primary font-bold shadow-sm hover:opacity-90 transition-opacity">
          Upgrade Plan
        </button>
        <div className="border-t border-surface-variant/30 pt-4 flex flex-col gap-2">
          <Link href="#" className="sidebar-link">
            <span className="material-symbols-outlined text-[20px]">help</span>
            <span>Help Center</span>
          </Link>
          <button
            onClick={signOut}
            className="sidebar-link w-full text-left"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
