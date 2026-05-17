'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { 
  Package, 
  Search, 
  Plus, 
  Filter, 
  Trash2, 
  Edit3, 
  Eye, 
  TrendingUp, 
  Star,
  RefreshCcw,
  Tag,
  Boxes,
  Image as ImageIcon,
  AlertTriangle,
  X
} from 'lucide-react';

// ── Centered Delete Confirmation Modal ─────────────────────────────────────
function DeleteModal({ productName, onConfirm, onCancel, isDeleting }: {
  productName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}) {
  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal Card */}
      <div className="relative bg-white dark:bg-dark-surface-container rounded-[2rem] shadow-2xl border border-gray-100 dark:border-dark-surface-variant/20 w-full max-w-md p-8 animate-fade-in">
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center mb-6 mx-auto">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>

        {/* Text */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
            Delete Intelligence Node?
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
            You are about to permanently remove{' '}
            <span className="font-black text-gray-900 dark:text-white">"{productName}"</span>{' '}
            from your catalog. This action cannot be undone.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 px-5 py-3 border border-gray-200 dark:border-dark-surface-variant/30 text-gray-600 dark:text-gray-300 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-white/5 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 px-5 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-red-500/20"
          >
            {isDeleting ? (
              <><RefreshCcw className="w-3.5 h-3.5 animate-spin" /> Deleting...</>
            ) : (
              <><Trash2 className="w-3.5 h-3.5" /> Delete Node</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
// ────────────────────────────────────────────────────────────────────────────

export default function ProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('search') || '';
    }
    return '';
  });
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; name: string } | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

  useEffect(() => {
    const fetchProducts = async () => {
      if (!user) return;
      try {
        const res = await fetch(`${API_URL}/api/products?company_id=${user.id}`);
        const result = await res.json();
        setProducts(Array.isArray(result.data) ? result.data : []);
      } catch (err) {
        console.error('Fetch products error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [user, API_URL]);

  const handleDeleteProduct = async () => {
    if (!confirmDelete) return;
    setDeletingId(confirmDelete.id);
    try {
      const token = localStorage.getItem('grawizah_token');
      const res = await fetch(`${API_URL}/api/products/${confirmDelete.id}`, {
        method: 'DELETE',
        headers: { ...(token && { 'Authorization': `Bearer ${token}` }) }
      });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== confirmDelete.id));
        setConfirmDelete(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

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
    <div className="p-6 md:p-10 w-full min-h-full font-sans">

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <DeleteModal
          productName={confirmDelete.name}
          onConfirm={handleDeleteProduct}
          onCancel={() => setConfirmDelete(null)}
          isDeleting={deletingId === confirmDelete.id}
        />
      )}

      {/* Header */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Boxes className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Inventory Intelligence</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Products Management</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Manage your global trade catalog and optimize listings with AI-driven scores.</p>
        </div>
        <Link href="/dashboard/products/add" className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-2 shadow-xl hover:opacity-90 transition-all">
          <Plus className="w-4 h-4" /> Add Intelligence Node
        </Link>
      </header>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Total Listings', value: products.length, icon: Package, color: 'text-primary', bg: 'bg-primary/5' },
          { label: 'Active Visibility', value: products.filter(p => p.listing_score >= 80).length, icon: Eye, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/20' },
          { label: 'Market Traction', value: products.reduce((acc, p) => acc + (p.view_count || 0), 0), icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/20' },
          { label: 'Avg. Trust Score', value: products.length > 0 ? Math.round(products.reduce((acc, p) => acc + (p.listing_score || 0), 0) / products.length) : 0, icon: Star, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/20' }
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-dark-surface-container-low p-6 rounded-2xl border border-gray-100 dark:border-dark-surface-variant/20 shadow-sm group hover:border-primary/20 transition-all">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Control Bar */}
      <div className="bg-white dark:bg-dark-surface-container-low p-4 rounded-2xl border border-gray-100 dark:border-dark-surface-variant/20 shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search by name or HS-Code..."
            className="w-full pl-12 pr-4 py-2.5 bg-gray-50 dark:bg-dark-surface-container border-none rounded-xl text-xs font-semibold outline-none focus:bg-white dark:focus:bg-dark-surface transition-all dark:text-white"
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
      <div className="bg-white dark:bg-dark-surface-container-low rounded-2xl border border-gray-100 dark:border-dark-surface-variant/20 shadow-sm overflow-hidden">
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
              {filteredProducts.length > 0 ? filteredProducts.map((p) => (
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
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg ${
                      (p.listing_score || 0) >= 80
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                        : (p.listing_score || 0) >= 60
                        ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'
                        : 'bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400'
                    }`}>
                      <Star className="w-3 h-3 fill-current" />
                      <span className="text-[11px] font-black">{p.listing_score}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/dashboard/products/add?edit=${p.id}`} className="p-2 text-gray-400 hover:text-primary transition-colors rounded-lg hover:bg-primary/5">
                        <Edit3 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setConfirmDelete({ id: p.id, name: p.name })}
                        disabled={deletingId === p.id}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
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

        {/* Footer */}
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
