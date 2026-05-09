'use client';

import { useState, useEffect } from 'react';
import {
  Search, SlidersHorizontal, MapPin, Building2, Shield, Award,
  Star, Globe, X, ArrowRight, CheckCircle2,
  MessageCircle, Sparkles
} from 'lucide-react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import Link from 'next/link';
import { COUNTRIES } from '@/lib/constants';

interface Supplier {
  id: string;
  name: string;
  country: string;
  verified: boolean;
  export_experience_years: number;
  export_countries: string[];
  certifications: { name: string }[];
  product_count: number;
  rating: number;
}

const MOCK_SUPPLIERS: Supplier[] = [
  { id: 'c1', name: 'PT Nusantara Agro Export', country: 'Indonesia', verified: true, export_experience_years: 12, export_countries: ['USA', 'Japan', 'Germany', 'Australia', 'Singapore', 'China'], certifications: [{ name: 'ISO 9001' }, { name: 'USDA Organic' }, { name: 'HACCP' }], product_count: 8, rating: 4.8 },
  { id: 'c2', name: 'Java Spice Trading Co', country: 'Indonesia', verified: true, export_experience_years: 8, export_countries: ['USA', 'UK', 'Germany', 'Netherlands'], certifications: [{ name: 'ISO 22000' }, { name: 'EU Organic' }], product_count: 12, rating: 4.6 },
  { id: 'c3', name: 'Borneo Wood Export Ltd', country: 'Indonesia', verified: false, export_experience_years: 5, export_countries: ['Japan', 'China', 'South Korea'], certifications: [{ name: 'FSC' }, { name: 'PEFC' }], product_count: 6, rating: 4.2 },
  { id: 'c4', name: 'Sumatra Organic Farms', country: 'Indonesia', verified: true, export_experience_years: 10, export_countries: ['USA', 'Australia', 'UK'], certifications: [{ name: 'USDA Organic' }, { name: 'JAS Organic' }, { name: 'MUI Halal' }], product_count: 15, rating: 4.7 },
  { id: 'c5', name: 'Bali Craft Collective', country: 'Indonesia', verified: false, export_experience_years: 3, export_countries: ['USA', 'Australia'], certifications: [{ name: 'Fair Trade' }], product_count: 20, rating: 4.0 },
  { id: 'c6', name: 'Sulawesi Coffee Heritage', country: 'Indonesia', verified: true, export_experience_years: 15, export_countries: ['Japan', 'USA', 'Germany', 'Italy', 'Australia', 'Canada'], certifications: [{ name: 'Rainforest Alliance' }, { name: 'UTZ' }, { name: 'ISO 22000' }], product_count: 5, rating: 4.9 },
];

const ITEMS_PER_PAGE = 6;

