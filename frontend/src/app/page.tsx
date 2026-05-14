'use client';

import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { useEffect, useRef, useState } from 'react';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'supplier' | 'buyer'>('supplier');

  return (
    <div className="min-h-screen flex flex-col bg-surface dark:bg-[#000] text-black dark:text-white selection:bg-primary/30 font-sans tracking-tight transition-colors duration-300 relative overflow-hidden">
      <Navbar />

      {/* Floating Dynamic Orbs (Restored from previous design) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/20 dark:bg-primary/10 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-float-slow" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-secondary/20 dark:bg-[#3b82f6]/10 blur-[150px] mix-blend-multiply dark:mix-blend-screen animate-float-delayed" />
        <div className="absolute top-[40%] left-[60%] w-[40vw] h-[40vw] rounded-full bg-[#8b5cf6]/20 dark:bg-[#8b5cf6]/10 blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-float" />
      </div>

      <main className="flex-grow pt-24 relative z-10">
        {/* Hero Section - Vercel Style */}
        <section className="relative px-6 py-20 md:py-32 flex flex-col items-center text-center overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-primary/10 to-transparent opacity-50 blur-[120px] pointer-events-none" />
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 dark:bg-[#111] border border-black/5 dark:border-white/10 text-black/60 dark:text-white/60 text-[11px] font-medium tracking-widest mb-8 animate-fade-in">
             <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
             VERIFIED TRADE NETWORK v2.0
          </div>

          <h1 className="text-5xl md:text-8xl font-medium tracking-tighter leading-[0.9] mb-8 animate-fade-in-up">
            Global Trade.<br />
            <span className="text-black/20 dark:text-white/40">Powered by Intelligence.</span>
          </h1>

          <p className="text-lg md:text-xl text-black/50 dark:text-white/50 max-w-2xl mx-auto mb-12 font-normal leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            The essential infrastructure for modern supply chains. Mitigate risk and discover verified partners with our neural data platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <Link href="/register" className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-sm font-semibold text-sm hover:opacity-90 transition-all">
              Start Building Trust
            </Link>
            <Link href="/catalog" className="px-8 py-3 bg-white dark:bg-black text-black dark:text-white border border-black/10 dark:border-white/10 rounded-sm font-semibold text-sm hover:bg-black/5 dark:hover:bg-white/5 transition-all">
              Explore Network
            </Link>
          </div>
        </section>

        {/* Stats Grid - Vercel Boxy Style */}
        <section className="border-t border-black/5 dark:border-white/10 border-b border-black/5 dark:border-white/10 bg-gray-50/50 dark:bg-[#050505]">
          <div className="max-w-[1440px] mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-black/5 dark:divide-white/10">
            {[
              { val: '2.4M+', label: 'Verified Partners' },
              { val: '150+', label: 'Market Jurisdictions' },
              { val: '$50B+', label: 'Analyzed Trade' },
              { val: '99.9%', label: 'SLA Uptime' }
            ].map((stat, i) => (
              <div key={i} className="p-8 md:p-12">
                <div className="text-2xl md:text-3xl font-medium mb-1 tracking-tighter">{stat.val}</div>
                <div className="text-[11px] text-black/40 dark:text-white/40 font-bold uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Dual Role Benefits - Split Innovation */}
        <section className="py-24 px-6 max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
            <h2 className="text-3xl md:text-4xl font-medium tracking-tight max-w-md">One Platform. Specialized Portals.</h2>
            <div className="flex p-1 bg-gray-50 dark:bg-[#111] border border-black/5 dark:border-white/10 rounded-sm">
               <button onClick={() => setActiveTab('supplier')} className={`px-6 py-2 text-xs font-bold transition-all ${activeTab === 'supplier' ? 'bg-white dark:bg-white text-black dark:text-black shadow-lg' : 'text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white'}`}>FOR SUPPLIERS</button>
               <button onClick={() => setActiveTab('buyer')} className={`px-6 py-2 text-xs font-bold transition-all ${activeTab === 'buyer' ? 'bg-white dark:bg-white text-black dark:text-black shadow-lg' : 'text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white'}`}>FOR BUYERS</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-1 px-1 bg-black/5 dark:bg-white/10 border border-black/5 dark:border-white/10 rounded-sm overflow-hidden">
            {activeTab === 'supplier' ? (
              <>
                <div className="bg-white dark:bg-[#050505] p-10 flex flex-col justify-between group">
                  <div>
                    <span className="material-symbols-outlined text-primary mb-6">insights</span>
                    <h3 className="text-2xl font-medium mb-4">Sell with Certainty</h3>
                    <p className="text-black/50 dark:text-white/50 text-sm leading-relaxed mb-8">Access AI-powered market benchmarking and optimize your listings to capture high-value global buyers.</p>
                  </div>
                  <ul className="space-y-3 text-xs text-black/60 dark:text-white/60">
                    <li className="flex items-center gap-2"><span className="w-1 h-1 bg-primary" /> Verified Trust Passport v2</li>
                    <li className="flex items-center gap-2"><span className="w-1 h-1 bg-primary" /> Competitive Pricing Intelligence</li>
                    <li className="flex items-center gap-2"><span className="w-1 h-1 bg-primary" /> Global Visibility Boost</li>
                  </ul>
                </div>
                <div className="bg-gray-50 dark:bg-[#0a0a0a] p-1 flex items-center justify-center">
                   <div className="w-full aspect-square bg-white dark:bg-[#000] border border-black/5 dark:border-white/5 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 opacity-10 dark:opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                      <div className="z-10 p-6 border border-black/5 dark:border-white/10 bg-gray-50 dark:bg-[#111] font-mono text-[10px] text-primary">
                         {`// AI Optimizer Running...\nMATCH_FOUND: 42 Buyers\nCONFIDENCE: 98.4%\nROI_ESTIMATE: +12.4%`}
                      </div>
                   </div>
                </div>
              </>
            ) : (
              <>
                <div className="bg-gray-50 dark:bg-[#0a0a0a] p-1 flex items-center justify-center order-2 md:order-1">
                   <div className="w-full aspect-square bg-white dark:bg-[#000] border border-black/5 dark:border-white/5 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 opacity-10 dark:opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                      <div className="z-10 p-6 border border-black/5 dark:border-white/10 bg-gray-50 dark:bg-[#111] font-mono text-[10px] text-emerald-600 dark:text-emerald-400">
                         {`// Sourcing Engine...\nSUPPLIER_VERIFIED: True\nRISK_SCORE: Low (1.2)\nDELIVERY_SYNC: Optimal`}
                      </div>
                   </div>
                </div>
                <div className="bg-white dark:bg-[#050505] p-10 flex flex-col justify-between group order-1 md:order-2">
                  <div>
                    <span className="material-symbols-outlined text-emerald-500 mb-6">verified</span>
                    <h3 className="text-2xl font-medium mb-4">Source with Confidence</h3>
                    <p className="text-black/50 dark:text-white/50 text-sm leading-relaxed mb-8">Identify rigorously vetted suppliers with our risk-scoring engine and real-time trade history verification.</p>
                  </div>
                  <ul className="space-y-3 text-xs text-black/60 dark:text-white/60">
                    <li className="flex items-center gap-2"><span className="w-1 h-1 bg-emerald-500" /> Real-time Compliance Checks</li>
                    <li className="flex items-center gap-2"><span className="w-1 h-1 bg-emerald-500" /> Fraud Prevention Protocol</li>
                    <li className="flex items-center gap-2"><span className="w-1 h-1 bg-emerald-500" /> Supply Chain Transparency</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Feature Box Grid - Vercel Minimalist */}
        <section className="py-24 border-t border-black/5 dark:border-white/10">
          <div className="max-w-[1200px] mx-auto px-6">
            <h2 className="text-center text-xs font-bold uppercase tracking-[0.4em] text-black/40 dark:text-white/40 mb-16">ENGINEERED FOR SCALE</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-1 px-1 bg-black/5 dark:bg-white/10 border border-black/5 dark:border-white/10 rounded-sm">
              {[
                { icon: 'hub', title: 'Network Intelligence', desc: 'Visualize complex supply chains with node-based mapping tools to identify vulnerabilities.' },
                { icon: 'bolt', title: 'Neural Matching', desc: 'Instant partner discovery using our high-performance AI-driven trade matching engine.' },
                { icon: 'shield_lock', title: 'Security Standard', desc: 'Enterprise-grade encryption and verifiable documentation for cross-border transactions.' },
                { icon: 'translate', title: 'Global Translation', desc: 'Real-time multi-language translation for seamless international communication.' },
                { icon: 'monitoring', title: 'Strategic Analytics', desc: 'Data-backed forecasting to stay ahead of market shifts and supply disruptions.' },
                { icon: 'api', title: 'Native API', desc: 'Integrate Grawizah Intelligence directly into your existing ERP and logistics stack.' },
              ].map((f, i) => (
                <div key={i} className="bg-white dark:bg-[#050505] p-8 hover:bg-gray-50 dark:hover:bg-[#0a0a0a] transition-all">
                   <span className="material-symbols-outlined text-black/40 dark:text-white/40 mb-6 group-hover:text-primary">{f.icon}</span>
                   <h4 className="text-sm font-bold mb-3 tracking-wide uppercase">{f.title}</h4>
                   <p className="text-[13px] text-black/40 dark:text-white/40 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Innovation Section - Network Map Preview */}
        <section className="py-24 bg-gray-50/50 dark:bg-[#050505]">
          <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
             <div>
               <h2 className="text-4xl font-medium tracking-tight mb-6 text-black dark:text-white">Visibility is Intelligence.</h2>
               <p className="text-black/50 dark:text-white/50 text-base leading-relaxed mb-8 font-normal">Our interactive Network Intelligence Map allows you to visualize your entire supply chain, identifying bottlenecks and alternative routing in a single, beautiful interface.</p>
               <Link href="/dashboard/intelligence" className="text-sm font-bold text-black dark:text-white border-b border-black/20 dark:border-white/20 pb-1 hover:border-black dark:hover:border-white transition-all">
                 VIEW NETWORK DEMO →
               </Link>
             </div>
             <div className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 p-1 aspect-video rounded-sm overflow-hidden relative group">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-full h-full bg-white dark:bg-[#000] flex flex-col">
                   <div className="h-6 bg-gray-100 dark:bg-[#111] border-b border-black/5 dark:border-white/10 flex items-center px-3 gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500/50" />
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                   </div>
                   <div className="flex-1 flex items-center justify-center overflow-hidden">
                      {/* Simple SVG Mock for the Map */}
                      <svg width="200" height="150" viewBox="0 0 200 150">
                         <circle cx="100" cy="75" r="4" fill="#6d28d9" />
                         <circle cx="50" cy="40" r="2" fill="currentColor" opacity="0.3" />
                         <circle cx="150" cy="110" r="2" fill="currentColor" opacity="0.3" />
                         <line x1="100" y1="75" x2="50" y2="40" stroke="#6d28d9" strokeWidth="0.5" opacity="0.4" />
                         <line x1="100" y1="75" x2="150" y2="110" stroke="#6d28d9" strokeWidth="0.5" opacity="0.4" />
                      </svg>
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* Professional Footer CTA */}
        <section className="py-24 border-t border-black/5 dark:border-white/10 text-center">
           <h2 className="text-4xl md:text-6xl font-medium tracking-tighter mb-12 text-black dark:text-white">Secure the Future.</h2>
           <Link href="/register" className="px-12 py-4 bg-black dark:bg-white text-white dark:text-black font-black tracking-widest text-xs uppercase hover:opacity-90 transition-all">
             GET STARTED NOW
           </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
