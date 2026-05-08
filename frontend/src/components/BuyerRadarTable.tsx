'use client';

import React, { useState, useEffect } from 'react';
import { Buyer } from '@/types/buyer';
import { TrendingUp, MapPin, Calendar, Database, Search, Filter } from 'lucide-react';
import { COUNTRIES } from '@/lib/constants';

const MOCK_BUYERS: Buyer[] = [
  { id: '1', company_name: 'Global Foods Inc', country: 'USA', buy_score: 92, verified: true, last_import_date: '2026-04-15', data_source: 'comtrade', created_at: '', updated_at: '' },
  { id: '2', company_name: 'Shanghai Trading Co', country: 'China', buy_score: 87, verified: true, last_import_date: '2026-04-20', data_source: 'customs', created_at: '', updated_at: '' },
  { id: '3', company_name: 'Euro Import GmbH', country: 'Germany', buy_score: 78, verified: true, last_import_date: '2026-03-28', data_source: 'comtrade', created_at: '', updated_at: '' },
  { id: '4', company_name: 'Tokyo Mart Ltd', country: 'Japan', buy_score: 85, verified: false, last_import_date: '2026-04-10', data_source: 'estimated', created_at: '', updated_at: '' },
  { id: '5', company_name: 'Australian Organics Pty', country: 'Australia', buy_score: 71, verified: true, last_import_date: '2026-02-15', data_source: 'comtrade', created_at: '', updated_at: '' },
  { id: '6', company_name: 'Singapore Fresh Foods', country: 'Singapore', buy_score: 65, verified: false, last_import_date: '2026-03-01', data_source: 'estimated', created_at: '', updated_at: '' },
  { id: '7', company_name: 'India Spice Merchants', country: 'India', buy_score: 58, verified: true, last_import_date: '2026-01-20', data_source: 'customs', created_at: '', updated_at: '' },
  { id: '8', company_name: 'Brazil Imports SA', country: 'Brazil', buy_score: 49, verified: false, last_import_date: '2025-12-10', data_source: 'estimated', created_at: '', updated_at: '' },
];

const getBuyScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-700 bg-green-100';
  if (score >= 60) return 'text-blue-700 bg-blue-100';
  if (score >= 40) return 'text-yellow-700 bg-yellow-100';
  return 'text-red-700 bg-red-100';
};

const getDataSourceBadge = (source: string) => {
  const badges: Record<string, string> = { comtrade: 'badge-success', customs: 'badge-primary', estimated: 'badge-warning' };
  return badges[source] || 'badge bg-gray-100';
};

export default function BuyerRadarTable() {
  const [buyers, setBuyers] = useState<Buyer[]>(MOCK_BUYERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [minScore, setMinScore] = useState(0);

  useEffect(() => {
    // Try fetching from backend
    fetch('http://localhost:8080/api/buyers/radar')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setBuyers(data);
        }
      })
      .catch(() => {}); // Use mock data on failure
  }, []);

  const filteredBuyers = buyers.filter(b => {
    const matchSearch = !searchQuery || b.company_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCountry = !countryFilter || b.country === countryFilter;
    const matchScore = b.buy_score >= minScore;
    return matchSearch && matchCountry && matchScore;
  });

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search buyers..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input-field pl-10" />
        </div>
        <select value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)} className="select-field md:w-48">
          <option value="">All Countries</option>
          {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={minScore} onChange={(e) => setMinScore(Number(e.target.value))} className="select-field md:w-48">
          <option value={0}>Min Score: Any</option>
          <option value={50}>Min Score: 50+</option>
          <option value={70}>Min Score: 70+</option>
          <option value={85}>Min Score: 85+</option>
        </select>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Company</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Country</th>
              <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Buy Score</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Last Import</th>
              <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Data Source</th>
              <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredBuyers.map((buyer) => (
              <tr key={buyer.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-primary-700">{buyer.company_name[0]}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{buyer.company_name}</p>
                      {buyer.verified && <span className="badge-success text-[10px]">Verified</span>}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {buyer.country}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`badge text-sm font-bold ${getBuyScoreColor(buyer.buy_score)}`}>
                    <TrendingUp className="w-3.5 h-3.5 mr-1" /> {buyer.buy_score}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {buyer.last_import_date ? (
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(buyer.last_import_date).toLocaleDateString()}</span>
                  ) : <span className="text-gray-400">N/A</span>}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`badge text-xs capitalize ${getDataSourceBadge(buyer.data_source)}`}>
                    <Database className="w-3 h-3 mr-1" /> {buyer.data_source}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button className="btn-primary btn-sm text-xs">View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredBuyers.length === 0 && (
          <div className="text-center py-12">
            <Database className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">No buyers found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
