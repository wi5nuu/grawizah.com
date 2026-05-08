'use client';

import { useParams } from 'next/navigation';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import Link from 'next/link';
import { MapPin, Calendar, Globe, Shield, Package, Award, MessageSquare, ExternalLink } from 'lucide-react';

const MOCK_SUPPLIER = {
  id: 'c1', name: 'PT Nusantara Agro Export', country: 'Indonesia', verified: true,
  description: 'Leading exporter of premium Indonesian agricultural products including coconut oil, spices, and coffee beans. ISO 9001:2015 and USDA Organic certified with 12 years of export experience.',
  export_experience_years: 12, export_countries: ['USA', 'Japan', 'Germany', 'Australia', 'Singapore', 'China'],
  certifications: ['ISO 9001:2015', 'USDA Organic', 'HACCP', 'MUI Halal'],
  website: 'www.nusantara-agro.com', contact_email: 'export@nusantara-agro.com',
  products: [
    { id: '1', name: 'Premium Virgin Coconut Oil', category: 'Agriculture', price: '$800 - $1,200/MT', views: 1247 },
    { id: '2', name: 'Arabica Coffee Beans - Grade 1', category: 'Food & Beverage', price: '$3,500 - $5,000/MT', views: 892 },
    { id: '4', name: 'Organic Turmeric Powder', category: 'Agriculture', price: '$2,000 - $3,500/MT', views: 543 },
  ],
};

export default function SupplierPage() {
  const params = useParams();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-r from-primary-700 to-accent-600 py-12">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
              <span className="text-3xl font-bold text-white">{MOCK_SUPPLIER.name[0]}</span>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold text-white">{MOCK_SUPPLIER.name}</h1>
                {MOCK_SUPPLIER.verified && (
                  <span className="bg-green-400/20 text-green-100 badge text-xs"><Shield className="w-3 h-3 mr-1" /> Verified</span>
                )}
              </div>
              <div className="flex items-center gap-4 text-primary-100 text-sm">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {MOCK_SUPPLIER.country}</span>
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {MOCK_SUPPLIER.export_experience_years} years experience</span>
                <span className="flex items-center gap-1"><Globe className="w-4 h-4" /> {MOCK_SUPPLIER.export_countries.length} export markets</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <div className="card">
              <h2 className="text-lg font-semibold mb-3">About</h2>
              <p className="text-gray-600 leading-relaxed">{MOCK_SUPPLIER.description}</p>
            </div>

            {/* Products */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Products ({MOCK_SUPPLIER.products.length})</h2>
                <Link href={`/supplier/${params.id}/products`} className="text-sm text-primary-600 font-medium hover:underline">
                  View All →
                </Link>
              </div>
              <div className="space-y-3">
                {MOCK_SUPPLIER.products.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-primary-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.category} • {product.views} views</p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-primary-700">{product.price}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="card">
              <h2 className="text-lg font-semibold mb-4">Certifications</h2>
              <div className="flex flex-wrap gap-2">
                {MOCK_SUPPLIER.certifications.map((cert) => (
                  <span key={cert} className="badge bg-green-50 text-green-700 border border-green-200">
                    <Award className="w-3.5 h-3.5 mr-1" /> {cert}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="card">
              <h3 className="font-semibold mb-4">Contact Supplier</h3>
              <button className="btn-primary w-full flex items-center justify-center gap-2 mb-3">
                <MessageSquare className="w-4 h-4" /> Send Inquiry
              </button>
              <a href={`https://${MOCK_SUPPLIER.website}`} target="_blank" rel="noopener" className="btn-outline w-full flex items-center justify-center gap-2 text-sm">
                <ExternalLink className="w-4 h-4" /> Visit Website
              </a>
            </div>

            <div className="card">
              <h3 className="font-semibold mb-3">Export Markets</h3>
              <div className="flex flex-wrap gap-2">
                {MOCK_SUPPLIER.export_countries.map((c) => (
                  <span key={c} className="badge bg-accent-50 text-accent-700 text-xs">{c}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
