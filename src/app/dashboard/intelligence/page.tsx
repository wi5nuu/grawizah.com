'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useBuyerRadar } from '@/hooks/useBuyerRadar';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { BuyerRadarTable } from '@/components/BuyerRadarTable';
import { LeaderboardTable } from '@/components/LeaderboardTable';
import { 
  Target, 
  TrendingUp, 
  Users, 
  BarChart3,
  Lock,
  Download
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function IntelligenceHubPage() {
  const { user, isPremium, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'buyer-radar' | 'leaderboard' | 'competitors'>('buyer-radar');
  
  const { buyers, loading: buyersLoading, searchBuyers } = useBuyerRadar();
  const { scores, loading: leaderboardLoading } = useLeaderboard();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (!authLoading && !isPremium) {
      router.push('/pricing');
    }
  }, [user, isPremium, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700"></div>
      </div>
    );
  }

  if (!user || !isPremium) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="card max-w-md text-center">
          <Lock className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Premium Feature</h2>
          <p className="text-gray-600 mb-6">
            Upgrade to Premium Intelligence to access Buyer Radar, AI Lead Scoring, and more.
          </p>
          <Link href="/pricing" className="btn-primary">
            Upgrade Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-700 to-accent-600 text-white">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Premium Intelligence Hub</h1>
              <p className="text-primary-100">
                AI-powered insights to win deals before negotiations start
              </p>
            </div>
            <div className="badge bg-white text-primary-700 px-4 py-2">
              Premium Active
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{buyers.length}</p>
            <p className="text-sm text-gray-600">Buyers in Radar</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-green-50 rounded-lg">
                <Target className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {buyers.filter(b => b.buy_score >= 80).length}
            </p>
            <p className="text-sm text-gray-600">High-Score Leads</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-purple-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {scores.length > 0 ? scores[0].rank : 'N/A'}
            </p>
            <p className="text-sm text-gray-600">Your Rank</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-orange-50 rounded-lg">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">12</p>
            <p className="text-sm text-gray-600">Market Alerts</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('buyer-radar')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'buyer-radar'
                    ? 'border-primary-700 text-primary-700'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Users className="w-4 h-4 inline mr-2" />
                Buyer Radar
              </button>
              <button
                onClick={() => setActiveTab('leaderboard')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'leaderboard'
                    ? 'border-primary-700 text-primary-700'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <TrendingUp className="w-4 h-4 inline mr-2" />
                Leaderboard
              </button>
              <button
                onClick={() => setActiveTab('competitors')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'competitors'
                    ? 'border-primary-700 text-primary-700'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <BarChart3 className="w-4 h-4 inline mr-2" />
                Competitor Benchmarking
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Buyer Radar Tab */}
            {activeTab === 'buyer-radar' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Buyer Radar</h2>
                    <p className="text-sm text-gray-600">
                      Verified buyers with AI-powered Buy Score (0-100)
                    </p>
                  </div>
                  <button className="btn-outline flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export CSV
                  </button>
                </div>

                {buyersLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700 mx-auto"></div>
                  </div>
                ) : (
                  <BuyerRadarTable buyers={buyers} />
                )}
              </div>
            )}

            {/* Leaderboard Tab */}
            {activeTab === 'leaderboard' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Leaderboard</h2>
                    <p className="text-sm text-gray-600">
                      Top traders ranked by business metrics
                    </p>
                  </div>
                </div>

                {leaderboardLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700 mx-auto"></div>
                  </div>
                ) : (
                  <LeaderboardTable scores={scores} currentCompanyId={user.id} />
                )}
              </div>
            )}

            {/* Competitor Benchmarking Tab */}
            {activeTab === 'competitors' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Competitor Benchmarking</h2>
                    <p className="text-sm text-gray-600">
                      Real-time price and strategy analysis
                    </p>
                  </div>
                </div>

                <div className="text-center py-12 text-gray-500">
                  <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">Coming Soon</p>
                  <p className="text-sm">Competitor analysis features are under development</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
