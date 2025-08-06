"use client";

import { useEffect, useState } from 'react';
import { TrendingUp, DollarSign, BarChart3, Building2 } from 'lucide-react';

interface EconomyKpi {
  borsaEndeksi: number;
  borsaDegisim: number;
  dolarKuru: number;
  dolarDegisim: number;
  enflasyon: number;
  enflasyonDegisim: number;
  faizOrani: number;
  faizDegisim: number;
}

const EconomyKpiWidget = () => {
  const [kpiData, setKpiData] = useState<EconomyKpi>({
    borsaEndeksi: 0,
    borsaDegisim: 0,
    dolarKuru: 0,
    dolarDegisim: 0,
    enflasyon: 0,
    enflasyonDegisim: 0,
    faizOrani: 0,
    faizDegisim: 0
  });
  const [loading, setLoading] = useState(true);

  // Mock ekonomi verileri - gerçek API entegrasyonu için hazır
  const mockKpiData: EconomyKpi = {
    borsaEndeksi: 8247.32,
    borsaDegisim: 2.34,
    dolarKuru: 34.28,
    dolarDegisim: -0.12,
    enflasyon: 42.8,
    enflasyonDegisim: 1.2,
    faizOrani: 45.0,
    faizDegisim: 0.0
  };

  useEffect(() => {
    // Simüle edilmiş veri yükleme - gerçek API'ye bağlanabilir
    const timer = setTimeout(() => {
      setKpiData(mockKpiData);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const formatNumber = (num: number, decimals: number = 2) => {
    return new Intl.NumberFormat('tr-TR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  };

  const formatPercentage = (num: number) => {
    const sign = num > 0 ? '+' : '';
    return `${sign}${formatNumber(num)}%`;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const kpiItems = [
    {
      title: 'BIST 100',
      value: formatNumber(kpiData.borsaEndeksi),
      change: formatPercentage(kpiData.borsaDegisim),
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Borsa İstanbul endeksi'
    },
    {
      title: 'USD/TRY',
      value: formatNumber(kpiData.dolarKuru),
      change: formatPercentage(kpiData.dolarDegisim),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Dolar/Türk Lirası paritesi'
    },
    {
      title: 'Enflasyon',
      value: `%${formatNumber(kpiData.enflasyon)}`,
      change: formatPercentage(kpiData.enflasyonDegisim),
      icon: BarChart3,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      description: 'Yıllık tüketici enflasyonu'
    },
    {
      title: 'Politika Faizi',
      value: `%${formatNumber(kpiData.faizOrani)}`,
      change: formatPercentage(kpiData.faizDegisim),
      icon: Building2,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'TCMB politika faizi'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="h-6 bg-gray-200 rounded w-20 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-24"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {kpiItems.map((item, index) => {
        const IconComponent = item.icon;
        const changeColor = getChangeColor(
          index === 0 ? kpiData.borsaDegisim :
          index === 1 ? kpiData.dolarDegisim :
          index === 2 ? kpiData.enflasyonDegisim :
          kpiData.faizDegisim
        );
        
        return (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-full ${item.bgColor}`}>
                <IconComponent className={`h-6 w-6 ${item.color}`} />
              </div>
              <span className={`text-sm font-medium ${changeColor}`}>
                {item.change}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">{item.title}</h3>
            <p className="text-2xl font-bold text-gray-900 mb-1">{item.value}</p>
            <p className="text-xs text-gray-500">{item.description}</p>
          </div>
        );
      })}
    </div>
  );
};

export default EconomyKpiWidget;
