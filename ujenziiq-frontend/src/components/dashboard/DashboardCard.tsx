import React from 'react';
import { TrendingUpIcon, TrendingDownIcon } from '@/components/icons/Icons';

export type TrendDirection = 'up' | 'down' | 'neutral';

interface DashboardCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: TrendDirection;
  trendText?: string;
  isDanger?: boolean;
}

export function DashboardCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend = 'neutral', 
  trendText,
  isDanger = false
}: DashboardCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className={`text-2xl font-bold mt-1 ${isDanger ? 'text-red-600' : 'text-gray-900'}`}>{value}</p>
        </div>
        <div className={`p-2 rounded-full ${isDanger ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <div className="mt-4 flex items-center">
        {trend !== 'neutral' && (
          <span className={`mr-2 ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
            {trend === 'up' ? <TrendingUpIcon className="h-4 w-4" /> : <TrendingDownIcon className="h-4 w-4" />}
          </span>
        )}
        <span className="text-sm text-gray-500">{description}</span>
        {trendText && (
          <span className={`ml-auto text-xs font-medium ${
            trend === 'up' ? 'text-green-500' : 
            trend === 'down' ? 'text-red-500' : 'text-gray-500'
          }`}>
            {trendText}
          </span>
        )}
      </div>
    </div>
  );
}