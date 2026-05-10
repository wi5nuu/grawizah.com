'use client';

import { useState } from 'react';
import { GitCompare, Star, Shield, MapPin, Award, Bot, CheckCircle2, X, ArrowRight, Sparkles } from 'lucide-react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

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
    <div className="min-h-screen flex flex-col bg-background text-on-background">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="p-6 lg:p-8 max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-on-surface flex items-center gap-2">
                <GitCompare className="w-6 h-6 text-primary" /> Supplier Comparison
              </h1>
              <p className="text-on-surface-variant mt-1">AI-powered comparison of shortlisted suppliers</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-on-surface-variant">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>{displayedSuppliers.length} suppliers selected</span>
            </div>
          </div>

          {/* AI Recommendation Banner */}
          <div className="bg-gradient-to-r from-primary-container to-secondary-container rounded-xl p-5 mb-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
              <Bot className="w-6 h-6 text-on-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-on-primary-container">AI Recommendation: {bestMatch.name}</p>
              <p className="text-xs text-on-primary-container/80 mt-0.5">Highest match score ({bestMatch.ai_match}%) based on your requirements, certifications, and trade history.</p>
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
                    ? 'bg-primary-fixed text-on-primary-fixed border-primary'
                    : 'bg-surface-container text-on-surface-variant border-transparent hover:bg-surface-container-high'
                  } border`}
              >
                {selectedSuppliers.includes(s.id) ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-4 h-4 rounded-full border-2 border-outline" />}
                {s.name}
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${s.ai_match >= 85 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'}`}>
                  {s.ai_match}%
                </span>
              </button>
            ))}
          </div>

          {/* Comparison Table */}
          <div className="table-container overflow-x-auto bg-surface-container-lowest rounded-xl border border-surface-variant shadow-ambient">
            <table className="w-full">
              <thead className="bg-surface-container-low border-b border-surface-variant">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase sticky left-0 bg-surface-container-low z-10">Criteria</th>
                  {displayedSuppliers.map(s => (
                    <th key={s.id} className="text-center px-6 py-4 min-w-[180px]">
                      <div className="flex flex-col items-center gap-1">
                        <p className="text-sm font-semibold text-on-surface">{s.name}</p>
                        <div className="flex items-center gap-1">
                          {s.verified && <Shield className="w-3.5 h-3.5 text-primary" />}
                          <span className="text-xs text-on-surface-variant">{s.country}</span>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-variant">
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-on-surface sticky left-0 bg-surface-container-lowest">AI Match Score</td>
                  {displayedSuppliers.map(s => (
                    <td key={s.id} className="text-center px-6 py-4">
                      <div className="flex flex-col items-center gap-1">
                        <span className={`badge text-sm font-bold ${s.ai_match >= 85 ? 'badge-success' : s.ai_match >= 70 ? 'badge-warning' : 'badge-danger'}`}>
                          <Bot className="w-3.5 h-3.5 mr-1" /> {s.ai_match}%
                        </span>
                        <div className="progress-bar h-1.5 w-20 mt-1">
                          <div className={`progress-bar-fill ${s.ai_match >= 85 ? 'bg-emerald-500' : s.ai_match >= 70 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${s.ai_match}%` }} />
                        </div>
                      </div>
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-on-surface sticky left-0 bg-surface-container-lowest">Verified</td>
                  {displayedSuppliers.map(s => (
                    <td key={s.id} className="text-center px-6 py-4">
                      {s.verified ? <span className="badge-success text-xs flex items-center gap-1 w-fit mx-auto"><Shield className="w-3.5 h-3.5" /> Verified</span> : <span className="text-on-surface-variant text-xs">Not verified</span>}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-on-surface sticky left-0 bg-surface-container-lowest">Experience</td>
                  {displayedSuppliers.map(s => <td key={s.id} className="text-center px-6 py-4 text-sm font-medium">{s.experience} years</td>)}
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-on-surface sticky left-0 bg-surface-container-lowest">Rating</td>
                  {displayedSuppliers.map(s => (
                    <td key={s.id} className="text-center px-6 py-4 text-sm font-medium">
                      <span className="flex items-center justify-center gap-1"><Star className="w-4 h-4 text-amber-400 fill-amber-400" /> {s.rating}</span>
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-on-surface sticky left-0 bg-surface-container-lowest">Response Rate</td>
                  {displayedSuppliers.map(s => (
                    <td key={s.id} className="text-center px-6 py-4">
                      <span className={`text-sm font-medium ${s.response_rate >= 90 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>{s.response_rate}%</span>
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-on-surface sticky left-0 bg-surface-container-lowest">Conversion Rate</td>
                  {displayedSuppliers.map(s => <td key={s.id} className="text-center px-6 py-4 text-sm font-medium">{s.conversion_rate}%</td>)}
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-on-surface sticky left-0 bg-surface-container-lowest">Price Range</td>
                  {displayedSuppliers.map(s => <td key={s.id} className="text-center px-6 py-4 text-sm font-semibold text-primary">{s.price}</td>)}
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-on-surface sticky left-0 bg-surface-container-lowest">Products</td>
                  {displayedSuppliers.map(s => <td key={s.id} className="text-center px-6 py-4 text-sm font-medium">{s.products}</td>)}
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-on-surface sticky left-0 bg-surface-container-lowest">Certifications</td>
                  {displayedSuppliers.map(s => (
                    <td key={s.id} className="text-center px-6 py-4">
                      <div className="flex flex-wrap justify-center gap-1">
                        {s.certifications.map(c => <span key={c} className="badge bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 text-[10px] flex items-center gap-0.5 border border-emerald-200 dark:border-emerald-700"><Award className="w-2.5 h-2.5" /> {c}</span>)}
                      </div>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 sticky left-0 bg-surface-container-lowest"></td>
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
      </main>
      <Footer />
    </div>
  );
}
