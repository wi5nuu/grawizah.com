'use client';

import React, { useState } from 'react';
import { CheckCircle, XCircle, Star, Award } from 'lucide-react';

interface Supplier {
  id: string;
  name: string;
  country: string;
  price: number;
  moq: string;
  leadTime: string;
  certifications: string[];
  rating: number;
  verified: boolean;
}

export default function SupplierComparisonPage() {
  const [suppliers] = useState<Supplier[]>([
    {
      id: '1',
      name: 'PT Indo Palm Export',
      country: 'Indonesia',
      price: 850,
      moq: '500 MT',
      leadTime: '30 days',
      certifications: ['RSPO', 'ISCC', 'Halal'],
      rating: 4.8,
      verified: true,
    },
    {
      id: '2',
      name: 'Malaysia Palm Industries',
      country: 'Malaysia',
      price: 875,
      moq: '1000 MT',
      leadTime: '45 days',
      certifications: ['RSPO', 'ISO 9001'],
      rating: 4.5,
      verified: true,
    },
    {
      id: '3',
      name: 'Thai Commodities Ltd',
      country: 'Thailand',
      price: 820,
      moq: '250 MT',
      leadTime: '60 days',
      certifications: ['ISO 9001', 'Halal'],
      rating: 4.2,
      verified: false,
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Supplier Comparison</h1>
          <p className="text-gray-600 mt-1">Compare quotes and supplier capabilities side-by-side</p>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Criteria</th>
                {suppliers.map((supplier) => (
                  <th key={supplier.id} className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-gray-900">{supplier.name}</span>
                        {supplier.verified && (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      <span className="text-sm text-gray-500">{supplier.country}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {/* Price */}
              <tr>
                <td className="px-6 py-4 font-medium text-gray-900">Price (USD/MT)</td>
                {suppliers.map((supplier) => (
                  <td key={supplier.id} className="px-6 py-4 text-center">
                    <span className="text-lg font-bold text-primary-700">
                      ${supplier.price}
                    </span>
                  </td>
                ))}
              </tr>

              {/* MOQ */}
              <tr className="bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">Minimum Order Quantity</td>
                {suppliers.map((supplier) => (
                  <td key={supplier.id} className="px-6 py-4 text-center text-gray-700">
                    {supplier.moq}
                  </td>
                ))}
              </tr>

              {/* Lead Time */}
              <tr>
                <td className="px-6 py-4 font-medium text-gray-900">Lead Time</td>
                {suppliers.map((supplier) => (
                  <td key={supplier.id} className="px-6 py-4 text-center text-gray-700">
                    {supplier.leadTime}
                  </td>
                ))}
              </tr>

              {/* Rating */}
              <tr className="bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">Supplier Rating</td>
                {suppliers.map((supplier) => (
                  <td key={supplier.id} className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold">{supplier.rating}</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Certifications */}
              <tr>
                <td className="px-6 py-4 font-medium text-gray-900">Certifications</td>
                {suppliers.map((supplier) => (
                  <td key={supplier.id} className="px-6 py-4">
                    <div className="flex flex-wrap gap-1 justify-center">
                      {supplier.certifications.map((cert) => (
                        <span key={cert} className="badge badge-success text-xs">
                          {cert}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Verified */}
              <tr className="bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">Verified Supplier</td>
                {suppliers.map((supplier) => (
                  <td key={supplier.id} className="px-6 py-4 text-center">
                    {supplier.verified ? (
                      <CheckCircle className="w-6 h-6 text-green-600 mx-auto" />
                    ) : (
                      <XCircle className="w-6 h-6 text-gray-400 mx-auto" />
                    )}
                  </td>
                ))}
              </tr>

              {/* Actions */}
              <tr>
                <td className="px-6 py-4 font-medium text-gray-900">Actions</td>
                {suppliers.map((supplier) => (
                  <td key={supplier.id} className="px-6 py-4 text-center">
                    <div className="flex flex-col gap-2">
                      <button className="btn-primary text-sm">Select</button>
                      <button className="btn-secondary text-sm">Contact</button>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Recommendation */}
        <div className="mt-6 bg-gradient-to-r from-primary-600 to-blue-600 text-white p-6 rounded-lg shadow">
          <div className="flex items-start gap-4">
            <Award className="w-8 h-8 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-bold mb-2">AI Recommendation</h3>
              <p className="text-sm opacity-90">
                Based on your requirements, we recommend <strong>PT Indo Palm Export</strong>. 
                They offer competitive pricing, verified certifications, and have the highest rating. 
                Their MOQ matches your order quantity and lead time is reasonable.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
