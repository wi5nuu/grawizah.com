'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CompanyService } from '@/services/CompanyService';
import { Company, Certification } from '@/types/company';
import { Award, Calendar, FileText, ExternalLink, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const companyService = new CompanyService();

export default function SupplierCertificationsPage() {
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

  const getCertificationCategory = (certName: string): string => {
    if (certName.includes('ISO') || certName.includes('HACCP') || certName.includes('GMP')) {
      return 'Quality & Standards';
    }
    if (certName.includes('Organic') || certName.includes('Rainforest') || certName.includes('Fairtrade')) {
      return 'Organic & Sustainability';
    }
    if (certName.includes('Halal')) {
      return 'Halal & Religious';
    }
    if (certName.includes('Phytosanitary') || certName.includes('Fumigation') || certName.includes('CoO')) {
      return 'Phytosanitary & Export';
    }
    if (certName.includes('FDA') || certName.includes('CE') || certName.includes('JAS')) {
      return 'Country Regulations';
    }
    return 'Company Legality';
  };

  const getTargetMarket = (certName: string): string => {
    if (certName.includes('FDA')) return 'USA';
    if (certName.includes('CE')) return 'Europe';
    if (certName.includes('JAS')) return 'Japan';
    if (certName.includes('JAKIM')) return 'Malaysia';
    if (certName.includes('IFANCA')) return 'USA';
    if (certName.includes('EU')) return 'Europe';
    if (certName.includes('USDA')) return 'USA';
    return 'Global';
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

  const certificationsByCategory = company.certifications?.reduce((acc, cert) => {
    const category = getCertificationCategory(cert.name);
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(cert);
    return acc;
  }, {} as Record<string, Certification[]>) || {};

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{company.name}</h1>
          <p className="text-gray-600">Certifications & Compliance</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6">
          <nav className="flex gap-8">
            <Link 
              href={`/supplier/${params.id}`}
              className="py-4 border-b-2 border-transparent text-gray-600 hover:text-gray-900"
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
              className="py-4 border-b-2 border-primary-700 text-primary-700 font-medium"
            >
              Certifications
            </Link>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        {company.certifications && company.certifications.length > 0 ? (
          <div className="space-y-8">
            {/* Summary */}
            <div className="card bg-primary-50 border-primary-200">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary-700 rounded-full flex items-center justify-center">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-primary-900 mb-1">
                    {company.certifications.length} Certifications
                  </h2>
                  <p className="text-primary-700">
                    Verified compliance with international standards
                  </p>
                </div>
              </div>
            </div>

            {/* Certifications by Category */}
            {Object.entries(certificationsByCategory).map(([category, certs]) => (
              <div key={category}>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-primary-700" />
                  {category}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {certs.map((cert, idx) => (
                    <div key={idx} className="card hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Award className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">{cert.name}</h4>
                            <p className="text-sm text-gray-600">{cert.issuer}</p>
                          </div>
                        </div>
                        <span className="badge badge-success text-xs">
                          {getTargetMarket(cert.name)}
                        </span>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>Issued: {new Date(cert.issue_date).toLocaleDateString()}</span>
                        </div>
                        {cert.expiry_date && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>Expires: {new Date(cert.expiry_date).toLocaleDateString()}</span>
                          </div>
                        )}
                        {cert.document_url && (
                          <a 
                            href={cert.document_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-primary-700 hover:text-primary-900"
                          >
                            <FileText className="w-4 h-4" />
                            <span>View Certificate</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Compliance Statement */}
            <div className="card bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Compliance Statement</h3>
              <p className="text-gray-600 leading-relaxed">
                All certifications displayed are valid and verified. {company.name} maintains strict compliance with international quality standards and regulations. We regularly update our certifications to ensure continuous compliance with evolving industry requirements.
              </p>
              <p className="text-gray-600 leading-relaxed mt-3">
                For verification or additional documentation, please contact our compliance team directly.
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Award className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Certifications Listed</h3>
            <p className="text-gray-600">This supplier hasn't added certification information yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
