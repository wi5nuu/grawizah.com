'use client';

import { useState, useEffect } from 'react';
import { Trophy, TrendingUp, TrendingDown, Minus, Crown, Star, BarChart3, RefreshCw } from 'lucide-react';
import { LeaderboardService } from '@/services/LeaderboardService';

interface LeaderboardEntry {
  rank: number;
  company_id?: string;
  company_name: string;
  country: string;
  total_score: number;
  conversion_rate: number;
  repeat_buyer_rate: number;
  response_rate: number;
  buyer_rating: number;
  trend_7d: number;
}

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, company_name: 'PT Nusantara Agro', country: 'Indonesia', total_score: 89.5, conversion_rate: 28.5, repeat_buyer_rate: 42.0, response_rate: 95.0, buyer_rating: 4.8, trend_7d: 2.3 },
  { rank: 2, company_name: 'Java Spice Trading', country: 'Indonesia', total_score: 85.2, conversion_rate: 25.0, repeat_buyer_rate: 38.0, response_rate: 92.0, buyer_rating: 4.6, trend_7d: 1.1 },
  { rank: 3, company_name: 'Borneo Wood Export', country: 'Indonesia', total_score: 82.1, conversion_rate: 22.0, repeat_buyer_rate: 35.0, response_rate: 88.0, buyer_rating: 4.5, trend_7d: -0.5 },
  { rank: 4, company_name: 'PT Sumatra Organic', country: 'Indonesia', total_score: 78.4, conversion_rate: 20.0, repeat_buyer_rate: 30.0, response_rate: 85.0, buyer_rating: 4.3, trend_7d: 3.2 },
  { rank: 5, company_name: 'Bali Craft Co', country: 'Indonesia', total_score: 74.8, conversion_rate: 18.0, repeat_buyer_rate: 28.0, response_rate: 82.0, buyer_rating: 4.2, trend_7d: 0.0 },
  { rank: 6, company_name: 'Sulawesi Export Hub', country: 'Indonesia', total_score: 71.3, conversion_rate: 16.5, repeat_buyer_rate: 25.0, response_rate: 80.0, buyer_rating: 4.0, trend_7d: -1.2 },
  { rank: 7, company_name: 'Kalimantan Resources', country: 'Indonesia', total_score: 68.9, conversion_rate: 15.0, repeat_buyer_rate: 22.0, response_rate: 78.0, buyer_rating: 3.9, trend_7d: 0.8 },
  { rank: 8, company_name: 'Papua Natural Products', country: 'Indonesia', total_score: 65.0, conversion_rate: 14.0, repeat_buyer_rate: 20.0, response_rate: 75.0, buyer_rating: 3.8, trend_7d: 1.5 },
];

