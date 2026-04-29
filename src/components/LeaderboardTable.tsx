import React from 'react';
import { LeaderboardScore } from '@/types/company';
import { Trophy, TrendingUp, TrendingDown } from 'lucide-react';

interface LeaderboardTableProps {
  scores: LeaderboardScore[];
  currentCompanyId?: string;
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ 
  scores,
  currentCompanyId 
}) => {
  const getRankBadge = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank;
  };

  const getTrendIcon = (trend?: number) => {
    if (!trend) return null;
    if (trend > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (trend < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return null;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rank
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Company
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Score
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Conversion Rate
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Repeat Buyer
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Response Rate
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Trend (7d)
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {scores.map((score) => {
            const isCurrentCompany = score.company_id === currentCompanyId;
            
            return (
              <tr 
                key={score.id}
                className={`${isCurrentCompany ? 'bg-primary-50' : 'hover:bg-gray-50'} transition-colors`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">
                      {getRankBadge(score.rank || 0)}
                    </span>
                    {score.rank && score.rank <= 3 && (
                      <Trophy className="w-5 h-5 text-yellow-500" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {/* Company name would come from joined data */}
                    Company #{score.company_id.slice(0, 8)}
                  </div>
                  {isCurrentCompany && (
                    <span className="badge badge-primary text-xs mt-1">You</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-lg font-bold text-primary-700">
                    {score.total_score.toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${score.conversion_rate}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">
                      {score.conversion_rate.toFixed(1)}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${score.repeat_buyer_rate}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">
                      {score.repeat_buyer_rate.toFixed(1)}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full" 
                        style={{ width: `${score.response_rate}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">
                      {score.response_rate.toFixed(1)}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    {getTrendIcon(score.trend_7d)}
                    <span className={`text-sm font-medium ${
                      score.trend_7d && score.trend_7d > 0 ? 'text-green-600' : 
                      score.trend_7d && score.trend_7d < 0 ? 'text-red-600' : 
                      'text-gray-600'
                    }`}>
                      {score.trend_7d ? `${score.trend_7d > 0 ? '+' : ''}${score.trend_7d.toFixed(2)}` : 'N/A'}
                    </span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      {scores.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Trophy className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No leaderboard data available</p>
        </div>
      )}
    </div>
  );
};
