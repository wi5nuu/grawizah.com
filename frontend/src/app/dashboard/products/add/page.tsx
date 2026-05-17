'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { HSCodeAIService } from '@/services/AIService';
import {
  Package,
  Save,
  ArrowLeft,
  RefreshCcw,
  Tag,
  DollarSign,
  Box,
  Sparkles,
  Loader2,
  X,
  Upload,
  CheckCircle2,
  AlertCircle,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { uploadToSupabase } from '@/lib/supabase';

export default function AddProductPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [productCount, setProductCount] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    hs_code: '',
    price_range_min: '',
    price_range_max: '',
    currency: 'USD',
    moq: '',
    images: [] as string[]
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // ── Auto-Classify State ──────────────────────────────────────────────────
  const [isClassifying, setIsClassifying] = useState(false);
  const [classifyStatus, setClassifyStatus] = useState<'idle' | 'classifying' | 'done' | 'error'>('idle');
  const [classifyConfidence, setClassifyConfidence] = useState<number | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const lastClassifiedInput = useRef('');
  // ────────────────────────────────────────────────────────────────────────

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('edit');
      if (id) {
        setEditId(id);
        const fetchProduct = async () => {
          try {
            const res = await fetch(`${API_URL}/api/products/${id}`);
            if (res.ok) {
              const data = await res.json();
              setFormData({
                name: data.name || '',
                description: data.description || '',
                category: data.category || '',
                hs_code: data.hs_code || '',
                price_range_min: String(data.price_range_min) || '',
                price_range_max: String(data.price_range_max) || '',
                currency: data.currency || 'USD',
                moq: String(data.moq) || '',
                images: data.images || []
              });
            }
          } catch (err) {
            console.error('Failed to load product for editing:', err);
          }
        };
        fetchProduct();
      }

      const fetchProductCount = async () => {
        try {
          if (!user) return;
          const res = await fetch(`${API_URL}/api/products?company_id=${user.id}`);
          if (res.ok) {
            const data = await res.json();
            setProductCount(Array.isArray(data.data) ? data.data.length : 0);
          }
        } catch (err) {
          console.error('Failed to fetch product count:', err);
        }
      };
      fetchProductCount();
    }
  }, [user, API_URL]);

  // ── Core Auto-Classify Function ──────────────────────────────────────────
  const runAutoClassify = useCallback(async (name: string, description: string, category: string) => {
    const input = (description || name).trim();
    if (!input || input === lastClassifiedInput.current) return;
    lastClassifiedInput.current = input;

    setIsClassifying(true);
    setClassifyStatus('classifying');
    setClassifyConfidence(null);

    try {
      const aiService = new HSCodeAIService();
      const result = await aiService.analyze({ description: input, category });

      if (result.success && result.data?.hs_code) {
        // Backend returns: { success, data: { hs_code, ... }, confidence }
        setFormData(prev => ({ ...prev, hs_code: result.data.hs_code }));
        setClassifyConfidence(typeof result.confidence === 'number' ? result.confidence : null);
        setClassifyStatus('done');
      } else if (result.success && result.data?.data?.hs_code) {
        // Fallback in case wrapper is nested
        setFormData(prev => ({ ...prev, hs_code: result.data.data.hs_code }));
        setClassifyStatus('done');
      } else {
        setClassifyStatus('error');
        setError(result.error || 'Auto-classification failed. Enter HS Code manually.');
        setTimeout(() => setError(''), 5000);
      }
    } catch (err: any) {
      setClassifyStatus('error');
      console.error('Auto-classify error:', err);
    } finally {
      setIsClassifying(false);
    }
  }, []);

  // ── Debounced Real-Time Trigger ──────────────────────────────────────────
  // Fires 1.2s after user stops typing in name or description
  const triggerDebounced = useCallback((name: string, description: string, category: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const input = (description || name).trim();
    if (input.length < 5) {
      setClassifyStatus('idle');
      return;
    }
    setClassifyStatus('classifying'); // Show spinner immediately
    debounceRef.current = setTimeout(() => {
      runAutoClassify(name, description, category);
    }, 1200);
  }, [runAutoClassify]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const updated = { ...formData, [e.target.name]: e.target.value };
    setFormData(updated);

    // Trigger real-time auto-classify only when relevant fields change
    if (['name', 'description', 'category'].includes(e.target.name)) {
      triggerDebounced(updated.name, updated.description, updated.category);
    }
  };

  // Manual classify button
  const handleClassifyHSCode = async () => {
    const input = (formData.description || formData.name).trim();
    if (!input) {
      setError('Please provide a product name or description first.');
      setTimeout(() => setError(''), 3000);
      return;
    }
    lastClassifiedInput.current = ''; // Force re-run even if same input
    await runAutoClassify(formData.name, formData.description, formData.category);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setError('');
    for (const file of files) {
      if (file.size > 2 * 1024 * 1024) {
        setError('Image must be under 2MB');
        setTimeout(() => setError(''), 5000);
        continue;
      }
      try {
        setLoading(true);
        const publicUrl = await uploadToSupabase(file, 'products');
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, publicUrl].slice(0, 4)
        }));
      } catch (err: any) {
        setError(err.message || 'Failed to upload image.');
        setTimeout(() => setError(''), 5000);
      } finally {
        setLoading(false);
      }
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setError('');

    if (user.role === 'free_trader' && productCount >= 5 && !editId) {
      setError('You have reached the 5 product limit for Starter Plan. Upgrade to Pro in "Upgrade Plan".');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('grawizah_token');
      const payload = {
        ...formData,
        company_id: user.id,
        price_range_min: parseFloat(formData.price_range_min),
        price_range_max: parseFloat(formData.price_range_max),
        moq: parseInt(formData.moq || '0', 10),
        images: formData.images,
      };

      const endpoint = editId ? `${API_URL}/api/products/${editId}` : `${API_URL}/api/products`;
      const method = editId ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Failed to ${editId ? 'update' : 'add'} product`);
      }

      router.push('/dashboard/products');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 w-full min-h-full font-sans">
      <header className="mb-8">
        <Link href="/dashboard/products" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors text-xs font-black uppercase tracking-widest mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Catalog
        </Link>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <Package className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{editId ? 'Update Listing' : 'New Listing'}</span>
        </div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{editId ? 'Edit Intelligence Node' : 'Add Intelligence Node'}</h1>
      </header>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 rounded-xl text-sm font-bold border border-red-200 dark:border-red-800/30 flex items-center gap-2 animate-fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-dark-surface-container-low rounded-[2rem] p-8 shadow-sm border border-gray-100 dark:border-dark-surface-variant/20 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Image Upload */}
          <div className="md:col-span-2 space-y-3 mb-4">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Product Gallery (Max 4)</label>
            <div className="flex flex-wrap gap-4 items-start">
              {formData.images.map((img, idx) => (
                <div key={idx} className="relative w-32 h-32 rounded-2xl overflow-hidden group border border-gray-100 dark:border-dark-surface-variant/20 shadow-sm">
                  <img src={img} alt={`Product ${idx + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button type="button" onClick={() => removeImage(idx)} className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {formData.images.length < 4 && (
                <label className="w-32 h-32 rounded-2xl border-2 border-dashed border-gray-200 dark:border-dark-surface-variant/30 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group bg-gray-50 dark:bg-dark-surface-container">
                  {loading ? <Loader2 className="w-6 h-6 text-primary animate-spin" /> : <Upload className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors" />}
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{loading ? 'Uploading...' : 'Upload'}</span>
                  <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              )}
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase">Recommended: 800x800px. Max Size: 2MB.</p>
          </div>

          {/* Product Name */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Product Name</label>
            <input
              required
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Parfum Arabica Blend 100ml"
              className="w-full bg-gray-50 dark:bg-dark-surface-container border-none rounded-2xl px-5 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/20 transition-all dark:text-white"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Category</label>
            <div className="relative">
              <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                required
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. Cosmetics & Fragrances"
                className="w-full bg-gray-50 dark:bg-dark-surface-container border-none rounded-2xl pl-12 pr-5 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/20 transition-all dark:text-white"
              />
            </div>
          </div>

          {/* HS Code with Real-Time Auto-Classify */}
          <div className="space-y-2">
            <div className="flex items-center justify-between ml-1 gap-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">HS Code</label>
              <div className="flex items-center gap-2">
                {/* Status chip */}
                {classifyStatus === 'classifying' && (
                  <span className="flex items-center gap-1 text-[9px] font-black text-purple-500 bg-purple-50 dark:bg-purple-950/30 px-2 py-0.5 rounded-full uppercase tracking-widest animate-pulse">
                    <Loader2 className="w-2.5 h-2.5 animate-spin" /> AI Classifying...
                  </span>
                )}
                {classifyStatus === 'done' && (
                  <span className="flex items-center gap-1 text-[9px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full uppercase tracking-widest">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    {classifyConfidence ? `${Math.round(classifyConfidence * 100)}% conf` : 'AI Classified'}
                  </span>
                )}
                {classifyStatus === 'error' && (
                  <span className="flex items-center gap-1 text-[9px] font-black text-red-500 bg-red-50 dark:bg-red-950/30 px-2 py-0.5 rounded-full uppercase tracking-widest">
                    <AlertCircle className="w-2.5 h-2.5" /> Failed
                  </span>
                )}
                {/* Manual classify button */}
                <button
                  type="button"
                  onClick={handleClassifyHSCode}
                  disabled={isClassifying}
                  title="Classify HS Code using Grawizah AI"
                  className="flex items-center gap-1.5 text-[10px] font-black text-primary hover:text-primary/80 bg-primary/5 hover:bg-primary/10 px-3 py-1 rounded-full uppercase tracking-widest transition-all disabled:opacity-50"
                >
                  {isClassifying ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                  Auto-Classify
                </button>
              </div>
            </div>
            <div className="relative">
              <input
                required
                name="hs_code"
                value={formData.hs_code}
                onChange={handleChange}
                placeholder="e.g. 3303.00.00"
                className={`w-full bg-gray-50 dark:bg-dark-surface-container border-2 rounded-2xl px-5 py-3 text-sm font-semibold outline-none transition-all dark:text-white ${
                  classifyStatus === 'done'
                    ? 'border-emerald-200 dark:border-emerald-800/50 focus:ring-2 focus:ring-emerald-200'
                    : classifyStatus === 'classifying'
                    ? 'border-purple-200 dark:border-purple-800/50 focus:ring-2 focus:ring-purple-200 animate-pulse'
                    : 'border-transparent focus:ring-2 focus:ring-primary/20'
                }`}
              />
              {classifyStatus === 'classifying' && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Sparkles className="w-4 h-4 text-purple-400 animate-spin" />
                </div>
              )}
              {classifyStatus === 'done' && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
              )}
            </div>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">
              ✨ Auto-classifies as you type product name or description
            </p>
          </div>

          {/* Min Price */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Min Price</label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input required type="number" step="0.01" name="price_range_min" value={formData.price_range_min} onChange={handleChange} placeholder="100.00" className="w-full bg-gray-50 dark:bg-dark-surface-container border-none rounded-2xl pl-12 pr-5 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/20 transition-all dark:text-white" />
            </div>
          </div>

          {/* Max Price */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Max Price</label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input required type="number" step="0.01" name="price_range_max" value={formData.price_range_max} onChange={handleChange} placeholder="500.00" className="w-full bg-gray-50 dark:bg-dark-surface-container border-none rounded-2xl pl-12 pr-5 py-3 text-sm font-semibold outline-all focus:ring-2 focus:ring-primary/20 transition-all dark:text-white" />
            </div>
          </div>

          {/* MOQ */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">MOQ (Minimum Order Qty)</label>
            <div className="relative">
              <Box className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input required name="moq" value={formData.moq} onChange={handleChange} placeholder="e.g. 50 Units" className="w-full bg-gray-50 dark:bg-dark-surface-container border-none rounded-2xl pl-12 pr-5 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/20 transition-all dark:text-white" />
            </div>
          </div>

          {/* Currency */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Currency</label>
            <select name="currency" value={formData.currency} onChange={handleChange} className="w-full bg-gray-50 dark:bg-dark-surface-container border-none rounded-2xl px-5 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/20 transition-all dark:text-white">
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="IDR">IDR (Rp)</option>
            </select>
          </div>

          {/* Description */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Technical Description</label>
            <textarea
              required
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Detailed product specifications, ingredients, usage, certifications..."
              className="w-full bg-gray-50 dark:bg-dark-surface-container border-none rounded-2xl px-5 py-4 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/20 transition-all dark:text-white"
            />
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">
              💡 More detailed description = more accurate AI HS Code classification
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <Link
            href="/dashboard/products"
            className="px-6 py-3.5 border border-gray-200 dark:border-dark-surface-variant/30 text-gray-500 dark:text-gray-400 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {loading ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {editId ? 'Update Node' : 'Deploy Node'}
          </button>
        </div>
      </form>
    </div>
  );
}
