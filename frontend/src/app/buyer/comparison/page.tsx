'use client';

import { useState } from 'react';
import { GitCompare, Star, Shield, MapPin, Award, Bot } from 'lucide-react';

const MOCK_SUPPLIERS = [
  { id: '1', name: 'PT Nusantara Agro', country: 'Indonesia', verified: true, experience: 12, rating: 4.8, response_rate: 95, conversion_rate: 28, certifications: ['ISO 9001', 'USDA Organic', 'HACCP'], price: '$800-1200/MT', ai_match: 92 },
  { id: '2', name: 'Java Spice Trading', country: 'Indonesia', verified: true, experience: 8, rating: 4.6, response_rate: 92, conversion_rate: 25, certifications: ['ISO 22000', 'EU Organic'], price: '$850-1100/MT', ai_match: 87 },
  { id: '3', name: 'Borneo Natural Co', country: 'Indonesia', verified: false, experience: 5, rating: 4.2, response_rate: 78, conversion_rate: 18, certifications: ['GMP'], price: '$700-1000/MT', ai_match: 74 },
];

export default function ComparisonPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 lg:p-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <GitCompare className="w-6 h-6 text-green-600" /> Supplier Comparison
          </h1>
          <p className="text-gray-500 mt-1">AI-powered comparison of shortlisted suppliers</p>
        </div>

        {/* Comparison Table */}
        <div className="table-container overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Criteria</th>
                {MOCK_SUPPLIERS.map(s => (
                  <th key={s.id} className="text-center px-6 py-4">
                    <p className="text-sm font-semibold text-gray-900">{s.name}</p>
                    <p className="text-xs text-gray-500">{s.country}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-3 text-sm font-medium text-gray-700">AI Match Score</td>
                {MOCK_SUPPLIERS.map(s => (
                  <td key={s.id} className="text-center px-6 py-3">
                    <span className={`badge text-sm font-bold ${s.ai_match >= 85 ? 'badge-success' : s.ai_match >= 70 ? 'badge-warning' : 'badge-danger'}`}>
                      <Bot className="w-3.5 h-3.5 mr-1" /> {s.ai_match}%
                    </span>
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-3 text-sm font-medium text-gray-700">Verified</td>
                {MOCK_SUPPLIERS.map(s => (
                  <td key={s.id} className="text-center px-6 py-3">
                    {s.verified ? <Shield className="w-5 h-5 text-green-500 mx-auto" /> : <span className="text-gray-300">—</span>}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-3 text-sm font-medium text-gray-700">Experience (years)</td>
                {MOCK_SUPPLIERS.map(s => <td key={s.id} className="text-center px-6 py-3 text-sm font-medium">{s.experience}</td>)}
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-3 text-sm font-medium text-gray-700">Rating</td>
                {MOCK_SUPPLIERS.map(s => (
                  <td key={s.id} className="text-center px-6 py-3 text-sm font-medium">
                    <span className="flex items-center justify-center gap-1"><Star className="w-4 h-4 text-amber-500" /> {s.rating}</span>
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-3 text-sm font-medium text-gray-700">Response Rate</td>
                {MOCK_SUPPLIERS.map(s => <td key={s.id} className="text-center px-6 py-3 text-sm font-medium">{s.response_rate}%</td>)}
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-3 text-sm font-medium text-gray-700">Conversion Rate</td>
                {MOCK_SUPPLIERS.map(s => <td key={s.id} className="text-center px-6 py-3 text-sm font-medium">{s.conversion_rate}%</td>)}
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-3 text-sm font-medium text-gray-700">Price Range</td>
                {MOCK_SUPPLIERS.map(s => <td key={s.id} className="text-center px-6 py-3 text-sm font-semibold text-primary-700">{s.price}</td>)}
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-3 text-sm font-medium text-gray-700">Certifications</td>
                {MOCK_SUPPLIERS.map(s => (
                  <td key={s.id} className="text-center px-6 py-3">
                    <div className="flex flex-wrap justify-center gap-1">
                      {s.certifications.map(c => <span key={c} className="badge bg-green-50 text-green-700 text-[10px]">{c}</span>)}
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4"></td>
                {MOCK_SUPPLIERS.map(s => (
                  <td key={s.id} className="text-center px-6 py-4">
                    <button className="btn-primary btn-sm w-full">Contact</button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
