'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useInquiry } from '@/hooks/useInquiry';
import { InquiryAnalytics } from '@/components/InquiryAnalytics';
import { 
  TrendingUp, 
  MessageSquare, 
  Package, 
  Star,
  ArrowRight,
  Lock
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, loading: authLoading, isPremium } = useAuth();
  const router = useRouter();
  const [companyId, setCompanyId] = useState<string>('');
  
  const { analytics, loading: analyticsLoading } = useInquiry(companyId);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user.email}</p>
            </div>
            {!isPremium && (
              <Link href="/pricing" className="btn-primary flex items-center gap-2">
                <Star className="w-4 h-4" />
                Upgrade to Premium
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">0</p>
            <p className="text-sm text-gray-600">Total Products</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-purple-50 rounded-lg">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {analytics?.total_inquiries || 0}
            </p>
            <p className="text-sm text-gray-600">Total Inquiries</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-green-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {analytics?.conversion_rate.toFixed(1) || 0}%
            </p>
            <p className="text-sm text-gray-600">Conversion Rate</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-orange-50 rounded-lg">
                <Star className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {isPremium ? 'Premium' : 'Free'}
            </p>
            <p className="text-sm text-gray-600">Account Tier</p>
          </div>
        </div>

        {/* Inquiry Analytics */}
        {analytics && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Inquiry Analytics</h2>
            <InquiryAnalytics analytics={analytics} />
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/dashboard/products" className="card hover:shadow-lg transition-shadow">
            <Package className="w-8 h-8 text-primary-700 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Products</h3>
            <p className="text-sm text-gray-600 mb-4">
              Add, edit, or remove your product listings
            </p>
            <div className="flex items-center text-primary-700 font-medium">
              Go to Products <ArrowRight className="w-4 h-4 ml-2" />
            </div>
          </Link>

          <Link href="/dashboard/inquiries" className="card hover:shadow-lg transition-shadow">
            <MessageSquare className="w-8 h-8 text-primary-700 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">View Inquiries</h3>
            <p className="text-sm text-gray-600 mb-4">
              Respond to buyer inquiries and track conversations
            </p>
            <div className="flex items-center text-primary-700 font-medium">
              Go to Inquiries <ArrowRight className="w-4 h-4 ml-2" />
            </div>
          </Link>

          {isPremium ? (
            <Link href="/dashboard/intelligence" className="card hover:shadow-lg transition-shadow border-2 border-primary-700">
              <TrendingUp className="w-8 h-8 text-primary-700 mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Premium Intelligence
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Access Buyer Radar, AI Lead Scoring, and more
              </p>
              <div className="flex items-center text-primary-700 font-medium">
                Open Intelligence Hub <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </Link>
          ) : (
            <div className="card bg-gray-50 border-2 border-dashed border-gray-300">
              <Lock className="w-8 h-8 text-gray-400 mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Premium Intelligence
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Upgrade to access advanced AI features
              </p>
              <Link href="/pricing" className="btn-primary text-sm">
                Upgrade Now
              </Link>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No recent activity</p>
          </div>
        </div>
      </div>
    </div>
  );
}
