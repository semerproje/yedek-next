'use client';

import React, { useState, useEffect } from 'react';
import { Leaf, Thermometer, Droplets, Wind, TreePine, TrendingUp, TrendingDown, Activity, Globe, Zap } from 'lucide-react';

interface EnvironmentKpiData {
  airQualityIndex: number;
  airQualityChange: number;
  carbonFootprint: number;
  carbonChange: number;
  renewableEnergyRate: number;
  renewableChange: number;
  biodiversityIndex: number;
  biodiversityChange: number;
  lastUpdate: string;
}

const EnvironmentKpiWidget = () => {
  const [kpiData, setKpiData] = useState<EnvironmentKpiData>({
    airQualityIndex: 0,
    airQualityChange: 0,
    carbonFootprint: 0,
    carbonChange: 0,
    renewableEnergyRate: 0,
    renewableChange: 0,
    biodiversityIndex: 0,
    biodiversityChange: 0,
    lastUpdate: ''
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKpiData = () => {
      // Simulate real-time environment data
      const mockKpiData: EnvironmentKpiData = {
        airQualityIndex: 67.4 + (Math.random() - 0.5) * 5,
        airQualityChange: 3.2 + (Math.random() - 0.5) * 2,
        carbonFootprint: 412.8 + (Math.random() - 0.5) * 10,
        carbonChange: -2.7 + (Math.random() - 0.5) * 2,
        renewableEnergyRate: 34.6 + (Math.random() - 0.5) * 3,
        renewableChange: 8.4 + (Math.random() - 0.5) * 3,
        biodiversityIndex: 72.1 + (Math.random() - 0.5) * 4,
        biodiversityChange: -1.8 + (Math.random() - 0.5) * 2,
        lastUpdate: new Date().toLocaleTimeString('tr-TR')
      };

      setKpiData(mockKpiData);
      setLoading(false);
    };

    fetchKpiData();
    const interval = setInterval(fetchKpiData, 25000);

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

  const getChangeColor = (change: number, isReverse: boolean = false) => {
    const positive = isReverse ? change < 0 : change >= 0;
    return positive ? 'text-green-600' : 'text-red-600';
  };

  const getChangeIcon = (change: number, isReverse: boolean = false) => {
    const positive = isReverse ? change < 0 : change >= 0;
    return positive ? (
      <TrendingUp className="w-4 h-4 text-green-600" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-600" />
    );
  };

  const getAirQualityStatus = (index: number) => {
    if (index >= 80) return { text: 'Mükemmel', color: 'text-green-600', bg: 'bg-green-50' };
    if (index >= 60) return { text: 'İyi', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (index >= 40) return { text: 'Orta', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    if (index >= 20) return { text: 'Kötü', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { text: 'Çok Kötü', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const kpiItems = [
    {
      title: 'Hava Kalite Endeksi',
      value: formatValue(kpiData.airQualityIndex),
      change: formatChange(kpiData.airQualityChange),
      changeColor: getChangeColor(kpiData.airQualityChange),
      icon: Wind,
      description: 'Türkiye ortalaması',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      extra: getAirQualityStatus(kpiData.airQualityIndex)
    },
    {
      title: 'Karbon Ayak İzi',
      value: formatValue(kpiData.carbonFootprint, true, ' ppm'),
      change: formatChange(kpiData.carbonChange),
      changeColor: getChangeColor(kpiData.carbonChange, true), // Reverse: decrease is good
      icon: Globe,
      description: 'CO₂ konsantrasyonu',
      bgColor: 'bg-gray-50',
      iconColor: 'text-gray-600',
    },
    {
      title: 'Yenilenebilir Enerji',
      value: formatValue(kpiData.renewableEnergyRate, true, '%'),
      change: formatChange(kpiData.renewableChange),
      changeColor: getChangeColor(kpiData.renewableChange),
      icon: Zap,
      description: 'Toplam enerji üretimi',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
    },
    {
      title: 'Biyoçeşitlilik Endeksi',
      value: formatValue(kpiData.biodiversityIndex),
      change: formatChange(kpiData.biodiversityChange),
      changeColor: getChangeColor(kpiData.biodiversityChange),
      icon: TreePine,
      description: 'Doğal yaşam alanları',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
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
          <Leaf className="w-6 h-6 text-green-600" />
          Çevre Metrikleri
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

      {/* Climate Indicators */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
            <Thermometer className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-blue-600">
              {(15.2 + Math.random() * 2).toFixed(1)}°C
            </div>
            <div className="text-sm text-blue-700">Ortalama Sıcaklık</div>
          </div>

          <div className="text-center p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg">
            <Droplets className="w-8 h-8 text-cyan-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-cyan-600">
              {Math.floor(64 + Math.random() * 10)}%
            </div>
            <div className="text-sm text-cyan-700">Nem Oranı</div>
          </div>

          <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
            <Wind className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-green-600">
              {Math.floor(12 + Math.random() * 8)} km/h
            </div>
            <div className="text-sm text-green-700">Rüzgar Hızı</div>
          </div>
        </div>
      </div>

      {/* Environmental Alerts */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
          Çevre Uyarıları
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-400">
            <h4 className="font-medium text-yellow-800">Hava Kalitesi Uyarısı</h4>
            <p className="text-sm text-yellow-700">İstanbul'da PM2.5 seviyesi normal üzerinde</p>
            <div className="mt-2 text-xs text-yellow-600 font-medium">● Orta düzey risk</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
            <h4 className="font-medium text-blue-800">Su Tasarrufu Önerisi</h4>
            <p className="text-sm text-blue-700">Rezervuar seviyeleri mevsim normallerinin altında</p>
            <div className="mt-2 text-xs text-blue-600 font-medium">● Tasarruf önerileri aktif</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentKpiWidget;
