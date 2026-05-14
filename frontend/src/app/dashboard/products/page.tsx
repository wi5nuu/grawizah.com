'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { 
  Package, 
  Search, 
  Plus, 
  Filter, 
  MoreVertical, 
  Edit3, 
  Eye, 
  TrendingUp, 
  Star,
  RefreshCcw,
  Tag,
  Boxes,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function ProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

  useEffect(() => {
    const fetchProducts = async () => {
      if (!user) return;
      try {
        // Fetch products by company ID (company_id is stored in user object in our auth flow)
        const res = await fetch(`${API_URL}/api/products?company_id=${user.id}`);
        const result = await res.json();
        setProducts(Array.isArray(result.data) ? result.data : []);
      } catch (err) {
        console.error("Fetch products error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [user, API_URL]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <RefreshCcw className="w-8 h-8 animate-spin text-primary opacity-20" />
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse">Orchestrating Catalog Nodes...</p>
      </div>
    );
  }

  const filteredProducts = products.filter(p => 
    (p.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.hs_code || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-10 w-full bg-[#fafafa] dark:bg-dark-background min-h-screen font-sans">
      
      {/* Header */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 gap-6">
        <div>
           <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                 <Boxes className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Inventory Intelligence</span>
           </div>
           <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Products Management</h2>
           <p className="text-sm text-gray-500 font-medium mt-1">Manage your global trade catalog and optimize listings with AI-driven scores.</p>
        </div>
        <button className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-2 shadow-xl hover:opacity-90 transition-all">
           <Plus className="w-4 h-4" /> Add Intelligence Node
        </button>
      </header>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
         {[
           { label: 'Total Listings', value: products.length, icon: Package, color: 'text-primary', bg: 'bg-primary/5' },
           { label: 'Active Visibility', value: products.filter(p => p.listing_score >= 80).length, icon: Eye, color: 'text-blue-500', bg: 'bg-blue-50' },
           { label: 'Market Traction', value: products.reduce((acc, p) => acc + (p.view_count || 0), 0), icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50' },
           { label: 'Avg. Trust Score', value: products.length > 0 ? Math.round(products.reduce((acc, p) => acc + (p.listing_score || 0), 0) / products.length) : 0, icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' }
         ].map((stat, i) => (
           <div key={i} className="bg-white dark:bg-dark-surface-container-low p-6 rounded-[2rem] border border-gray-100 dark:border-dark-surface-variant/20 shadow-sm group">
              <div className="flex justify-between items-start mb-4">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                 <div className={`w-10 h-10 rounded-xl ${stat.bg} dark:bg-opacity-10 flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                    <stat.icon className="w-5 h-5" />
                 </div>
              </div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">{stat.value}</h3>
           </div>
         ))}
      </div>

      {/* Control Bar */}
      <div className="bg-white dark:bg-dark-surface-container-low p-4 rounded-[2rem] border border-gray-100 dark:border-dark-surface-variant/20 shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
         <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input 
               type="text" 
               placeholder="Search by name or HS-Code..." 
               className="w-full pl-12 pr-4 py-2.5 bg-gray-50 dark:bg-dark-surface-container border-none rounded-xl text-xs font-semibold outline-none focus:bg-white transition-all"
               value={search}
               onChange={(e) => setSearch(e.target.value)}
            />
         </div>
         <div className="flex gap-2">
            <button className="px-5 py-2.5 bg-gray-50 dark:bg-dark-surface-container rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-400 hover:bg-gray-100 transition-all">All Categories</button>
            <button className="px-5 py-2.5 bg-gray-50 dark:bg-dark-surface-container rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-400 hover:bg-gray-100 transition-all">
               <Filter className="w-3 h-3 inline mr-1" /> Filters
            </button>
         </div>
      </div>

      {/* Product Table */}
      <div className="bg-white dark:bg-dark-surface-container-low rounded-[2.5rem] border border-gray-100 dark:border-dark-surface-variant/20 shadow-sm overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-gray-50/50 dark:bg-white/5 text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-black">
                     <th className="px-8 py-5">Product Details</th>
                     <th className="px-8 py-5">Classification</th>
                     <th className="px-8 py-5">Pricing Node</th>
                     <th className="px-8 py-5 text-center">Trust Score</th>
                     <th className="px-8 py-5 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                  {filteredProducts.length > 0 ? filteredProducts.map((p, idx) => (
                    <tr key={p.id} className="hover:bg-gray-50/80 dark:hover:bg-white/5 transition-colors group">
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                                {p.images && p.images[0] ? (
                                   <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                                ) : (
                                   <ImageIcon className="w-5 h-5 text-gray-300" />
                                )}
                             </div>
                             <div>
                                <p className="text-[13px] font-black text-gray-900 dark:text-white leading-none">{p.name}</p>
                                <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase tracking-tighter">ID: {p.id.substring(0, 12)}...</p>
                             </div>
                          </div>
                       </td>
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                             <Tag className="w-3 h-3 text-primary/50" />
                             <span className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-widest">{p.category || 'N/A'}</span>
                          </div>
                          <p className="text-[10px] text-gray-400 font-bold mt-1.5 uppercase">HS: {p.hs_code || 'UNCLASSIFIED'}</p>
                       </td>
                       <td className="px-8 py-6">
                          <p className="text-[13px] font-black text-gray-900 dark:text-white">{p.currency} {p.price_range_min} - {p.price_range_max}</p>
                          <p className="text-[10px] text-gray-400 font-bold mt-1.5 uppercase">MOQ: {p.moq}</p>
                       </td>
                       <td className="px-8 py-6 text-center">
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg">
                             <Star className="w-3 h-3 fill-current" />
                             <span className="text-[11px] font-black">{p.listing_score}</span>
                          </div>
                       </td>
                       <td className="px-8 py-6 text-right">
                          <div className="flex justify-end gap-2">
                             <button className="p-2 text-gray-400 hover:text-primary transition-colors">
                                <Edit3 className="w-4 h-4" />
                             </button>
                             <button className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                                <MoreVertical className="w-4 h-4" />
                             </button>
                          </div>
                       </td>
                    </tr>
                  )) : (
                    <tr>
                       <td colSpan={5} className="px-8 py-20 text-center">
                          <div className="flex flex-col items-center gap-3">
                             <Package className="w-10 h-10 text-gray-200 mb-2" />
                             <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">No Products Found</p>
                             <p className="text-xs text-gray-400 font-medium">Start by adding your first intelligence node to the catalog.</p>
                          </div>
                       </td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>
         
         {/* Footer Info */}
         <div className="p-6 bg-gray-50/50 dark:bg-white/5 border-t border-gray-50 dark:border-white/5 flex justify-between items-center">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
               Syncing <span className="text-gray-900 dark:text-white">{filteredProducts.length}</span> nodes from global trade database
            </p>
            <div className="flex gap-2">
               <button className="px-4 py-2 bg-white dark:bg-dark-surface border border-gray-200 dark:border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:bg-gray-50 transition-all">Prev</button>
               <button className="px-4 py-2 bg-white dark:bg-dark-surface border border-gray-200 dark:border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:bg-gray-50 transition-all">Next</button>
            </div>
         </div>
      </div>
    </div>
  );
}
