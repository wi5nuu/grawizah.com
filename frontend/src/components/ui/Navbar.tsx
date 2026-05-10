'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/components/ThemeProvider';

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, signOut, isBuyer } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    { href: '/features', label: 'Features' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/directory', label: 'Directory' },
    { href: '/catalog', label: 'Catalog' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/80 dark:bg-dark-surface/80 backdrop-blur-md shadow-sm shadow-primary/5 border-b border-surface-variant/10 dark:border-dark-surface-variant/30 transition-colors duration-300">
      <div className="flex justify-between items-center px-8 py-4 max-w-[1440px] mx-auto">
        {/* Logo */}
        <Link href="/" className="text-2xl font-display font-bold gradient-text hover:opacity-80 transition-opacity">
          Grawizah
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 font-body">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-all duration-200 ${
                isActive(link.href)
                  ? 'text-primary font-bold border-b-2 border-primary'
                  : 'text-on-surface-variant hover:text-primary hover:opacity-80'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-surface-container-high transition-all"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                  <span className="text-on-primary text-sm font-bold">
                    {user?.email?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
                <span className="text-sm font-medium text-on-surface max-w-[120px] truncate">
                  {user?.email?.split('@')[0]}
                </span>
                <span className="material-symbols-outlined text-on-surface-variant text-[18px]">expand_more</span>
              </button>

              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-surface-container-lowest rounded-xl shadow-ambient border border-surface-variant/50 py-2 z-50 animate-fade-in">
                    <div className="px-4 py-2 border-b border-surface-variant/30">
                      <p className="text-sm font-semibold text-on-surface">{user?.email}</p>
                      <p className="text-xs text-primary capitalize">{user?.role?.replace('_', ' ')}</p>
                    </div>
                    <Link
                      href={isBuyer ? '/buyer/dashboard' : '/dashboard'}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-on-surface-variant hover:bg-surface-container-high transition"
                      onClick={() => setProfileOpen(false)}
                    >
                      <span className="material-symbols-outlined text-[18px]">dashboard</span> Dashboard
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-on-surface-variant hover:bg-surface-container-high transition"
                      onClick={() => setProfileOpen(false)}
                    >
                      <span className="material-symbols-outlined text-[18px]">settings</span> Settings
                    </Link>
                    <hr className="my-1 border-surface-variant/30" />
                    <button
                      onClick={() => { signOut(); setProfileOpen(false); }}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-error hover:bg-error-container/20 w-full transition"
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span> Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="font-body text-sm text-primary hover:opacity-80 transition-opacity font-medium px-4 py-2">
                Log In
              </Link>
              <Link href="/register" className="btn-primary btn-sm">
                Get Started
              </Link>
            </>
          )}
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-lg bg-surface-container-low dark:bg-dark-surface-container flex items-center justify-center text-on-surface-variant dark:text-dark-on-surface-variant hover:text-primary transition-colors"
            title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          >
            <span className="material-symbols-outlined text-[20px]">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-primary" onClick={() => setMobileOpen(!mobileOpen)}>
          <span className="material-symbols-outlined">{mobileOpen ? 'close' : 'menu'}</span>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-surface-variant/30 bg-surface animate-fade-in">
          <nav className="px-6 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-3 rounded-lg font-medium ${
                  isActive(link.href) ? 'bg-primary-fixed text-on-primary-fixed-variant' : 'text-on-surface-variant'
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <hr className="my-2 border-surface-variant/30" />
            {isAuthenticated ? (
              <>
                <Link href={isBuyer ? '/buyer/dashboard' : '/dashboard'} className="block px-4 py-3 rounded-lg font-medium text-on-surface-variant" onClick={() => setMobileOpen(false)}>
                  Dashboard
                </Link>
                <button onClick={() => { signOut(); setMobileOpen(false); }} className="block w-full text-left px-4 py-3 rounded-lg font-medium text-error">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block px-4 py-3 rounded-lg font-medium text-on-surface-variant" onClick={() => setMobileOpen(false)}>
                  Log In
                </Link>
                <Link href="/register" className="block px-4 py-3 btn-primary text-center" onClick={() => setMobileOpen(false)}>
                  Get Started
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </nav>
  );
}
