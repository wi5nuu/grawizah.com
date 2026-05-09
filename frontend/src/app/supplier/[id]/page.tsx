'use client';

import { useParams } from 'next/navigation';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import Link from 'next/link';
import { MapPin, Calendar, Globe, Shield, Package, Award, MessageSquare, ExternalLink, Star, CheckCircle2, Building2, Clock } from 'lucide-react';

const MOCK_SUPPLIER = {
  id: 'c1', name: 'PT Nusantara Agro Export', country: 'Indonesia', verified: true,
  description: 'Leading exporter of premium Indonesian agricultural products including coconut oil, spices, and coffee beans. ISO 9001:2015 and USDA Organic certified with 12 years of export experience. We pride ourselves on sustainable farming practices and direct partnerships with local farmers across Sumatra and Java.',
  export_experience_years: 12, export_countries: ['USA', 'Japan', 'Germany', 'Australia', 'Singapore', 'China'],
  certifications: ['ISO 9001:2015', 'USDA Organic', 'HACCP', 'MUI Halal'],
  website: 'www.nusantara-agro.com', contact_email: 'export@nusantara-agro.com',
  rating: 4.8, response_rate: 95, response_time: '< 2 hours',
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

      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-800 to-accent-700">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        </div>

        <div className="relative container mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="w-20 h-20 bg-white/15 backdrop-blur rounded-2xl flex items-center justify-center flex-shrink-0 border border-white/20">
              <span className="text-3xl font-bold text-white">{MOCK_SUPPLIER.name[0]}</span>
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white">{MOCK_SUPPLIER.name}</h1>
                {MOCK_SUPPLIER.verified && (
                  <span className="bg-green-400/20 text-green-100 badge text-xs flex items-center gap-1 border border-green-400/30">
                    <Shield className="w-3 h-3" /> Verified
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-primary-100 text-sm mb-4">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {MOCK_SUPPLIER.country}</span>
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {MOCK_SUPPLIER.export_experience_years} years experience</span>
                <span className="flex items-center gap-1"><Globe className="w-4 h-4" /> {MOCK_SUPPLIER.export_countries.length} export markets</span>
              </div>
              {/* Quick Stats */}
              <div className="flex flex-wrap gap-4">
                <div className="bg-white/10 backdrop-blur rounded-lg px-3 py-2 flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-white text-sm font-medium">{MOCK_SUPPLIER.rating} Rating</span>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg px-3 py-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span className="text-white text-sm font-medium">{MOCK_SUPPLIER.response_rate}% Response Rate</span>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg px-3 py-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-accent-300" />
                  <span className="text-white text-sm font-medium">Responds {MOCK_SUPPLIER.response_time}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <button className="btn-primary flex items-center gap-2 bg-white text-primary-700 hover:bg-gray-50">
                <MessageSquare className="w-4 h-4" /> Send Inquiry
              </button>
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
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary-500" /> About
              </h2>
              <p className="text-gray-600 leading-relaxed">{MOCK_SUPPLIER.description}</p>
            </div>

            {/* Products */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary-500" /> Products ({MOCK_SUPPLIER.products.length})
                </h2>
                <Link href={`/supplier/${params.id}/products`} className="text-sm text-primary-600 font-medium hover:underline flex items-center gap-1">
                  View All →
                </Link>
              </div>
              <div className="space-y-3">
                {MOCK_SUPPLIER.products.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition border border-gray-100 group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl flex items-center justify-center group-hover:scale-105 transition">
                        <Package className="w-6 h-6 text-primary-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.category} • {product.views.toLocaleString()} views</p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-primary-700">{product.price}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="card">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" /> Certifications
              </h2>
              <div className="flex flex-wrap gap-2">
                {MOCK_SUPPLIER.certifications.map((cert) => (
                  <span key={cert} className="badge bg-green-50 text-green-700 border border-green-200 flex items-center gap-1.5 px-3 py-1.5">
                    <Award className="w-3.5 h-3.5" /> {cert}
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
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Globe className="w-4 h-4 text-accent-500" /> Export Markets
              </h3>
              <div className="flex flex-wrap gap-2">
                {MOCK_SUPPLIER.export_countries.map((c) => (
                  <span key={c} className="badge bg-accent-50 text-accent-700 text-xs px-3 py-1.5">{c}</span>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" /> Trust Signals
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Verified Status</span>
                  <span className="badge-success text-xs flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Verified</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Response Rate</span>
                  <span className="font-medium text-gray-900">{MOCK_SUPPLIER.response_rate}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Avg Response Time</span>
                  <span className="font-medium text-gray-900">{MOCK_SUPPLIER.response_time}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Export Experience</span>
                  <span className="font-medium text-gray-900">{MOCK_SUPPLIER.export_experience_years} years</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
