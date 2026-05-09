'use client';

import { useState } from 'react';
import { GitCompare, Star, Shield, MapPin, Award, Bot, CheckCircle2, X, ArrowRight, Sparkles } from 'lucide-react';

const MOCK_SUPPLIERS = [
  { id: '1', name: 'PT Nusantara Agro', country: 'Indonesia', verified: true, experience: 12, rating: 4.8, response_rate: 95, conversion_rate: 28, certifications: ['ISO 9001', 'USDA Organic', 'HACCP'], price: '$800-1200/MT', ai_match: 92, products: 8 },
  { id: '2', name: 'Java Spice Trading', country: 'Indonesia', verified: true, experience: 8, rating: 4.6, response_rate: 92, conversion_rate: 25, certifications: ['ISO 22000', 'EU Organic'], price: '$850-1100/MT', ai_match: 87, products: 12 },
  { id: '3', name: 'Borneo Natural Co', country: 'Indonesia', verified: false, experience: 5, rating: 4.2, response_rate: 78, conversion_rate: 18, certifications: ['GMP'], price: '$700-1000/MT', ai_match: 74, products: 6 },
];

export default function ComparisonPage() {
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>(MOCK_SUPPLIERS.map(s => s.id));

  const toggleSupplier = (id: string) => {
    setSelectedSuppliers(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const displayedSuppliers = MOCK_SUPPLIERS.filter(s => selectedSuppliers.includes(s.id));
  const bestMatch = MOCK_SUPPLIERS.reduce((best, s) => s.ai_match > best.ai_match ? s : best, MOCK_SUPPLIERS[0]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 lg:p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <GitCompare className="w-6 h-6 text-green-600" /> Supplier Comparison
            </h1>
            <p className="text-gray-500 mt-1">AI-powered comparison of shortlisted suppliers</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Sparkles className="w-4 h-4 text-primary-500" />
            <span>{displayedSuppliers.length} suppliers selected</span>
          </div>
        </div>

        {/* AI Recommendation Banner */}
        <div className="bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-200 rounded-xl p-5 mb-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-primary-800">AI Recommendation: {bestMatch.name}</p>
            <p className="text-xs text-primary-600 mt-0.5">Highest match score ({bestMatch.ai_match}%) based on your requirements, certifications, and trade history.</p>
          </div>
          <button className="btn-primary btn-sm flex items-center gap-1 whitespace-nowrap">
            Contact Best Match <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Supplier Selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          {MOCK_SUPPLIERS.map(s => (
            <button
              key={s.id}
              onClick={() => toggleSupplier(s.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${selectedSuppliers.includes(s.id)
                  ? 'bg-primary-100 text-primary-700 border border-primary-200'
                  : 'bg-gray-100 text-gray-500 border border-transparent hover:bg-gray-200'
                }`}
            >
              {selectedSuppliers.includes(s.id) ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-4 h-4 rounded-full border-2 border-gray-300" />}
              {s.name}
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${s.ai_match >= 85 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {s.ai_match}%
              </span>
            </button>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="table-container overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase sticky left-0 bg-gray-50 z-10">Criteria</th>
                {displayedSuppliers.map(s => (
                  <th key={s.id} className="text-center px-6 py-4 min-w-[180px]">
                    <div className="flex flex-col items-center gap-1">
                      <p className="text-sm font-semibold text-gray-900">{s.name}</p>
                      <div className="flex items-center gap-1">
                        {s.verified && <Shield className="w-3.5 h-3.5 text-green-500" />}
                        <span className="text-xs text-gray-500">{s.country}</span>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-700 sticky left-0 bg-white">AI Match Score</td>
                {displayedSuppliers.map(s => (
                  <td key={s.id} className="text-center px-6 py-4">
                    <div className="flex flex-col items-center gap-1">
                      <span className={`badge text-sm font-bold ${s.ai_match >= 85 ? 'badge-success' : s.ai_match >= 70 ? 'badge-warning' : 'bg-red-50 text-red-700'}`}>
                        <Bot className="w-3.5 h-3.5 mr-1" /> {s.ai_match}%
                      </span>
                      <div className="progress-bar h-1.5 w-20">
                        <div className={`progress-bar-fill ${s.ai_match >= 85 ? 'bg-green-500' : s.ai_match >= 70 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${s.ai_match}%` }} />
                      </div>
                    </div>
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-700 sticky left-0 bg-white">Verified</td>
                {displayedSuppliers.map(s => (
                  <td key={s.id} className="text-center px-6 py-4">
                    {s.verified ? <span className="badge-success text-xs flex items-center gap-1 w-fit mx-auto"><Shield className="w-3.5 h-3.5" /> Verified</span> : <span className="text-gray-400 text-xs">Not verified</span>}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-700 sticky left-0 bg-white">Experience</td>
                {displayedSuppliers.map(s => <td key={s.id} className="text-center px-6 py-4 text-sm font-medium">{s.experience} years</td>)}
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-700 sticky left-0 bg-white">Rating</td>
                {displayedSuppliers.map(s => (
                  <td key={s.id} className="text-center px-6 py-4 text-sm font-medium">
                    <span className="flex items-center justify-center gap-1"><Star className="w-4 h-4 text-amber-400 fill-amber-400" /> {s.rating}</span>
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-700 sticky left-0 bg-white">Response Rate</td>
                {displayedSuppliers.map(s => (
                  <td key={s.id} className="text-center px-6 py-4">
                    <span className={`text-sm font-medium ${s.response_rate >= 90 ? 'text-green-600' : 'text-amber-600'}`}>{s.response_rate}%</span>
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-700 sticky left-0 bg-white">Conversion Rate</td>
                {displayedSuppliers.map(s => <td key={s.id} className="text-center px-6 py-4 text-sm font-medium">{s.conversion_rate}%</td>)}
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-700 sticky left-0 bg-white">Price Range</td>
                {displayedSuppliers.map(s => <td key={s.id} className="text-center px-6 py-4 text-sm font-semibold text-primary-700">{s.price}</td>)}
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-700 sticky left-0 bg-white">Products</td>
                {displayedSuppliers.map(s => <td key={s.id} className="text-center px-6 py-4 text-sm font-medium">{s.products}</td>)}
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-700 sticky left-0 bg-white">Certifications</td>
                {displayedSuppliers.map(s => (
                  <td key={s.id} className="text-center px-6 py-4">
                    <div className="flex flex-wrap justify-center gap-1">
                      {s.certifications.map(c => <span key={c} className="badge bg-green-50 text-green-700 text-[10px] flex items-center gap-0.5"><Award className="w-2.5 h-2.5" /> {c}</span>)}
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 sticky left-0 bg-white"></td>
                {displayedSuppliers.map(s => (
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
