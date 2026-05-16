'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types';

export default function RegisterPage() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'supplier' | 'buyer'>('supplier');
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const backendRole = role === 'supplier' ? UserRole.FREE_TRADER : UserRole.BUYER;
      await signUp(email, password, backendRole);
      router.push('/login?registered=true');
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-surface">
      {/* Left Panel - Dynamic Brand Experience */}
      <div className={`hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-16 transition-all duration-700 ${
        role === 'supplier' 
          ? 'bg-gradient-to-br from-primary via-[#5300b7] to-primary-container' 
          : 'bg-gradient-to-br from-[#0284c7] via-[#0369a1] to-[#065f46]'
      }`}>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className={`absolute bottom-10 left-10 w-72 h-72 rounded-full blur-3xl transition-colors duration-700 ${role === 'supplier' ? 'bg-white/10' : 'bg-emerald-400/10'}`} />
          <div className={`absolute top-20 right-10 w-96 h-96 rounded-full blur-3xl transition-colors duration-700 ${role === 'supplier' ? 'bg-white/5' : 'bg-blue-400/5'}`} />
        </div>
        
        <div className="relative z-10 text-center text-white max-w-lg animate-fade-in" key={role}>
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-8 backdrop-blur-md overflow-hidden shadow-xl border border-white/30">
            <img src="/images/android-chrome-192x192.png" alt="Grawizah Logo" className="w-14 h-14 object-contain drop-shadow-md" />
          </div>
          
          <h2 className="text-4xl font-display font-black mb-4 tracking-tight">
            {role === 'supplier' ? 'Sell Smarter with Intelligence' : 'Source Better with Trust'}
          </h2>
          <p className="text-lg text-white/80 leading-relaxed font-medium">
            {role === 'supplier' 
              ? 'Join 2.4M+ global suppliers using AI to optimize listings and track competition.' 
              : 'Find verified global partners with AI-backed reliability scoring and secure networking.'}
          </p>
          
          <div className="mt-12 space-y-4">
            {(role === 'supplier' ? [
              { icon: 'insights', text: 'AI-powered market benchmarking' },
              { icon: 'verified', text: 'Get your Grawizah Trust Passport' },
              { icon: 'auto_awesome', text: 'Smart matching with global buyers' },
            ] : [
              { icon: 'search', text: 'Advanced neural supplier discovery' },
              { icon: 'security', text: 'Verified trade history & compliance' },
              { icon: 'hub', text: 'Global supply chain network map' },
            ]).map((item) => (
              <div key={item.text} className="flex items-center gap-4 text-left bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 hover:bg-white/15 transition-colors">
                <span className={`material-symbols-outlined ${role === 'supplier' ? 'text-purple-300' : 'text-emerald-300'}`}>{item.icon}</span>
                <span className="text-white/90 text-sm font-bold tracking-tight">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-dark-surface">
        <div className="w-full max-w-md">
          <Link href="/" className="text-2xl font-display font-black gradient-text mb-6 block lg:hidden">Grawizah</Link>
          <div className="mb-8">
            <h1 className="text-3xl font-display font-black text-on-surface mb-2">
              {role === 'supplier' ? 'Become a Supplier' : 'Join as a Buyer'}
            </h1>
            <p className="text-on-surface-variant font-medium">
              {role === 'supplier' 
                ? 'Join our global intelligence network and sell smarter.' 
                : 'Access verified supply chains and source with confidence.'}
            </p>
          </div>

          {error && (
            <div className="bg-error-container text-on-error-container p-4 rounded-2xl mb-6 text-sm flex items-center gap-2 border border-error/10 animate-shake">
              <span className="material-symbols-outlined text-[20px]">error</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selector */}
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Register as</label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: 'supplier', icon: 'factory', label: 'Supplier' },
                  { value: 'buyer', icon: 'shopping_cart', label: 'Buyer' },
                ].map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value as 'supplier' | 'buyer')}
                    className={`flex items-center justify-center gap-3 py-4 rounded-2xl border-2 font-bold transition-all ${
                      role === r.value
                        ? role === 'supplier' 
                          ? 'border-primary bg-primary/5 text-primary' 
                          : 'border-[#0284c7] bg-[#0284c7]/5 text-[#0284c7]'
                        : 'border-gray-100 text-gray-400 hover:border-gray-200'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[22px]">{r.icon}</span> {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-dark-on-surface mb-2">Company Name</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">business</span>
                  <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-100 dark:border-dark-surface-variant/30 bg-gray-50 dark:bg-dark-surface-container focus:ring-2 focus:ring-primary focus:outline-none transition-all" placeholder="Your Company Ltd." />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-dark-on-surface mb-2">Email Address</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">mail</span>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-100 dark:border-dark-surface-variant/30 bg-gray-50 dark:bg-dark-surface-container focus:ring-2 focus:ring-primary focus:outline-none transition-all" placeholder="you@company.com" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-dark-on-surface mb-2">Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-100 dark:border-dark-surface-variant/30 bg-gray-50 dark:bg-dark-surface-container focus:ring-2 focus:ring-primary focus:outline-none transition-all" placeholder="••••••••" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-dark-on-surface mb-2">Confirm</label>
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-100 dark:border-dark-surface-variant/30 bg-gray-50 dark:bg-dark-surface-container focus:ring-2 focus:ring-primary focus:outline-none transition-all" placeholder="••••••••" required />
                </div>
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input type="checkbox" className="rounded-md border-gray-200 text-primary focus:ring-primary mt-1" required />
              <span className="text-xs text-gray-500 dark:text-dark-on-surface-variant leading-relaxed">
                By creating an account, you agree to Grawizah&apos;s <Link href="#" className="text-primary font-bold hover:underline">Terms of Service</Link> and <Link href="#" className="text-primary font-bold hover:underline">Privacy Policy</Link>.
              </span>
            </label>

            <button 
              type="submit" 
              disabled={loading} 
              className={`w-full py-4 rounded-2xl font-black text-white shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 ${
                role === 'supplier' 
                  ? 'bg-primary shadow-primary/20' 
                  : 'bg-[#0284c7] shadow-blue-500/20'
              }`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {role === 'supplier' ? 'Start Selling' : 'Start Sourcing'} 
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm mt-8 font-medium text-gray-500">
            Already have an account? <Link href="/login" className="text-primary font-black hover:underline">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
