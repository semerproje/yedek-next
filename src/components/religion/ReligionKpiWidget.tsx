'use client';

import React, { useState, useEffect } from 'react';
import { Church, Heart, Users, Book, TrendingUp, TrendingDown, Activity, Sun, Moon, Calendar } from 'lucide-react';

interface ReligionKpiData {
  prayerParticipation: number;
  participationChange: number;
  religiousEducation: number;
  educationChange: number;
  charitableActivities: number;
  charityChange: number;
  interfaithDialogue: number;
  dialogueChange: number;
  lastUpdate: string;
}

const ReligionKpiWidget = () => {
  const [kpiData, setKpiData] = useState<ReligionKpiData>({
    prayerParticipation: 0,
    participationChange: 0,
    religiousEducation: 0,
    educationChange: 0,
    charitableActivities: 0,
    charityChange: 0,
    interfaithDialogue: 0,
    dialogueChange: 0,
    lastUpdate: ''
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKpiData = () => {
      // Gerçek zamanlı din verilerini simüle et
      const mockKpiData: ReligionKpiData = {
        prayerParticipation: 72.8 + (Math.random() - 0.5) * 3,
        participationChange: 1.4 + (Math.random() - 0.5) * 2,
        religiousEducation: 85.3 + (Math.random() - 0.5) * 2,
        educationChange: 3.7 + (Math.random() - 0.5) * 2,
        charitableActivities: 91.2 + (Math.random() - 0.5) * 2,
        charityChange: 8.2 + (Math.random() - 0.5) * 3,
        interfaithDialogue: 67.5 + (Math.random() - 0.5) * 4,
        dialogueChange: 12.8 + (Math.random() - 0.5) * 4,
        lastUpdate: new Date().toLocaleTimeString('tr-TR')
      };

      setKpiData(mockKpiData);
      setLoading(false);
    };

    fetchKpiData();
    const interval = setInterval(fetchKpiData, 30000);

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

  const getParticipationLevel = (rate: number) => {
    if (rate >= 85) return { text: 'Çok Yüksek', color: 'text-green-600', bg: 'bg-green-50' };
    if (rate >= 70) return { text: 'Yüksek', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (rate >= 55) return { text: 'Orta', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    if (rate >= 40) return { text: 'Düşük', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { text: 'Çok Düşük', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const kpiItems = [
    {
      title: 'İbadet Katılımı',
      value: formatValue(kpiData.prayerParticipation, true, '%'),
      change: formatChange(kpiData.participationChange),
      changeColor: getChangeColor(kpiData.participationChange),
      icon: Church,
      description: 'Düzenli ibadet eden nüfus',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      extra: getParticipationLevel(kpiData.prayerParticipation)
    },
    {
      title: 'Dini Eğitim Oranı',
      value: formatValue(kpiData.religiousEducation, true, '%'),
      change: formatChange(kpiData.educationChange),
      changeColor: getChangeColor(kpiData.educationChange),
      icon: Book,
      description: 'Dini eğitim alan nüfus',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      title: 'Hayırseverlik Faaliyetleri',
      value: formatValue(kpiData.charitableActivities, true, '%'),
      change: formatChange(kpiData.charityChange),
      changeColor: getChangeColor(kpiData.charityChange),
      icon: Heart,
      description: 'Yardım faaliyetlerine katılım',
      bgColor: 'bg-rose-50',
      iconColor: 'text-rose-600',
    },
    {
      title: 'Dinler Arası Diyalog',
      value: formatValue(kpiData.interfaithDialogue, true, '%'),
      change: formatChange(kpiData.dialogueChange),
      changeColor: getChangeColor(kpiData.dialogueChange),
      icon: Users,
      description: 'Hoşgörü ve diyalog faaliyetleri',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
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
          <Church className="w-6 h-6 text-blue-600" />
          Dini Yaşam Metrikleri
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

      {/* Dini Takvim ve Zamanlar */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
            <Sun className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-blue-600">
              {new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-sm text-blue-700">İmsak Vakti</div>
          </div>

          <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg">
            <Sun className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-orange-600">
              {new Date(Date.now() + 30 * 60000).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-sm text-orange-700">Güneş Doğuşu</div>
          </div>

          <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
            <Moon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-purple-600">
              {new Date(Date.now() + 12 * 60 * 60000).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-sm text-purple-700">Öğle Namazı</div>
          </div>
        </div>
      </div>

      {/* Dini Etkinlik Bildirimleri */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Dini Etkinlikler
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-400">
            <h4 className="font-medium text-green-800">Mevlid Kandili</h4>
            <p className="text-sm text-green-700">3 gün sonra kutlanacak</p>
            <div className="mt-2 text-xs text-green-600 font-medium">● Mübarek gece</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
            <h4 className="font-medium text-blue-800">Cuma Hutbesi</h4>
            <p className="text-sm text-blue-700">"Hoşgörü ve Merhamet" konulu</p>
            <div className="mt-2 text-xs text-blue-600 font-medium">● Bu Cuma</div>
          </div>
        </div>
      </div>

      {/* Dini Kurumlar İstatistikleri */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-600" />
          Dini Kurumlar
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-xl font-bold text-indigo-600">
              {Math.floor(89500 + Math.random() * 1000).toLocaleString()}
            </div>
            <div className="text-sm text-indigo-700">Cami</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-emerald-600">
              {Math.floor(15600 + Math.random() * 200).toLocaleString()}
            </div>
            <div className="text-sm text-emerald-700">Kuran Kursu</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-purple-600">
              {Math.floor(1240 + Math.random() * 50).toLocaleString()}
            </div>
            <div className="text-sm text-purple-700">İmam Hatip Okulu</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-rose-600">
              {Math.floor(320 + Math.random() * 20).toLocaleString()}
            </div>
            <div className="text-sm text-rose-700">Kilise & Sinagog</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReligionKpiWidget;
