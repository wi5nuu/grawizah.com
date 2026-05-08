'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import ProductCard from '@/components/ProductCard';
import { Search, Filter, Grid, List, SlidersHorizontal, Building2 } from 'lucide-react';
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = MOCK_PRODUCTS.filter((p) => {
    const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = !selectedCategory || p.category === selectedCategory;
    const matchCountry = !selectedCountry || p.country_origin === selectedCountry;
    return matchSearch && matchCategory && matchCountry;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <div className="bg-gradient-to-r from-primary-700 to-accent-600 py-12">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Global Product Catalog</h1>
          <p className="text-primary-100 text-lg">AI-ranked products from verified suppliers worldwide</p>

          <div className="mt-8 flex gap-3">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products, HS codes, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/95 backdrop-blur text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className="px-5 py-3.5 bg-white/20 backdrop-blur rounded-xl text-white hover:bg-white/30 transition flex items-center gap-2 font-medium">
              <SlidersHorizontal className="w-5 h-5" /> Filters
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Filters */}
        {showFilters && (
          <div className="card mb-6 animate-slide-up">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="select-field">
                  <option value="">All Categories</option>
                  {PRODUCT_CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Country of Origin</label>
                <select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)} className="select-field">
                  <option value="">All Countries</option>
                  {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex items-end">
                <button onClick={() => { setSelectedCategory(''); setSelectedCountry(''); setSearchQuery(''); }} className="btn-ghost text-sm">
                  Clear All
                </button>
              </div>
            </div>
          </div>
        )}

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
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
