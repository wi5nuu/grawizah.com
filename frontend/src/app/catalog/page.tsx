'use client';

import { useState } from 'react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import ProductCard from '@/components/ProductCard';
import { PRODUCT_CATEGORIES, COUNTRIES } from '@/lib/constants';
import Link from 'next/link';

const MOCK_PRODUCTS = [
  { id: '1', name: 'Advanced Processor Modules PX-9', description: 'High-performance processor module for enterprise computing. Multi-threaded architecture with advanced thermal management.', hs_code: '854231', category: 'Electronics', country_origin: 'China', price_range_min: 1200, price_range_max: 1500, currency: 'USD', moq: 100, images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAWe9F2uj9__k5b3Glco3dNMrJ7kgrbIjPup-q58O8AFM70XCmtVDu0USZ75Xpz0jct5WNxhxqJ5bxsxLjdIXc6-ug-O_fgg2Qm7sivePJXwF27OkI6wnuo_XnzpSO1zR6HMLgn5-pVcNli_zazJqviM7uPZYVzKg0l0n3Jn2oIuv2ppIO4yeCCUfVMg-0OpDAHWfIIBGGqV3dbf-rwP5R3we5ct9pJ0k4mNOlQ-p1NuQAFWfnlSeAghCPVbPUlVjxqIkffWa37e8HG'], listing_score: 92, view_count: 1247, inquiry_count: 34, company_id: 'c1', created_at: '', updated_at: '' },
  { id: '2', name: 'Precision Automation Actuators', description: 'Industrial-grade precision actuators for robotics and automation systems. High torque output with minimal backlash.', hs_code: '847989', category: 'Machinery', country_origin: 'Germany', price_range_min: 450, price_range_max: 600, currency: 'USD', moq: 50, images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBkNs8MiEKaXvJ9zRl1qpDCapg8SuKDBbnnkEg8GQj1HJKrT5e3PZ3jMe048DYZDify3yiPKu7AGVIyxHITiVavEGjk9XkuHTy37-3aHutlAY4DntRZGETqmWy2LSZXq7ewTlXl87ci_tD0wAhGlTD46TIqyjymVVjZ9qEM4M98XUHoB54VEHZq2AN8SCb1efMWTGEXmfIcJTOT0uLQCAQjvEmnzsPz4sm4L-Ss6LGYmeayBfx50arcP-1BDkyAIC4nLbk9w6g6xfJz'], listing_score: 88, view_count: 892, inquiry_count: 28, company_id: 'c2', created_at: '', updated_at: '' },
  { id: '3', name: 'Enterprise Server Blade G-Series', description: 'High-density server blade for data center deployment. Features redundant power, hot-swap storage, and advanced cooling.', hs_code: '851762', category: 'Electronics', country_origin: 'USA', price_range_min: 3200, price_range_max: 4100, currency: 'USD', moq: 10, images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAo76yh4HPGol9HY7DSvkB21xboMW9eohxbZUGRxEO2q8UVymjlAYDopGzJT188cEOX-yf8T_4lbfWwt-GBzgOC6JeviCbMy78yAIBQQ6gqdoktGl9tLCOlD2OdrmO-oyc5v3xGsip5WWElRAMcQMfK_elvwgSEY8NYHBATxT63us-rOKVy8cmDfPHsr-IEZ9OXrFWjCWb8U18Csip4T9K00DNs8DvLhuBOA-pvfgLuQMbB2Gyb4BeFX5KUCqWszg3fDufI0_8ZgME6'], listing_score: 85, view_count: 678, inquiry_count: 19, company_id: 'c3', created_at: '', updated_at: '' },
  { id: '4', name: 'Organic Turmeric Powder', description: 'Premium quality organic turmeric powder with high curcumin content. USDA Organic and EU Organic certified.', hs_code: '091030', category: 'Agriculture', country_origin: 'Indonesia', price_range_min: 2000, price_range_max: 3500, currency: 'USD', moq: 200, images: [], listing_score: 79, view_count: 543, inquiry_count: 15, company_id: 'c1', created_at: '', updated_at: '' },
  { id: '5', name: 'Rattan Furniture Set', description: 'Handcrafted natural rattan furniture set. Includes 2 chairs and 1 table. Indoor and outdoor use.', hs_code: '940179', category: 'Furniture', country_origin: 'Indonesia', price_range_min: 150, price_range_max: 400, currency: 'USD', moq: 20, images: [], listing_score: 76, view_count: 421, inquiry_count: 12, company_id: 'c4', created_at: '', updated_at: '' },
  { id: '6', name: 'Batik Fabric - Premium Cotton', description: 'Hand-drawn batik on premium cotton. Traditional Javanese patterns, suitable for fashion and home decor.', hs_code: '520852', category: 'Textiles', country_origin: 'Indonesia', price_range_min: 15, price_range_max: 45, currency: 'USD', moq: 100, images: [], listing_score: 72, view_count: 356, inquiry_count: 8, company_id: 'c5', created_at: '', updated_at: '' },
];

export default function CatalogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [verifiedOnly, setVerifiedOnly] = useState(true);
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [loading, setLoading] = useState(false);

  const filteredProducts = products.filter((p) => {
    const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = !selectedCategory || p.category === selectedCategory;
    const matchCountry = !selectedCountry || p.country_origin === selectedCountry;
    return matchSearch && matchCategory && matchCountry;
  });

  const handleSortChange = async (val: string) => {
    setSortBy(val);
    if (val === 'ai') {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:8080/api/products?sort=ai`);
        const result = await res.json();
        // Map backend mock to frontend mock structure if needed
        if (result.data) {
          // Merge with some mock data for display since backend mock is sparse
          const aiRanked = result.data.map((p: any) => ({
             ...MOCK_PRODUCTS.find(mp => mp.id === p.id.replace('p', '')), // Match ID
             ai_score: p.ai_score,
             ai_metrics: p.ai_metrics
          })).filter((p: any) => p.id);
          setProducts(aiRanked.length > 0 ? aiRanked : MOCK_PRODUCTS);
        }
      } catch {} finally { setLoading(false); }
    } else {
      setProducts(MOCK_PRODUCTS);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background">
      <Navbar />

      <main className="flex-1 mt-10 mb-16 max-w-[1440px] w-full mx-auto px-8 lg:px-16 flex flex-col gap-10">
        {/* Hero & Search */}
        <section className="bg-gradient-to-r from-[#5300b7] to-[#2563eb] rounded-xl p-12 text-white flex flex-col items-center justify-center text-center relative overflow-hidden shadow-lg">
          <h1 className="font-display font-extrabold text-4xl mb-4 relative z-10">Product Catalog</h1>
          <p className="font-body text-base text-white/90 max-w-2xl mb-8 relative z-10">Discover verified global trade products, suppliers, and market intelligence.</p>
          <div className="w-full max-w-2xl relative z-10 flex bg-white rounded-lg p-2 shadow-xl items-center">
            <span className="material-symbols-outlined text-gray-400 ml-3 mr-2">search</span>
            <input
              className="flex-1 bg-transparent border-none focus:ring-0 text-gray-900 font-body outline-none text-sm"
              placeholder="Search by product name, HS Code, or supplier..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="bg-[#5300b7] hover:bg-[#430099] text-white px-6 py-2.5 rounded-md font-bold text-sm transition-colors whitespace-nowrap">
              Search Products
            </button>
          </div>
        </section>

        {/* Layout Wrapper */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filter Sidebar */}
          <aside className="w-full md:w-64 flex-shrink-0 flex flex-col gap-6">
            <div className="bg-surface-container-lowest rounded-xl border border-surface-variant/50 p-6" style={{ boxShadow: '0 4px 24px rgba(109,40,217,0.04)' }}>
              <h2 className="font-headline font-bold text-lg mb-4 text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">tune</span>
                Filters
              </h2>
              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-label font-semibold text-sm text-on-surface-variant uppercase tracking-wider mb-3">Category</h3>
                <div className="flex flex-col gap-2">
                  {['Electronics', 'Machinery', 'Textiles', 'Agriculture'].map((cat) => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedCategory === cat}
                        onChange={() => setSelectedCategory(selectedCategory === cat ? '' : cat)}
                        className="form-checkbox text-primary rounded border-outline focus:ring-primary/20"
                      />
                      <span className="text-sm font-body text-on-surface group-hover:text-primary transition-colors">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>
              {/* Country */}
              <div className="mb-6">
                <h3 className="font-label font-semibold text-sm text-on-surface-variant uppercase tracking-wider mb-3">Origin Country</h3>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full bg-surface-container-low border border-surface-variant rounded-lg p-2 text-sm font-body focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none"
                >
                  <option value="">All Countries</option>
                  {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              {/* Verification Status */}
              <div>
                <h3 className="font-label font-semibold text-sm text-on-surface-variant uppercase tracking-wider mb-3">Supplier Status</h3>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" checked={verifiedOnly} onChange={() => setVerifiedOnly(!verifiedOnly)} className="form-checkbox text-secondary rounded border-outline focus:ring-secondary/20" />
                  <span className="text-sm font-body text-on-surface group-hover:text-secondary transition-colors font-medium">Verified Suppliers Only</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Results Header */}
            <div className="flex justify-between items-center">
              <span className="font-body text-on-surface-variant text-sm">
                Showing <strong className="text-on-surface">1-{filteredProducts.length}</strong> of {MOCK_PRODUCTS.length} products
              </span>
              <div className="flex items-center gap-2">
                <span className="font-body text-sm text-on-surface-variant">Sort by:</span>
                <select value={sortBy} onChange={(e) => handleSortChange(e.target.value)} className="bg-transparent border-none text-sm font-label font-medium text-primary focus:ring-0 cursor-pointer">
                  <option value="relevance">Relevance</option>
                  <option value="ai">AI Ranked (Smart Match)</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>

            {loading && (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-on-surface-variant font-medium animate-pulse">AI is calculating optimal matches...</p>
              </div>
            )}

            {!loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product as any} viewMode="grid" />
                ))}
              </div>
            )}

            {filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <span className="material-symbols-outlined text-6xl text-outline-variant mb-4 block">search_off</span>
                <h3 className="text-xl font-semibold text-on-surface mb-2">No products found</h3>
                <p className="text-on-surface-variant mb-6">Try adjusting your search or filter criteria</p>
                <button onClick={() => { setSearchQuery(''); setSelectedCategory(''); setSelectedCountry(''); }} className="btn-primary">Clear All Filters</button>
              </div>
            )}

            {/* Pagination */}
            <div className="mt-8 flex justify-center gap-2">
              <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-surface-variant text-on-surface-variant hover:border-primary hover:text-primary transition-colors">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-on-primary font-bold">1</button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-surface-variant text-on-surface-variant hover:border-primary hover:text-primary transition-colors">2</button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-surface-variant text-on-surface-variant hover:border-primary hover:text-primary transition-colors">3</button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-surface-variant text-on-surface-variant hover:border-primary hover:text-primary transition-colors">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
