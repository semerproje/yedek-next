import React from 'react';

interface DashboardSkeletonProps {
  cards?: number;
  showChart?: boolean;
  showRecentNews?: boolean;
}

export const DashboardSkeleton: React.FC<DashboardSkeletonProps> = ({ 
  cards = 8, 
  showChart = true, 
  showRecentNews = true 
}) => {
  return (
    <div className="min-h-screen bg-gray-50 p-6 animate-pulse">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Skeleton */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-300 rounded-xl"></div>
              <div>
                <div className="h-8 bg-gray-300 rounded w-48 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-64"></div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
              <div className="h-4 bg-gray-300 rounded w-16"></div>
            </div>
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: cards }).map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-300 rounded w-20"></div>
                  <div className="h-8 bg-gray-300 rounded w-16"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="w-8 h-8 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Chart Skeleton */}
        {showChart && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="h-6 bg-gray-300 rounded w-32 mb-6"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        )}

        {/* Recent News Skeleton */}
        {showRecentNews && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="h-6 bg-gray-300 rounded w-32 mb-6"></div>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
                  <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div className="flex items-center space-x-4">
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
