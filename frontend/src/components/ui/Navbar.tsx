'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/components/ThemeProvider';

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, signOut, isBuyer, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/features', label: 'Features' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/directory', label: 'Directory' },
    { href: '/catalog', label: 'Catalog' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/80 dark:bg-black/80 backdrop-blur-xl border-b border-black/5 dark:border-white/10 transition-all duration-300">
      <div className="flex justify-between items-center px-6 py-3.5 max-w-[1440px] mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img src="/images/android-chrome-192x192.png" alt="Grawizah Logo" className="w-7 h-7 object-contain" />
          <span className="text-xl font-bold tracking-tighter text-black dark:text-white">
            Grawizah
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[13px] font-medium transition-all duration-200 ${
                isActive(link.href)
                  ? 'text-black dark:text-white'
                  : 'text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div className="hidden md:flex items-center gap-4">
          {loading ? (
            <div className="w-24 h-8 bg-black/5 dark:bg-white/5 animate-pulse rounded-sm" />
          ) : isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-black/5 dark:hover:bg-white/5 transition-all"
              >
                <div className="w-6 h-6 bg-black/10 dark:bg-white/10 rounded-sm flex items-center justify-center">
                  <span className="text-black dark:text-white text-[10px] font-bold">
                    {user?.email?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
                <span className="text-xs font-medium text-black/80 dark:text-white/80 max-w-[100px] truncate">
                  {user?.email?.split('@')[0]}
                </span>
              </button>

              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-black border border-black/5 dark:border-white/10 rounded-sm shadow-2xl py-2 z-50 animate-fade-in">
                    <div className="px-4 py-2 border-b border-black/5 dark:border-white/5">
                      <p className="text-[11px] font-bold text-black/40 dark:text-white/40 uppercase tracking-widest">{user?.role?.replace('_', ' ')}</p>
                      <p className="text-xs font-medium text-black/80 dark:text-white/80">{user?.email}</p>
                    </div>
                    <Link
                      href={isBuyer ? '/buyer/dashboard' : '/dashboard'}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition"
                      onClick={() => setProfileOpen(false)}
                    >
                      <span className="material-symbols-outlined text-[16px]">dashboard</span> Dashboard
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center gap-2 px-4 py-2 text-xs text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition"
                      onClick={() => setProfileOpen(false)}
                    >
                      <span className="material-symbols-outlined text-[16px]">settings</span> Settings
                    </Link>
                    <hr className="my-1 border-black/5 dark:border-white/5" />
                    <button
                      onClick={() => { signOut(); setProfileOpen(false); }}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-red-500 hover:bg-red-500/10 w-full transition"
                    >
                      <span className="material-symbols-outlined text-[16px]">logout</span> Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="text-xs text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-all font-medium px-2 py-1">
                Log In
              </Link>
              <Link href="/register" className="px-4 py-1.5 bg-white dark:bg-white text-black rounded-sm font-bold text-xs hover:bg-white/90 transition-all">
                Get Started
              </Link>
            </>
          )}
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-sm bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors"
            title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          >
            <span className="material-symbols-outlined text-[18px]">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setMobileOpen(!mobileOpen)}>
          <span className="material-symbols-outlined">{mobileOpen ? 'close' : 'menu'}</span>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-black animate-fade-in">
          <nav className="px-6 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-3 rounded-sm text-sm font-medium ${
                  isActive(link.href) ? 'bg-white/10 text-white' : 'text-white/40'
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <hr className="my-2 border-white/5" />
            {!loading && (
              isAuthenticated ? (
                <>
                  <Link href={isBuyer ? '/buyer/dashboard' : '/dashboard'} className="block px-4 py-3 rounded-sm text-sm text-white/60" onClick={() => setMobileOpen(false)}>
                    Dashboard
                  </Link>
                  <button onClick={() => { signOut(); setMobileOpen(false); }} className="block w-full text-left px-4 py-3 rounded-sm text-sm text-red-400">
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block px-4 py-3 rounded-sm text-sm text-white/40" onClick={() => setMobileOpen(false)}>
                    Log In
                  </Link>
                  <Link href="/register" className="block px-4 py-3 bg-white text-black text-center font-bold text-sm rounded-sm" onClick={() => setMobileOpen(false)}>
                    Get Started
                  </Link>
                </>
              )
            )}
          </nav>
        </div>
      )}
    </nav>
  );
}
