'use client';

import React, { useState, useEffect } from 'react';
import { Palette, Music, Camera, BookOpen, Theater, Users, TrendingUp, TrendingDown, Activity, Calendar, Clock } from 'lucide-react';

interface CultureSummary {
  id: string;
  title: string;
  value: string;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  trend: number[];
  lastUpdate: string;
  priority: 'high' | 'medium' | 'low';
}

const CultureSummaryCards = () => {
  const [summaries, setSummaries] = useState<CultureSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummaries = () => {
      const mockSummaries: CultureSummary[] = [
        {
          id: '1',
          title: 'Günlük Kültür Ziyaretçisi',
          value: '14,832',
          change: 23.7,
          changeType: 'increase',
          description: 'Müze ve sanat galerisi ziyaretçi sayısı',
          icon: Users,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          trend: [12200, 13400, 14100, 14832],
          lastUpdate: '10 dk önce',
          priority: 'high'
        },
        {
          id: '2',
          title: 'Aktif Sanat Etkinliği',
          value: '247',
          change: 15.3,
          changeType: 'increase',
          description: 'Bu hafta düzenlenen kültür etkinlikleri',
          icon: Calendar,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          trend: [210, 225, 235, 247],
          lastUpdate: '5 dk önce',
          priority: 'high'
        },
        {
          id: '3',
          title: 'Müzik Konser Katılımı',
          value: '8,926',
          change: -4.2,
          changeType: 'decrease',
          description: 'Bu hafta konser katılımcı sayısı',
          icon: Music,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          trend: [9500, 9200, 9000, 8926],
          lastUpdate: '20 dk önce',
          priority: 'medium'
        },
        {
          id: '4',
          title: 'Yeni Sanat Eseri',
          value: '156',
          change: 31.8,
          changeType: 'increase',
          description: 'Bu ay sergilenen yeni eser sayısı',
          icon: Palette,
          color: 'text-pink-600',
          bgColor: 'bg-pink-50',
          trend: [115, 125, 140, 156],
          lastUpdate: '30 dk önce',
          priority: 'medium'
        },
        {
          id: '5',
          title: 'Fotoğraf Sergi Ziyareti',
          value: '3,247',
          change: 8.9,
          changeType: 'increase',
          description: 'Fotoğraf sergilerini ziyaret eden kişi sayısı',
          icon: Camera,
          color: 'text-indigo-600',
          bgColor: 'bg-indigo-50',
          trend: [2800, 3000, 3100, 3247],
          lastUpdate: '25 dk önce',
          priority: 'low'
        },
        {
          id: '6',
          title: 'Kitap Lansmanı',
          value: '89',
          change: 12.6,
          changeType: 'increase',
          description: 'Bu ay gerçekleşen kitap tanıtım etkinliği',
          icon: BookOpen,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          trend: [75, 80, 85, 89],
          lastUpdate: '1 saat önce',
          priority: 'medium'
        },
        {
          id: '7',
          title: 'Tiyatro Oyunu İzleyicisi',
          value: '5,634',
          change: -2.1,
          changeType: 'decrease',
          description: 'Bu hafta tiyatro salonlarındaki toplam izleyici',
          icon: Theater,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          trend: [5800, 5750, 5700, 5634],
          lastUpdate: '45 dk önce',
          priority: 'low'
        },
        {
          id: '8',
          title: 'Ortalama Etkinlik Süresi',
          value: '2.4 saat',
          change: 6.7,
          changeType: 'increase',
          description: 'Kültür etkinliklerinin ortalama süresi',
          icon: Clock,
          color: 'text-teal-600',
          bgColor: 'bg-teal-50',
          trend: [2.1, 2.2, 2.3, 2.4],
          lastUpdate: '15 dk önce',
          priority: 'low'
        }
      ];

      setSummaries(mockSummaries);
      setLoading(false);
    };

    fetchSummaries();
    const interval = setInterval(fetchSummaries, 30000);

    return () => clearInterval(interval);
  }, []);

  const formatChange = (change: number, type: string) => {
    const sign = type === 'increase' ? '+' : type === 'decrease' ? '-' : '';
    return `${sign}${Math.abs(change).toFixed(1)}%`;
  };

  const getChangeIcon = (type: string) => {
    switch (type) {
      case 'increase':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'decrease':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      case 'low':
        return 'border-l-green-500';
      default:
        return 'border-l-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Palette className="w-6 h-6 text-purple-600" />
            Kültür Özeti
          </h2>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            Canlı veriler
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaries.map((summary) => {
          const Icon = summary.icon;
          return (
            <div
              key={summary.id}
              className={`bg-white rounded-lg border-2 border-gray-100 border-l-4 ${getPriorityColor(summary.priority)} p-4 hover:shadow-lg transition-all duration-300 hover:border-gray-200`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`${summary.bgColor} rounded-lg p-2`}>
                  <Icon className={`w-5 h-5 ${summary.color}`} />
                </div>
                <div className="flex items-center gap-1">
                  {getChangeIcon(summary.changeType)}
                  <span className={`text-sm font-medium ${
                    summary.changeType === 'increase' ? 'text-green-600' : 
                    summary.changeType === 'decrease' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {formatChange(summary.change, summary.changeType)}
                  </span>
                </div>
              </div>

              <div className="mb-2">
                <h3 className="text-sm font-medium text-gray-600 mb-1">
                  {summary.title}
                </h3>
                <div className="text-2xl font-bold text-gray-900">
                  {summary.value}
                </div>
              </div>

              <p className="text-xs text-gray-500 mb-3">
                {summary.description}
              </p>

              {/* Mini Trend Chart */}
              <div className="flex items-end gap-1 mb-3" style={{height: '20px'}}>
                {summary.trend.map((value, index) => {
                  const maxValue = Math.max(...summary.trend);
                  const height = (value / maxValue) * 20;
                  return (
                    <div
                      key={index}
                      className={`bg-gradient-to-t ${summary.color.replace('text-', 'from-').replace('-600', '-400')} to-gray-200 rounded-sm flex-1`}
                      style={{ height: `${height}px` }}
                    ></div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-500">
                  Son güncelleme
                </span>
                <span className="text-xs font-medium text-gray-700">
                  {summary.lastUpdate}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Statistics */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {summaries.filter(s => s.changeType === 'increase').length}
            </div>
            <div className="text-sm text-purple-700 font-medium">Artan Metrik</div>
            <div className="text-xs text-purple-600 mt-1">Son 24 saatte</div>
          </div>

          <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {summaries.filter(s => s.priority === 'high').length}
            </div>
            <div className="text-sm text-blue-700 font-medium">Yüksek Öncelik</div>
            <div className="text-xs text-blue-600 mt-1">Kritik metrikler</div>
          </div>

          <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
            <div className="text-3xl font-bold text-green-600 mb-2">
              %{(summaries.filter(s => s.changeType === 'increase').length / summaries.length * 100).toFixed(0)}
            </div>
            <div className="text-sm text-green-700 font-medium">İyileşme Oranı</div>
            <div className="text-xs text-green-600 mt-1">Genel trend</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CultureSummaryCards;
