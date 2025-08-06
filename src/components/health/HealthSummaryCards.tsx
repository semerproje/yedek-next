'use client';

import React, { useState, useEffect } from 'react';
import { Heart, Activity, Users, TrendingUp, TrendingDown, Shield, Stethoscope, Brain, Clock, AlertTriangle } from 'lucide-react';

interface HealthSummary {
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

const HealthSummaryCards = () => {
  const [summaries, setSummaries] = useState<HealthSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummaries = () => {
      const mockSummaries: HealthSummary[] = [
        {
          id: '1',
          title: 'Günlük Hasta Sayısı',
          value: '8,247',
          change: 12.4,
          changeType: 'increase',
          description: 'Son 24 saatte muayene olan hasta sayısı',
          icon: Users,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          trend: [7200, 7800, 8100, 8247],
          lastUpdate: '5 dk önce',
          priority: 'high'
        },
        {
          id: '2',
          title: 'Acil Müdahaleler',
          value: '156',
          change: -8.2,
          changeType: 'decrease',
          description: 'Bugün gerçekleşen acil müdahale sayısı',
          icon: AlertTriangle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          trend: [180, 170, 162, 156],
          lastUpdate: '2 dk önce',
          priority: 'high'
        },
        {
          id: '3',
          title: 'Aşılama Oranı',
          value: '%89.7',
          change: 2.1,
          changeType: 'increase',
          description: 'Hedef nüfusta COVID-19 aşılanma oranı',
          icon: Shield,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          trend: [85.2, 87.1, 88.9, 89.7],
          lastUpdate: '1 saat önce',
          priority: 'medium'
        },
        {
          id: '4',
          title: 'Yoğun Bakım Doluluk',
          value: '%73.2',
          change: 5.8,
          changeType: 'increase',
          description: 'Yoğun bakım ünitelerinin doluluk oranı',
          icon: Activity,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          trend: [68.1, 70.5, 72.1, 73.2],
          lastUpdate: '15 dk önce',
          priority: 'high'
        },
        {
          id: '5',
          title: 'Kardiyoloji Konsültasyonları',
          value: '1,423',
          change: 15.7,
          changeType: 'increase',
          description: 'Bu hafta kardiyoloji bölümüne başvuru',
          icon: Heart,
          color: 'text-pink-600',
          bgColor: 'bg-pink-50',
          trend: [1100, 1250, 1350, 1423],
          lastUpdate: '30 dk önce',
          priority: 'medium'
        },
        {
          id: '6',
          title: 'Nöroloji Taramaları',
          value: '387',
          change: -3.4,
          changeType: 'decrease',
          description: 'Bu hafta nörolojik tarama sayısı',
          icon: Brain,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          trend: [420, 410, 395, 387],
          lastUpdate: '45 dk önce',
          priority: 'low'
        },
        {
          id: '7',
          title: 'Sağlık Kontrolleri',
          value: '2,864',
          change: 7.9,
          changeType: 'increase',
          description: 'Rutin sağlık kontrolü yapılan kişi sayısı',
          icon: Stethoscope,
          color: 'text-indigo-600',
          bgColor: 'bg-indigo-50',
          trend: [2400, 2600, 2750, 2864],
          lastUpdate: '20 dk önce',
          priority: 'medium'
        },
        {
          id: '8',
          title: 'Ortalama Bekleme Süresi',
          value: '18 dk',
          change: -12.5,
          changeType: 'decrease',
          description: 'Polikliniklerde ortalama bekleme süresi',
          icon: Clock,
          color: 'text-teal-600',
          bgColor: 'bg-teal-50',
          trend: [25, 22, 20, 18],
          lastUpdate: '10 dk önce',
          priority: 'medium'
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
            <Activity className="w-6 h-6 text-green-600" />
            Sağlık Özeti
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
          <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {summaries.filter(s => s.changeType === 'increase').length}
            </div>
            <div className="text-sm text-green-700 font-medium">Artan Metrik</div>
            <div className="text-xs text-green-600 mt-1">Son 24 saatte</div>
          </div>

          <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {summaries.filter(s => s.priority === 'high').length}
            </div>
            <div className="text-sm text-blue-700 font-medium">Yüksek Öncelik</div>
            <div className="text-xs text-blue-600 mt-1">Kritik metrikler</div>
          </div>

          <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              %{(summaries.filter(s => s.changeType === 'increase').length / summaries.length * 100).toFixed(0)}
            </div>
            <div className="text-sm text-purple-700 font-medium">İyileşme Oranı</div>
            <div className="text-xs text-purple-600 mt-1">Genel trend</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthSummaryCards;
