"use client";

import { useEffect, useState } from 'react';
import { Trophy, Users, Clock, Target } from 'lucide-react';

interface SportKpi {
  activeMatches: number;
  matchesDegisim: number;
  totalFans: number;
  fansDegisim: number;
  transfers: number;
  transfersDegisim: number;
  tournaments: number;
  tournamentsDegisim: number;
}

const SportKpiWidget = () => {
  const [kpiData, setKpiData] = useState<SportKpi>({
    activeMatches: 0,
    matchesDegisim: 0,
    totalFans: 0,
    fansDegisim: 0,
    transfers: 0,
    transfersDegisim: 0,
    tournaments: 0,
    tournamentsDegisim: 0,
  });

  useEffect(() => {
    // Simüle edilmiş gerçek zamanlı spor verileri
    const updateKpiData = () => {
      setKpiData({
        activeMatches: 247,
        matchesDegisim: Math.random() > 0.5 ? 12 : -8,
        totalFans: 4.8,
        fansDegisim: Math.random() > 0.5 ? 0.2 : -0.1,
        transfers: 156,
        transfersDegisim: Math.random() > 0.5 ? 23 : -15,
        tournaments: 89,
        tournamentsDegisim: Math.random() > 0.5 ? 5 : -3,
      });
    };

    updateKpiData();
    const interval = setInterval(updateKpiData, 20000); // 20 saniyede bir güncelle

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

  const formatChange = (value: number) => {
    const prefix = value >= 0 ? '+' : '';
    return `${prefix}${value.toLocaleString('tr-TR')}`;
  };

  const getChangeColor = (value: number) => {
    return value >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const kpiItems = [
    {
      title: 'Aktif Maçlar',
      value: formatValue(kpiData.activeMatches),
      change: formatChange(kpiData.matchesDegisim),
      changeColor: getChangeColor(kpiData.matchesDegisim),
      icon: Trophy,
      description: 'Bugün oynanan maçlar',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Toplam Taraftar',
      value: formatValue(kpiData.totalFans, false, false, true),
      change: formatChange(kpiData.fansDegisim),
      changeColor: getChangeColor(kpiData.fansDegisim),
      icon: Users,
      description: 'Milyar spor takipçisi',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      title: 'Transfer Haberleri',
      value: formatValue(kpiData.transfers),
      change: formatChange(kpiData.transfersDegisim),
      changeColor: getChangeColor(kpiData.transfersDegisim),
      icon: Target,
      description: 'Bu hafta transferler',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Aktif Turnuvalar',
      value: formatValue(kpiData.tournaments),
      change: formatChange(kpiData.tournamentsDegisim),
      changeColor: getChangeColor(kpiData.tournamentsDegisim),
      icon: Clock,
      description: 'Devam eden müsabakalar',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">⚽ Spor Göstergeleri</h2>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-500">Canlı Skor</span>
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

      {/* Canlı Maç Skoru */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🏆 Canlı Maç Skorları</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  GS
                </div>
                <span className="font-semibold">Galatasaray</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">2</div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  FB
                </div>
                <span className="font-semibold">Fenerbahçe</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">1</div>
            </div>
            <div className="mt-2 text-center">
              <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold animate-pulse">
                CANLI • 67'
              </span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white text-xs font-bold">
                  BJK
                </div>
                <span className="font-semibold">Beşiktaş</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">3</div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  TS
                </div>
                <span className="font-semibold">Trabzonspor</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">0</div>
            </div>
            <div className="mt-2 text-center">
              <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
                BİTTİ
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Lig Durumu */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Lig Durumu Özeti</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">28</div>
            <div className="text-sm text-gray-600">Hafta</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">156</div>
            <div className="text-sm text-gray-600">Gol</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">67</div>
            <div className="text-sm text-gray-600">Kart</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">2.1M</div>
            <div className="text-sm text-gray-600">Seyirci</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SportKpiWidget;
