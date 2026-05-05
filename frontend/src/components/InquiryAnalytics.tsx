import React from 'react';
import { InquiryAnalytics as IInquiryAnalytics } from '@/types/inquiry';
import { TrendingUp, MessageSquare, CheckCircle, Users, Clock } from 'lucide-react';

interface InquiryAnalyticsProps {
  analytics: IInquiryAnalytics;
}

export const InquiryAnalytics: React.FC<InquiryAnalyticsProps> = ({ analytics }) => {
  const stats = [
    {
      label: 'Total Inquiries',
      value: analytics.total_inquiries,
      icon: MessageSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Response Rate',
      value: `${analytics.response_rate.toFixed(1)}%`,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Conversion Rate',
      value: `${analytics.conversion_rate.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      label: 'Repeat Buyers',
      value: `${analytics.repeat_buyer_rate.toFixed(1)}%`,
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      label: 'Avg Response Time',
      value: `${analytics.avg_response_time_hours.toFixed(1)}h`,
      icon: Clock,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        
        return (
          <div key={index} className="card">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {stat.value}
            </p>
            <p className="text-sm text-gray-600">
              {stat.label}
            </p>
          </div>
        );
      })}
    </div>
  );
};
