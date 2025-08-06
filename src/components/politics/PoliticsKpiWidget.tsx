'use client';

import React, { useState, useEffect } from 'react';
import { Vote, Users, TrendingUp, TrendingDown, Activity, Building, Crown, Shield, BarChart3, AlertTriangle } from 'lucide-react';

interface PoliticsKpiData {
  approvalRating: number;
  approvalChange: number;
  voterTurnout: number;
  turnoutChange: number;
  parliamentActivity: number;
  activityChange: number;
  publicTrust: number;
  trustChange: number;
  lastUpdate: string;
}

const PoliticsKpiWidget = () => {
  const [kpiData, setKpiData] = useState<PoliticsKpiData>({
    approvalRating: 0,
    approvalChange: 0,
    voterTurnout: 0,
    turnoutChange: 0,
    parliamentActivity: 0,
    activityChange: 0,
    publicTrust: 0,
    trustChange: 0,
    lastUpdate: ''
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKpiData = () => {
      // Simulate real-time politics data
      const mockKpiData: PoliticsKpiData = {
        approvalRating: 52.3 + (Math.random() - 0.5) * 6,
        approvalChange: -1.8 + (Math.random() - 0.5) * 4,
        voterTurnout: 84.2 + (Math.random() - 0.5) * 3,
        turnoutChange: 2.1 + (Math.random() - 0.5) * 2,
        parliamentActivity: 76.8 + (Math.random() - 0.5) * 5,
        activityChange: 4.3 + (Math.random() - 0.5) * 3,
        publicTrust: 41.7 + (Math.random() - 0.5) * 8,
        trustChange: -3.2 + (Math.random() - 0.5) * 4,
        lastUpdate: new Date().toLocaleTimeString('tr-TR')
      };

      setKpiData(mockKpiData);
      setLoading(false);
    };

    fetchKpiData();
    const interval = setInterval(fetchKpiData, 22000);

    return () => clearInterval(interval);
  }, []);

  const formatValue = (value: number, isDecimal: boolean = true, unit: string = '') => {
    const formatted = isDecimal ? value.toFixed(1) : value.toLocaleString();
    return unit ? `${formatted}${unit}` : formatted;
  };

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getChangeIcon = (change: number) => {
    return change >= 0 ? (
      <TrendingUp className="w-4 h-4 text-green-600" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-600" />
    );
  };

  const getApprovalStatus = (rating: number) => {
    if (rating >= 70) return { text: 'Yüksek', color: 'text-green-600', bg: 'bg-green-50' };
    if (rating >= 50) return { text: 'Orta', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (rating >= 30) return { text: 'Düşük', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { text: 'Çok Düşük', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const kpiItems = [
    {
      title: 'Hükümet Onay Oranı',
      value: formatValue(kpiData.approvalRating, true, '%'),
      change: formatChange(kpiData.approvalChange),
      changeColor: getChangeColor(kpiData.approvalChange),
      icon: Vote,
      description: 'Halkın hükümete güveni',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      extra: getApprovalStatus(kpiData.approvalRating)
    },
    {
      title: 'Seçmen Katılımı',
      value: formatValue(kpiData.voterTurnout, true, '%'),
      change: formatChange(kpiData.turnoutChange),
      changeColor: getChangeColor(kpiData.turnoutChange),
      icon: Users,
      description: 'Son seçim katılım oranı',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      title: 'Meclis Aktivitesi',
      value: formatValue(kpiData.parliamentActivity, true, '%'),
      change: formatChange(kpiData.activityChange),
      changeColor: getChangeColor(kpiData.activityChange),
      icon: Building,
      description: 'Yasama faaliyetleri',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Kamu Güveni',
      value: formatValue(kpiData.publicTrust, true, '%'),
      change: formatChange(kpiData.trustChange),
      changeColor: getChangeColor(kpiData.trustChange),
      icon: Shield,
      description: 'Kurumlara güven endeksi',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Crown className="w-6 h-6 text-blue-600" />
          Politik Metrikler
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Activity className="w-4 h-4" />
          <span>Son güncelleme: {kpiData.lastUpdate}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`${item.bgColor} rounded-lg p-2`}>
                  <Icon className={`w-5 h-5 ${item.iconColor}`} />
                </div>
                <div className="flex items-center gap-1">
                  {getChangeIcon(item.changeColor === 'text-green-600' ? 1 : -1)}
                  <span className={`text-sm font-medium ${item.changeColor}`}>
                    {item.change}
                  </span>
                </div>
              </div>

              <div className="mb-2">
                <h3 className="text-sm font-medium text-gray-600">
                  {item.title}
                </h3>
                <div className="text-2xl font-bold text-gray-900">
                  {item.value}
                </div>
              </div>

              {item.extra && (
                <div className={`${item.extra.bg} ${item.extra.color} px-2 py-1 rounded-full text-xs font-medium mb-2 inline-block`}>
                  {item.extra.text}
                </div>
              )}

              <p className="text-xs text-gray-500">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Political Indicators */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
            <BarChart3 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-blue-600">
              {Math.floor(287 + Math.random() * 20)}
            </div>
            <div className="text-sm text-blue-700">Aktif Yasama</div>
          </div>

          <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
            <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-purple-600">
              {Math.floor(23 + Math.random() * 5)}
            </div>
            <div className="text-sm text-purple-700">Siyasi Parti</div>
          </div>

          <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
            <Building className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-orange-600">
              {Math.floor(142 + Math.random() * 30)}
            </div>
            <div className="text-sm text-orange-700">Belediye Sayısı</div>
          </div>
        </div>
      </div>

      {/* Political Alerts */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          Politik Gündem
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
            <h4 className="font-medium text-blue-800">Meclis Oturumu</h4>
            <p className="text-sm text-blue-700">Yeni yasama dönemi görüşmeleri devam ediyor</p>
            <div className="mt-2 text-xs text-blue-600 font-medium">● Canlı yayın aktif</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-400">
            <h4 className="font-medium text-purple-800">Anket Sonuçları</h4>
            <p className="text-sm text-purple-700">Son kamuoyu araştırması yayınlandı</p>
            <div className="mt-2 text-xs text-purple-600 font-medium">● Güncel veriler mevcut</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoliticsKpiWidget;
