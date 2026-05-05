import React from 'react';
import { Buyer } from '@/types/buyer';
import { TrendingUp, MapPin, Calendar, Database } from 'lucide-react';

interface BuyerRadarTableProps {
  buyers: Buyer[];
  onSelectBuyer?: (buyer: Buyer) => void;
  showActions?: boolean;
}

export const BuyerRadarTable: React.FC<BuyerRadarTableProps> = ({ 
  buyers, 
  onSelectBuyer,
  showActions = true 
}) => {
  const getBuyScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-blue-600 bg-blue-50';
    if (score >= 40) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getDataSourceBadge = (source: string) => {
    const badges = {
      comtrade: 'badge-success',
      customs: 'badge-primary',
      estimated: 'badge-warning'
    };
    return badges[source as keyof typeof badges] || 'badge bg-gray-100';
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Company
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Country
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Buy Score
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Import
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Data Source
            </th>
            {showActions && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {buyers.map((buyer) => (
            <tr 
              key={buyer.id}
              className="hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => onSelectBuyer?.(buyer)}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {buyer.company_name}
                    </div>
                    {buyer.verified && (
                      <span className="badge badge-success text-xs mt-1">
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  {buyer.country}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getBuyScoreColor(buyer.buy_score)}`}>
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {buyer.buy_score}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {buyer.last_import_date ? (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(buyer.last_import_date).toLocaleDateString()}
                  </div>
                ) : (
                  <span className="text-gray-400">N/A</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`badge ${getDataSourceBadge(buyer.data_source)} text-xs flex items-center gap-1 w-fit`}>
                  <Database className="w-3 h-3" />
                  {buyer.data_source}
                </span>
              </td>
              {showActions && (
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectBuyer?.(buyer);
                    }}
                    className="text-primary-700 hover:text-primary-900 font-medium"
                  >
                    View Details
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      
      {buyers.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Database className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No buyers found</p>
        </div>
      )}
    </div>
  );
};
