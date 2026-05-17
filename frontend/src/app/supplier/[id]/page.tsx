'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  Star, 
  Mail, 
  MessageSquare, 
  Info, 
  Package, 
  Award,
  Globe,
  Clock,
  Box,
  TrendingUp,
  ArrowRight,
  ChevronRight,
  Loader2,
  Building2,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export default function SupplierProfilePage({ params }: { params: { id: string } }) {
  const { id: supplierId } = params;
  const { user } = useAuth();
  const [company, setCompany] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'certifications'>('overview');
  
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  const [showTradeAssurance, setShowTradeAssurance] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

  useEffect(() => {
    if (!supplierId) return;
    async function fetchData() {
      try {
        setLoading(true);
        const compRes = await fetch(`${API_URL}/api/companies/${supplierId}`);
        if (!compRes.ok) throw new Error("Company not found");
        const compData = await compRes.json();
        setCompany(compData);

        const prodRes = await fetch(`${API_URL}/api/products?company_id=${supplierId}`);
        const prodData = await prodRes.json();
        setProducts(prodData.data || []);
      } catch (err) {
        console.error("Failed to fetch supplier data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [supplierId, API_URL]);

  const handleSendInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to send an inquiry.");
      return;
    }
    setInquiryLoading(true);
    try {
      const token = localStorage.getItem('grawizah_token');
      const res = await fetch(`${API_URL}/api/inquiries`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          supplier_id: supplierId,
          buyer_id: user.id,
          product_id: products[0]?.id || "p_default",
          message: `[Category: ${category}] ${message}`,
          status: 'open',
          source_type: 'email'
        })
      });
      if (res.ok) {
        setInquirySuccess(true);
        setMessage('');
        setCategory('');
        setTimeout(() => setInquirySuccess(false), 5000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setInquiryLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa] dark:bg-dark-background gap-6">
        <Loader2 className="w-12 h-12 animate-spin text-primary opacity-20" />
        <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest animate-pulse">Loading Dossier...</p>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa] dark:bg-dark-background gap-4">
        <h2 className="text-2xl font-display font-bold">Supplier Not Found</h2>
        <Link href="/catalog" className="text-primary hover:underline font-bold">Back to Catalog</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-dark-background font-sans antialiased">
      <Navbar />

      <main className="max-w-[1400px] mx-auto px-6 md:px-10 pt-24 pb-20">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-8">
          <Link href="/catalog" className="hover:text-primary transition-colors">Catalog</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-900 dark:text-white">{company.name}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Main Dossier Content */}
          <div className="flex-1 min-w-0">
            <div className="bg-white dark:bg-dark-surface rounded-xl border border-gray-100 dark:border-dark-surface-variant/20 overflow-hidden">
              
              {/* Profile Hero Header */}
              <div className="relative">
                <div className="h-48 bg-gray-900 relative rounded-t-xl">
                  <div className="absolute inset-0 opacity-20 rounded-t-xl" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                  <div className="absolute -bottom-20 left-10 z-10">
                    <div className="w-40 h-40 bg-white dark:bg-dark-surface border-[8px] border-white dark:border-dark-surface rounded-xl shadow-2xl flex items-center justify-center p-4">
                       <img 
                        src={`https://ui-avatars.com/api/?name=${company.name}&background=6366f1&color=fff&size=256&font-size=0.33`} 
                        alt={company.name} 
                        className="w-full h-full object-contain rounded-xl" 
                       />
                    </div>
                  </div>
                </div>
                
                <div className="pt-28 px-10 pb-10">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                    <div>
                      <div className="flex items-center gap-4 mb-3">
                        <h1 className="text-3xl md:text-5xl font-display font-semibold tracking-tight text-gray-900 dark:text-white leading-tight">{company.name}</h1>
                        {company.verified && (
                          <div className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-800/30">
                            <ShieldCheck className="w-3.5 h-3.5" /> Verified
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-6 text-xs font-bold text-gray-500">
                        <div className="flex items-center gap-2">
                           <MapPin className="w-4 h-4 text-primary" />
                           {company.country}
                        </div>
                        <div className="flex items-center gap-2">
                           <Calendar className="w-4 h-4 text-primary" />
                           Est. {company.year_established || '2005'}
                        </div>
                        <div className="flex items-center gap-2">
                           <Star className="w-4 h-4 text-amber-400 fill-current" />
                           <span className="text-gray-900 dark:text-white">4.9/5</span>
                           <span className="opacity-50">(342 Audits)</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button 
                        onClick={() => setShowInquiryModal(true)}
                        className="px-8 py-3.5 bg-gray-50 dark:bg-dark-surface-container text-gray-900 dark:text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl border border-gray-100 dark:border-dark-surface-variant/20 hover:bg-gray-100 transition-all flex items-center gap-2"
                      >
                        <MessageSquare className="w-4 h-4" /> Message
                      </button>
                      <button 
                        onClick={() => setShowTradeAssurance(true)}
                        className="px-8 py-3.5 bg-primary text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                      >
                        <TrendingUp className="w-4 h-4" /> Secure Trade
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-t border-gray-100 dark:border-dark-surface-variant/20 px-10">
                {(['overview', 'products', 'certifications'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-6 px-4 font-black text-[11px] uppercase tracking-[0.2em] transition-all border-b-2 ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-10 space-y-16">
                {activeTab === 'overview' && (
                  <>
                    <section>
                      <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.25em] mb-8">Executive Summary</h2>
                      <div className="bg-gray-50/50 dark:bg-dark-surface-container/30 rounded-3xl p-10 border border-gray-100 dark:border-dark-surface-variant/10 leading-relaxed text-gray-700 dark:text-gray-300 font-medium">
                        <p className="text-lg">
                          {company.description || `${company.name} is an institutional-grade sourcing partner specialized in global trade orchestration. Based in ${company.country}, they maintain state-of-the-art production facilities and adhere to international quality benchmarks.`}
                        </p>
                      </div>
                    </section>

                    <section>
                      <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.25em] mb-8">Performance Metrics</h2>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                          { label: 'Reliability', value: '99.2%', icon: <Clock className="w-5 h-5" /> },
                          { label: 'Audit Score', value: '4.9/5', icon: <Star className="w-5 h-5" /> },
                          { label: 'Capacity', value: 'Active', icon: <Box className="w-5 h-5" /> },
                          { label: 'Compliance', value: 'Verified', icon: <ShieldCheck className="w-5 h-5" /> }
                        ].map((stat, i) => (
                          <div key={i} className="bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-surface-variant/30 rounded-2xl p-6 shadow-sm">
                             <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center mb-4">{stat.icon}</div>
                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                             <p className="text-xl font-display font-semibold text-gray-900 dark:text-white">{stat.value}</p>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section>
                      <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.25em] mb-8">Enterprise Data</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                        {[
                          { label: 'Business Structure', value: company.business_type || 'Manufacturing & Export' },
                          { label: 'Jurisdiction', value: company.country },
                          { label: 'Employee Node Count', value: '250 - 500' },
                          { label: 'Main Export Corridor', value: 'Global Supply Chain' },
                        ].map((item, i) => (
                          <div key={i} className="flex justify-between items-center py-4 border-b border-gray-50 dark:border-dark-surface-variant/10">
                            <span className="text-xs font-bold text-gray-500">{item.label}</span>
                            <span className="text-sm font-black text-gray-900 dark:text-white">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </section>
                  </>
                )}

                {activeTab === 'products' && (
                  <section>
                    <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.25em] mb-8">Catalog Showcase</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                      {products.map(product => (
                        <Link key={product.id} href={`/catalog/${product.id}`} className="group bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-surface-variant/30 rounded-xl overflow-hidden hover:shadow-2xl transition-all">
                          <div className="aspect-[4/3] relative overflow-hidden bg-gray-50">
                            <img 
                              src={product.images?.[0] || 'https://via.placeholder.com/400'} 
                              alt={product.name} 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                            />
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-primary border border-gray-100">
                              HS {product.hs_code}
                            </div>
                          </div>
                          <div className="p-8">
                            <h3 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
                            <p className="text-2xl font-display font-semibold text-primary dark:text-dark-primary mb-6">${product.price_range_min}</p>
                            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                               View Infrastructure <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </section>
                )}

                {activeTab === 'certifications' && (
                  <section>
                    <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.25em] mb-8">Institutional Compliance</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {['ISO 9001:2015', 'ISO 14001', 'REACH', 'Industry Audit v2.0'].map((cert, i) => (
                        <div key={i} className="flex items-center gap-6 p-8 bg-gray-50/50 dark:bg-dark-surface-container/30 rounded-xl border border-gray-100 dark:border-dark-surface-variant/10">
                          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-sm">
                            <Award className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-[13px] font-black text-gray-900 dark:text-white uppercase tracking-widest mb-1">{cert}</p>
                            <p className="text-xs font-medium text-gray-500">Certified Sourcing Compliance</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar: Interaction Center */}
          <aside className="w-full lg:w-[400px] flex-shrink-0">
             <div className="sticky top-24 space-y-8">
                
                {/* Contact Dossier */}
                <div id="inquiry-form" className="bg-gray-900 dark:bg-dark-surface rounded-xl p-10 text-white shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full" />
                   <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40 mb-8">Intelligence Request</h3>
                   
                   <form onSubmit={handleSendInquiry} className="space-y-6">
                      <div>
                         <label className="text-[10px] font-black text-white/30 uppercase tracking-widest block mb-2 px-1">Sourcing Domain</label>
                         <select 
                           value={category}
                           onChange={(e) => setCategory(e.target.value)}
                           className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm font-bold outline-none focus:border-primary transition-all appearance-none cursor-pointer"
                         >
                            <option value="" className="bg-gray-900">Select Strategy..</option>
                            <option value="spot" className="bg-gray-900">Spot Transaction</option>
                            <option value="contract" className="bg-gray-900">Long-term Contract</option>
                            <option value="oem" className="bg-gray-900">OEM Orchestration</option>
                         </select>
                      </div>
                      
                      <div>
                         <label className="text-[10px] font-black text-white/30 uppercase tracking-widest block mb-2 px-1">Requirement Dossier</label>
                         <textarea 
                           value={message}
                           onChange={(e) => setMessage(e.target.value)}
                           placeholder="Describe MOQ, lead time, and specifications.."
                           className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm font-bold outline-none focus:border-primary transition-all h-32 resize-none"
                         />
                      </div>

                      <button 
                        disabled={inquiryLoading}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-black text-[11px] uppercase tracking-widest py-5 rounded-xl transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 active:scale-95"
                      >
                         {inquiryLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                         Submit Intelligence Inquiry
                      </button>
                      
                      {inquirySuccess && (
                        <p className="text-[11px] font-black text-emerald-400 text-center uppercase tracking-widest animate-pulse">Request Transmitted Successfully</p>
                      )}
                   </form>
                </div>

                {/* Trust Credentials Mini Grid */}
                <div className="bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-surface-variant/30 rounded-xl p-10">
                   <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 mb-8">Audit Integrity</h3>
                   <div className="space-y-6">
                      {[
                        { label: 'Trade Assurance', status: 'Active', icon: <ShieldCheck className="w-5 h-5 text-emerald-500" /> },
                        { label: 'On-Site Verification', status: 'Passed', icon: <CheckCircle2 className="w-5 h-5 text-blue-500" /> },
                        { label: 'Export License', status: 'Valid', icon: <ExternalLink className="w-5 h-5 text-primary" /> }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between">
                           <div className="flex items-center gap-3">
                              {item.icon}
                              <span className="text-[13px] font-bold text-gray-600 dark:text-gray-300">{item.label}</span>
                           </div>
                           <span className="text-[11px] font-black uppercase text-gray-400">{item.status}</span>
                        </div>
                      ))}
                   </div>
                </div>

             </div>
          </aside>
        </div>
      </main>

      {/* Sourcing Intelligence Request Modal */}
      {showInquiryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className="bg-gray-900 text-white rounded-xl w-full max-w-lg overflow-hidden shadow-2xl border border-white/10 relative p-8 animate-scale-in">
            <button 
              onClick={() => setShowInquiryModal(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white text-sm font-bold"
            >
              ✕
            </button>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center text-primary">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black">Intelligence Request</h3>
                <p className="text-white/40 text-[10px] uppercase font-black tracking-widest">Sourcing dossier for {company.name}</p>
              </div>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              setShowInquiryModal(false);
              await handleSendInquiry(e);
            }} className="space-y-6">
              <div>
                 <label className="text-[10px] font-black text-white/30 uppercase tracking-widest block mb-2 px-1">Sourcing Domain</label>
                 <select 
                   value={category}
                   onChange={(e) => setCategory(e.target.value)}
                   className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm font-bold outline-none focus:border-primary transition-all appearance-none cursor-pointer text-white"
                 >
                    <option value="" className="bg-gray-900 text-white">Select Strategy..</option>
                    <option value="spot" className="bg-gray-900 text-white">Spot Transaction</option>
                    <option value="contract" className="bg-gray-900 text-white">Long-term Contract</option>
                    <option value="oem" className="bg-gray-900 text-white">OEM Orchestration</option>
                 </select>
              </div>
              
              <div>
                 <label className="text-[10px] font-black text-white/30 uppercase tracking-widest block mb-2 px-1">Requirement Dossier</label>
                 <textarea 
                   value={message}
                   onChange={(e) => setMessage(e.target.value)}
                   placeholder="Describe MOQ, lead time, and specifications.."
                   className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm font-bold outline-none focus:border-primary transition-all h-32 resize-none text-white placeholder-white/35"
                 />
              </div>

              <button 
                disabled={inquiryLoading}
                className="w-full bg-primary hover:bg-primary/90 text-white font-black text-[11px] uppercase tracking-widest py-5 rounded-xl transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 active:scale-95"
              >
                 {inquiryLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                 Submit Intelligence Inquiry
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Trade Assurance Modal */}
      {showTradeAssurance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-dark-surface rounded-xl w-full max-w-lg overflow-hidden shadow-2xl border border-gray-100 dark:border-dark-surface-variant/30 p-8 relative animate-scale-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white">Secure Trade Assurance</h3>
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-wider">Protocol Enabled</span>
              </div>
            </div>

            <p className="text-sm font-medium text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              Grawizah Trade Assurance is actively protecting transactions with <strong>{company.name}</strong>. Under this protection protocol:
            </p>

            <ul className="space-y-4 mb-8">
              {[
                'Spot and long-term contract orchestrations are 100% verified.',
                'Full regulatory compliance and on-site audit certification.',
                'Secured communication ledger with automatic buyer/supplier sync.'
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-3 text-xs font-bold text-gray-500 dark:text-gray-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>

            <div className="flex gap-4">
              <button 
                onClick={() => {
                  setShowTradeAssurance(false);
                  setShowInquiryModal(true);
                }}
                className="flex-1 py-4 bg-primary text-white font-black text-[11px] uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-all text-center"
              >
                Initiate Sourcing Inquiry
              </button>
              <button 
                onClick={() => setShowTradeAssurance(false)}
                className="px-6 py-4 bg-gray-50 dark:bg-dark-surface-container text-gray-500 font-black text-[11px] uppercase tracking-widest rounded-xl hover:bg-gray-100 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sourcing Inquiry Success Modal */}
      {inquirySuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-dark-surface rounded-xl w-full max-w-md overflow-hidden shadow-2xl border border-gray-100 dark:border-dark-surface-variant/30 p-8 text-center animate-scale-in">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100 shadow-sm animate-bounce">
              <ShieldCheck className="w-8 h-8" />
            </div>
            
            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">Request Transmitted Successfully</h3>
            <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">Secured Sourcing Ledger</p>
            
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
              Your intelligence dossier has been safely logged in our database. The supplier has been instantly notified via all verified trade communication channels.
            </p>

            <button 
              onClick={() => setInquirySuccess(false)}
              className="w-full py-4 bg-primary text-white font-black text-[11px] uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              Understood
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
