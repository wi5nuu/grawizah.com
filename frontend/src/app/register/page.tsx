'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function RegisterPage() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('supplier');
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return;
    setLoading(true);
    try {
      await signUp(email, password);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-surface">
      {/* Left Panel - Brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-secondary via-primary to-primary-container relative overflow-hidden items-center justify-center p-16">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute bottom-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute top-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 text-center text-white max-w-lg">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-8 backdrop-blur-sm">
            <span className="text-4xl font-extrabold text-white">G</span>
          </div>
          <h2 className="text-4xl font-display font-extrabold mb-4">Join Grawizah</h2>
          <p className="text-lg text-white/80 leading-relaxed">Start your journey in global trade intelligence. Get verified, get discovered, get trading.</p>
          <div className="mt-12 space-y-4">
            {[
              { icon: 'verified_user', text: 'Instant supplier verification' },
              { icon: 'insights', text: 'AI-powered market intelligence' },
              { icon: 'public', text: 'Connect with buyers in 150+ countries' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3 text-left bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <span className="material-symbols-outlined text-primary-fixed">{item.icon}</span>
                <span className="text-white/90 text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link href="/" className="text-2xl font-display font-extrabold gradient-text mb-2 block lg:hidden">Grawizah</Link>
          <h1 className="text-3xl font-display font-bold text-on-surface mb-2">Create Account</h1>
          <p className="text-on-surface-variant mb-8">Start your global trade journey today.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selector */}
            <div>
              <label className="block text-sm font-medium text-on-surface mb-2">I am a</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'supplier', icon: 'factory', label: 'Supplier' },
                  { value: 'buyer', icon: 'shopping_cart', label: 'Buyer' },
                ].map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-semibold transition-all ${
                      role === r.value
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-surface-variant text-on-surface-variant hover:border-outline'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">{r.icon}</span> {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface mb-2">Company Name</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">business</span>
                <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="input-field pl-10" placeholder="Your Company Ltd." />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-2">Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">mail</span>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field pl-10" placeholder="you@company.com" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" placeholder="••••••••" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">Confirm</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input-field" placeholder="••••••••" required />
              </div>
            </div>

            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" className="rounded border-outline-variant text-primary focus:ring-primary mt-0.5" required />
              <span className="text-sm text-on-surface-variant">I agree to the <Link href="#" className="text-primary hover:underline">Terms of Service</Link> and <Link href="#" className="text-primary hover:underline">Privacy Policy</Link></span>
            </label>

            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2" style={{ boxShadow: '0 8px 24px rgba(109,40,217,0.25)' }}>
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-on-surface-variant text-sm mt-8">
            Already have an account? <Link href="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
