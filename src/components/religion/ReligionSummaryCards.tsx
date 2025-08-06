'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Church, 
  Heart, 
  Book, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Target,
  Star,
  Globe,
  Hand,
  Moon
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

const ReligionSummaryCards = () => {
  const [cards, setCards] = useState<SummaryCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummaryData = () => {
      // Din özet kartlarını simüle et
      const mockCards: SummaryCard[] = [
        {
          id: '1',
          title: 'Toplam Müslüman Nüfus',
          value: '84.2M',
          change: 1.8,
          changeText: 'Yıllık artış',
          icon: Users,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          trend: 'up',
          description: 'Türkiye\'de yaşayan Müslüman nüfus',
          target: '85M hedefi'
        },
        {
          id: '2',
          title: 'Aktif Cami Sayısı',
          value: '89.7K',
          change: 3.2,
          changeText: 'Son 2 yılda',
          icon: Church,
          color: 'text-emerald-600',
          bgColor: 'bg-emerald-50',
          trend: 'up',
          description: 'Hizmet veren cami ve mescitler',
          target: '92K hedefi'
        },
        {
          id: '3',
          title: 'Hayırseverlik Oranı',
          value: '%91.3',
          change: 5.4,
          changeText: 'Geçen yıla göre',
          icon: Heart,
          color: 'text-rose-600',
          bgColor: 'bg-rose-50',
          trend: 'up',
          description: 'Düzenli bağış yapan nüfus oranı',
          target: '%95 hedefi'
        },
        {
          id: '4',
          title: 'Kuran Kursu Sayısı',
          value: '15.6K',
          change: 2.7,
          changeText: 'Yıllık artış',
          icon: Book,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          trend: 'up',
          description: 'Aktif Kuran kursu sayısı',
          target: '16K hedefi'
        },
        {
          id: '5',
          title: 'Hac ve Umre Katılımı',
          value: '87.4K',
          change: 15.8,
          changeText: 'Pandemi öncesine göre',
          icon: Star,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          trend: 'up',
          description: 'Yıllık hac ve umre ziyaretçileri',
          target: '95K hedefi'
        },
        {
          id: '6',
          title: 'Dinler Arası Etkinlik',
          value: '1.2K',
          change: 28.3,
          changeText: 'Son 3 yılda',
          icon: Globe,
          color: 'text-teal-600',
          bgColor: 'bg-teal-50',
          trend: 'up',
          description: 'Dinler arası diyalog etkinlikleri',
          target: '1.5K hedefi'
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
          <Hand className="w-6 h-6 text-blue-600" />
          Dini Yaşam İstatistikleri
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

      {/* Küresel Karşılaştırma */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-indigo-600" />
          Dünya Geneli Karşılaştırma
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-xl font-bold text-indigo-600">2/195</div>
            <div className="text-sm text-indigo-700">En Büyük Müslüman Nüfus</div>
            <div className="text-xs text-gray-500">Endonezya'dan sonra</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-purple-600">%99.8</div>
            <div className="text-sm text-purple-700">Müslüman Oranı</div>
            <div className="text-xs text-gray-500">Dünya ortalaması %24.9</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-blue-600">856</div>
            <div className="text-sm text-blue-700">Kişi Başına Cami</div>
            <div className="text-xs text-gray-500">Dünya ortalaması 1.240</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-green-600">%12.4</div>
            <div className="text-sm text-green-700">Hac Katılım Oranı</div>
            <div className="text-xs text-gray-500">Dünya ortalaması %8.2</div>
          </div>
        </div>
      </div>

      {/* Gündem Özetleri */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-600" />
            Bu Hafta Öne Çıkanlar
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Mevlid Kandili hazırlıkları</p>
                <p className="text-xs text-gray-500">Camiler özel program hazırlıyor</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Dinler arası diyalog konferansı</p>
                <p className="text-xs text-gray-500">İstanbul'da 3 gün sürecek</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Yeni Kuran kursu açılışları</p>
                <p className="text-xs text-gray-500">50 yeni kurs hizmete girdi</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Moon className="w-5 h-5 text-indigo-600" />
            Dini Takvim
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Mevlid Kandili</p>
                <p className="text-xs text-gray-500">3 gün sonra</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Regaib Kandili</p>
                <p className="text-xs text-gray-500">2 hafta sonra</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Miraç Kandili</p>
                <p className="text-xs text-gray-500">1 ay sonra</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReligionSummaryCards;
