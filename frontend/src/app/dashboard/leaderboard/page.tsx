'use client';

import { useState, useEffect } from 'react';
import { LeaderboardService } from '@/services/LeaderboardService';

const MOCK_ENTRIES = [
  { id: '1', company_name: 'Nexus Manufacturing', country: 'Germany', score: 98, rank: 1, products: 42, inquiries: 312, badge: 'Gold Elite' },
  { id: '2', company_name: 'AeroTech Solutions', country: 'Taiwan', score: 95, rank: 2, products: 38, inquiries: 287, badge: 'Gold' },
  { id: '3', company_name: 'Chen Manufacturing', country: 'China', score: 91, rank: 3, products: 56, inquiries: 245, badge: 'Silver' },
  { id: '4', company_name: 'Pacific Textiles', country: 'Indonesia', score: 88, rank: 4, products: 29, inquiries: 198, badge: 'Silver' },
  { id: '5', company_name: 'SteelForge Industries', country: 'India', score: 85, rank: 5, products: 34, inquiries: 176, badge: 'Bronze' },
];

export default function LeaderboardPage() {
  const [entries, setEntries] = useState(MOCK_ENTRIES);
  const [period, setPeriod] = useState('monthly');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const service = new LeaderboardService();
        const data = await service.getLeaderboard();
        if (data && data.length > 0) setEntries(data as any);
      } catch { }
    };
    fetchData();
  }, []);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return { icon: 'emoji_events', color: 'text-amber-500', bg: 'bg-amber-100' };
    if (rank === 2) return { icon: 'emoji_events', color: 'text-gray-400', bg: 'bg-gray-100' };
    if (rank === 3) return { icon: 'emoji_events', color: 'text-amber-700', bg: 'bg-amber-50' };
    return { icon: 'tag', color: 'text-on-surface-variant', bg: 'bg-surface-container-low' };
  };

  const getBadgeStyle = (badge: string) => {
    if (badge.includes('Gold')) return 'bg-amber-100 text-amber-800 border border-amber-200';
    if (badge.includes('Silver')) return 'bg-gray-100 text-gray-700 border border-gray-200';
    return 'bg-orange-100 text-orange-800 border border-orange-200';
  };

  return (
    <div className="p-8 max-w-[1440px] mx-auto w-full">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-on-surface flex items-center gap-3">
            <span className="material-symbols-outlined text-amber-500 text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
            Supplier Leaderboard
          </h2>
          <p className="text-on-surface-variant mt-2 font-body">Top-performing suppliers ranked by engagement, quality, and trade volume.</p>
        </div>
        <div className="flex gap-2 bg-surface-container-low rounded-xl p-1">
          {['weekly', 'monthly', 'yearly'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${
                period === p ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold' : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </header>

      {/* Top 3 Podium */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {entries.slice(0, 3).map((entry) => {
          const rankStyle = getRankIcon(entry.rank);
          return (
            <div
              key={entry.id}
              className={`relative bg-surface-container-lowest rounded-2xl border p-6 text-center hover:-translate-y-1 transition-all duration-300 ${
                entry.rank === 1 ? 'border-amber-300 shadow-lg md:scale-105 md:z-10' : 'border-surface-variant shadow-ambient'
              }`}
            >
              {entry.rank === 1 && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-gradient-to-r from-amber-400 to-amber-500 text-white rounded-full text-xs font-bold shadow-md">
                  #1 Champion
                </div>
              )}
              <div className={`w-16 h-16 ${rankStyle.bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <span className={`material-symbols-outlined text-3xl ${rankStyle.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>{rankStyle.icon}</span>
              </div>
              <h3 className="text-lg font-bold text-on-surface mb-1">{entry.company_name}</h3>
              <p className="text-sm text-on-surface-variant mb-3 flex items-center justify-center gap-1">
                <span className="material-symbols-outlined text-[16px]">location_on</span> {entry.country}
              </p>
              <div className="text-4xl font-extrabold gradient-text mb-2">{entry.score}</div>
              <p className="text-xs text-on-surface-variant mb-4">Performance Score</p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getBadgeStyle(entry.badge)}`}>
                {entry.badge}
              </span>
              <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-surface-variant/50">
                <div><p className="text-lg font-bold text-on-surface">{entry.products}</p><p className="text-xs text-on-surface-variant">Products</p></div>
                <div><p className="text-lg font-bold text-on-surface">{entry.inquiries}</p><p className="text-xs text-on-surface-variant">Inquiries</p></div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Full Leaderboard Table */}
      <section className="bg-surface-container-lowest rounded-xl border border-surface-variant shadow-ambient overflow-hidden">
        <div className="p-6 border-b border-surface-variant/50">
          <h3 className="font-display font-semibold text-lg text-on-surface">Full Rankings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low border-b border-surface-variant/50 text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                <th className="p-4 pl-6">Rank</th>
                <th className="p-4">Company</th>
                <th className="p-4">Score</th>
                <th className="p-4">Products</th>
                <th className="p-4">Inquiries</th>
                <th className="p-4 pr-6">Badge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-variant/30">
              {entries.map((entry) => {
                const rankStyle = getRankIcon(entry.rank);
                return (
                  <tr key={entry.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="p-4 pl-6">
                      <div className={`w-8 h-8 rounded-full ${rankStyle.bg} flex items-center justify-center`}>
                        <span className={`text-sm font-bold ${rankStyle.color}`}>{entry.rank}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-on-surface">{entry.company_name}</p>
                      <p className="text-xs text-on-surface-variant">{entry.country}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-on-surface">{entry.score}</span>
                        <div className="w-16 h-1.5 bg-surface-variant rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" style={{ width: `${entry.score}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-on-surface">{entry.products}</td>
                    <td className="p-4 text-on-surface">{entry.inquiries}</td>
                    <td className="p-4 pr-6"><span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getBadgeStyle(entry.badge)}`}>{entry.badge}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
