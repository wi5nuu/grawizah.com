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
                  : 'text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Theme Toggle (Visible on all screens) */}
          <button
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="w-9 h-9 rounded-md bg-black/5 dark:bg-white/10 flex items-center justify-center text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-all active:scale-90"
            title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          >
            <span className="material-symbols-outlined text-[20px]">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

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
                        <p className="text-[11px] font-bold text-black/60 dark:text-white/60 uppercase tracking-widest">{user?.role?.replace('_', ' ')}</p>
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
                        href={isBuyer ? '/buyer/settings' : '/dashboard/settings'}
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
                <Link href="/register" className="px-4 py-1.5 bg-black dark:bg-white text-white dark:text-black rounded-sm font-bold text-xs hover:opacity-90 transition-all">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button 
            aria-label="Toggle mobile menu"
            className="md:hidden text-black dark:text-white w-10 h-10 flex items-center justify-center rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors" 
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span className="material-symbols-outlined">{mobileOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-black/5 dark:border-white/10 bg-white dark:bg-dark-surface animate-fade-in overflow-y-auto max-h-[calc(100vh-64px)]">
          <nav className="px-6 py-6 space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/30 dark:text-white/30 px-4 mb-2">Navigation</p>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-3.5 rounded-xl text-[15px] font-bold transition-all ${
                  isActive(link.href) 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-black/60 dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            <div className="my-6 border-t border-black/5 dark:border-white/5 pt-6" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/30 dark:text-white/30 px-4 mb-2">Account</p>

            {!loading && (
              isAuthenticated ? (
                <>
                  <Link 
                    href={isBuyer ? '/buyer/dashboard' : '/dashboard'} 
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-[15px] font-bold text-black/60 dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/5 transition-all" 
                    onClick={() => setMobileOpen(false)}
                  >
                    <span className="material-symbols-outlined text-[20px]">dashboard</span> Dashboard
                  </Link>
                  <Link 
                    href={isBuyer ? '/buyer/settings' : '/dashboard/settings'} 
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-[15px] font-bold text-black/60 dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/5 transition-all" 
                    onClick={() => setMobileOpen(false)}
                  >
                    <span className="material-symbols-outlined text-[20px]">settings</span> Settings
                  </Link>
                  <button 
                    onClick={() => { signOut(); setMobileOpen(false); }} 
                    className="flex items-center gap-3 w-full text-left px-4 py-3.5 rounded-xl text-[15px] font-bold text-red-500 hover:bg-red-500/10 transition-all"
                  >
                    <span className="material-symbols-outlined text-[20px]">logout</span> Sign Out
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  <Link 
                    href="/login" 
                    className="flex items-center justify-center px-4 py-4 rounded-xl text-[15px] font-bold text-black/60 dark:text-white/60 border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-all" 
                    onClick={() => setMobileOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link 
                    href="/register" 
                    className="flex items-center justify-center px-4 py-4 bg-black dark:bg-white text-white dark:text-black font-black text-[15px] rounded-xl shadow-lg" 
                    onClick={() => setMobileOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              )
            )}
          </nav>
        </div>
      )}
    </nav>
  );
}
