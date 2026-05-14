'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, AlertCircle, Globe, DollarSign, Package } from 'lucide-react';

interface MarketAlert {
  id: string;
  type: 'price_surge' | 'demand_spike' | 'new_market' | 'competitor_gap';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  market: string;
  product: string;
  actionable: string;
  timestamp: Date;
}

export const MarketOpportunityAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<MarketAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAlerts();
    
    // Refresh every 5 minutes
    const interval = setInterval(loadAlerts, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081'}/api/alerts/market`);
      const data = await res.json();
      
      const mappedAlerts: MarketAlert[] = data.map((a: any) => ({
        id: a.id,
        type: a.type,
        title: a.title,
        description: a.message,
        impact: a.type === 'demand_surge' ? 'high' : 'medium',
        market: a.country,
        product: a.product,
        actionable: 'Analyze current buyer intent in ' + a.country + ' for ' + a.product + '.',
        timestamp: new Date(a.timestamp),
      }));
      
      setAlerts(mappedAlerts);
    } catch (error) {
      console.error('Failed to load alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAlertIcon = (type: MarketAlert['type']) => {
    switch (type) {
      case 'price_surge':
        return <DollarSign className="w-5 h-5" />;
      case 'demand_spike':
        return <TrendingUp className="w-5 h-5" />;
      case 'new_market':
        return <Globe className="w-5 h-5" />;
      case 'competitor_gap':
        return <Package className="w-5 h-5" />;
    }
  };

  const getAlertColor = (impact: MarketAlert['impact']) => {
    switch (impact) {
      case 'high':
        return 'border-red-500 bg-red-50';
      case 'medium':
        return 'border-orange-500 bg-orange-50';
      case 'low':
        return 'border-blue-500 bg-blue-50';
    }
  };

  const getImpactBadge = (impact: MarketAlert['impact']) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-orange-100 text-orange-800',
      low: 'bg-blue-100 text-blue-800',
    };
    
    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${colors[impact]}`}>
        {impact.toUpperCase()} IMPACT
      </span>
    );
  };

  const getTimeAgo = (date: Date) => {
    const hours = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        <p className="text-gray-500 mt-2">Loading market opportunities...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Market Opportunity Alerts</h3>
          <p className="text-sm text-gray-600">AI-powered insights from global trade data</p>
        </div>
        <button
          onClick={loadAlerts}
          className="btn-secondary text-sm"
        >
          Refresh
        </button>
      </div>

      {alerts.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">No alerts at the moment</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`border-l-4 p-4 rounded-lg ${getAlertColor(alert.impact)}`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg">
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{alert.title}</h4>
                    {getImpactBadge(alert.impact)}
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-2">{alert.description}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-600 mb-3">
                    <span className="flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      {alert.market}
                    </span>
                    <span className="flex items-center gap-1">
                      <Package className="w-3 h-3" />
                      {alert.product}
                    </span>
                    <span>{getTimeAgo(alert.timestamp)}</span>
                  </div>
                  
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <p className="text-xs font-semibold text-gray-700 mb-1">
                      💡 Actionable Insight:
                    </p>
                    <p className="text-sm text-gray-900">{alert.actionable}</p>
                  </div>
                  
                  <div className="mt-3 flex gap-2">
                    <button className="btn-primary text-xs">
                      View Buyers
                    </button>
                    <button className="btn-secondary text-xs">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
