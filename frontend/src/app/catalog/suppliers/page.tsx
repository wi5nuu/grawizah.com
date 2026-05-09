'use client';

import { useState } from 'react';
import DashboardSidebar from '@/components/ui/DashboardSidebar';
import Link from 'next/link';

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
    <div className="min-h-screen flex bg-surface text-on-surface">
      <DashboardSidebar />

      <main className="flex-1 md:ml-64 bg-background min-h-screen">
        {/* Mobile Nav */}
        <header className="md:hidden bg-surface-container-low border-b border-surface-variant/30 p-4 flex justify-between items-center sticky top-0 z-50">
          <h1 className="text-xl font-display font-extrabold text-primary">Grawizah</h1>
          <button className="text-on-surface"><span className="material-symbols-outlined">menu</span></button>
        </header>

        <div className="max-w-[1440px] mx-auto px-6 lg:px-16 py-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center text-sm text-on-surface-variant mb-6 font-medium">
            <Link href="/catalog" className="hover:text-primary transition-colors">Catalog</Link>
            <span className="material-symbols-outlined text-[16px] mx-2">chevron_right</span>
            <span className="text-primary font-semibold">Suppliers</span>
          </nav>

          {/* Hero Section */}
          <div className="relative overflow-hidden rounded-2xl bg-surface-container-lowest border border-surface-variant mb-12">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 p-12 lg:p-16 text-center">
              <h1 className="text-4xl lg:text-5xl font-display font-bold text-on-surface mb-4">Supplier Directory</h1>
              <p className="text-lg text-on-surface-variant max-w-2xl mx-auto mb-8">Discover and connect with vetted global suppliers. Filter by region, certification, and trade volume to find your ideal partners.</p>

              {/* Advanced Filters Bar */}
              <div className="max-w-4xl mx-auto bg-surface p-2 rounded-xl border border-surface-variant/50 flex flex-wrap lg:flex-nowrap gap-2 items-center" style={{ boxShadow: '0 4px 24px rgba(109,40,217,0.08)' }}>
                <div className="flex-1 min-w-[200px] relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                  <input
                    className="w-full pl-10 pr-4 py-3 bg-transparent border-none focus:ring-2 focus:ring-secondary rounded-lg text-sm text-on-surface placeholder:text-on-surface-variant"
                    placeholder="Search suppliers, products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className="h-8 w-px bg-surface-variant hidden lg:block" />
                <div className="flex-1 min-w-[150px] relative">
                  <select value={region} onChange={(e) => setRegion(e.target.value)} className="w-full pl-4 pr-10 py-3 bg-transparent border-none focus:ring-2 focus:ring-secondary rounded-lg text-sm text-on-surface appearance-none font-medium">
                    <option value="">All Regions</option>
                    <option>Asia Pacific</option>
                    <option>Europe</option>
                    <option>North America</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                </div>
                <div className="h-8 w-px bg-surface-variant hidden lg:block" />
                <div className="flex-1 min-w-[150px] relative">
                  <select value={cert} onChange={(e) => setCert(e.target.value)} className="w-full pl-4 pr-10 py-3 bg-transparent border-none focus:ring-2 focus:ring-secondary rounded-lg text-sm text-on-surface appearance-none font-medium">
                    <option value="">Any Certification</option>
                    <option>ISO 9001</option>
                    <option>Fair Trade</option>
                    <option>Organic</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                </div>
                <button className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity w-full lg:w-auto">
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Trust Bar */}
          <div className="flex flex-wrap justify-center gap-8 mb-12 p-6 bg-surface-container-low rounded-xl border border-surface-variant/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary"><span className="material-symbols-outlined">verified</span></div>
              <div><p className="font-bold text-on-surface">Verified Suppliers</p><p className="text-xs text-on-surface-variant">10,000+ vetted partners</p></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary"><span className="material-symbols-outlined">workspace_premium</span></div>
              <div><p className="font-bold text-on-surface">Certified Quality</p><p className="text-xs text-on-surface-variant">ISO & Industry standards</p></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-tertiary-container/10 flex items-center justify-center text-tertiary-container"><span className="material-symbols-outlined">public</span></div>
              <div><p className="font-bold text-on-surface">Global Reach</p><p className="text-xs text-on-surface-variant">150+ Export Markets</p></div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {filtered.map((supplier) => (
              <div key={supplier.id} className="bg-surface-container-lowest rounded-[16px] border border-surface-variant p-6 hover:-translate-y-1 transition-all duration-300 flex flex-col" style={{ boxShadow: '0 4px 24px rgba(109,40,217,0.04)' }}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center border border-surface-variant">
                      <span className="material-symbols-outlined text-on-surface-variant text-2xl">{supplier.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-on-surface leading-tight">{supplier.name}</h3>
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
                  <span className="text-sm font-semibold text-on-surface">{supplier.rating}</span>
                  <span className="text-xs text-on-surface-variant">({supplier.reviews} reviews)</span>
                </div>

                <div className="mb-4 flex-1">
                  <p className="text-xs font-semibold text-on-surface-variant mb-2 uppercase tracking-wider">Certifications</p>
                  <div className="flex flex-wrap gap-2">
                    {supplier.certs.map((c) => (
                      <span key={c} className="px-2 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded uppercase tracking-wide border border-emerald-200">{c}</span>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-xs font-semibold text-on-surface-variant mb-2 uppercase tracking-wider">Top Markets</p>
                  <p className="text-sm text-on-surface">{supplier.markets}</p>
                </div>

                <Link href={`/supplier/${supplier.id}`} className="w-full border-2 border-primary text-primary hover:bg-surface-container-low py-2 rounded-lg font-semibold transition-colors mt-auto text-center block">
                  View Profile
                </Link>
              </div>
            ))}
          </div>

          {/* CTA Banner */}
          <div className="bg-gradient-to-br from-primary-container to-secondary-container rounded-2xl p-8 lg:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 mb-16 relative overflow-hidden">
            <div className="relative z-10 max-w-xl">
              <h2 className="text-3xl font-display font-bold mb-4">Can&apos;t Find the Right Supplier?</h2>
              <p className="text-on-primary-container text-lg">Let our intelligence engine find the perfect match for your specific requirements. Submit an RFQ and get curated recommendations within 24 hours.</p>
            </div>
            <button className="relative z-10 bg-white text-primary-container px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:scale-105 transition-transform whitespace-nowrap">
              Submit RFQ Now
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
