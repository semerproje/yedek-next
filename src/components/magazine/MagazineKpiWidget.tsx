'use client';

import React, { useState, useEffect } from 'react';
import { Star, Users, Camera, Heart, TrendingUp, TrendingDown, Activity, Crown, Zap } from 'lucide-react';

interface MagazineKpiData {
  celebrityIndex: number;
  celebrityIndexChange: number;
  followersCount: number;
  followersChange: number;
  newsCount: number;
  newsChange: number;
  engagementRate: number;
  engagementChange: number;
  lastUpdate: string;
}

const MagazineKpiWidget = () => {
  const [kpiData, setKpiData] = useState<MagazineKpiData>({
    celebrityIndex: 0,
    celebrityIndexChange: 0,
    followersCount: 0,
    followersChange: 0,
    newsCount: 0,
    newsChange: 0,
    engagementRate: 0,
    engagementChange: 0,
    lastUpdate: ''
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKpiData = () => {
      // Simulate real-time magazine data
      const mockKpiData: MagazineKpiData = {
        celebrityIndex: 92.3 + (Math.random() - 0.5) * 2,
        celebrityIndexChange: 4.7 + (Math.random() - 0.5) * 2,
        followersCount: 8.9 + (Math.random() - 0.5) * 0.3,
        followersChange: 12.4 + (Math.random() - 0.5) * 4,
        newsCount: 1847 + Math.floor(Math.random() * 50),
        newsChange: 18.2 + (Math.random() - 0.5) * 5,
        engagementRate: 87.6 + (Math.random() - 0.5) * 3,
        engagementChange: 6.8 + (Math.random() - 0.5) * 3,
        lastUpdate: new Date().toLocaleTimeString('tr-TR')
      };

      setKpiData(mockKpiData);
      setLoading(false);
    };

    fetchKpiData();
    const interval = setInterval(fetchKpiData, 25000);

    return () => clearInterval(interval);
  }, []);

  const formatValue = (value: number, isDecimal: boolean = true, isMillion: boolean = false) => {
    if (isMillion) {
      return `${value.toFixed(1)}M`;
    }
    return isDecimal ? value.toFixed(1) : value.toLocaleString();
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

  const kpiItems = [
    {
      title: 'Ünlü Endeksi',
      value: formatValue(kpiData.celebrityIndex),
      change: formatChange(kpiData.celebrityIndexChange),
      changeColor: getChangeColor(kpiData.celebrityIndexChange),
      icon: Star,
      description: 'Magazin popülaritesi',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
    },
    {
      title: 'Takipçi Sayısı',
      value: formatValue(kpiData.followersCount, false, true),
      change: formatChange(kpiData.followersChange),
      changeColor: getChangeColor(kpiData.followersChange),
      icon: Users,
      description: 'Milyon sosyal medya',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Magazin Haberi',
      value: formatValue(kpiData.newsCount, false),
      change: formatChange(kpiData.newsChange),
      changeColor: getChangeColor(kpiData.newsChange),
      icon: Camera,
      description: 'Bu hafta yayınlanan',
      bgColor: 'bg-pink-50',
      iconColor: 'text-pink-600',
    },
    {
      title: 'Etkileşim Oranı',
      value: `%${formatValue(kpiData.engagementRate)}`,
      change: formatChange(kpiData.engagementChange),
      changeColor: getChangeColor(kpiData.engagementChange),
      icon: Heart,
      description: 'Ortalama beğeni oranı',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
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
          <Star className="w-6 h-6 text-yellow-600" />
          Magazin Metrikleri
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

              <p className="text-xs text-gray-500">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Additional Celebrity Stats */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg">
            <Crown className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-yellow-600">
              {Math.floor(47 + Math.random() * 10)}
            </div>
            <div className="text-sm text-yellow-700">A-List Ünlü</div>
          </div>

          <div className="text-center p-4 bg-gradient-to-r from-pink-50 to-pink-100 rounded-lg">
            <Camera className="w-8 h-8 text-pink-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-pink-600">
              {Math.floor(234 + Math.random() * 30)}
            </div>
            <div className="text-sm text-pink-700">Paparazzi Fotoğrafı</div>
          </div>

          <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
            <Zap className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-purple-600">
              {Math.floor(89 + Math.random() * 15)}
            </div>
            <div className="text-sm text-purple-700">Viral Haber</div>
          </div>
        </div>
      </div>

      {/* Live Magazine Events */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          Trending Magazin Haberleri
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900">Hadise Yeni Albümünü Duyurdu</h4>
            <p className="text-sm text-gray-600">Pop yıldızı sosyal medyadan paylaştı</p>
            <div className="mt-2 text-xs text-green-600 font-medium">● 2.3M etkileşim</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900">Kenan İmirzalıoğlu Film Seti</h4>
            <p className="text-sm text-gray-600">Yeni diziden görüntüler sızdırıldı</p>
            <div className="mt-2 text-xs text-red-600 font-medium">● Trending Topic</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MagazineKpiWidget;
