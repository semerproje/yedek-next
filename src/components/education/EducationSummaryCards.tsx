'use client';

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  GraduationCap, 
  Users, 
  Award, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Target,
  Brain,
  Globe,
  School,
  Calculator
} from 'lucide-react';

interface SummaryCard {
  id: string;
  title: string;
  value: string;
  change: number;
  changeText: string;
  icon: any;
  color: string;
  bgColor: string;
  trend: 'up' | 'down' | 'neutral';
  description: string;
  target?: string;
}

const EducationSummaryCards = () => {
  const [cards, setCards] = useState<SummaryCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummaryData = () => {
      // Eğitim özet kartlarını simüle et
      const mockCards: SummaryCard[] = [
        {
          id: '1',
          title: 'Toplam Öğrenci Sayısı',
          value: '18.2M',
          change: 3.2,
          changeText: 'Geçen yıla göre',
          icon: Users,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          trend: 'up',
          description: 'Tüm eğitim seviyelerinde kayıtlı öğrenci',
          target: '19M hedefi'
        },
        {
          id: '2',
          title: 'Üniversite Mezunu Oranı',
          value: '%23.4',
          change: 2.1,
          changeText: 'Son 5 yılda',
          icon: GraduationCap,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          trend: 'up',
          description: '25-34 yaş grubunda yükseköğretim mezunu',
          target: '%30 hedefi'
        },
        {
          id: '3',
          title: 'Okur-Yazar Oranı',
          value: '%96.7',
          change: 0.8,
          changeText: 'Yıllık artış',
          icon: BookOpen,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          trend: 'up',
          description: '15+ yaş nüfusunda okuma yazma oranı',
          target: '%98 hedefi'
        },
        {
          id: '4',
          title: 'Ortalama Başarı Skoru',
          value: '487',
          change: -2.3,
          changeText: 'PISA 2022\'ye göre',
          icon: Award,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          trend: 'down',
          description: 'Matematik, fen ve okuma ortalaması',
          target: '520 hedefi'
        },
        {
          id: '5',
          title: 'Dijital Okuryazarlık',
          value: '%71.2',
          change: 15.6,
          changeText: 'Son 3 yılda',
          icon: Brain,
          color: 'text-teal-600',
          bgColor: 'bg-teal-50',
          trend: 'up',
          description: 'Temel dijital becerilere sahip nüfus',
          target: '%85 hedefi'
        },
        {
          id: '6',
          title: 'Öğretmen Başına Öğrenci',
          value: '17.2',
          change: -5.1,
          changeText: 'Son 2 yılda',
          icon: School,
          color: 'text-indigo-600',
          bgColor: 'bg-indigo-50',
          trend: 'up', // Azalma olumlu
          description: 'İlk ve ortaöğretimde ortalama oran',
          target: '15 hedefi'
        }
      ];

      setCards(mockCards);
      setLoading(false);
    };

    fetchSummaryData();
  }, []);

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Target className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-40 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Calculator className="w-6 h-6 text-blue-600" />
          Eğitim İstatistikleri
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>Son güncelleme: {new Date().toLocaleTimeString('tr-TR')}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-lg transition-all duration-300 relative overflow-hidden"
            >
              {/* Arka plan deseni */}
              <div className={`absolute top-0 right-0 w-20 h-20 ${card.bgColor} rounded-full transform translate-x-8 -translate-y-8 opacity-20`}></div>
              
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className={`${card.bgColor} rounded-lg p-3`}>
                    <Icon className={`w-6 h-6 ${card.color}`} />
                  </div>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(card.trend)}
                    <span className={`text-sm font-medium ${getTrendColor(card.trend)}`}>
                      {formatChange(card.change)}
                    </span>
                  </div>
                </div>

                <div className="mb-3">
                  <h3 className="text-sm font-medium text-gray-600 mb-1">
                    {card.title}
                  </h3>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {card.value}
                  </div>
                  <p className="text-xs text-gray-500">
                    {card.changeText}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    {card.description}
                  </p>
                  {card.target && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Hedef:</span>
                      <span className={`text-xs font-medium ${card.color}`}>
                        {card.target}
                      </span>
                    </div>
                  )}
                </div>

                {/* İlerleme çubuğu (hedef varsa) */}
                {card.target && (
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${card.color.replace('text-', 'bg-')}`}
                        style={{ 
                          width: `${Math.min(
                            (parseFloat(card.value.replace(/[^\d.]/g, '')) / 
                             parseFloat(card.target?.replace(/[^\d.]/g, '') || '100')) * 100, 
                            100
                          )}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Ek İstatistikler */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-600" />
          Küresel Karşılaştırma
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-xl font-bold text-blue-600">34/37</div>
            <div className="text-sm text-blue-700">OECD Sıralaması</div>
            <div className="text-xs text-gray-500">Eğitim kalitesi</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-green-600">%103</div>
            <div className="text-sm text-green-700">İlkokul Kayıt</div>
            <div className="text-xs text-gray-500">Net kayıt oranı</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-purple-600">%87</div>
            <div className="text-sm text-purple-700">Ortaokul Kayıt</div>
            <div className="text-xs text-gray-500">Net kayıt oranı</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-orange-600">43.7%</div>
            <div className="text-sm text-orange-700">Yükseköğretim</div>
            <div className="text-xs text-gray-500">Brüt kayıt oranı</div>
          </div>
        </div>
      </div>

      {/* Gündem Özetleri */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-600" />
            Bu Hafta Öne Çıkanlar
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">YKS 2025 başvuruları başladı</p>
                <p className="text-xs text-gray-500">2.5 milyon öğrenci bekleniyor</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Dijital eğitim projesi genişliyor</p>
                <p className="text-xs text-gray-500">500 bin tablet dağıtımı</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Yeni meslek liseleri açılıyor</p>
                <p className="text-xs text-gray-500">Teknoloji odaklı 150 okul</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-red-600" />
            Dikkat Gereken Alanlar
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">PISA skorlarında düşüş</p>
                <p className="text-xs text-gray-500">Matematik alanında gerileme</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Öğretmen açığı sürüyor</p>
                <p className="text-xs text-gray-500">Özellikle matematik ve fen</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Kırsal-kentsel eşitsizlik</p>
                <p className="text-xs text-gray-500">Fırsat eşitliği sorunu</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationSummaryCards;
