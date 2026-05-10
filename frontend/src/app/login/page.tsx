'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-surface">
      {/* Left Panel - Brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-secondary to-primary-container relative overflow-hidden items-center justify-center p-16">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 text-center text-white max-w-lg">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-8 backdrop-blur-sm overflow-hidden">
            <img src="/images/android-chrome-192x192.png" alt="Grawizah Logo" className="w-14 h-14 object-contain drop-shadow-md" />
          </div>
          <h2 className="text-4xl font-display font-extrabold mb-4">Welcome to Grawizah</h2>
          <p className="text-lg text-white/80 leading-relaxed">Pre-transaction intelligence for global trade. Make smarter decisions backed by deep market data.</p>
          <div className="mt-12 grid grid-cols-3 gap-6 text-center">
            {[{ v: '2.4M+', l: 'Suppliers' }, { v: '150+', l: 'Countries' }, { v: '99.9%', l: 'Accuracy' }].map(s => (
              <div key={s.l} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-2xl font-bold">{s.v}</p>
                <p className="text-xs text-white/70 mt-1">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link href="/" className="text-2xl font-display font-extrabold gradient-text mb-2 block lg:hidden">Grawizah</Link>
          <h1 className="text-3xl font-display font-bold text-on-surface mb-2">Sign In</h1>
          <p className="text-on-surface-variant mb-8">Enter your credentials to access your dashboard.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-2">Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">mail</span>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field pl-10" placeholder="you@company.com" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-2">Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">lock</span>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field pl-10" placeholder="••••••••" required />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-outline-variant text-primary focus:ring-primary" />
                <span className="text-sm text-on-surface-variant">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-primary font-medium hover:underline">Forgot password?</Link>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2" style={{ boxShadow: '0 8px 24px rgba(109,40,217,0.25)' }}>
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-on-surface-variant text-sm mt-8">
            Don&apos;t have an account? <Link href="/register" className="text-primary font-semibold hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
