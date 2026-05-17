'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types/product';
import Link from 'next/link';

// Premium Company Avatar component with robust fallback rendering
const CompanyAvatar = ({ logoUrl, companyName, className, index }: { logoUrl?: string, companyName: string, className: string, index: number }) => {
  const [imgError, setImgError] = useState(false);
  
  const getAvatarBg = (idx: number) => {
    const bgs = [
      'bg-gradient-to-br from-yellow-400 to-amber-600 text-white', // Gold
      'bg-gradient-to-br from-indigo-400 to-indigo-700 text-white', // Purple
      'bg-gradient-to-br from-emerald-400 to-emerald-700 text-white', // Emerald
      'bg-gradient-to-br from-blue-500 to-indigo-600 text-white',
      'bg-gradient-to-br from-pink-500 to-rose-600 text-white',
      'bg-gradient-to-br from-purple-500 to-violet-600 text-white',
      'bg-gradient-to-br from-teal-500 to-emerald-600 text-white',
    ];
    return bgs[idx % bgs.length];
  };

  const isUiAvatar = logoUrl && (logoUrl.includes('ui-avatars.com') || logoUrl.trim() === '');

  if (logoUrl && !imgError && !isUiAvatar) {
    return (
      <div className={`${className} overflow-hidden flex items-center justify-center`}>
        <img 
          src={logoUrl} 
          alt={companyName} 
          onError={() => setImgError(true)} 
          className="w-full h-full object-cover rounded-xl" 
        />
      </div>
    );
  }

  return (
    <div className={`${className} flex items-center justify-center font-black ${getAvatarBg(index)} shadow-inner rounded-xl`}>
      <span>{companyName ? companyName[0].toUpperCase() : 'G'}</span>
    </div>
  );
};
import { 
  Loader2, 
  Search, 
  Globe, 
  ShieldCheck, 
  LayoutGrid, 
  Users, 
  Filter, 
  ChevronDown, 
  Star, 
  CheckCircle2, 
  Clock, 
  Box, 
  Play, 
  ChevronRight,
  MessageSquare,
  Mail
} from 'lucide-react';

