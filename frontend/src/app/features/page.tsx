'use client';

import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

const features = [
  { icon: 'hub', title: 'Global Network Mapping', desc: 'Visualize complex supply chains with our interactive node-based mapping tool. Identify vulnerabilities, discover alternative routing, and optimize your global logistics network in real-time.', large: true, gradient: 'from-blue-600/20 to-purple-600/20', hasChart: true },
  { icon: 'monitoring', title: 'Predictive Analytics', desc: 'Leverage AI-driven forecasting models to predict market trends, demand fluctuations, and potential supply chain disruptions before they occur.', badge: 'AI Powered', gradient: 'from-emerald-600/20 to-teal-600/20' },
  { icon: 'policy', title: 'Compliance Engine', desc: 'Automated tariff calculation, trade restriction checks, and documentation generation to ensure full compliance across global borders.', gradient: 'from-orange-600/20 to-red-600/20' },
  { icon: 'currency_exchange', title: 'Multi-Currency Settlements', desc: 'Execute transactions seamlessly in over 50 currencies with real-time exchange rates and minimized conversion fees.', gradient: 'from-indigo-600/20 to-blue-600/20' },
  { icon: 'verified_user', title: 'Supplier Verification', desc: 'Access our rigorously vetted directory of global suppliers, complete with risk scores, financial health metrics, and audit histories.', gradient: 'from-pink-600/20 to-rose-600/20' },
  { icon: 'api', title: 'Enterprise API Access', desc: 'Integrate Grawizah\'s powerful data streams directly into your existing ERP, CRM, or custom internal systems with our robust RESTful API.', large: true, gradient: 'from-purple-600/20 to-fuchsia-600/20', hasCode: true },
  { icon: 'inventory_2', title: 'Inventory Sync', desc: 'Real-time synchronization across multiple warehouses globally, ensuring accurate stock levels and preventing overselling.', gradient: 'from-cyan-600/20 to-blue-600/20' },
  { icon: 'support_agent', title: 'Dedicated Trade Desk', desc: '24/7 access to our team of international trade experts to assist with complex negotiations, customs disputes, or logistics emergencies.', gradient: 'from-amber-600/20 to-orange-600/20' },
];

export default function FeaturesPage() {
  const handleDemoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    alert('Thank you for your interest! A sales representative will contact you shortly to schedule a demo.');
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface dark:bg-[#050505] text-on-surface dark:text-white overflow-hidden font-body selection:bg-primary/30">
      <Navbar />

      <main className="flex-grow pt-24 pb-16 relative">
        {/* Dynamic Global Background Orbs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/20 dark:bg-primary/10 blur-[120px] mix-blend-screen animate-float-slow" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-secondary/20 dark:bg-[#3b82f6]/10 blur-[150px] mix-blend-screen animate-float-delayed" />
          <div className="absolute top-[40%] left-[60%] w-[40vw] h-[40vw] rounded-full bg-[#8b5cf6]/20 dark:bg-[#8b5cf6]/10 blur-[100px] mix-blend-screen animate-float" />
        </div>

        {/* Hero Section */}
        <section className="relative z-10 max-w-[1440px] mx-auto px-8 md:px-16 pt-16 pb-20 text-center animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-display font-extrabold mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
            Platform Features
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-body leading-relaxed">
            Discover the powerful tools that make Grawizah the leading platform for global trade intelligence and seamless commerce operations.
          </p>
        </section>

        {/* Features Grid (Bento Style) */}
        <section className="relative z-10 max-w-[1440px] mx-auto px-8 md:px-16 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className={`${f.large ? 'col-span-1 md:col-span-2 lg:col-span-2' : ''} relative group overflow-hidden bg-white/40 dark:bg-[#151520]/80 backdrop-blur-lg p-8 rounded-[2rem] border border-white/40 dark:border-white/10 hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_40px_rgba(83,0,183,0.1)] flex flex-col ${f.large && f.hasCode ? 'md:flex-row gap-8 items-center' : ''}`}
              >
                {/* Dynamic Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${f.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />
                
                <div className={`relative z-10 flex flex-col ${f.large && f.hasCode ? 'flex-1' : 'flex-grow'}`}>
                  <div className={`w-14 h-14 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                    <span className={`material-symbols-outlined text-transparent bg-clip-text bg-gradient-to-br from-primary to-secondary text-3xl`}>{f.icon}</span>
                  </div>
                  <h3 className={`font-display font-bold ${f.large ? 'text-3xl' : 'text-2xl'} mb-4 text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-primary-400 transition-colors duration-300`}>{f.title}</h3>
                  <p className="font-body text-gray-600 dark:text-gray-400 leading-relaxed flex-grow mb-6">{f.desc}</p>
                  
                  {f.badge && (
                    <div className="mt-auto relative z-10 flex items-center">
                      <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold border border-primary/20">{f.badge}</span>
                    </div>
                  )}
                  {f.hasCode && (
                    <Link href="#" onClick={(e) => { e.preventDefault(); alert('Redirecting to API Documentation...'); }} className="font-semibold text-primary hover:text-primary-400 transition-colors flex items-center gap-1 mt-auto">
                      View Documentation <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                  )}
                  {f.hasChart && (
                    <div className="mt-6 h-32 rounded-xl bg-gradient-to-r from-gray-200 to-gray-100 dark:from-white/5 dark:to-white/10 relative overflow-hidden group-hover:border-primary/30 transition-colors border border-transparent">
                       <div className="absolute inset-0 opacity-20 dark:opacity-40" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '16px 16px' }} />
                       <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-white dark:from-[#151520] to-transparent" />
                    </div>
                  )}
                </div>
                {f.hasCode && (
                  <div className="w-full md:w-1/2 mt-6 md:mt-0 bg-[#0d0d12] border border-white/10 rounded-xl p-4 flex items-center justify-center relative overflow-hidden group-hover:border-primary/30 transition-colors">
                    <pre className="font-mono text-xs text-gray-400 w-full whitespace-pre-wrap break-all">
                      {'{ "status": 200,\n  "data": {\n    "nodes": 142,\n    "edges": 305\n  },\n  "message": "Success"\n}'}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-24 px-8 relative z-10">
          <div className="max-w-[1200px] mx-auto bg-gradient-to-br from-[#5300b7] via-[#7b2cbf] to-[#3a0ca3] rounded-[3rem] p-16 text-center text-white relative overflow-hidden group shadow-[0_20px_50px_rgba(83,0,183,0.3)]">
            {/* Animated background decorations */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/20 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-1000 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white/10 rounded-full blur-[60px] group-hover:scale-150 transition-transform duration-1000 pointer-events-none" />
            
            <h2 className="font-display font-extrabold text-4xl md:text-5xl mb-6 relative z-10 leading-tight">Ready to optimize your global trade?</h2>
            <p className="font-body text-xl md:text-2xl mb-12 text-white/90 max-w-2xl mx-auto relative z-10 font-light">Join thousands of enterprises already using Grawizah to streamline their operations, reduce risks, and discover new market opportunities.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-6 relative z-10">
              <Link href="/register" className="px-10 py-5 bg-white text-primary rounded-2xl font-bold text-xl hover:bg-gray-50 hover:scale-105 transition-all duration-300 shadow-2xl">
                Start Free
              </Link>
              <button onClick={handleDemoClick} className="px-10 py-5 bg-black/20 backdrop-blur-md border border-white/30 text-white rounded-2xl font-bold text-xl hover:bg-white/20 transition-all duration-300">
                Request Demo
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
