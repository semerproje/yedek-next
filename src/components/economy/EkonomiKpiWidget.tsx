"use client";

import { useEffect, useState } from 'react';
import { TrendingUp, FileText, Eye, Users } from 'lucide-react';

interface KpiData {
  totalNews: number;
  totalReports: number;
  dailyViews: number;
  activeUsers: number;
}

const EkonomiKpiWidget = () => {
  const [kpiData, setKpiData] = useState<KpiData>({
    totalNews: 0,
    totalReports: 0,
    dailyViews: 0,
    activeUsers: 0
  });
  const [loading, setLoading] = useState(true);

  // Mock veri - Ekonomi kategorisi için
  const mockKpiData: KpiData = {
    totalNews: 1847,
    totalReports: 542,
    dailyViews: 25847,
    activeUsers: 3241
  };

  useEffect(() => {
    // Simüle edilmiş veri yükleme
    const timer = setTimeout(() => {
      setKpiData(mockKpiData);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const kpiItems = [
    {
      title: 'Ekonomi Haberleri',
      value: kpiData.totalNews,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+18%'
    },
    {
      title: 'Piyasa Analizleri',
      value: kpiData.totalReports,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+12%'
    },
    {
      title: 'Günlük Görüntüleme',
      value: kpiData.dailyViews,
      icon: Eye,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: '+25%'
    },
    {
      title: 'Aktif Yatırımcı',
      value: kpiData.activeUsers,
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      change: '+8%'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {kpiItems.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-full ${item.bgColor}`}>
                <IconComponent className={`h-6 w-6 ${item.color}`} />
              </div>
              <span className="text-sm font-medium text-green-600">{item.change}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">{item.title}</h3>
            <p className="text-2xl font-bold text-gray-900">
              {item.value.toLocaleString('tr-TR')}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default EkonomiKpiWidget;
