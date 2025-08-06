"use client";

import { useEffect, useState } from 'react';
import { Heart, Activity, Users, Shield } from 'lucide-react';

interface HealthKpi {
  healthIndex: number;
  healthDegisim: number;
  patientCount: number;
  patientDegisim: number;
  researchProjects: number;
  researchDegisim: number;
  vaccinationRate: number;
  vaccinationDegisim: number;
}

const HealthKpiWidget = () => {
  const [kpiData, setKpiData] = useState<HealthKpi>({
    healthIndex: 0,
    healthDegisim: 0,
    patientCount: 0,
    patientDegisim: 0,
    researchProjects: 0,
    researchDegisim: 0,
    vaccinationRate: 0,
    vaccinationDegisim: 0,
  });

  useEffect(() => {
    // Simüle edilmiş gerçek zamanlı sağlık verileri
    const updateKpiData = () => {
      setKpiData({
        healthIndex: 78.2,
        healthDegisim: Math.random() > 0.5 ? 1.8 : -0.7,
        patientCount: 2.4,
        patientDegisim: Math.random() > 0.5 ? 0.1 : -0.05,
        researchProjects: 1547,
        researchDegisim: Math.random() > 0.5 ? 47 : -23,
        vaccinationRate: 89.7,
        vaccinationDegisim: Math.random() > 0.5 ? 2.1 : -1.3,
      });
    };

    updateKpiData();
    const interval = setInterval(updateKpiData, 30000); // 30 saniyede bir güncelle

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
      title: 'Sağlık İndeksi',
      value: formatValue(kpiData.healthIndex, true),
      change: formatChange(kpiData.healthDegisim, true),
      changeColor: getChangeColor(kpiData.healthDegisim),
      icon: Heart,
      description: 'Küresel sağlık durumu',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
    },
    {
      title: 'Hasta Sayısı',
      value: formatValue(kpiData.patientCount, false, true),
      change: formatChange(kpiData.patientDegisim),
      changeColor: getChangeColor(kpiData.patientDegisim),
      icon: Users,
      description: 'Milyon aktif hasta',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Araştırma Projeleri',
      value: formatValue(kpiData.researchProjects),
      change: formatChange(kpiData.researchDegisim),
      changeColor: getChangeColor(kpiData.researchDegisim),
      icon: Activity,
      description: 'Aktif tıbbi araştırmalar',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Aşılanma Oranı',
      value: formatValue(kpiData.vaccinationRate, true),
      change: formatChange(kpiData.vaccinationDegisim, true),
      changeColor: getChangeColor(kpiData.vaccinationDegisim),
      icon: Shield,
      description: 'Toplum aşılanma oranı',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">🏥 Sağlık Göstergeleri</h2>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
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

      {/* Günlük Sağlık Raporu */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Günlük Sağlık Raporu</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">+247</div>
            <div className="text-sm text-gray-600">Yeni Tedavi</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">95.2%</div>
            <div className="text-sm text-gray-600">İyileşme Oranı</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">1,247</div>
            <div className="text-sm text-gray-600">Sağlık Kontrolü</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">89</div>
            <div className="text-sm text-gray-600">Yeni Araştırma</div>
          </div>
        </div>
      </div>

      {/* COVID-19 Durumu */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🦠 COVID-19 Güncel Durum</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-700">Günlük Vaka</span>
              <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">
                -12%
              </span>
            </div>
            <div className="text-2xl font-bold text-blue-600">1,247</div>
            <div className="text-xs text-gray-500 mt-1">Son 24 saat</div>
          </div>

          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-700">İyileşen</span>
              <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">
                +5%
              </span>
            </div>
            <div className="text-2xl font-bold text-green-600">2,847</div>
            <div className="text-xs text-gray-500 mt-1">Son 24 saat</div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-purple-700">Aşı Dağıtımı</span>
              <span className="text-xs bg-purple-500 text-white px-2 py-1 rounded">
                +8%
              </span>
            </div>
            <div className="text-2xl font-bold text-purple-600">5,647</div>
            <div className="text-xs text-gray-500 mt-1">Bugün</div>
          </div>
        </div>
      </div>

      {/* Hastane Kapasitesi */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🏨 Hastane Kapasitesi</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Yoğun Bakım</span>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div className="bg-red-600 h-2 rounded-full" style={{ width: '73%' }}></div>
              </div>
              <span className="text-sm font-medium text-gray-900">73%</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Normal Servis</span>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '56%' }}></div>
              </div>
              <span className="text-sm font-medium text-gray-900">56%</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Ameliyathane</span>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '34%' }}></div>
              </div>
              <span className="text-sm font-medium text-gray-900">34%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthKpiWidget;
