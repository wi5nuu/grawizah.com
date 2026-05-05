'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CompanyService } from '@/services/CompanyService';
import { Company } from '@/types/company';
import { MapPin, Award, Calendar, Globe, Mail, Phone, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const companyService = new CompanyService();

export default function SupplierAboutPage() {
  const params = useParams();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchCompany(params.id as string);
    }
  }, [params.id]);

  const fetchCompany = async (id: string) => {
    try {
      setLoading(true);
      const data = await companyService.getCompanyById(id);
      setCompany(data);
    } catch (error) {
      console.error('Failed to fetch company:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700"></div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Company Not Found</h2>
          <Link href="/catalog" className="text-primary-700 hover:text-primary-900">
            Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-700 to-accent-600 text-white">
        <div className="container mx-auto px-6 py-12">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-4xl font-bold">{company.name}</h1>
                {company.verified && (
                  <CheckCircle className="w-8 h-8 text-green-400" />
                )}
              </div>
              <div className="flex items-center gap-2 text-primary-100 mb-4">
                <MapPin className="w-5 h-5" />
                <span className="text-lg">{company.country}</span>
              </div>
              {company.verified && (
                <span className="badge bg-green-500 text-white">
                  ✓ Verified Supplier
                </span>
              )}
            </div>
            <button className="btn-primary bg-white text-primary-700 hover:bg-gray-100">
              Contact Supplier
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6">
          <nav className="flex gap-8">
            <Link 
              href={`/supplier/${params.id}`}
              className="py-4 border-b-2 border-primary-700 text-primary-700 font-medium"
            >
              About Us
            </Link>
            <Link 
              href={`/supplier/${params.id}/products`}
              className="py-4 border-b-2 border-transparent text-gray-600 hover:text-gray-900"
            >
              Products
            </Link>
            <Link 
              href={`/supplier/${params.id}/certifications`}
              className="py-4 border-b-2 border-transparent text-gray-600 hover:text-gray-900"
            >
              Certifications
            </Link>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Company Story */}
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Company Story</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                {company.name} is a leading supplier based in {company.country} with {company.export_experience_years || 0}+ years of experience in international trade.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We specialize in providing high-quality products to global markets, maintaining the highest standards of quality and customer service. Our commitment to excellence has made us a trusted partner for businesses worldwide.
              </p>
            </div>

            {/* Core Values */}
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Core Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-primary-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Quality</h3>
                    <p className="text-sm text-gray-600">Uncompromising commitment to product excellence</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Globe className="w-6 h-6 text-blue-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Consistency</h3>
                    <p className="text-sm text-gray-600">Reliable delivery and product standards</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-green-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Transparency</h3>
                    <p className="text-sm text-gray-600">Open communication and honest business practices</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-orange-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Long-term Partnership</h3>
                    <p className="text-sm text-gray-600">Building lasting relationships with clients</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Export Experience */}
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Export Experience</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-700 mb-2">
                    {company.export_experience_years || 0}+
                  </div>
                  <p className="text-sm text-gray-600">Years Experience</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-700 mb-2">
                    {company.export_countries?.length || 0}
                  </div>
                  <p className="text-sm text-gray-600">Export Markets</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-700 mb-2">
                    {company.certifications?.length || 0}
                  </div>
                  <p className="text-sm text-gray-600">Certifications</p>
                </div>
              </div>
            </div>

            {/* Export Countries Map */}
            {company.export_countries && company.export_countries.length > 0 && (
              <div className="card">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Export Markets</h2>
                <div className="flex flex-wrap gap-2">
                  {company.export_countries.map((country, idx) => (
                    <span key={idx} className="badge badge-primary">
                      {country}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="card">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="text-sm">contact@{company.name.toLowerCase().replace(/\s+/g, '')}.com</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="text-sm">+62 xxx xxxx xxxx</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span className="text-sm">{company.country}</span>
                </div>
              </div>
              <button className="btn-primary w-full mt-4">
                Send Inquiry
              </button>
            </div>

            {/* Business Licenses */}
            <div className="card">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Business Licenses</h3>
              <div className="space-y-2">
                {company.nib && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">NIB</span>
                    <span className="font-medium text-gray-900">{company.nib}</span>
                  </div>
                )}
                {company.npwp && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">NPWP</span>
                    <span className="font-medium text-gray-900">{company.npwp}</span>
                  </div>
                )}
                {company.export_license && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Export License</span>
                    <span className="font-medium text-gray-900">{company.export_license}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="card bg-primary-50 border-primary-200">
              <h3 className="text-lg font-bold text-primary-900 mb-4">Why Choose Us?</h3>
              <ul className="space-y-2 text-sm text-primary-800">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary-700" />
                  Verified Supplier
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary-700" />
                  {company.export_experience_years}+ Years Experience
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary-700" />
                  Export to {company.export_countries?.length || 0} Countries
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary-700" />
                  {company.certifications?.length || 0} International Certifications
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