const leaderboardService = new LeaderboardService();

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(MOCK_LEADERBOARD);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    leaderboardService.getLeaderboard()
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setLeaderboard(data.map((entry: any, idx: number) => ({
            rank: idx + 1,
            company_id: entry.company_id,
            company_name: entry.company_name || `Company ${idx + 1}`,
            country: entry.country || 'Indonesia',
            total_score: entry.total_score || 0,
            conversion_rate: entry.conversion_rate || 0,
            repeat_buyer_rate: entry.repeat_buyer_rate || 0,
            response_rate: entry.response_rate || 0,
            buyer_rating: entry.buyer_rating || 0,
            trend_7d: entry.trend_7d || 0,
          })));
        }
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const getMedal = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getTrend = (trend: number) => {
    if (trend > 0) return { icon: TrendingUp, color: 'text-green-600', label: `+${trend.toFixed(1)}` };
    if (trend < 0) return { icon: TrendingDown, color: 'text-red-500', label: `${trend.toFixed(1)}` };
    return { icon: Minus, color: 'text-gray-400', label: '0.0' };
  };

  const getTier = (score: number) => {
    if (score >= 80) return { label: 'Excellent', color: 'badge-success' };
    if (score >= 60) return { label: 'Good', color: 'badge-primary' };
    if (score >= 40) return { label: 'Average', color: 'badge-warning' };
    return { label: 'Needs Work', color: 'bg-red-50 text-red-700' };
  };

  const topScore = leaderboard.length > 0 ? Math.max(...leaderboard.map(e => e.total_score)) : 0;
  const avgConversion = leaderboard.length > 0 ? (leaderboard.reduce((s, e) => s + e.conversion_rate, 0) / leaderboard.length).toFixed(1) : '0';

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              Leaderboard <Crown className="w-5 h-5 text-amber-500" />
            </h1>
            <p className="text-gray-500 text-sm">Benchmark your performance against other suppliers</p>
          </div>
        </div>
        <button className="btn-ghost flex items-center gap-2 text-sm">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center"><Trophy className="w-5 h-5 text-amber-600" /></div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{topScore.toFixed(1)}</p>
              <p className="text-xs text-gray-500">Top Score</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center"><BarChart3 className="w-5 h-5 text-primary-700" /></div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{leaderboard.length}</p>
              <p className="text-xs text-gray-500">Suppliers Ranked</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center"><TrendingUp className="w-5 h-5 text-green-600" /></div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{avgConversion}%</p>
              <p className="text-xs text-gray-500">Avg Conversion</p>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="w-8 h-8 border-2 border-primary-300 border-t-primary-600 rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 mt-2 text-sm">Loading leaderboard...</p>
        </div>
      )}

      {/* Top 3 Cards */}
      <div className="grid md:grid-cols-3 gap-5 mb-8">
        {leaderboard.slice(0, 3).map((entry) => (
          <div key={entry.rank} className={`card relative overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${entry.rank === 1 ? 'border-2 border-amber-300 bg-gradient-to-br from-amber-50 via-yellow-50 to-white' : 'border border-gray-100'}`}>
            {entry.rank === 1 && (
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-amber-200/30 to-transparent rounded-bl-full" />
            )}
            <div className="text-center relative">
              <span className="text-5xl">{getMedal(entry.rank)}</span>
              <h3 className="text-lg font-bold text-gray-900 mt-3">{entry.company_name}</h3>
              <p className="text-sm text-gray-500">{entry.country}</p>
              <p className="text-4xl font-extrabold gradient-text mt-3">{entry.total_score.toFixed(1)}</p>
              <p className="text-xs text-gray-400 mb-4">Total Score</p>
              <div className="progress-bar h-2 mb-4">
                <div className="progress-bar-fill bg-gradient-to-r from-primary-500 to-accent-500" style={{ width: `${entry.total_score}%` }} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-900">{entry.conversion_rate}%</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wide">Conversion</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-900">{entry.response_rate}%</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wide">Response</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-900">{entry.repeat_buyer_rate}%</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wide">Repeat</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-900 flex items-center justify-center gap-0.5">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> {entry.buyer_rating}
                </p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wide">Rating</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Full Table */}
      <div className="table-container">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Rank</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Company</th>
              <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Score</th>
              <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Conversion</th>
              <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Response</th>
              <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Repeat</th>
              <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Rating</th>
              <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase">7d Trend</th>
              <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Tier</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {leaderboard.map((entry) => {
              const trend = getTrend(entry.trend_7d);
              const tier = getTier(entry.total_score);
              const TrendIcon = trend.icon;
              return (
                <tr key={entry.rank} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-lg font-bold text-gray-900">{getMedal(entry.rank)}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{entry.company_name}</p>
                    <p className="text-xs text-gray-500">{entry.country}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-lg font-bold gradient-text">{entry.total_score.toFixed(1)}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{entry.conversion_rate}%</p>
                      <div className="progress-bar h-1.5 mt-1 w-20 mx-auto"><div className="progress-bar-fill bg-primary-500" style={{ width: `${entry.conversion_rate}%` }} /></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{entry.response_rate}%</p>
                      <div className="progress-bar h-1.5 mt-1 w-20 mx-auto"><div className="progress-bar-fill bg-green-500" style={{ width: `${entry.response_rate}%` }} /></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-medium text-gray-900">{entry.repeat_buyer_rate}%</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-900">
                    <span className="flex items-center justify-center gap-0.5"><Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> {entry.buyer_rating}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`flex items-center justify-center gap-1 text-sm font-medium ${trend.color}`}>
                      <TrendIcon className="w-4 h-4" /> {trend.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`badge text-xs ${tier.color}`}>{tier.label}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
