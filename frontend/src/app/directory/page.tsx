'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { 
  Search, 
  MapPin, 
  Star, 
  ChevronRight, 
  ShieldCheck, 
  Loader2,
  Mail,
  Building2,
  Clock,
  Award,
  Globe,
  FileText,
  AlertCircle
} from 'lucide-react';

export default function DirectoryPage() {
  const [search, setSearch] = useState('');
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

  useEffect(() => {
    const fetchSuppliers = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/api/companies`);
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        const result = await res.json();
        if (result.data) {
          setSuppliers(result.data);
        } else {
          setSuppliers([]);
        }
      } catch (err) {
        console.error("Failed to fetch suppliers:", err);
        setError("Unable to sync with Intelligence Network. Please ensure backend is active.");
      } finally {
        setLoading(false);
      }
    };
    fetchSuppliers();
  }, [API_URL]);

  const filtered = suppliers.filter((s) => {
    return !search || s.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-dark-background text-on-surface dark:text-dark-on-surface font-sans antialiased">
      <Navbar />

      <main className="max-w-[1400px] mx-auto px-6 md:px-10 pt-20 pb-20">
        
        {/* Intelligence Ledger Header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-black text-primary uppercase tracking-[0.3em]">Institutional Network</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-semibold tracking-tight text-gray-900 dark:text-white mb-6">
            Global Trade <br />
            <span className="text-primary dark:text-dark-primary">Directory.</span>
          </h1>
          <p className="text-lg text-gray-500 mb-10 max-w-2xl font-medium leading-relaxed">
            The authoritative ledger of verified manufacturers, trade infrastructure, and institutional partners worldwide. Verified by Grawizah Intelligence.
          </p>

          <div className="bg-white dark:bg-dark-surface p-2 rounded-2xl border border-gray-100 dark:border-dark-surface-variant/30 flex items-center shadow-xl shadow-gray-200/50 dark:shadow-none max-w-2xl">
            <Search className="w-5 h-5 text-gray-400 mx-4" />
            <input 
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-semibold text-gray-900 dark:text-white placeholder:text-gray-400 outline-none py-3" 
              placeholder="Search by company identity or NIB..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
            />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <Loader2 className="w-12 h-12 animate-spin text-primary opacity-20" />
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest animate-pulse">Accessing Intelligence Nodes...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-center max-w-md mx-auto">
            <AlertCircle className="w-12 h-12 text-amber-500 opacity-50" />
            <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white">Connection Interrupted</h3>
            <p className="text-sm text-gray-500 font-medium">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-widest">Retry Sync</button>
          </div>
        ) : (
          <div className="space-y-6">
            {filtered.map((supplier) => (
              <div key={supplier.id} className="bg-white dark:bg-dark-surface rounded-[2rem] border border-gray-100 dark:border-dark-surface-variant/20 overflow-hidden transition-all hover:border-primary/30 shadow-sm hover:shadow-xl">
                <div className="p-8 md:p-10 flex flex-col xl:flex-row gap-10">
                  
                  {/* Identity Column */}
                  <div className="flex-[1.5] flex gap-6">
                    <div className="w-24 h-24 rounded-2xl bg-gray-50 dark:bg-dark-surface-container border border-gray-100 dark:border-dark-surface-variant/20 flex items-center justify-center p-2 flex-shrink-0">
                      <img src={`https://ui-avatars.com/api/?name=${supplier.name}&background=6366f1&color=fff&size=128&font-size=0.33`} alt="" className="w-full h-full object-contain rounded-xl" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <Link href={`/supplier/${supplier.id}`} className="text-2xl font-display font-bold text-gray-900 dark:text-white hover:text-primary transition-all tracking-tight">{supplier.name}</Link>
                        {supplier.verified && (
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-100">
                            <ShieldCheck className="w-3 h-3" /> Institutional Verified
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs font-bold text-gray-500 mb-6">
                        <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-primary" /> {supplier.country}</span>
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-primary" /> Est. {supplier.year_established || '2005'}</span>
                        <span className="flex items-center gap-1.5"><Award className="w-3.5 h-3.5 text-amber-400" /> {supplier.score || 98} Audit Score</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {['Manufacturer', 'Export Licensed', 'ISO Certified'].map(tag => (
                          <span key={tag} className="px-3 py-1 bg-gray-50 dark:bg-dark-surface-container text-gray-500 dark:text-gray-400 text-[9px] font-black rounded-lg uppercase tracking-widest border border-gray-100/50">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Audit Dossier Column */}
                  <div className="flex-1 bg-gray-50/50 dark:bg-dark-surface-container/20 rounded-3xl p-8 border border-gray-100/50 dark:border-dark-surface-variant/10">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                      <FileText className="w-3 h-3" /> Audit Dossier
                    </p>
                    <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                       <div>
                          <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Reliability Index</p>
                          <p className="text-sm font-black text-gray-900 dark:text-white">99.2% On-Time</p>
                       </div>
                       <div>
                          <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Export Scale</p>
                          <p className="text-sm font-black text-gray-900 dark:text-white">Global (15+ Nations)</p>
                       </div>
                       <div>
                          <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Business Type</p>
                          <p className="text-sm font-black text-gray-900 dark:text-white">{supplier.business_type || 'Manufacturing'}</p>
                       </div>
                       <div>
                          <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Security Score</p>
                          <p className="text-sm font-black text-emerald-600">Low Risk</p>
                       </div>
                    </div>
                  </div>

                  {/* CTA Column */}
                  <div className="flex-shrink-0 flex flex-col justify-center gap-3">
                    <Link href={`/supplier/${supplier.id}`} className="px-8 py-3.5 bg-primary text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 text-center flex items-center justify-center gap-2">
                      Access Full Report <ChevronRight className="w-4 h-4" />
                    </Link>
                    <button className="px-8 py-3.5 bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-surface-variant/30 text-gray-900 dark:text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl hover:bg-gray-50 transition-all text-center flex items-center justify-center gap-2">
                      <Mail className="w-4 h-4" /> Official Inquiry
                    </button>
                  </div>

                </div>
              </div>
            ))}
            
            {filtered.length === 0 && (
              <div className="text-center py-32 bg-white dark:bg-dark-surface rounded-[2rem] border border-gray-100 dark:border-dark-surface-variant/20 shadow-sm">
                <Building2 className="w-16 h-16 text-gray-200 dark:text-gray-800 mx-auto mb-6" />
                <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-2">Node Identity Not Found</h3>
                <p className="text-sm text-gray-500 font-medium">No company matching your query was found in the institutional network.</p>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
