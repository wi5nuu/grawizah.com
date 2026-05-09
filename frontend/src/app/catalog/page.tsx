'use client';

import { useState } from 'react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import ProductCard from '@/components/ProductCard';
import { Search, Grid, List, SlidersHorizontal, Building2, X, Sparkles, TrendingUp, Filter } from 'lucide-react';
import { PRODUCT_CATEGORIES, COUNTRIES } from '@/lib/constants';
import Link from 'next/link';

const MOCK_PRODUCTS = [
  { id: '1', name: 'Premium Virgin Coconut Oil', description: 'Cold-pressed, organic virgin coconut oil from Indonesian plantations. High lauric acid content, ideal for food and cosmetic applications.', hs_code: '151311', category: 'Agriculture', country_origin: 'Indonesia', price_range_min: 800, price_range_max: 1200, currency: 'USD', moq: 1000, images: [], listing_score: 92, view_count: 1247, inquiry_count: 34, company_id: 'c1', created_at: '', updated_at: '' },
  { id: '2', name: 'Arabica Coffee Beans - Grade 1', description: 'Single-origin Arabica beans from Gayo highlands, Aceh. Specialty grade with cupping score above 84.', hs_code: '090111', category: 'Food & Beverage', country_origin: 'Indonesia', price_range_min: 3500, price_range_max: 5000, currency: 'USD', moq: 500, images: [], listing_score: 88, view_count: 892, inquiry_count: 28, company_id: 'c2', created_at: '', updated_at: '' },
  { id: '3', name: 'Teak Wood Planks - KD Certified', description: 'Kiln-dried plantation teak wood planks. FSC certified, suitable for furniture and decking.', hs_code: '440729', category: 'Construction Materials', country_origin: 'Indonesia', price_range_min: 600, price_range_max: 900, currency: 'USD', moq: 50, images: [], listing_score: 85, view_count: 678, inquiry_count: 19, company_id: 'c3', created_at: '', updated_at: '' },
  { id: '4', name: 'Organic Turmeric Powder', description: 'Premium quality organic turmeric powder with high curcumin content. USDA Organic and EU Organic certified.', hs_code: '091030', category: 'Agriculture', country_origin: 'Indonesia', price_range_min: 2000, price_range_max: 3500, currency: 'USD', moq: 200, images: [], listing_score: 79, view_count: 543, inquiry_count: 15, company_id: 'c1', created_at: '', updated_at: '' },
  { id: '5', name: 'Rattan Furniture Set', description: 'Handcrafted natural rattan furniture set. Includes 2 chairs and 1 table. Indoor and outdoor use.', hs_code: '940179', category: 'Furniture', country_origin: 'Indonesia', price_range_min: 150, price_range_max: 400, currency: 'USD', moq: 20, images: [], listing_score: 76, view_count: 421, inquiry_count: 12, company_id: 'c4', created_at: '', updated_at: '' },
  { id: '6', name: 'Batik Fabric - Premium Cotton', description: 'Hand-drawn batik on premium cotton. Traditional Javanese patterns, suitable for fashion and home decor.', hs_code: '520852', category: 'Textiles', country_origin: 'Indonesia', price_range_min: 15, price_range_max: 45, currency: 'USD', moq: 100, images: [], listing_score: 72, view_count: 356, inquiry_count: 8, company_id: 'c5', created_at: '', updated_at: '' },
];

export default function CatalogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = MOCK_PRODUCTS.filter((p) => {
    const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = !selectedCategory || p.category === selectedCategory;
    const matchCountry = !selectedCountry || p.country_origin === selectedCountry;
    return matchSearch && matchCategory && matchCountry;
  });

  const activeFilterCount = [selectedCategory, selectedCountry].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* ─── Hero Section ─── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-800 to-accent-700">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        </div>

        <div className="relative container mx-auto px-6 py-14">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-primary-200 mb-6">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <span>/</span>
            <span className="text-white font-medium">Catalog</span>
          </nav>

          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur text-white/90 px-3 py-1.5 rounded-full text-xs font-medium mb-4">
              <Sparkles className="w-3.5 h-3.5" /> AI-Ranked Results
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Global Product Catalog</h1>
            <p className="text-primary-100 text-lg mb-8">
              Discover AI-ranked products from verified suppliers worldwide
            </p>

            {/* Search bar */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products, HS codes, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/95 backdrop-blur text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium transition-all shadow-lg ${showFilters || activeFilterCount > 0
                  ? 'bg-white text-primary-700'
                  : 'bg-white/20 backdrop-blur text-white hover:bg-white/30'
                  }`}
              >
                <SlidersHorizontal className="w-5 h-5" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* Filter panel */}
            {showFilters && (
              <div className="mt-4 flex flex-wrap items-center gap-3 animate-slide-up">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2.5 rounded-lg bg-white/90 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  <option value="">All Categories</option>
                  {PRODUCT_CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="px-4 py-2.5 rounded-lg bg-white/90 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  <option value="">All Countries</option>
                  {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2.5 rounded-lg bg-white/90 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  <option value="relevance">Sort: Relevance</option>
                  <option value="score">Sort: AI Score</option>
                  <option value="views">Sort: Most Viewed</option>
                  <option value="inquiries">Sort: Most Inquired</option>
                </select>
                {activeFilterCount > 0 && (
                  <button
                    onClick={() => { setSelectedCategory(''); setSelectedCountry(''); setSearchQuery(''); }}
                    className="flex items-center gap-1 px-3 py-2.5 text-sm text-white/80 hover:text-white transition"
                  >
                    <X className="w-4 h-4" /> Clear all
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-6 mt-8 text-sm">
            <div className="flex items-center gap-2 text-white/90">
              <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span><strong className="text-white">{MOCK_PRODUCTS.length}</strong> Products</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <span><strong className="text-white">AI</strong> Ranked</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Catalog Tabs */}
        <div className="flex items-center gap-4 mb-6 border-b border-gray-200 pb-3">
          <span className="px-4 py-2 rounded-lg text-sm font-semibold bg-primary-100 text-primary-700">
            Products
          </span>
          <Link href="/catalog/suppliers" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 transition flex items-center gap-1.5">
            <Building2 className="w-4 h-4" /> Supplier Directory
          </Link>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-900">{filteredProducts.length}</span> products
            {searchQuery && <span> for &ldquo;{searchQuery}&rdquo;</span>}
          </p>
          <div className="flex items-center gap-2">
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-primary-100 text-primary-700' : 'text-gray-400 hover:bg-gray-100'}`}>
              <Grid className="w-5 h-5" />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-primary-100 text-primary-700' : 'text-gray-400 hover:bg-gray-100'}`}>
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product as any} viewMode={viewMode} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Search className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory(''); setSelectedCountry(''); }}
              className="btn-primary"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
