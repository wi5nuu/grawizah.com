import React from 'react';
import { Company } from '@/types/company';
import { MapPin, Award, TrendingUp, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface SupplierCardProps {
  company: Company;
  showStats?: boolean;
  onContact?: (companyId: string) => void;
}

export const SupplierCard: React.FC<SupplierCardProps> = ({ 
  company, 
  showStats = true,
  onContact 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-bold text-gray-900">{company.name}</h3>
            {company.verified && (
              <CheckCircle className="w-5 h-5 text-green-500" />
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{company.country}</span>
          </div>
        </div>
        {company.verified && (
          <span className="badge badge-success">Verified</span>
        )}
      </div>

      {/* Export Experience */}
      {company.export_experience_years && (
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-primary-700">
              {company.export_experience_years}+ years
            </span>
            {' '}export experience
          </p>
        </div>
      )}

      {/* Export Countries */}
      {company.export_countries && company.export_countries.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2">Export Markets:</p>
          <div className="flex flex-wrap gap-2">
            {company.export_countries.slice(0, 5).map((country, idx) => (
              <span key={idx} className="badge bg-gray-100 text-gray-700 text-xs">
                {country}
              </span>
            ))}
            {company.export_countries.length > 5 && (
              <span className="badge bg-gray-100 text-gray-700 text-xs">
                +{company.export_countries.length - 5} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Certifications */}
      {company.certifications && company.certifications.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
            <Award className="w-3 h-3" />
            Certifications:
          </p>
          <div className="flex flex-wrap gap-2">
            {company.certifications.slice(0, 3).map((cert, idx) => (
              <span key={idx} className="badge badge-primary text-xs">
                {cert.name}
              </span>
            ))}
            {company.certifications.length > 3 && (
              <span className="badge badge-primary text-xs">
                +{company.certifications.length - 3}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Link 
          href={`/supplier/${company.id}`}
          className="btn-outline flex-1 text-center text-sm"
        >
          View Profile
        </Link>
        <button
          onClick={() => onContact?.(company.id)}
          className="btn-primary flex-1 text-sm"
        >
          Contact
        </button>
      </div>
    </div>
  );
};
