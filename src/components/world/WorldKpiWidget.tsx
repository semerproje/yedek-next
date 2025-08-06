"use client";

import { useEffect, useState } from 'react';
import { Globe, Users, TrendingUp, AlertCircle } from 'lucide-react';

interface WorldKpi {
  globalEvents: number;
  eventsDegisim: number;
  activeCrises: number;
  crisesDegisim: number;
  diplomaticMeetings: number;
  meetingsDegisim: number;
  tradeVolume: number;
  tradeDegisim: number;
}

const WorldKpiWidget = () => {
  const [kpiData, setKpiData] = useState<WorldKpi>({
    globalEvents: 0,
    eventsDegisim: 0,
    activeCrises: 0,
    crisesDegisim: 0,
    diplomaticMeetings: 0,
    meetingsDegisim: 0,
    tradeVolume: 0,
    tradeDegisim: 0,
  });

  useEffect(() => {
    // Simüle edilmiş gerçek zamanlı dünya verileri
    const updateKpiData = () => {
      setKpiData({
        globalEvents: 247,
        eventsDegisim: Math.random() > 0.5 ? 12 : -8,
        activeCrises: 18,
        crisesDegisim: Math.random() > 0.5 ? 2 : -3,
        diplomaticMeetings: 34,
        meetingsDegisim: Math.random() > 0.5 ? 5 : -2,
        tradeVolume: 2847.6,
        tradeDegisim: Math.random() > 0.5 ? 156.4 : -89.2,
      });
    };

    updateKpiData();
    const interval = setInterval(updateKpiData, 30000); // 30 saniyede bir güncelle

    return () => clearInterval(interval);
  }, []);

  const formatValue = (value: number, isPercentage = false, isMillions = false) => {
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
      title: 'Küresel Olaylar',
      value: formatValue(kpiData.globalEvents),
      change: formatChange(kpiData.eventsDegisim),
      changeColor: getChangeColor(kpiData.eventsDegisim),
      icon: Globe,
      description: '24 saat',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Aktif Krizler',
      value: formatValue(kpiData.activeCrises),
      change: formatChange(kpiData.crisesDegisim),
      changeColor: getChangeColor(kpiData.crisesDegisim),
      icon: AlertCircle,
      description: 'Devam eden',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
    },
    {
      title: 'Diplomatik Toplantılar',
      value: formatValue(kpiData.diplomaticMeetings),
      change: formatChange(kpiData.meetingsDegisim),
      changeColor: getChangeColor(kpiData.meetingsDegisim),
      icon: Users,
      description: 'Bu hafta',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      title: 'Ticaret Hacmi',
      value: formatValue(kpiData.tradeVolume, false, true),
      change: formatChange(kpiData.tradeDegisim),
      changeColor: getChangeColor(kpiData.tradeDegisim),
      icon: TrendingUp,
      description: 'Milyar USD',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">🌍 Dünya Göstergeleri</h2>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
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
    </div>
  );
};

export default WorldKpiWidget;
