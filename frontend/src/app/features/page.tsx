'use client';

import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

const features = [
  { icon: 'hub', title: 'Global Network Mapping', desc: 'Visualize complex supply chains with our interactive node-based mapping tool. Identify vulnerabilities, discover alternative routing, and optimize your global logistics network in real-time.', large: true, color: 'primary', hasChart: true },
  { icon: 'monitoring', title: 'Predictive Analytics', desc: 'Leverage AI-driven forecasting models to predict market trends, demand fluctuations, and potential supply chain disruptions before they occur.', color: 'secondary', badge: 'AI Powered' },
  { icon: 'policy', title: 'Compliance Engine', desc: 'Automated tariff calculation, trade restriction checks, and documentation generation to ensure full compliance across global borders.', color: 'tertiary' },
  { icon: 'currency_exchange', title: 'Multi-Currency Settlements', desc: 'Execute transactions seamlessly in over 50 currencies with real-time exchange rates and minimized conversion fees.', color: 'primary' },
  { icon: 'verified_user', title: 'Supplier Verification', desc: 'Access our rigorously vetted directory of global suppliers, complete with risk scores, financial health metrics, and audit histories.', color: 'secondary' },
  { icon: 'api', title: 'Enterprise API Access', desc: 'Integrate Grawizah\'s powerful data streams directly into your existing ERP, CRM, or custom internal systems with our robust RESTful API.', large: true, color: 'primary', hasCode: true },
  { icon: 'inventory_2', title: 'Inventory Sync', desc: 'Real-time synchronization across multiple warehouses globally, ensuring accurate stock levels and preventing overselling.', color: 'tertiary' },
  { icon: 'support_agent', title: 'Dedicated Trade Desk', desc: '24/7 access to our team of international trade experts to assist with complex negotiations, customs disputes, or logistics emergencies.', color: 'primary' },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background">
      <Navbar />

      <main className="flex-grow pt-24 pb-16">
        {/* Hero Section */}
        <section className="max-w-[1440px] mx-auto px-8 md:px-16 pt-16 pb-20 text-center">
          <h1 className="text-5xl md:text-6xl font-display font-extrabold text-on-background mb-6 tracking-tight">Platform Features</h1>
          <p className="text-xl text-on-surface-variant max-w-2xl mx-auto font-body leading-relaxed">
            Discover the powerful tools that make Grawizah the leading platform for global trade intelligence and seamless commerce operations.
          </p>
        </section>

        {/* Features Grid (Bento Style) */}
        <section className="max-w-[1440px] mx-auto px-8 md:px-16 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className={`${f.large ? 'col-span-1 md:col-span-2 lg:col-span-2' : ''} bg-surface-container-lowest rounded-[16px] border border-surface-variant p-8 shadow-ambient hover:shadow-ambient-hover hover:-translate-y-1 transition-all duration-300 flex flex-col ${f.large && f.hasCode ? 'md:flex-row gap-8 items-center' : ''} relative overflow-hidden group`}
              >
                {f.large && !f.hasCode && (
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-primary/10 transition-colors duration-500"></div>
                )}
                <div className={`relative z-10 flex flex-col ${f.large && f.hasCode ? 'flex-1' : 'h-full'}`}>
                  <div className={`w-${f.large ? '12' : '10'} h-${f.large ? '12' : '10'} rounded-xl bg-${f.color}/10 flex items-center justify-center mb-${f.large ? '6' : '5'}`}>
                    <span className={`material-symbols-outlined text-${f.color} text-${f.large ? '2xl' : 'xl'}`}>{f.icon}</span>
                  </div>
                  <h3 className={`text-${f.large ? '2xl' : 'xl'} font-headline font-bold text-on-background mb-3`}>{f.title}</h3>
                  <p className={`text-on-surface-variant ${f.large ? '' : 'text-sm'} font-body ${f.large && !f.hasCode ? 'mb-6' : ''} flex-grow`}>{f.desc}</p>
                  {f.badge && (
                    <div className="flex items-center gap-2 mt-auto">
                      <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">{f.badge}</span>
                    </div>
                  )}
                  {f.hasCode && (
                    <Link href="#" className="text-primary font-semibold text-sm hover:underline inline-flex items-center mt-4">
                      View Documentation <span className="material-symbols-outlined text-sm ml-1">arrow_forward</span>
                    </Link>
                  )}
                  {f.hasChart && (
                    <div className="mt-auto h-32 rounded-lg bg-surface-container border border-surface-variant/50 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-tr from-surface-container to-primary/5"></div>
                      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-primary/10 to-transparent"></div>
                    </div>
                  )}
                </div>
                {f.hasCode && (
                  <div className="w-full md:w-1/2 h-32 bg-surface-container rounded-lg border border-surface-variant flex items-center justify-center relative overflow-hidden">
                    <div className="font-mono text-xs text-on-surface-variant/70 p-4 w-full h-full opacity-50 absolute inset-0">
                      {'{ "status": 200, "data": { "nodes": 142, "edges": 305 }, "message": "Success" }'}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* CTA Banner */}
        <section className="max-w-[1200px] mx-auto px-8 md:px-16 mb-24">
          <div className="bg-gradient-to-br from-primary-container to-secondary rounded-[24px] p-12 md:p-16 text-center relative overflow-hidden shadow-ambient">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-on-primary mb-4">Ready to optimize your global trade?</h2>
              <p className="text-on-primary-container text-lg mb-8 max-w-2xl mx-auto font-body">
                Join thousands of enterprises already using Grawizah to streamline their operations, reduce risks, and discover new market opportunities.
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <Link href="/register" className="bg-white text-primary px-8 py-3 rounded-lg font-bold hover:bg-surface transition-colors shadow-lg w-full sm:w-auto text-center">
                  Start Free
                </Link>
                <Link href="#" className="bg-transparent border border-white/30 text-white px-8 py-3 rounded-lg font-bold hover:bg-white/10 transition-colors w-full sm:w-auto text-center">
                  Request Demo
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
