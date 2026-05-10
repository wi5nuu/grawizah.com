'use client';

import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { useEffect, useRef, useState } from 'react';

// Animated counter for stats
function AnimatedStat({ value, label }: { value: string; label: string }) {
  const [display, setDisplay] = useState('0');
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const numMatch = value.match(/[\d.]+/);
    if (!numMatch) { setDisplay(value); return; }
    const end = parseFloat(numMatch[0]);
    const suffix = value.replace(numMatch[0], '');

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const duration = 2000;
        const startTime = performance.now();
        const animate = (currentTime: number) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = eased * end;
          if (end >= 100) setDisplay(Math.floor(current).toLocaleString() + suffix);
          else setDisplay(current.toFixed(1) + suffix);
          if (progress < 1) requestAnimationFrame(animate);
          else setDisplay(value);
        };
        requestAnimationFrame(animate);
      }
    }, { threshold: 0.3 });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-center group cursor-default">
      <div className="font-display font-bold text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-2 tabular-nums group-hover:scale-110 transition-transform duration-500">{display}</div>
      <div className="font-body text-sm text-on-surface-variant dark:text-gray-400 uppercase tracking-wider font-semibold">{label}</div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface dark:bg-[#050505] text-on-surface dark:text-white overflow-hidden font-body selection:bg-primary/30">
      <Navbar />

      <main className="flex-grow pt-24 relative">
        {/* Dynamic Global Background Orbs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/20 dark:bg-primary/10 blur-[120px] mix-blend-screen animate-float-slow" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-secondary/20 dark:bg-[#3b82f6]/10 blur-[150px] mix-blend-screen animate-float-delayed" />
          <div className="absolute top-[40%] left-[60%] w-[40vw] h-[40vw] rounded-full bg-[#8b5cf6]/20 dark:bg-[#8b5cf6]/10 blur-[100px] mix-blend-screen animate-float" />
        </div>

        {/* Hero Section */}
        <section className="relative z-10 max-w-[1440px] mx-auto px-8 py-20 md:py-32 flex flex-col items-center text-center">
          <div className="relative z-10 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 dark:bg-white/5 backdrop-blur-md border border-primary/20 dark:border-white/10 text-primary dark:text-primary-400 font-semibold text-sm mb-8 hover:scale-105 hover:bg-white/10 transition-all cursor-default shadow-[0_0_20px_rgba(83,0,183,0.15)]">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              <span>Trusted by 500+ Global Enterprises</span>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse ml-1" />
            </div>
          </div>

          <h1 className="font-display font-extrabold text-5xl md:text-7xl lg:text-[80px] leading-[1.1] mb-6 max-w-5xl tracking-tight relative z-10 animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'backwards' }}>
            Pre-Transaction <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#9d4edd] to-secondary">Intelligence</span> for Global Trade
          </h1>

          <p className="font-body text-xl md:text-2xl text-on-surface-variant dark:text-gray-300 mb-10 max-w-2xl leading-relaxed relative z-10 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'backwards' }}>
            Mitigate risk and discover verified partners with our sophisticated data platform. Make decisions backed by deep market intelligence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto relative z-10 animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'backwards' }}>
            <Link href="/register" className="px-8 py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:scale-[1.04] hover:shadow-[0_0_40px_rgba(83,0,183,0.5)] transition-all duration-300 relative overflow-hidden group border border-primary-400/50">
              <span className="relative z-10 flex items-center justify-center gap-2">
                Start Free Trial
                <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </Link>
            <Link href="/catalog" className="px-8 py-4 bg-white/5 dark:bg-white/5 backdrop-blur-md text-on-surface dark:text-white border border-surface-variant/50 dark:border-white/10 rounded-2xl font-bold text-lg hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300 group flex items-center justify-center gap-2">
              View Catalog
              <span className="material-symbols-outlined text-[20px] group-hover:rotate-90 transition-transform duration-300 text-primary dark:text-primary-400">explore</span>
            </Link>
          </div>
        </section>

        {/* Glass Stats Bar */}
        <section className="relative z-10 max-w-[1440px] mx-auto px-8 py-12 mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 bg-white/40 dark:bg-[#111118]/60 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-3xl p-10 hover:shadow-2xl hover:border-primary/30 transition-all duration-500">
            <AnimatedStat value="2.4M+" label="Verified Suppliers" />
            <AnimatedStat value="$50B" label="Trade Volume" />
            <AnimatedStat value="99.9%" label="Data Accuracy" />
            <AnimatedStat value="150+" label="Countries Covered" />
          </div>
        </section>

        {/* Features Bento Grid */}
        <section className="relative z-10 py-24 px-8">
          <div className="max-w-[1440px] mx-auto">
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="font-display font-extrabold text-4xl md:text-5xl mb-4 bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">Unparalleled Market Visibility</h2>
              <p className="font-body text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Everything you need to source, verify, and transact with confidence in the global marketplace.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: 'share', title: 'Global Network Mapping', desc: 'Visualize complex supply chains with our interactive node-based mapping tool. Identify vulnerabilities, discover alternative routing, and optimize your global logistics network in real-time.', large: true, gradient: 'from-blue-600/20 to-purple-600/20', img: 'bg-gradient-to-t from-black/80 to-transparent' },
                { icon: 'insights', title: 'Predictive Analytics', desc: 'Leverage AI-driven forecasting models to predict market trends, demand fluctuations, and potential supply chain disruptions before they occur.', large: false, badge: 'AI Powered', gradient: 'from-emerald-600/20 to-teal-600/20' },
                { icon: 'security', title: 'Compliance Engine', desc: 'Automated tariff calculation, trade restriction checks, and documentation generation to ensure full compliance across global borders.', large: false, gradient: 'from-orange-600/20 to-red-600/20' },
                { icon: 'currency_exchange', title: 'Multi-Currency Settlements', desc: 'Execute transactions seamlessly in over 50 currencies with real-time exchange rates and minimized conversion fees.', large: false, gradient: 'from-indigo-600/20 to-blue-600/20' },
                { icon: 'verified_user', title: 'Supplier Verification', desc: 'Access our rigorously vetted directory of global suppliers, complete with risk scores, financial health metrics, and audit histories.', large: false, gradient: 'from-pink-600/20 to-rose-600/20' },
                { icon: 'api', title: 'Enterprise API Access', desc: 'Integrate Grawizah\'s powerful data streams directly into your existing ERP, CRM, or custom internal systems with our robust RESTful API.', large: false, link: 'View Documentation →', gradient: 'from-purple-600/20 to-fuchsia-600/20', code: '{ "status": 200, "data": { "nodes": 142, "edges": 305 }, "message": "Success" }' },
              ].map((f, i) => (
                <div
                  key={i}
                  className={`${f.large ? 'md:col-span-2' : ''} relative group overflow-hidden bg-white/40 dark:bg-[#151520]/80 backdrop-blur-lg p-8 rounded-[2rem] border border-white/40 dark:border-white/10 hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_40px_rgba(83,0,183,0.1)] flex flex-col`}
                >
                  {/* Dynamic Gradient Background on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${f.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />
                  
                  <div className="relative z-10 flex-grow">
                    <div className="w-14 h-14 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                      <span className={`material-symbols-outlined text-transparent bg-clip-text bg-gradient-to-br from-primary to-secondary text-3xl`}>{f.icon}</span>
                    </div>
                    <h3 className={`font-display font-bold ${f.large ? 'text-3xl' : 'text-2xl'} mb-4 text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-primary-400 transition-colors duration-300`}>{f.title}</h3>
                    <p className="font-body text-gray-600 dark:text-gray-400 leading-relaxed">{f.desc}</p>
                  </div>

                  {f.badge && (
                    <div className="mt-8 relative z-10">
                      <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold border border-primary/20">{f.badge}</span>
                    </div>
                  )}
                  {f.link && (
                    <div className="mt-8 relative z-10">
                      <Link href="#" className="font-semibold text-primary hover:text-primary-400 transition-colors flex items-center gap-1">{f.link}</Link>
                    </div>
                  )}
                  {f.code && (
                    <div className="mt-6 bg-[#0d0d12] border border-white/10 rounded-xl p-4 font-mono text-xs text-gray-400 overflow-hidden relative z-10 group-hover:border-primary/30 transition-colors">
                      <pre>{f.code}</pre>
                    </div>
                  )}
                  {f.large && (
                    <div className="mt-8 h-32 rounded-xl bg-gradient-to-r from-gray-200 to-gray-100 dark:from-white/5 dark:to-white/10 relative overflow-hidden">
                       <div className="absolute inset-0 opacity-20 dark:opacity-40" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '16px 16px' }} />
                       <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-white dark:from-[#151520] to-transparent" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-24 px-8 relative z-10">
          <div className="max-w-[1200px] mx-auto bg-gradient-to-br from-[#5300b7] via-[#7b2cbf] to-[#3a0ca3] rounded-[3rem] p-16 text-center text-white relative overflow-hidden group shadow-[0_20px_50px_rgba(83,0,183,0.3)]">
            {/* Animated background decorations */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/20 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-1000 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white/10 rounded-full blur-[60px] group-hover:scale-150 transition-transform duration-1000 pointer-events-none" />
            
            <h2 className="font-display font-extrabold text-5xl md:text-6xl mb-6 relative z-10 leading-tight">Ready to secure your supply chain?</h2>
            <p className="font-body text-xl md:text-2xl mb-12 text-white/90 max-w-2xl mx-auto relative z-10 font-light">Join industry leaders who trust Grawizah for their global trade intelligence.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-6 relative z-10">
              <Link href="/register" className="px-10 py-5 bg-white text-primary rounded-2xl font-bold text-xl hover:bg-gray-50 hover:scale-105 transition-all duration-300 shadow-2xl">
                Get Started Now
              </Link>
              <Link href="#" className="px-10 py-5 bg-black/20 backdrop-blur-md border border-white/30 text-white rounded-2xl font-bold text-xl hover:bg-white/20 transition-all duration-300">
                Contact Sales
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
