'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulate API call for password reset
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitted(true);
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
          <h2 className="text-4xl font-display font-extrabold mb-4">Reset Password</h2>
          <p className="text-lg text-white/80 leading-relaxed">Don't worry, it happens to the best of us. Let's get you back to your account.</p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link href="/" className="text-2xl font-display font-extrabold gradient-text mb-2 block lg:hidden">Grawizah</Link>
          <h1 className="text-3xl font-display font-bold text-on-surface mb-2">Forgot Password</h1>
          
          {submitted ? (
            <div className="bg-success-container/20 border border-success/30 rounded-xl p-6 text-center animate-fade-in mb-8">
              <span className="material-symbols-outlined text-success text-4xl mb-2">check_circle</span>
              <h3 className="text-lg font-bold text-on-surface mb-2">Check Your Inbox</h3>
              <p className="text-on-surface-variant text-sm mb-6">
                If an account exists for <strong>{email}</strong>, you will receive password reset instructions.
              </p>
              <Link href="/login" className="btn-primary w-full inline-block">
                Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              <p className="text-on-surface-variant mb-8">Enter the email address associated with your account and we'll send you a link to reset your password.</p>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-2">Email Address</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">mail</span>
                    <input 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      className="input-field pl-10" 
                      placeholder="you@company.com" 
                      required 
                    />
                  </div>
                </div>
                <button 
                  type="submit" 
                  disabled={loading || !email} 
                  className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2" 
                  style={{ boxShadow: '0 8px 24px rgba(109,40,217,0.25)' }}
                >
                  {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Send Reset Link'}
                </button>
              </form>

              <div className="mt-8 text-center">
                <Link href="/login" className="text-sm font-medium text-on-surface-variant hover:text-primary hover:underline flex items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                  Back to Sign In
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
