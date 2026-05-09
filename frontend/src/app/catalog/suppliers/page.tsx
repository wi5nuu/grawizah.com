'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

const MOCK_SUPPLIERS = [
  { id: '1', name: 'Nexus Manufacturing', country: 'Germany', icon: 'factory', rating: 4.8, reviews: 124, certs: ['ISO 9001', 'CE Marked'], markets: 'EU, North America, Middle East' },
  { id: '2', name: 'AeroTech Solutions', country: 'Taiwan', icon: 'precision_manufacturing', rating: 5.0, reviews: 89, certs: ['AS9100', 'ISO 14001'], markets: 'Global' },
  { id: '3', name: 'BioChem Synthetics', country: 'India', icon: 'science', rating: 4.2, reviews: 312, certs: ['GMP', 'REACH'], markets: 'Asia, Europe, Africa' },
  { id: '4', name: 'Pacific Textiles Co.', country: 'Indonesia', icon: 'checkroom', rating: 4.5, reviews: 198, certs: ['OEKO-TEX', 'GOTS'], markets: 'EU, USA, Japan' },
  { id: '5', name: 'SteelForge Industries', country: 'China', icon: 'hardware', rating: 4.6, reviews: 267, certs: ['ISO 9001', 'ISO 14001'], markets: 'Global' },
  { id: '6', name: 'AgriPure Exports', country: 'Brazil', icon: 'eco', rating: 4.3, reviews: 145, certs: ['USDA Organic', 'Fair Trade'], markets: 'North America, EU' },
];

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="flex text-amber-400">
      {Array.from({ length: full }).map((_, i) => (
        <span key={i} className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
      ))}
      {half && <span className="material-symbols-outlined text-[18px]">star_half</span>}
      {Array.from({ length: 5 - full - (half ? 1 : 0) }).map((_, i) => (
        <span key={`e${i}`} className="material-symbols-outlined text-[18px]">star_border</span>
      ))}
    </div>
  );
}

export default function SupplierDirectoryPage() {
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('');
  const [cert, setCert] = useState('');

  const filtered = MOCK_SUPPLIERS.filter((s) => {
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-surface dark:bg-dark-background text-on-surface dark:text-dark-on-surface">
      <Navbar />

      <main className="flex-1 pt-20">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16 py-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center text-sm text-on-surface-variant dark:text-dark-on-surface-variant mb-6 font-medium">
            <Link href="/catalog" className="hover:text-primary transition-colors">Catalog</Link>
            <span className="material-symbols-outlined text-[16px] mx-2">chevron_right</span>
            <span className="text-primary dark:text-dark-primary font-semibold">Suppliers</span>
          </nav>

          {/* Hero Section */}
          <div className="relative overflow-hidden rounded-2xl bg-surface-container-lowest dark:bg-dark-surface-container border border-surface-variant dark:border-dark-surface-variant mb-12">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 p-12 lg:p-16 text-center">
              <h1 className="text-4xl lg:text-5xl font-display font-bold mb-4">Supplier Directory</h1>
              <p className="text-lg text-on-surface-variant dark:text-dark-on-surface-variant max-w-2xl mx-auto mb-8">Discover and connect with vetted global suppliers.</p>

              <div className="max-w-4xl mx-auto bg-surface dark:bg-dark-surface-container-low p-2 rounded-xl border border-surface-variant/50 dark:border-dark-surface-variant/50 flex flex-wrap lg:flex-nowrap gap-2 items-center shadow-ambient">
                <div className="flex-1 min-w-[200px] relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                  <input className="w-full pl-10 pr-4 py-3 bg-transparent border-none focus:ring-2 focus:ring-secondary rounded-lg text-sm placeholder:text-on-surface-variant" placeholder="Search suppliers..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <div className="h-8 w-px bg-surface-variant hidden lg:block" />
                <div className="flex-1 min-w-[150px] relative">
                  <select value={region} onChange={(e) => setRegion(e.target.value)} className="w-full pl-4 pr-10 py-3 bg-transparent border-none focus:ring-2 focus:ring-secondary rounded-lg text-sm appearance-none font-medium">
                    <option value="">All Regions</option><option>Asia Pacific</option><option>Europe</option><option>North America</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                </div>
                <button className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity w-full lg:w-auto">Search</button>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 stagger-children">
            {filtered.map((supplier) => (
              <div key={supplier.id} className="bg-surface-container-lowest dark:bg-dark-surface-container rounded-2xl border border-surface-variant dark:border-dark-surface-variant p-6 hover-lift transition-all duration-300 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-surface-container dark:bg-dark-surface-container-high flex items-center justify-center border border-surface-variant dark:border-dark-surface-variant">
                      <span className="material-symbols-outlined text-on-surface-variant text-2xl">{supplier.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg leading-tight">{supplier.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-on-surface-variant mt-1">
                        <span className="material-symbols-outlined text-[16px]">location_on</span>
                        {supplier.country}
                      </div>
                    </div>
                  </div>
                  <button className="text-on-surface-variant hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">bookmark_border</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <StarRating rating={supplier.rating} />
                  <span className="text-sm font-semibold">{supplier.rating}</span>
                  <span className="text-xs text-on-surface-variant">({supplier.reviews} reviews)</span>
                </div>

                <div className="mb-4 flex-1">
                  <p className="text-xs font-semibold text-on-surface-variant mb-2 uppercase tracking-wider">Certifications</p>
                  <div className="flex flex-wrap gap-2">
                    {supplier.certs.map((c) => (
                      <span key={c} className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold rounded uppercase tracking-wide border border-emerald-200 dark:border-emerald-700">{c}</span>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-xs font-semibold text-on-surface-variant mb-2 uppercase tracking-wider">Top Markets</p>
                  <p className="text-sm">{supplier.markets}</p>
                </div>

                <Link href={`/supplier/${supplier.id}`} className="w-full border-2 border-primary dark:border-dark-primary text-primary dark:text-dark-primary hover:bg-primary/5 py-2 rounded-lg font-semibold transition-colors mt-auto text-center block">
                  View Profile
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
