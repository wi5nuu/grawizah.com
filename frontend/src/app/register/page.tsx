'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types';
import { Globe, Eye, EyeOff, ArrowRight, User, Briefcase, CheckCircle2, Shield, Zap, BarChart3 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'free_trader' | 'buyer'>('free_trader');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await signUp(email, password, role as UserRole);
      router.push(role === 'buyer' ? '/buyer/dashboard' : '/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    { icon: Zap, text: 'AI-powered buyer matching' },
    { icon: Shield, text: 'Verified supplier network' },
    { icon: BarChart3, text: 'Trade intelligence insights' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-1 gradient-bg items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-400/5 rounded-full blur-3xl" />
        <div className="relative text-center text-white max-w-md">
          <div className="w-16 h-16 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-8">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold mb-4">Join Grawizah</h2>
          <p className="text-primary-100 text-lg leading-relaxed mb-8">
            Start discovering global trade opportunities with AI-powered intelligence. Free to get started.
          </p>
          <div className="space-y-3 text-left">
            {benefits.map((b, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-xl px-4 py-3">
                <b.icon className="w-5 h-5 text-accent-300 flex-shrink-0" />
                <span className="text-sm text-white/90">{b.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center space-x-2 mb-10 lg:hidden">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-700 to-accent-500 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-primary-700">Grawizah</span>
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-500 mb-8">Choose your role and get started for free</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2">
              <span className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">!</span>
              {error}
            </div>
          )}

          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setRole('free_trader')}
              className={`flex flex-col items-center gap-2 p-5 rounded-xl border-2 transition-all ${role === 'free_trader'
                  ? 'border-primary-500 bg-primary-50 shadow-md shadow-primary-500/10'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${role === 'free_trader' ? 'bg-primary-100' : 'bg-gray-100'}`}>
                <Briefcase className={`w-6 h-6 ${role === 'free_trader' ? 'text-primary-700' : 'text-gray-400'}`} />
              </div>
              <span className={`text-sm font-semibold ${role === 'free_trader' ? 'text-primary-700' : 'text-gray-600'}`}>Supplier / Trader</span>
              <span className="text-[10px] text-gray-400">Sell & export products</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('buyer')}
              className={`flex flex-col items-center gap-2 p-5 rounded-xl border-2 transition-all ${role === 'buyer'
                  ? 'border-primary-500 bg-primary-50 shadow-md shadow-primary-500/10'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${role === 'buyer' ? 'bg-primary-100' : 'bg-gray-100'}`}>
                <User className={`w-6 h-6 ${role === 'buyer' ? 'text-primary-700' : 'text-gray-400'}`} />
              </div>
              <span className={`text-sm font-semibold ${role === 'buyer' ? 'text-primary-700' : 'text-gray-600'}`}>Buyer</span>
              <span className="text-[10px] text-gray-400">Source & import goods</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="you@company.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="input-field pr-12" placeholder="Min. 8 characters" required minLength={6} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input-field" placeholder="••••••••" required />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 py-3.5">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Create Account <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            Already have an account?{' '}
            <Link href="/login" className="text-primary-700 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
