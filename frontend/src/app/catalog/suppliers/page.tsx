'use client';

import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, MapPin, Building2, Shield, Award } from 'lucide-react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import Link from 'next/link';
import { COUNTRIES, PRODUCT_CATEGORIES } from '@/lib/constants';

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

export default function SupplierDirectoryPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Try fetching from backend
  useEffect(() => {
    fetch('http://localhost:8080/api/companies?type=supplier')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data) && data.length > 0) setSuppliers(data); })
      .catch(() => {});
  }, []);

  const filtered = suppliers.filter(s => {
    const matchSearch = !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCountry = !countryFilter || s.country === countryFilter;
    const matchVerified = !verifiedOnly || s.verified;
    return matchSearch && matchCountry && matchVerified;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <div className="bg-gradient-to-r from-primary-700 to-accent-600 py-12">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl font-bold text-white">Supplier Directory</h1>
          <p className="text-primary-100 mt-2">Find verified export-ready suppliers from Indonesia</p>
          <div className="mt-6 flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search suppliers by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/95 backdrop-blur text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-5 py-3 bg-white/20 backdrop-blur rounded-xl text-white font-medium hover:bg-white/30 transition">
              <SlidersHorizontal className="w-5 h-5" /> Filters
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 flex flex-wrap gap-3 animate-slide-up">
              <select value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)} className="px-3 py-2 rounded-lg bg-white/90 text-gray-700 text-sm">
                <option value="">All Countries</option>
                {COUNTRIES.map(c => <option key={c}>{c}</option>)}
              </select>
              <label className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/90 text-gray-700 text-sm cursor-pointer">
                <input type="checkbox" checked={verifiedOnly} onChange={(e) => setVerifiedOnly(e.target.checked)} className="rounded" />
                Verified Only
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-6 py-8">
        <p className="text-sm text-gray-500 mb-6">
          Showing <strong>{filtered.length}</strong> suppliers
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((supplier) => (
            <div key={supplier.id} className="card hover:shadow-lg transition-all group">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-700 transition">{supplier.name}</h3>
                    {supplier.verified && <Shield className="w-4 h-4 text-green-500 flex-shrink-0" />}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="w-3.5 h-3.5" /> {supplier.country}
                    <span>•</span>
                    <span>{supplier.export_experience_years}+ yrs</span>
                  </div>
                </div>
                {supplier.verified && <span className="badge-success text-[10px]">Verified</span>}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <p className="text-lg font-bold text-primary-700">{supplier.product_count}</p>
                  <p className="text-xs text-gray-500">Products</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <p className="text-lg font-bold text-primary-700">{supplier.export_countries.length}</p>
                  <p className="text-xs text-gray-500">Markets</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <p className="text-lg font-bold text-amber-600">⭐ {supplier.rating}</p>
                  <p className="text-xs text-gray-500">Rating</p>
                </div>
              </div>

              {/* Certifications */}
              {supplier.certifications.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {supplier.certifications.slice(0, 3).map((cert, i) => (
                      <span key={i} className="badge bg-green-50 text-green-700 text-[10px]">
                        <Award className="w-2.5 h-2.5 mr-0.5" /> {cert.name}
                      </span>
                    ))}
                    {supplier.certifications.length > 3 && (
                      <span className="badge bg-gray-50 text-gray-500 text-[10px]">+{supplier.certifications.length - 3}</span>
                    )}
                  </div>
                </div>
              )}

              {/* Export Markets */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {supplier.export_countries.slice(0, 4).map((c) => (
                    <span key={c} className="badge bg-accent-50 text-accent-700 text-[10px]">{c}</span>
                  ))}
                  {supplier.export_countries.length > 4 && (
                    <span className="badge bg-gray-50 text-gray-500 text-[10px]">+{supplier.export_countries.length - 4}</span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-3 border-t border-gray-100">
                <Link href={`/supplier/${supplier.id}`} className="btn-outline flex-1 text-center text-sm">
                  View Profile
                </Link>
                <Link href={`/supplier/${supplier.id}`} className="btn-primary flex-1 text-center text-sm">
                  Contact
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-lg">No suppliers found matching your criteria</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