export default function SupplierDirectoryPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'experience' | 'products'>('rating');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetch('http://localhost:8080/api/companies?type=supplier')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data) && data.length > 0) setSuppliers(data); })
      .catch(() => { });
  }, []);

  const filtered = suppliers
    .filter(s => {
      const matchSearch = !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCountry = !countryFilter || s.country === countryFilter;
      const matchVerified = !verifiedOnly || s.verified;
      return matchSearch && matchCountry && matchVerified;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'experience') return b.export_experience_years - a.export_experience_years;
      return b.product_count - a.product_count;
    });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  useEffect(() => { setCurrentPage(1); }, [searchQuery, countryFilter, verifiedOnly, sortBy]);

  const activeFilterCount = [countryFilter, verifiedOnly].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-800 to-accent-700">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        </div>

        <div className="relative container mx-auto px-6 py-14">
          <nav className="flex items-center gap-2 text-sm text-primary-200 mb-6">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <span>/</span>
            <Link href="/catalog" className="hover:text-white transition">Catalog</Link>
            <span>/</span>
            <span className="text-white font-medium">Suppliers</span>
          </nav>

          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur text-white/90 px-3 py-1.5 rounded-full text-xs font-medium mb-4">
              <Building2 className="w-3.5 h-3.5" /> Verified Directory
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Supplier Directory</h1>
            <p className="text-primary-100 text-lg mb-8">
              Find verified export-ready suppliers from Indonesia
            </p>

            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search suppliers by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/95 backdrop-blur text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium transition-all shadow-lg ${showFilters || activeFilterCount > 0 ? 'bg-white text-primary-700' : 'bg-white/20 backdrop-blur text-white hover:bg-white/30'}`}
              >
                <SlidersHorizontal className="w-5 h-5" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">{activeFilterCount}</span>
                )}
              </button>
            </div>

            {showFilters && (
              <div className="mt-4 flex flex-wrap items-center gap-3 animate-slide-up">
                <select value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)} className="px-4 py-2.5 rounded-lg bg-white/90 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-white/50">
                  <option value="">All Countries</option>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)} className="px-4 py-2.5 rounded-lg bg-white/90 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-white/50">
                  <option value="rating">Sort: Top Rated</option>
                  <option value="experience">Sort: Most Experienced</option>
                  <option value="products">Sort: Most Products</option>
                </select>
                <label className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/90 text-gray-700 text-sm cursor-pointer hover:bg-white transition">
                  <input type="checkbox" checked={verifiedOnly} onChange={(e) => setVerifiedOnly(e.target.checked)} className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                  <Shield className="w-4 h-4 text-green-600" /> Verified Only
                </label>
                {activeFilterCount > 0 && (
                  <button onClick={() => { setCountryFilter(''); setVerifiedOnly(false); }} className="flex items-center gap-1 px-3 py-2.5 text-sm text-white/80 hover:text-white transition">
                    <X className="w-4 h-4" /> Clear all
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-6 mt-8 text-sm">
            <div className="flex items-center gap-2 text-white/90">
              <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center"><Building2 className="w-4 h-4" /></div>
              <span><strong className="text-white">{suppliers.length}</strong> Suppliers</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center"><CheckCircle2 className="w-4 h-4" /></div>
              <span><strong className="text-white">{suppliers.filter(s => s.verified).length}</strong> Verified</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center"><Globe className="w-4 h-4" /></div>
              <span><strong className="text-white">40+</strong> Export Markets</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 text-sm text-gray-500">
            <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-green-500" /> Verified Suppliers</span>
            <span className="flex items-center gap-1.5"><Award className="w-4 h-4 text-amber-500" /> Certified Quality</span>
            <span className="flex items-center gap-1.5"><MessageCircle className="w-4 h-4 text-accent-500" /> Direct Contact</span>
            <span className="flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-primary-500" /> Trade Intelligence</span>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <p className="text-sm text-gray-500">
            Showing <strong className="text-gray-900">{paginated.length}</strong> of <strong className="text-gray-900">{filtered.length}</strong> suppliers
          </p>
          {filtered.length > ITEMS_PER_PAGE && (
            <p className="text-sm text-gray-400">Page {currentPage} of {totalPages}</p>
          )}
        </div>

        {/* Supplier Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {paginated.map((supplier) => (
            <div key={supplier.id} className="card group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-700 transition truncate">{supplier.name}</h3>
                    {supplier.verified && <Shield className="w-4 h-4 text-green-500 flex-shrink-0" />}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{supplier.country}</span>
                    <span className="text-gray-300">•</span>
                    <span>{supplier.export_experience_years}+ yrs exp</span>
                  </div>
                </div>
                {supplier.verified && (
                  <span className="badge-success text-[10px] flex-shrink-0 ml-2"><CheckCircle2 className="w-3 h-3 mr-0.5" /> Verified</span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-2.5 bg-primary-50 rounded-lg">
                  <p className="text-lg font-bold text-primary-700">{supplier.product_count}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide">Products</p>
                </div>
                <div className="text-center p-2.5 bg-accent-50 rounded-lg">
                  <p className="text-lg font-bold text-accent-700">{supplier.export_countries.length}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide">Markets</p>
                </div>
                <div className="text-center p-2.5 bg-amber-50 rounded-lg">
                  <p className="text-lg font-bold text-amber-600 flex items-center justify-center gap-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />{supplier.rating}
                  </p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide">Rating</p>
                </div>
              </div>

              {supplier.certifications.length > 0 && (
                <div className="mb-4">
                  <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-1.5 font-semibold">Certifications</p>
                  <div className="flex flex-wrap gap-1">
                    {supplier.certifications.slice(0, 3).map((cert, i) => (
                      <span key={i} className="inline-flex items-center gap-1 badge bg-green-50 text-green-700 text-[10px]">
                        <Award className="w-2.5 h-2.5" /> {cert.name}
                      </span>
                    ))}
                    {supplier.certifications.length > 3 && (
                      <span className="badge bg-gray-50 text-gray-500 text-[10px]">+{supplier.certifications.length - 3} more</span>
                    )}
                  </div>
                </div>
              )}

              <div className="mb-4">
                <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-1.5 font-semibold">Export Markets</p>
                <div className="flex flex-wrap gap-1">
                  {supplier.export_countries.slice(0, 4).map((c) => (
                    <span key={c} className="badge bg-accent-50 text-accent-700 text-[10px]">{c}</span>
                  ))}
                  {supplier.export_countries.length > 4 && (
                    <span className="badge bg-gray-50 text-gray-500 text-[10px]">+{supplier.export_countries.length - 4} more</span>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <Link href={`/supplier/${supplier.id}`} className="btn-outline flex-1 text-center text-sm py-2.5">View Profile</Link>
                <Link href={`/supplier/${supplier.id}`} className="btn-primary flex-1 text-center text-sm py-2.5 flex items-center justify-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5" /> Contact
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Building2 className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-gray-900 text-xl font-semibold mb-2">No suppliers found</p>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">Try adjusting your search or filters</p>
            <button onClick={() => { setSearchQuery(''); setCountryFilter(''); setVerifiedOnly(false); }} className="btn-primary">Clear All Filters</button>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition">Previous</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button key={page} onClick={() => setCurrentPage(page)} className={`w-10 h-10 rounded-lg text-sm font-medium transition ${currentPage === page ? 'bg-primary-600 text-white shadow-md' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{page}</button>
            ))}
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition">Next</button>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <section className="gradient-bg py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Can&apos;t Find the Right Supplier?</h2>
          <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">Let our AI-powered matching system connect you with the perfect trade partners.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="inline-flex items-center gap-2 bg-white text-primary-700 font-semibold px-8 py-3.5 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:shadow-lg">
              Get Matched for Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/features" className="inline-flex items-center gap-2 border-2 border-white/30 text-white font-semibold px-8 py-3.5 rounded-lg hover:bg-white/10 transition-all duration-200">
              Learn How It Works
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
