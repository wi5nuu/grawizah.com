'use client';

import React, { useState, useEffect } from 'react';
import { LeaderboardService } from '@/services/LeaderboardService';
import { LeaderboardScore } from '@/types';
import { Trophy, TrendingUp, TrendingDown, Award } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [scores, setScores] = useState<LeaderboardScore[]>([]);
  const [myScore, setMyScore] = useState<LeaderboardScore | null>(null);
  const [loading, setLoading] = useState(true);
  const leaderboardService = new LeaderboardService();

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const data = await leaderboardService.getAll();
      setScores(data);
      
      if (user) {
        const myData = await leaderboardService.getMyScore(user.id);
        setMyScore(myData);
      }
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-500" />
            Business Performance Leaderboard
          </h1>
          <p className="text-gray-600 mt-1">Track your performance against competitors</p>
        </div>

        {/* My Score Card */}
        {myScore && (
          <div className="bg-gradient-to-r from-primary-600 to-blue-600 text-white p-6 rounded-lg shadow-lg mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Your Current Rank</p>
                <p className="text-4xl font-bold mt-1">#{myScore.rank}</p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-90">Total Score</p>
                <p className="text-4xl font-bold mt-1">{myScore.total_score.toFixed(1)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-90">7-Day Trend</p>
                <div className="flex items-center gap-2 mt-1">
                  {myScore.trend_7d && myScore.trend_7d > 0 ? (
                    <>
                      <TrendingUp className="w-6 h-6" />
                      <span className="text-2xl font-bold">+{myScore.trend_7d.toFixed(1)}</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="w-6 h-6" />
                      <span className="text-2xl font-bold">{myScore.trend_7d?.toFixed(1) || 0}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Conversion</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Repeat Buyers</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Response Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trend</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    Loading leaderboard...
                  </td>
                </tr>
              ) : scores.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No data available
                  </td>
                </tr>
              ) : (
                scores.map((score, index) => {
                  const isMyCompany = myScore?.company_id === score.company_id;
                  return (
                    <tr 
                      key={score.id} 
                      className={`hover:bg-gray-50 ${isMyCompany ? 'bg-primary-50' : ''}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-2xl">{getRankIcon(score.rank)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">
                            {score.company_id}
                          </span>
                          {isMyCompany && (
                            <Award className="w-4 h-4 text-primary-600" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-lg font-bold text-primary-700">
                          {score.total_score.toFixed(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${score.conversion_rate}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">{score.conversion_rate}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${score.repeat_buyer_rate}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">{score.repeat_buyer_rate}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-purple-600 h-2 rounded-full" 
                              style={{ width: `${score.response_rate}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">{score.response_rate}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {score.trend_7d && score.trend_7d > 0 ? (
                          <span className="flex items-center gap-1 text-green-600">
                            <TrendingUp className="w-4 h-4" />
                            +{score.trend_7d.toFixed(1)}
                          </span>
                        ) : score.trend_7d && score.trend_7d < 0 ? (
                          <span className="flex items-center gap-1 text-red-600">
                            <TrendingDown className="w-4 h-4" />
                            {score.trend_7d.toFixed(1)}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
