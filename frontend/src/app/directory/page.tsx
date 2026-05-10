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
    <div className="flex text-[#fbbf24] dark:text-amber-400">
      {Array.from({ length: full }).map((_, i) => (
        <span key={i} className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
      ))}
      {half && <span className="material-symbols-outlined text-[16px]">star_half</span>}
      {Array.from({ length: 5 - full - (half ? 1 : 0) }).map((_, i) => (
        <span key={`e${i}`} className="material-symbols-outlined text-[16px]">star_border</span>
      ))}
    </div>
  );
}

export default function DirectoryPage() {
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('');
  const [cert, setCert] = useState('');

  const filtered = MOCK_SUPPLIERS.filter((s) => {
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-dark-background flex flex-col font-body">
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 max-w-[1200px] mx-auto w-full px-6 py-12 mt-16">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center text-[13px] text-gray-500 dark:text-gray-400 mb-6 font-medium">
          <Link href="/" className="hover:text-[#5300b7] dark:hover:text-[#d0bcff] transition-colors">Home</Link>
          <span className="material-symbols-outlined text-[14px] mx-1">chevron_right</span>
          <span className="text-[#5300b7] dark:text-[#d0bcff] font-bold">Supplier Directory</span>
        </nav>

        {/* Hero Section */}
        <div className="rounded-2xl bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-surface-variant/30 p-12 text-center mb-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#5300b7] to-[#2563eb]" />
          <h1 className="text-4xl font-display font-extrabold text-gray-900 dark:text-dark-on-surface mb-3">Supplier Directory</h1>
          <p className="text-[15px] text-gray-600 dark:text-dark-on-surface-variant mb-8">Discover and connect with vetted global suppliers. Filter by region,<br/>certification, and trade volume to find your ideal partners.</p>

          <div className="max-w-3xl mx-auto bg-gray-50 dark:bg-dark-surface-container p-2 rounded-xl border border-gray-200 dark:border-dark-surface-variant/50 flex flex-wrap lg:flex-nowrap gap-2 items-center shadow-sm">
            <div className="flex-[2] min-w-[200px] relative flex items-center px-3">
              <span className="material-symbols-outlined text-gray-400 dark:text-gray-500 mr-2">search</span>
              <input className="w-full bg-transparent border-none focus:ring-0 text-[14px] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none" placeholder="Search suppliers, products..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 hidden lg:block" />
            <div className="flex-1 min-w-[150px] relative">
              <select value={region} onChange={(e) => setRegion(e.target.value)} className="w-full px-3 py-2 bg-transparent border-none focus:ring-0 text-[14px] text-gray-700 dark:text-gray-300 appearance-none font-medium outline-none">
                <option value="">All Regions</option><option>Asia Pacific</option><option>Europe</option><option>North America</option>
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[18px]">expand_more</span>
            </div>
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 hidden lg:block" />
            <div className="flex-1 min-w-[150px] relative">
              <select value={cert} onChange={(e) => setCert(e.target.value)} className="w-full px-3 py-2 bg-transparent border-none focus:ring-0 text-[14px] text-gray-700 dark:text-gray-300 appearance-none font-medium outline-none">
                <option value="">Any Certification</option><option>ISO 9001</option><option>CE Marked</option>
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[18px]">expand_more</span>
            </div>
            <button className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-8 py-2.5 rounded-lg font-bold text-[14px] transition-colors w-full lg:w-auto">Search</button>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="bg-white dark:bg-dark-surface rounded-xl flex flex-wrap md:flex-nowrap items-center justify-around py-6 px-4 mb-10 border border-gray-100 dark:border-dark-surface-variant/30 shadow-sm gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#f3e8ff] dark:bg-[#d0bcff]/10 text-[#5300b7] dark:text-[#d0bcff] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            </div>
            <div>
              <p className="font-bold text-gray-900 dark:text-dark-on-surface text-[14px]">Verified Suppliers</p>
              <p className="text-[12px] text-gray-500 dark:text-gray-400">10,000+ vetted partners</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 text-[#2563eb] dark:text-blue-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
            </div>
            <div>
              <p className="font-bold text-gray-900 dark:text-dark-on-surface text-[14px]">Certified Quality</p>
              <p className="text-[12px] text-gray-500 dark:text-gray-400">ISO & Industry standards</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-900/20 text-[#ea580c] dark:text-orange-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>public</span>
            </div>
            <div>
              <p className="font-bold text-gray-900 dark:text-dark-on-surface text-[14px]">Global Reach</p>
              <p className="text-[12px] text-gray-500 dark:text-gray-400">150+ Export Markets</p>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filtered.map((supplier) => (
            <div key={supplier.id} className="bg-white dark:bg-dark-surface rounded-2xl border border-gray-100 dark:border-dark-surface-variant/30 p-6 hover:shadow-lg dark:hover:border-dark-surface-variant/60 transition-all flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-dark-surface-container border border-gray-100 dark:border-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400">
                    <span className="material-symbols-outlined text-[24px]">{supplier.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-[16px] text-gray-900 dark:text-dark-on-surface leading-tight">{supplier.name}</h3>
                    <div className="flex items-center gap-1 text-[12px] text-gray-500 dark:text-gray-400 mt-1">
                      <span className="material-symbols-outlined text-[14px]">location_on</span>
                      {supplier.country}
                    </div>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-[#5300b7] dark:hover:text-[#d0bcff] transition-colors">
                  <span className="material-symbols-outlined text-[20px]">bookmark_border</span>
                </button>
              </div>

              <div className="flex items-center gap-2 mb-5">
                <StarRating rating={supplier.rating} />
                <span className="text-[14px] font-bold text-gray-900 dark:text-dark-on-surface">{supplier.rating}</span>
                <span className="text-[12px] text-gray-500 dark:text-gray-400">({supplier.reviews} reviews)</span>
              </div>

              <div className="mb-4">
                <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-wide">Certifications</p>
                <div className="flex flex-wrap gap-2">
                  {supplier.certs.map((c) => (
                    <span key={c} className="px-2.5 py-1 bg-[#f0fdf4] dark:bg-emerald-900/20 text-[#166534] dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/30 text-[10px] font-bold rounded-md uppercase tracking-wider">{c}</span>
                  ))}
                </div>
              </div>

              <div className="mb-6 flex-1">
                <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 mb-1 uppercase tracking-wide">Top Markets</p>
                <p className="text-[13px] text-gray-700 dark:text-gray-300 font-medium">{supplier.markets}</p>
              </div>

              <Link href={`/supplier/${supplier.id}`} className="w-full border-2 border-[#5300b7] dark:border-[#d0bcff] text-[#5300b7] dark:text-[#d0bcff] hover:bg-[#5300b7] hover:text-white dark:hover:bg-[#d0bcff] dark:hover:text-dark-surface py-2.5 rounded-lg font-bold text-[14px] transition-colors text-center block">
                View Profile
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="bg-[#f3e8ff] dark:bg-[#d0bcff]/10 rounded-2xl p-10 flex flex-col md:flex-row items-center justify-between border border-purple-100 dark:border-purple-900/20 gap-6">
          <div className="max-w-xl text-center md:text-left">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-3">Can&apos;t Find the Right Supplier?</h2>
            <p className="text-[15px] text-gray-600 dark:text-gray-300 leading-relaxed">Let our intelligence engine find the perfect match for your specific requirements. Submit an RFQ and get curated recommendations within 24 hours.</p>
          </div>
          <button className="bg-[#5300b7] hover:bg-[#430099] dark:bg-[#d0bcff] dark:hover:bg-[#e8def8] text-white dark:text-[#381e72] font-bold px-8 py-3.5 rounded-xl transition-colors shadow-sm whitespace-nowrap">
            Submit RFQ Now
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
