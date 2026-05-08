'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, ChevronDown, Globe, LogOut, User, Settings, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, signOut, isBuyer } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navLinks = [
    { href: '/catalog', label: 'Catalog' },
    { href: '/catalog/suppliers', label: 'Suppliers' },
    { href: '/features', label: 'Features' },
    { href: '/pricing', label: 'Pricing' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <header className="border-b border-gray-200/60 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="w-9 h-9 bg-gradient-to-br from-primary-700 to-accent-500 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-primary-700">Grawizah</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive(link.href)
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:text-primary-700 hover:bg-gray-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Section */}
        <div className="hidden md:flex items-center space-x-3">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {user?.email?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
                  {user?.email?.split('@')[0]}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 animate-fade-in">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{user?.email}</p>
                      <p className="text-xs text-primary-600 capitalize">{user?.role?.replace('_', ' ')}</p>
                    </div>
                    <Link
                      href={isBuyer ? '/buyer/dashboard' : '/dashboard'}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                      onClick={() => setProfileOpen(false)}
                    >
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                      onClick={() => setProfileOpen(false)}
                    >
                      <Settings className="w-4 h-4" /> Settings
                    </Link>
                    <hr className="my-1 border-gray-100" />
                    <button
                      onClick={() => { signOut(); setProfileOpen(false); }}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full transition"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="btn-ghost btn-sm">
                Login
              </Link>
              <Link href="/register" className="btn-primary btn-sm">
                Start Free
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white animate-fade-in">
          <nav className="px-6 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-3 rounded-lg font-medium ${
                  isActive(link.href) ? 'bg-primary-50 text-primary-700' : 'text-gray-600'
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <hr className="my-2" />
            {isAuthenticated ? (
              <>
                <Link href={isBuyer ? '/buyer/dashboard' : '/dashboard'} className="block px-4 py-3 rounded-lg font-medium text-gray-600" onClick={() => setMobileOpen(false)}>
                  Dashboard
                </Link>
                <button onClick={() => { signOut(); setMobileOpen(false); }} className="block w-full text-left px-4 py-3 rounded-lg font-medium text-red-600">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block px-4 py-3 rounded-lg font-medium text-gray-600" onClick={() => setMobileOpen(false)}>
                  Login
                </Link>
                <Link href="/register" className="block px-4 py-3 btn-primary text-center" onClick={() => setMobileOpen(false)}>
                  Start Free
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
