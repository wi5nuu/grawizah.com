'use client';

import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <Navbar />

      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="max-w-[1440px] mx-auto px-8 py-20 md:py-32 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-8 border border-primary/20">
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span>Trusted by 500+ Global Enterprises</span>
          </div>
          <h1 className="font-display font-extrabold text-5xl md:text-7xl leading-tight mb-6 max-w-4xl text-on-surface tracking-tight">
            Pre-Transaction <span className="gradient-text">Intelligence</span> for Global Trade
          </h1>
          <p className="font-body text-xl md:text-2xl text-on-surface-variant mb-10 max-w-2xl leading-relaxed">
            Mitigate risk and discover verified partners with our sophisticated data platform. Make decisions backed by deep market intelligence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/register" className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-on-primary rounded-xl font-bold text-lg hover:scale-[1.02] transition-transform" style={{ boxShadow: '0 8px 24px rgba(109,40,217,0.25)' }}>
              Start Free Trial
            </Link>
            <Link href="/catalog" className="px-8 py-4 bg-surface text-primary border-2 border-primary rounded-xl font-bold text-lg hover:bg-surface-container-low transition-colors">
              View Catalog
            </Link>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="max-w-[1440px] mx-auto px-8 py-12 mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 bg-surface-container-lowest border border-surface-variant/30 rounded-2xl p-8" style={{ boxShadow: '0 4px 24px rgba(109,40,217,0.04)' }}>
            {[
              { value: '2.4M+', label: 'Verified Suppliers' },
              { value: '$50B', label: 'Trade Volume' },
              { value: '99.9%', label: 'Data Accuracy' },
              { value: '150+', label: 'Countries Covered' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display font-bold text-4xl text-primary mb-2">{stat.value}</div>
                <div className="font-body text-sm text-on-surface-variant uppercase tracking-wider font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Bento Grid */}
        <section className="bg-surface-container-low py-24">
          <div className="max-w-[1440px] mx-auto px-8">
            <div className="text-center mb-16">
              <h2 className="font-display font-extrabold text-3xl md:text-4xl text-on-surface mb-4">Unparalleled Market Visibility</h2>
              <p className="font-body text-lg text-on-surface-variant max-w-2xl mx-auto">Everything you need to source, verify, and transact with confidence in the global marketplace.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 (Large) */}
              <div className="md:col-span-2 bg-surface-container-lowest p-8 rounded-2xl border border-surface-variant/30 hover:-translate-y-1 transition-all duration-300" style={{ boxShadow: '0 4px 24px rgba(109,40,217,0.06)' }}>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-primary text-2xl">search_insights</span>
                </div>
                <h3 className="font-display font-bold text-2xl mb-3 text-on-surface">Deep Tier Discovery</h3>
                <p className="font-body text-on-surface-variant leading-relaxed">Map your entire supply chain down to Tier N. Identify hidden risks and uncover new sourcing opportunities with our proprietary network graphing engine.</p>
              </div>
              {/* Feature 2 */}
              <div className="bg-surface-container-lowest p-8 rounded-2xl border border-surface-variant/30 hover:-translate-y-1 transition-all duration-300" style={{ boxShadow: '0 4px 24px rgba(109,40,217,0.06)' }}>
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-secondary text-2xl">verified_user</span>
                </div>
                <h3 className="font-display font-bold text-xl mb-3 text-on-surface">Instant Verification</h3>
                <p className="font-body text-on-surface-variant">Automated KYC and AML checks against global registries in milliseconds.</p>
              </div>
              {/* Feature 3 */}
              <div className="bg-surface-container-lowest p-8 rounded-2xl border border-surface-variant/30 hover:-translate-y-1 transition-all duration-300" style={{ boxShadow: '0 4px 24px rgba(109,40,217,0.06)' }}>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-primary text-2xl">monitoring</span>
                </div>
                <h3 className="font-display font-bold text-xl mb-3 text-on-surface">Live Market Pricing</h3>
                <p className="font-body text-on-surface-variant">Real-time commodity and freight pricing indexes to negotiate better terms.</p>
              </div>
              {/* Feature 4 */}
              <div className="bg-surface-container-lowest p-8 rounded-2xl border border-surface-variant/30 hover:-translate-y-1 transition-all duration-300" style={{ boxShadow: '0 4px 24px rgba(109,40,217,0.06)' }}>
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-secondary text-2xl">account_balance</span>
                </div>
                <h3 className="font-display font-bold text-xl mb-3 text-on-surface">Trade Finance Integrations</h3>
                <p className="font-body text-on-surface-variant">Seamlessly connect intelligence to your letter of credit workflows.</p>
              </div>
              {/* Feature 5 (Large) */}
              <div className="md:col-span-2 bg-surface-container-lowest p-8 rounded-2xl border border-surface-variant/30 hover:-translate-y-1 transition-all duration-300" style={{ boxShadow: '0 4px 24px rgba(109,40,217,0.06)' }}>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-primary text-2xl">gavel</span>
                </div>
                <h3 className="font-display font-bold text-2xl mb-3 text-on-surface">Regulatory Compliance Shield</h3>
                <p className="font-body text-on-surface-variant leading-relaxed">Stay ahead of changing tariffs, sanctions, and ESG requirements. Our AI parses global trade legislation to alert you of potential impacts to your specific trade lanes before they happen.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-24 px-8">
          <div className="max-w-[1200px] mx-auto bg-gradient-to-br from-primary to-secondary rounded-3xl p-12 text-center text-on-primary relative overflow-hidden" style={{ boxShadow: '0 16px 48px rgba(83,0,183,0.3)' }}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <h2 className="font-display font-extrabold text-4xl mb-6 relative z-10">Ready to secure your supply chain?</h2>
            <p className="font-body text-xl mb-10 text-on-primary/90 max-w-2xl mx-auto relative z-10">Join industry leaders who trust Grawizah for their global trade intelligence.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
              <Link href="/register" className="px-8 py-4 bg-surface-container-lowest text-primary rounded-xl font-bold text-lg hover:bg-surface transition-colors shadow-lg">
                Get Started Now
              </Link>
              <Link href="#" className="px-8 py-4 bg-transparent border-2 border-surface-container-lowest text-surface-container-lowest rounded-xl font-bold text-lg hover:bg-white/10 transition-colors">
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