export default function CatalogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState<'products' | 'suppliers'>('suppliers');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [companies, setCompanies] = useState<Record<string, any>>({});
  
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedCapabilities, setSelectedCapabilities] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = `${API_URL}/api/products?limit=50`;
      if (sortBy === 'ai') url += '&sort=ai';
      
      const res = await fetch(url);
      const result = await res.json();
      if (result.data) {
        setProducts(result.data);
        
        // Fetch unique companies
        const uniqueCompanyIds = [...new Set(result.data.map((p: any) => p.company_id))];
        const comps: Record<string, any> = {};
        for (const cid of uniqueCompanyIds) {
          if (typeof cid === 'string') {
            fetch(`${API_URL}/api/companies/${cid}`)
              .then(r => r.json())
              .then(cData => {
                 setCompanies(prev => ({...prev, [cid]: cData}));
              }).catch(() => {});
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = !selectedCategory || p.category === selectedCategory;
    const matchCountry = selectedCountries.length === 0 || selectedCountries.includes(p.country_origin);
    
    const company = companies[p.company_id];
    let matchVerified = true;
    let matchRating = true;

    if (company) {
      if (verifiedOnly && !company.verified) matchVerified = false;
      const cRating = company.score ? (company.score / 20) : 4.9;
      if (cRating < minRating) matchRating = false;
    }

    return matchSearch && matchCategory && matchCountry && matchVerified && matchRating;
  });

  const suppliersWithProducts = Object.values(companies).map(company => {
    return {
      ...company,
      products: filteredProducts.filter(p => p.company_id === company.id)
    };
  }).filter(c => {
    if (c.products.length === 0) return false;
    if (verifiedOnly && !c.verified) return false;
    const cRating = c.score ? (c.score / 20) : 4.9; 
    if (cRating < minRating) return false;
    if (selectedCountries.length > 0 && !selectedCountries.includes(c.country)) return false;
    return true;
  });

  const toggleCountry = (country: string) => {
    setSelectedCountries(prev => 
      prev.includes(country) ? prev.filter(c => c !== country) : [...prev, country]
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] dark:bg-dark-background text-on-surface dark:text-dark-on-surface selection:bg-primary/20 font-sans antialiased transition-colors duration-500 overflow-x-hidden">
      <Navbar />

      {/* Hero Header Area - Creative & Formal */}
      <div className="bg-white dark:bg-dark-surface border-b border-gray-100 dark:border-dark-surface-variant/20 pt-20 pb-8 sticky top-[64px] z-40 transition-all shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-semibold tracking-tight text-gray-900 dark:text-white mb-2">Global Catalog</h1>
              <p className="text-sm text-gray-500 font-medium">Orchestrating verified trade connections worldwide.</p>
            </div>
            
            {/* View Toggle - Modern Tabs */}
            <div className="flex p-1 bg-gray-50 dark:bg-dark-surface-container rounded-xl border border-gray-200 dark:border-dark-surface-variant/30 w-fit">
              <button 
                onClick={() => setViewType('suppliers')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${viewType === 'suppliers' ? 'bg-white dark:bg-dark-surface text-primary dark:text-dark-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Users className="w-4 h-4" /> Suppliers
              </button>
              <button 
                onClick={() => setViewType('products')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${viewType === 'products' ? 'bg-white dark:bg-dark-surface text-primary dark:text-dark-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <LayoutGrid className="w-4 h-4" /> Products
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Main Search Bar - Refined */}
            <div className="flex-1 flex w-full bg-gray-50 dark:bg-dark-surface-container rounded-2xl border border-gray-100 dark:border-dark-surface-variant/30 px-4 py-1.5 items-center group focus-within:border-primary/50 transition-all">
              <Search className="w-5 h-5 text-gray-400 mr-3" />
              <input
                type="text"
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-semibold text-gray-900 dark:text-white placeholder:text-gray-400 outline-none py-2"
                placeholder="Find manufacturers, products, or trade partners..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="bg-primary text-white px-8 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">Search</button>
            </div>

            {/* Quick Filters */}
            <div className="flex items-center gap-3 w-full md:w-auto">
               <button 
                 onClick={() => setShowMobileFilters(!showMobileFilters)}
                 className="lg:hidden flex items-center gap-2 px-4 py-3 bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-surface-variant/30 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 hover:border-primary transition-all flex-1 justify-center"
               >
                  <Filter className="w-4 h-4" /> Filters {showMobileFilters ? <ChevronDown className="w-3 h-3 rotate-180" /> : <ChevronDown className="w-3 h-3" />}
               </button>
               <button className="hidden md:flex items-center gap-2 px-4 py-3 bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-surface-variant/30 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 hover:border-primary transition-all">
                  <Globe className="w-4 h-4" /> Worldwide <ChevronDown className="w-3 h-3" />
               </button>
               <button className="hidden lg:flex items-center gap-2 px-4 py-3 bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-surface-variant/30 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 hover:border-primary transition-all">
                  <Filter className="w-4 h-4" /> All Categories <ChevronDown className="w-3 h-3" />
               </button>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-grow max-w-[1400px] w-full mx-auto px-6 md:px-10 pt-6 md:pt-10 flex flex-col lg:flex-row gap-8 lg:gap-12 overflow-hidden h-auto lg:h-[calc(100vh-280px)]">
        
        {/* Sidebar Filters - Formal Design */}
        <aside className={`${showMobileFilters ? 'block' : 'hidden'} lg:block w-full lg:w-[260px] flex-shrink-0 lg:overflow-y-auto pr-4 scrollbar-hide lg:pb-20`}>
          <div className="space-y-12">
            <div>
              <h3 className="font-display font-black text-[11px] uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-6">Security & Trust</h3>
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 dark:border-gray-700 text-primary focus:ring-primary bg-transparent" checked={verifiedOnly} onChange={(e) => setVerifiedOnly(e.target.checked)} />
                  <span className="text-sm font-bold text-gray-600 dark:text-gray-300 group-hover:text-primary transition-colors flex items-center gap-2">
                    Verified Pro <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                  </span>
                </label>
              </div>
            </div>

            <div className="border-t border-gray-100 dark:border-dark-surface-variant/20 pt-8">
              <h3 className="font-display font-black text-[11px] uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-6">Performance Audit</h3>
              <div className="space-y-4">
                {[0, 4.0, 4.5, 5.0].map((rating) => (
                  <label key={rating} className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" name="rating" className="w-4 h-4 text-primary focus:ring-primary bg-transparent border-gray-300 dark:border-gray-700" checked={minRating === rating} onChange={() => setMinRating(rating)} />
                    <span className="text-sm font-bold text-gray-600 dark:text-gray-300 group-hover:text-primary transition-colors">
                      {rating === 0 ? 'All Ratings' : `${rating} & Above`}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-100 dark:border-dark-surface-variant/20 pt-8">
              <h3 className="font-display font-black text-[11px] uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-6">Market Jurisdictions</h3>
              <div className="space-y-4">
                {['China', 'Indonesia', 'Germany', 'South Korea'].map((country) => (
                  <label key={country} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 dark:border-gray-700 text-primary focus:ring-primary bg-transparent" checked={selectedCountries.includes(country)} onChange={() => toggleCountry(country)} />
                    <span className="text-sm font-bold text-gray-600 dark:text-gray-300 group-hover:text-primary transition-colors flex items-center gap-2">
                       <img src={`https://flagcdn.com/w20/${country.toLowerCase() === 'indonesia' ? 'id' : country.toLowerCase() === 'china' ? 'cn' : country.toLowerCase() === 'germany' ? 'de' : 'kr'}.png`} alt="" className="w-4 rounded-sm" />
                       {country}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Catalog Grid Area */}
        <div className="flex-1 min-w-0 lg:overflow-y-auto pr-2 scrollbar-hide pb-20">
          <div className="flex justify-between items-center mt-2 lg:mt-4 mb-6 lg:mb-8 bg-white dark:bg-dark-surface p-4 rounded-2xl border border-gray-100 dark:border-dark-surface-variant/20">
            <span className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">
               Orchestrating {viewType === 'products' ? filteredProducts.length : suppliersWithProducts.length} intelligence nodes
            </span>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest hidden sm:block">Verified Only</span>
              <button 
                onClick={() => setVerifiedOnly(!verifiedOnly)}
                className={`w-10 h-5 rounded-full relative transition-all ${verifiedOnly ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-800'}`}
              >
                <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-all ${verifiedOnly ? 'translate-x-5' : ''}`} />
              </button>
            </div>
          </div>

          {loading ? (
             <div className="flex flex-col items-center justify-center py-32 gap-6">
                <Loader2 className="w-12 h-12 animate-spin text-primary opacity-20" />
                <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest animate-pulse">Syncing Global Data...</p>
             </div>
          ) : viewType === 'products' ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} viewMode="grid" />
                ))}
             </div>
          ) : (
             <div className="flex flex-col gap-10">
               {suppliersWithProducts.map(supplier => (
                 <div key={supplier.id} className="bg-white dark:bg-dark-surface rounded-[2rem] p-8 md:p-10 border border-gray-100 dark:border-dark-surface-variant/20 transition-all group">
                   
                   {/* Supplier Formal Dossier Header */}
                   <div className="flex flex-col xl:flex-row justify-between items-start gap-8 mb-10 pb-10 border-b border-gray-50 dark:border-dark-surface-variant/10">
                     <div className="flex items-start gap-6">
                        <div className="w-20 h-20 rounded-2xl bg-gray-50 dark:bg-dark-surface-container border border-gray-100 dark:border-dark-surface-variant/20 flex items-center justify-center p-2 transition-transform group-hover:rotate-3">
                           <CompanyAvatar 
                              logoUrl={supplier.logo_url} 
                              companyName={supplier.name} 
                              className="w-full h-full text-2xl" 
                              index={supplier.id ? supplier.id.charCodeAt(0) : 0} 
                            />
                        </div>
                        <div>
                           <div className="flex items-center gap-3 mb-2 flex-wrap">
                              <Link href={`/supplier/${supplier.id}`} className="text-2xl font-display font-bold text-gray-900 dark:text-white hover:text-primary transition-all tracking-tight">{supplier.name}</Link>
                              <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-800/30">
                                 <ShieldCheck className="w-3 h-3" /> Verified
                              </div>
                           </div>
                           <div className="flex items-center gap-4 text-xs font-bold text-gray-500 dark:text-gray-400">
                              <span className="flex items-center gap-1.5">
                                 <img src={`https://flagcdn.com/w20/${supplier.country?.toLowerCase() === 'indonesia' ? 'id' : supplier.country?.toLowerCase() === 'germany' ? 'de' : supplier.country?.toLowerCase() === 'south korea' ? 'kr' : 'cn'}.png`} alt="" className="w-4 rounded-sm" />
                                 {supplier.country}
                              </span>
                              <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
                              <span className="flex items-center gap-1">
                                 <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
                                 <span className="text-gray-900 dark:text-white">4.9/5</span>
                                 <span className="font-medium opacity-60">(24 Reviews)</span>
                              </span>
                           </div>
                        </div>
                     </div>
                     <div className="flex gap-4 w-full xl:w-auto">
                        <Link href={`/supplier/${supplier.id}`} className="flex-1 xl:flex-none px-8 py-3.5 bg-gray-50 dark:bg-dark-surface-container text-gray-900 dark:text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl hover:bg-gray-100 dark:hover:bg-dark-surface-container-high transition-all text-center flex items-center justify-center gap-2">
                           <Mail className="w-4 h-4" /> Message
                        </Link>
                        <Link href={`/supplier/${supplier.id}`} className="flex-1 xl:flex-none px-8 py-3.5 bg-primary text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 text-center flex items-center justify-center gap-2">
                           <MessageSquare className="w-4 h-4" /> Live Chat
                        </Link>
                     </div>
                   </div>

                   {/* Intelligence Grid */}
                   <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
                      <div className="xl:col-span-3 space-y-8">
                         <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Operations Meta</p>
                            <div className="space-y-4">
                               <div className="flex justify-between items-center bg-gray-50/50 dark:bg-dark-surface-container/30 p-3 rounded-xl border border-gray-100/50 dark:border-dark-surface-variant/10">
                                  <span className="text-xs font-bold text-gray-500 flex items-center gap-2"><Clock className="w-3 h-3" /> Delivery</span>
                                  <span className="text-xs font-black text-emerald-600">98% On-Time</span>
                               </div>
                               <div className="flex justify-between items-center bg-gray-50/50 dark:bg-dark-surface-container/30 p-3 rounded-xl border border-gray-100/50 dark:border-dark-surface-variant/10">
                                  <span className="text-xs font-bold text-gray-500 flex items-center gap-2"><Box className="w-3 h-3" /> Capacity</span>
                                  <span className="text-xs font-black text-gray-900 dark:text-white">Active (High)</span>
                               </div>
                            </div>
                         </div>
                         <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Capabilities</p>
                            <div className="flex flex-wrap gap-2">
                               {['OEM', 'ODM', 'R&D'].map(cap => (
                                 <span key={cap} className="px-3 py-1 bg-gray-100 dark:bg-dark-surface-container-high text-gray-600 dark:text-gray-400 text-[10px] font-black rounded-lg uppercase">{cap}</span>
                               ))}
                            </div>
                         </div>
                      </div>

                      <div className="xl:col-span-9">
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Product Showcase</p>
                         <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {supplier.products.slice(0, 3).map((p: any) => (
                               <Link key={p.id} href={`/catalog/${p.id}`} className="group/item relative aspect-square rounded-2xl overflow-hidden bg-gray-50 dark:bg-dark-surface-container border border-gray-100 dark:border-dark-surface-variant/20">
                                  <img src={p.images?.[0] || 'https://via.placeholder.com/400'} alt="" className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-700" />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover/item:opacity-100 transition-all p-4 flex flex-col justify-end">
                                     <p className="text-white text-[10px] font-black uppercase tracking-widest mb-1 truncate">{p.name}</p>
                                     <p className="text-primary-container text-sm font-black">${p.price_range_min}</p>
                                  </div>
                               </Link>
                            ))}
                            {/* Factory Insight Card */}
                            <div className="relative aspect-square rounded-2xl overflow-hidden group/factory cursor-pointer">
                               <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80" alt="" className="w-full h-full object-cover group-hover/factory:scale-110 transition-all" />
                               <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-3 backdrop-blur-[1px]">
                                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                                     <Play className="w-4 h-4 text-white fill-current pl-0.5" />
                                  </div>
                                  <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">View Facility</span>
                               </div>
                            </div>
                         </div>
                         <Link href={`/supplier/${supplier.id}`} className="inline-flex items-center gap-2 mt-6 text-[10px] font-black text-primary uppercase tracking-[0.3em] hover:gap-4 transition-all group/more">
                            Explore Full Intelligence Report <ChevronRight className="w-4 h-4" />
                         </Link>
                      </div>
                   </div>
                 </div>
               ))}
               {suppliersWithProducts.length === 0 && (
                 <div className="text-center py-32 bg-white dark:bg-dark-surface rounded-[2rem] border border-gray-100 dark:border-dark-surface-variant/20 shadow-sm">
                    <Search className="w-16 h-16 text-gray-200 dark:text-gray-800 mx-auto mb-6" />
                    <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-2">No Intelligence Matches</h3>
                    <p className="text-sm text-gray-500 font-medium">Try broadening your discovery parameters or reset filters.</p>
                 </div>
               )}
             </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
