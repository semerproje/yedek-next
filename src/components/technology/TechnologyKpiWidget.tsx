"use client";

import { useEffect, useState } from 'react';
import { Cpu, Smartphone, Globe, TrendingUp } from 'lucide-react';

interface TechnologyKpi {
  aiProgress: number;
  aiDegisim: number;
  globalUsers: number;
  usersDegisim: number;
  innovations: number;
  innovationsDegisim: number;
  marketCap: number;
  marketDegisim: number;
}

const TechnologyKpiWidget = () => {
  const [kpiData, setKpiData] = useState<TechnologyKpi>({
    aiProgress: 0,
    aiDegisim: 0,
    globalUsers: 0,
    usersDegisim: 0,
    innovations: 0,
    innovationsDegisim: 0,
    marketCap: 0,
    marketDegisim: 0,
  });

  useEffect(() => {
    // Simüle edilmiş gerçek zamanlı teknoloji verileri
    const updateKpiData = () => {
      setKpiData({
        aiProgress: 78.4,
        aiDegisim: Math.random() > 0.5 ? 2.3 : -1.1,
        globalUsers: 5.2,
        usersDegisim: Math.random() > 0.5 ? 0.3 : -0.1,
        innovations: 1247,
        innovationsDegisim: Math.random() > 0.5 ? 89 : -34,
        marketCap: 3547.8,
        marketDegisim: Math.random() > 0.5 ? 234.5 : -156.2,
      });
    };

    updateKpiData();
    const interval = setInterval(updateKpiData, 25000); // 25 saniyede bir güncelle

    return () => clearInterval(interval);
  }, []);

  const formatValue = (value: number, isPercentage = false, isMillions = false, isBillions = false) => {
    if (isBillions) {
      return `${value.toLocaleString('tr-TR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}B`;
    }
    if (isMillions) {
      return `${value.toLocaleString('tr-TR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}M`;
    }
    if (isPercentage) {
      return `${value.toFixed(1)}%`;
    }
    return value.toLocaleString('tr-TR');
  };

  const formatChange = (value: number, isPercentage = false) => {
    const prefix = value >= 0 ? '+' : '';
    if (isPercentage) {
      return `${prefix}${value.toFixed(1)}%`;
    }
    return `${prefix}${value.toLocaleString('tr-TR')}`;
  };

  const getChangeColor = (value: number) => {
    return value >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const kpiItems = [
    {
      title: 'AI Gelişim İndeksi',
      value: formatValue(kpiData.aiProgress, true),
      change: formatChange(kpiData.aiDegisim, true),
      changeColor: getChangeColor(kpiData.aiDegisim),
      icon: Cpu,
      description: 'Küresel AI gelişimi',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Küresel Kullanıcılar',
      value: formatValue(kpiData.globalUsers, false, false, true),
      change: formatChange(kpiData.usersDegisim, false),
      changeColor: getChangeColor(kpiData.usersDegisim),
      icon: Globe,
      description: 'Milyar aktif kullanıcı',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      title: 'Yeni İnovasyonlar',
      value: formatValue(kpiData.innovations),
      change: formatChange(kpiData.innovationsDegisim),
      changeColor: getChangeColor(kpiData.innovationsDegisim),
      icon: Smartphone,
      description: 'Bu ay lansman sayısı',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Pazar Değeri',
      value: formatValue(kpiData.marketCap, false, false, true),
      change: formatChange(kpiData.marketDegisim),
      changeColor: getChangeColor(kpiData.marketDegisim),
      icon: TrendingUp,
      description: 'Trilyon USD',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">💻 Teknoloji Göstergeleri</h2>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-500">Canlı Veriler</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div
              key={index}
              className={`${item.bgColor} rounded-lg p-4 border border-gray-100 hover:shadow-md transition-shadow duration-200`}
            >
              <div className="flex items-center justify-between mb-3">
                <IconComponent className={`w-6 h-6 ${item.iconColor}`} />
                <span className={`text-sm font-medium ${item.changeColor}`}>
                  {item.change}
                </span>
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-gray-900">{item.value}</h3>
                <p className="text-sm font-medium text-gray-700">{item.title}</p>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Teknoloji Trend Çizelgesi */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Teknoloji Trendleri</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">+87%</div>
            <div className="text-sm text-gray-600">AI Adoption</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">+124%</div>
            <div className="text-sm text-gray-600">Cloud Migration</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">+56%</div>
            <div className="text-sm text-gray-600">IoT Devices</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">+203%</div>
            <div className="text-sm text-gray-600">5G Coverage</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnologyKpiWidget;
