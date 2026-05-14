'use client';

import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { useEffect, useState } from 'react';
import { ArrowRight, ShieldCheck, Globe, Zap, BarChart3, Database, MessageSquare } from 'lucide-react';

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] dark:bg-dark-background text-on-surface dark:text-dark-on-surface selection:bg-primary/20 font-sans antialiased transition-colors duration-500 overflow-x-hidden">
      <Navbar />

      <main className="flex-grow pt-16 md:pt-20">
        {/* Hero Section - Refined Typography */}
        <section className="relative px-6 py-16 md:py-32 lg:py-40 flex flex-col items-center text-center max-w-[1200px] mx-auto overflow-hidden">
          {/* Subtle Background Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[400px] md:h-[600px] bg-gradient-to-b from-primary/5 to-transparent opacity-60 blur-[120px] pointer-events-none" />
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-surface-variant/30 text-primary dark:text-dark-primary text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase mb-8 md:mb-10 animate-fade-in shadow-sm">
             <span className="relative flex h-2 w-2">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
             </span>
             Verified Trade Intelligence v3.0
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-8xl font-display font-semibold tracking-tight leading-[1.1] mb-8 md:mb-10 animate-fade-in-up text-gray-900 dark:text-white">
            The Gateway to <br />
            <span className="text-primary dark:text-dark-primary">Global Enterprise.</span>
          </h1>

          <p className="text-base md:text-xl lg:text-2xl text-gray-500 dark:text-dark-on-surface-variant max-w-3xl mx-auto mb-10 md:mb-14 font-medium leading-relaxed animate-fade-in-up px-2" style={{ animationDelay: '0.1s' }}>
            Institutional-grade trade infrastructure for modern supply chains. Discover, verify, and connect with global partners through real-time data orchestration.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 w-full sm:w-auto animate-fade-in-up px-4" style={{ animationDelay: '0.2s' }}>
            <Link href="/register" className="px-8 md:px-10 py-3.5 md:py-4 bg-primary text-white dark:bg-dark-primary dark:text-dark-on-primary rounded-xl font-bold text-sm md:text-base hover:scale-105 transition-all shadow-lg flex items-center justify-center gap-2">
              Get Started <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/catalog" className="px-8 md:px-10 py-3.5 md:py-4 bg-white dark:bg-dark-surface text-gray-900 dark:text-white border border-gray-200 dark:border-dark-surface-variant/30 rounded-xl font-bold text-sm md:text-base hover:bg-gray-50 dark:hover:bg-dark-surface-container transition-all shadow-sm flex items-center justify-center gap-2">
              Explore Catalog <Globe className="w-5 h-5" />
            </Link>
          </div>
        </section>

        {/* Brand/Trust Section - Responsive */}
        <section className="py-12 md:py-20 border-y border-gray-100 dark:border-dark-surface-variant/20 bg-white/50 dark:bg-dark-surface/30">
          <div className="max-w-[1200px] mx-auto px-6">
            <p className="text-center text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] text-gray-400 dark:text-gray-500 mb-8 md:mb-12">Empowering Global Trade Excellence</p>
            <div className="flex flex-wrap justify-center items-center gap-x-8 md:gap-x-16 gap-y-6 md:gap-y-10 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
               <div className="flex items-center gap-2 font-display font-bold text-lg md:text-2xl whitespace-nowrap">ISO CERTIFIED</div>
               <div className="flex items-center gap-2 font-display font-bold text-lg md:text-2xl whitespace-nowrap">TÜV SÜD</div>
               <div className="flex items-center gap-2 font-display font-bold text-lg md:text-2xl whitespace-nowrap">RSPO</div>
               <div className="flex items-center gap-2 font-display font-bold text-lg md:text-2xl whitespace-nowrap">OEKO-TEX</div>
            </div>
          </div>
        </section>

        {/* Feature 1: The Catalog Showcase - Responsive */}
        <section className="py-20 md:py-28 px-6 max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1">
               <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 md:mb-8">
                 <Database className="w-6 h-6 md:w-7 md:h-7 text-primary" />
               </div>
               <h2 className="text-3xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-4 md:mb-6 leading-tight">Vetted Supplier <br/>Discovery Engine.</h2>
               <p className="text-base md:text-lg text-gray-500 dark:text-dark-on-surface-variant mb-8 md:mb-10 leading-relaxed font-medium">
                 Navigate the global marketplace with sub-second precision. Our intelligent catalog filters through thousands of verified manufacturers.
               </p>
               <ul className="space-y-4 md:space-y-5 mb-8 md:mb-10">
                 {[
                   "Automated Credential Verification (ACV)",
                   "Real-time Production Capacity Audit",
                   "Export Quality Assurance Matrix"
                 ].map((item, i) => (
                   <li key={i} className="flex items-center gap-3 md:gap-4">
                      <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600">
                        <ShieldCheck className="w-3 h-3 md:w-4 md:h-4" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 font-bold text-xs md:text-sm">{item}</span>
                   </li>
                 ))}
               </ul>
               <Link href="/catalog" className="inline-flex items-center gap-2 text-primary dark:text-dark-primary font-black text-xs md:text-sm uppercase tracking-widest hover:gap-4 transition-all">
                 View Catalog Infrastructure <ArrowRight className="w-4 h-4" />
               </Link>
            </div>
            <div className="order-1 lg:order-2 bg-white dark:bg-dark-surface p-2 rounded-2xl shadow-xl md:shadow-2xl border border-gray-100 dark:border-dark-surface-variant/30 lg:rotate-2 hover:rotate-0 transition-transform duration-700 max-w-lg mx-auto w-full">
               <div className="bg-gray-50 dark:bg-dark-surface-container rounded-xl overflow-hidden aspect-[4/3] relative">
                  <div className="absolute top-3 left-3 right-3 md:top-4 md:left-4 md:right-4 bg-white dark:bg-dark-surface rounded-lg p-3 md:p-4 shadow-lg border border-gray-100 dark:border-dark-surface-variant/20 flex items-center justify-between">
                     <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">N</div>
                        <div>
                           <p className="text-[10px] md:text-[12px] font-black text-gray-900 dark:text-white uppercase">Nexus Engineering</p>
                           <p className="text-[8px] md:text-[10px] text-gray-500 uppercase tracking-tighter font-bold">Germany</p>
                        </div>
                     </div>
                     <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-600 text-[8px] md:text-[10px] font-black rounded uppercase">ACTIVE</span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 md:bottom-4 md:left-4 md:right-4 grid grid-cols-2 gap-2 md:gap-3">
                     <div className="bg-white/90 dark:bg-dark-surface/90 backdrop-blur p-2 md:p-3 rounded-lg border border-white/20">
                        <p className="text-[8px] md:text-[9px] text-gray-500 uppercase font-black mb-0.5 md:mb-1">On-Time Rate</p>
                        <p className="text-lg md:text-xl font-display font-black text-gray-900 dark:text-white">98.5%</p>
                     </div>
                     <div className="bg-white/90 dark:bg-dark-surface/90 backdrop-blur p-2 md:p-3 rounded-lg border border-white/20">
                        <p className="text-[8px] md:text-[9px] text-gray-500 uppercase font-black mb-0.5 md:mb-1">Quality Score</p>
                        <p className="text-lg md:text-xl font-display font-black text-gray-900 dark:text-white">4.9/5</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* Feature 2: The Network Intelligence - Responsive */}
        <section className="py-20 md:py-28 bg-gray-50 dark:bg-dark-surface-container/30 border-y border-gray-100 dark:border-dark-surface-variant/20">
          <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
             <div className="rounded-2xl md:rounded-3xl shadow-2xl border border-gray-200 dark:border-dark-surface-variant/30 relative overflow-hidden group max-w-lg mx-auto w-full order-1 lg:order-1">
                <div className="aspect-[16/10] bg-gray-200 dark:bg-dark-surface-container-low flex items-center justify-center overflow-hidden">
                   <img 
                     src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                     alt="Global Supply Chain Logistics" 
                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />
                </div>
             </div>
             <div className="order-2 lg:order-2">
               <div className="w-12 h-12 md:w-14 md:h-14 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6 md:mb-8">
                 <Globe className="w-6 h-6 md:w-7 md:h-7 text-secondary" />
               </div>
               <h2 className="text-3xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-4 md:mb-6 leading-tight">Supply Chain <br/>Visualization.</h2>
               <p className="text-base md:text-lg text-gray-500 dark:text-dark-on-surface-variant mb-8 md:mb-10 leading-relaxed font-medium">
                 Identify geopolitical risks and alternative sourcing routes in a single interactive dashboard. Monitor global trade flows with institutional-grade data.
               </p>
               <div className="grid grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-10">
                  <div>
                     <p className="text-xl md:text-2xl font-display font-black text-primary dark:text-dark-primary mb-0.5 md:mb-1">150+</p>
                     <p className="text-[9px] md:text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Jurisdictions</p>
                  </div>
                  <div>
                     <p className="text-xl md:text-2xl font-display font-black text-primary dark:text-dark-primary mb-0.5 md:mb-1">$50B+</p>
                     <p className="text-[9px] md:text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Analyzed Flows</p>
                  </div>
               </div>
               <Link href="/dashboard/intelligence" className="inline-flex items-center gap-2 text-secondary dark:text-accent-400 font-black text-xs md:text-sm uppercase tracking-widest hover:gap-4 transition-all">
                 Launch Intelligence Map <BarChart3 className="w-4 h-4" />
               </Link>
             </div>
          </div>
        </section>

        {/* Feature 3: AI Engine - Responsive */}
        <section className="py-20 md:py-28 px-6 max-w-[1200px] mx-auto text-center">
           <div className="max-w-3xl mx-auto mb-12 md:mb-20">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-purple-100 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center mb-6 md:mb-8 mx-auto">
                <Zap className="w-6 h-6 md:w-7 md:h-7 text-purple-600" />
              </div>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-4 md:mb-6 leading-tight">Neural HS Code <br/>Classification.</h2>
              <p className="text-base md:text-lg text-gray-500 dark:text-dark-on-surface-variant leading-relaxed font-medium">
                Our AI engine automatically categorizes products with 99.2% accuracy.
              </p>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[
                { icon: <MessageSquare className="w-5 h-5 md:w-6 md:h-6" />, title: 'Inquiry Assist', desc: 'AI-generated response suggestions for trade negotiations.' },
                { icon: <Zap className="w-5 h-5 md:w-6 md:h-6" />, title: 'Auto-Classification', desc: 'Instant HS Code mapping for 10,000+ categories.' },
                { icon: <BarChart3 className="w-5 h-5 md:w-6 md:h-6" />, title: 'Demand Prediction', desc: 'Forecast buyer demand signals using neural data.' }
              ].map((item, i) => (
                <div key={i} className="bg-white dark:bg-dark-surface p-8 md:p-10 rounded-2xl border border-gray-100 dark:border-dark-surface-variant/30 hover:shadow-lg transition-all text-left">
                   <div className="text-primary dark:text-dark-primary mb-6">{item.icon}</div>
                   <h4 className="text-base md:text-lg font-display font-bold text-gray-900 dark:text-white mb-2 md:mb-3 uppercase tracking-tight">{item.title}</h4>
                   <p className="text-xs md:text-sm text-gray-500 dark:text-dark-on-surface-variant leading-relaxed">{item.desc}</p>
                </div>
              ))}
           </div>
        </section>

        {/* Final CTA - Responsive */}
        <section className="py-24 md:py-40 bg-dark-surface text-white relative overflow-hidden">
           <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
           <div className="max-w-[1200px] mx-auto px-6 text-center relative z-10">
              <h2 className="text-3xl md:text-6xl font-display font-bold tracking-tight mb-8 md:mb-10 leading-tight">
                 Secure the Future <br className="hidden sm:block" /> of Your Supply Chain.
              </h2>
              <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-12 md:mb-16 font-medium px-4">
                 Join the institutional trade network trusted by global manufacturers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center px-6">
                 <Link href="/register" className="w-full sm:w-auto px-10 md:px-12 py-4 md:py-5 bg-white text-dark-surface rounded-xl font-black text-xs md:text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl">
                    Create Account
                 </Link>
                 <Link href="/contact" className="w-full sm:w-auto px-10 md:px-12 py-4 md:py-5 bg-white/5 border border-white/10 text-white rounded-xl font-black text-xs md:text-sm uppercase tracking-widest hover:bg-white/10 transition-all backdrop-blur-sm">
                    Talk to Expert
                 </Link>
              </div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
