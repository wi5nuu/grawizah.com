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
      <div className="font-display font-bold text-4xl text-primary mb-2 tabular-nums group-hover:scale-110 transition-transform duration-300">{display}</div>
      <div className="font-body text-sm text-on-surface-variant uppercase tracking-wider font-semibold">{label}</div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface overflow-hidden">
      <Navbar />

      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="relative max-w-[1440px] mx-auto px-8 py-20 md:py-32 flex flex-col items-center text-center">
          {/* Animated Floating Orbs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-10 left-[10%] w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-20 right-[15%] w-96 h-96 bg-secondary/8 rounded-full blur-3xl animate-float-delayed" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl animate-float-slow" />
            {/* Orbiting particles */}
            <div className="absolute top-1/3 left-1/2 animate-orbit">
              <div className="w-3 h-3 rounded-full bg-primary/30 blur-[2px]" />
            </div>
            <div className="absolute top-1/3 left-1/2 animate-orbit-reverse">
              <div className="w-2 h-2 rounded-full bg-secondary/30 blur-[1px]" />
            </div>
          </div>

          <div className="relative z-10 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-8 border border-primary/20 animate-bounce-in hover:scale-105 transition-transform cursor-default">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              <span>Trusted by 500+ Global Enterprises</span>
              <div className="live-dot ml-1" />
            </div>
          </div>

          <h1 className="font-display font-extrabold text-5xl md:text-7xl leading-tight mb-6 max-w-4xl text-on-surface tracking-tight relative z-10 animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'backwards' }}>
            Pre-Transaction <span className="gradient-text">Intelligence</span> for Global Trade
          </h1>

          <p className="font-body text-xl md:text-2xl text-on-surface-variant mb-10 max-w-2xl leading-relaxed relative z-10 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'backwards' }}>
            Mitigate risk and discover verified partners with our sophisticated data platform. Make decisions backed by deep market intelligence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto relative z-10 animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'backwards' }}>
            <Link href="/register" className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-on-primary rounded-xl font-bold text-lg hover:scale-[1.04] hover:shadow-xl transition-all duration-300 relative overflow-hidden group" style={{ boxShadow: '0 8px 24px rgba(109,40,217,0.25)' }}>
              <span className="relative z-10 flex items-center justify-center gap-2">
                Start Free Trial
                <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </Link>
            <Link href="/catalog" className="px-8 py-4 bg-surface text-primary border-2 border-primary rounded-xl font-bold text-lg hover:bg-primary hover:text-on-primary transition-all duration-300 group flex items-center justify-center gap-2">
              View Catalog
              <span className="material-symbols-outlined text-[20px] group-hover:rotate-90 transition-transform duration-300">explore</span>
            </Link>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="max-w-[1440px] mx-auto px-8 py-12 mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 bg-surface-container-lowest border border-surface-variant/30 rounded-2xl p-8 hover:shadow-lg transition-shadow duration-500" style={{ boxShadow: '0 4px 24px rgba(109,40,217,0.04)' }}>
            <AnimatedStat value="2.4M+" label="Verified Suppliers" />
            <AnimatedStat value="$50B" label="Trade Volume" />
            <AnimatedStat value="99.9%" label="Data Accuracy" />
            <AnimatedStat value="150+" label="Countries Covered" />
          </div>
        </section>

        {/* Features Bento Grid */}
        <section className="bg-surface-container-low py-24 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float-slow pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-secondary/5 rounded-full blur-3xl animate-float-delayed pointer-events-none" />

          <div className="max-w-[1440px] mx-auto px-8 relative z-10">
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="font-display font-extrabold text-3xl md:text-4xl text-on-surface mb-4">Unparalleled Market Visibility</h2>
              <p className="font-body text-lg text-on-surface-variant max-w-2xl mx-auto">Everything you need to source, verify, and transact with confidence in the global marketplace.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
              {[
                { icon: 'search_insights', title: 'Deep Tier Discovery', desc: 'Map your entire supply chain down to Tier N. Identify hidden risks and uncover new sourcing opportunities with our proprietary network graphing engine.', large: true, color: 'primary' },
                { icon: 'verified_user', title: 'Instant Verification', desc: 'Automated KYC and AML checks against global registries in milliseconds.', color: 'secondary' },
                { icon: 'monitoring', title: 'Live Market Pricing', desc: 'Real-time commodity and freight pricing indexes to negotiate better terms.', color: 'primary' },
                { icon: 'account_balance', title: 'Trade Finance', desc: 'Seamlessly connect intelligence to your letter of credit workflows.', color: 'secondary' },
                { icon: 'gavel', title: 'Regulatory Compliance Shield', desc: 'Stay ahead of changing tariffs, sanctions, and ESG requirements. Our AI parses global trade legislation to alert you of potential impacts before they happen.', large: true, color: 'primary' },
              ].map((f, i) => (
                <div
                  key={i}
                  className={`${f.large ? 'md:col-span-2' : ''} bg-surface-container-lowest p-8 rounded-2xl border border-surface-variant/30 hover-lift tilt-hover group relative overflow-hidden`}
                  style={{ boxShadow: '0 4px 24px rgba(109,40,217,0.06)' }}
                >
                  {/* Hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-secondary/0 group-hover:from-primary/5 group-hover:to-secondary/3 transition-all duration-700 pointer-events-none" />

                  <div className="relative z-10">
                    <div className={`w-12 h-12 rounded-xl bg-${f.color}/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      <span className={`material-symbols-outlined text-${f.color} text-2xl`}>{f.icon}</span>
                    </div>
                    <h3 className={`font-display font-bold ${f.large ? 'text-2xl' : 'text-xl'} mb-3 text-on-surface group-hover:text-primary transition-colors duration-300`}>{f.title}</h3>
                    <p className="font-body text-on-surface-variant leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-24 px-8">
          <div className="max-w-[1200px] mx-auto bg-gradient-to-br from-primary to-secondary rounded-3xl p-12 text-center text-on-primary relative overflow-hidden group" style={{ boxShadow: '0 16px 48px rgba(83,0,183,0.3)' }}>
            {/* Animated background decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-float-delayed pointer-events-none" />
            <div className="absolute top-1/2 left-1/4 animate-orbit pointer-events-none">
              <div className="w-4 h-4 rounded-full bg-white/20 blur-[2px]" />
            </div>

            <h2 className="font-display font-extrabold text-4xl mb-6 relative z-10">Ready to secure your supply chain?</h2>
            <p className="font-body text-xl mb-10 text-on-primary/90 max-w-2xl mx-auto relative z-10">Join industry leaders who trust Grawizah for their global trade intelligence.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
              <Link href="/register" className="px-8 py-4 bg-surface-container-lowest text-primary rounded-xl font-bold text-lg hover:bg-surface hover:scale-105 transition-all duration-300 shadow-lg">
                Get Started Now
              </Link>
              <Link href="#" className="px-8 py-4 bg-transparent border-2 border-surface-container-lowest text-surface-container-lowest rounded-xl font-bold text-lg hover:bg-white/10 transition-all duration-300">
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
