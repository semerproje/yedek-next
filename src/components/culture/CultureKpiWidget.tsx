'use client';

import React, { useState, useEffect } from 'react';
import { Palette, Users, Calendar, BookOpen, Music, Camera, TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface CultureKpiData {
  cultureIndex: number;
  cultureIndexChange: number;
  visitorsCount: number;
  visitorsChange: number;
  eventsCount: number;
  eventsChange: number;
  artworksCount: number;
  artworksChange: number;
  lastUpdate: string;
}

const CultureKpiWidget = () => {
  const [kpiData, setKpiData] = useState<CultureKpiData>({
    cultureIndex: 0,
    cultureIndexChange: 0,
    visitorsCount: 0,
    visitorsChange: 0,
    eventsCount: 0,
    eventsChange: 0,
    artworksCount: 0,
    artworksChange: 0,
    lastUpdate: ''
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKpiData = () => {
      // Simulate real-time culture data
      const mockKpiData: CultureKpiData = {
        cultureIndex: 84.6 + (Math.random() - 0.5) * 2,
        cultureIndexChange: 3.2 + (Math.random() - 0.5) * 2,
        visitorsCount: 1.8 + (Math.random() - 0.5) * 0.2,
        visitorsChange: 15.7 + (Math.random() - 0.5) * 5,
        eventsCount: 247 + Math.floor(Math.random() * 20),
        eventsChange: 8.4 + (Math.random() - 0.5) * 3,
        artworksCount: 12847 + Math.floor(Math.random() * 100),
        artworksChange: 5.9 + (Math.random() - 0.5) * 2,
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
      title: 'Kültür Endeksi',
      value: formatValue(kpiData.cultureIndex),
      change: formatChange(kpiData.cultureIndexChange),
      changeColor: getChangeColor(kpiData.cultureIndexChange),
      icon: Palette,
      description: 'Genel kültür aktivitesi',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Ziyaretçi Sayısı',
      value: formatValue(kpiData.visitorsCount, false, true),
      change: formatChange(kpiData.visitorsChange),
      changeColor: getChangeColor(kpiData.visitorsChange),
      icon: Users,
      description: 'Milyon aylık ziyaret',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Aktif Etkinlik',
      value: formatValue(kpiData.eventsCount, false),
      change: formatChange(kpiData.eventsChange),
      changeColor: getChangeColor(kpiData.eventsChange),
      icon: Calendar,
      description: 'Bu ay düzenlenen',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      title: 'Eser Koleksiyonu',
      value: formatValue(kpiData.artworksCount, false),
      change: formatChange(kpiData.artworksChange),
      changeColor: getChangeColor(kpiData.artworksChange),
      icon: BookOpen,
      description: 'Toplam sanat eseri',
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
          <Palette className="w-6 h-6 text-purple-600" />
          Kültür Metrikleri
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

      {/* Additional Culture Stats */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
            <Music className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-purple-600">
              {Math.floor(127 + Math.random() * 20)}
            </div>
            <div className="text-sm text-purple-700">Müzik Etkinliği</div>
          </div>

          <div className="text-center p-4 bg-gradient-to-r from-pink-50 to-pink-100 rounded-lg">
            <Camera className="w-8 h-8 text-pink-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-pink-600">
              {Math.floor(89 + Math.random() * 15)}
            </div>
            <div className="text-sm text-pink-700">Fotoğraf Sergisi</div>
          </div>

          <div className="text-center p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-lg">
            <BookOpen className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-indigo-600">
              {Math.floor(345 + Math.random() * 30)}
            </div>
            <div className="text-sm text-indigo-700">Kitap Lansmanı</div>
          </div>
        </div>
      </div>

      {/* Live Culture Events */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          Canlı Kültür Etkinlikleri
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900">İstanbul Modern Sanat Müzesi</h4>
            <p className="text-sm text-gray-600">Çağdaş Türk Resmi Sergisi</p>
            <div className="mt-2 text-xs text-green-600 font-medium">● Devam ediyor</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900">Cemal Reşit Rey Konser Salonu</h4>
            <p className="text-sm text-gray-600">İstanbul Filarmoni Konseri</p>
            <div className="mt-2 text-xs text-red-600 font-medium">● Canlı yayın</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CultureKpiWidget;
