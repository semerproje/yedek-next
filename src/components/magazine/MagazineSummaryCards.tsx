'use client';

import React, { useState, useEffect } from 'react';
import { Star, TrendingUp, Users, Heart, Camera, Music, Crown, Sparkles, Clock, Eye, Award, Zap } from 'lucide-react';

interface SummaryCard {
  id: string;
  title: string;
  subtitle: string;
  value: string | number;
  change: number;
  icon: any;
  color: string;
  bgColor: string;
  description: string;
  trending?: boolean;
  details?: {
    label: string;
    value: string;
  }[];
}

const MagazineSummaryCards = () => {
  const [cards, setCards] = useState<SummaryCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummaryData = () => {
      const mockCards: SummaryCard[] = [
        {
          id: '1',
          title: 'En Popüler Ünlü',
          subtitle: 'Bu hafta',
          value: 'Hadise',
          change: 23.4,
          icon: Crown,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          description: 'Yeni albüm duyurusu ile büyük ses getirdi',
          trending: true,
          details: [
            { label: 'Popülerlik Skoru', value: '94.3' },
            { label: 'Sosyal Medya', value: '2.3M etkileşim' },
            { label: 'Haber Sayısı', value: '47 haber' }
          ]
        },
        {
          id: '2',
          title: 'Toplam Magazin Haberi',
          subtitle: 'Son 24 saat',
          value: '1,847',
          change: 18.2,
          icon: Camera,
          color: 'text-pink-600',
          bgColor: 'bg-pink-50',
          description: 'Günlük haber üretim oranında artış',
          details: [
            { label: 'Ünlü Haberleri', value: '756' },
            { label: 'Moda Haberleri', value: '423' },
            { label: 'Müzik Haberleri', value: '334' },
            { label: 'Diğer', value: '334' }
          ]
        },
        {
          id: '3',
          title: 'Sosyal Medya Etkileşimi',
          subtitle: 'Ortalama',
          value: '87.6%',
          change: 12.8,
          icon: Heart,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          description: 'Magazin içeriklerinde etkileşim oranı',
          trending: true,
          details: [
            { label: 'Instagram', value: '91.2%' },
            { label: 'Twitter', value: '84.7%' },
            { label: 'TikTok', value: '89.1%' },
            { label: 'YouTube', value: '85.4%' }
          ]
        },
        {
          id: '4',
          title: 'Aktif Takipçi Sayısı',
          subtitle: 'Toplam',
          value: '12.4M',
          change: 15.6,
          icon: Users,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          description: 'Türk ünlülerin toplam takipçi sayısı',
          details: [
            { label: 'Can Yaman', value: '3.2M' },
            { label: 'Hande Erçel', value: '2.8M' },
            { label: 'Hadise', value: '2.1M' },
            { label: 'Diğerleri', value: '4.3M' }
          ]
        },
        {
          id: '5',
          title: 'Video İzlenme',
          subtitle: 'Bu hafta',
          value: '8.9M',
          change: 27.3,
          icon: Eye,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          description: 'Magazin videolarının toplam izlenme',
          trending: true,
          details: [
            { label: 'Röportajlar', value: '3.2M' },
            { label: 'Kırmızı Halı', value: '2.4M' },
            { label: 'Backstage', value: '1.8M' },
            { label: 'Canlı Yayın', value: '1.5M' }
          ]
        },
        {
          id: '6',
          title: 'Trending Konular',
          subtitle: 'Gündem',
          value: '23',
          change: 8.9,
          icon: TrendingUp,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          description: 'Şu anda trend olan magazin konuları',
          details: [
            { label: 'Müzik', value: '8 konu' },
            { label: 'Moda', value: '6 konu' },
            { label: 'Aşk', value: '5 konu' },
            { label: 'Diğer', value: '4 konu' }
          ]
        },
        {
          id: '7',
          title: 'Yeni Proje Duyuruları',
          subtitle: 'Bu ay',
          value: '34',
          change: 45.2,
          icon: Sparkles,
          color: 'text-indigo-600',
          bgColor: 'bg-indigo-50',
          description: 'Ünlülerden gelen yeni proje duyuruları',
          trending: true,
          details: [
            { label: 'Film/Dizi', value: '15 proje' },
            { label: 'Müzik', value: '12 proje' },
            { label: 'Moda', value: '4 proje' },
            { label: 'Diğer', value: '3 proje' }
          ]
        },
        {
          id: '8',
          title: 'AI Doğruluk Oranı',
          subtitle: 'Tahminler',
          value: '91.2%',
          change: 5.7,
          icon: Zap,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          description: 'AI sisteminin magazin tahmin doğruluğu',
          details: [
            { label: 'Trend Tahmini', value: '94.1%' },
            { label: 'Popülerlik', value: '89.7%' },
            { label: 'Duygu Analizi', value: '87.3%' },
            { label: 'Öneriler', value: '93.8%' }
          ]
        }
      ];

      // Simulate real-time updates
      const updatedCards = mockCards.map(card => {
        let newValue = card.value;
        
        if (typeof card.value === 'string' && card.value.includes('%')) {
          const numericValue = parseFloat(card.value.replace('%', ''));
          newValue = `${(numericValue + (Math.random() - 0.5) * 2).toFixed(1)}%`;
        } else if (typeof card.value === 'string' && card.value.includes('M')) {
          const numericValue = parseFloat(card.value.replace('M', ''));
          newValue = `${(numericValue + (Math.random() - 0.5) * 0.2).toFixed(1)}M`;
        } else if (typeof card.value === 'string' && !isNaN(Number(card.value.replace(/,/g, '')))) {
          const numericValue = parseInt(card.value.replace(/,/g, ''));
          newValue = (numericValue + Math.floor((Math.random() - 0.5) * 10)).toLocaleString();
        }

        return {
          ...card,
          value: newValue,
          change: card.change + (Math.random() - 0.5) * 2
        };
      });

      setCards(updatedCards);
      setLoading(false);
    };

    fetchSummaryData();
    const interval = setInterval(fetchSummaryData, 20000);

    return () => clearInterval(interval);
  }, []);

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
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
          <Award className="w-6 h-6 text-pink-600" />
          Magazin Özet Kartları
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>Gerçek zamanlı güncelleme</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          
          return (
            <div
              key={card.id}
              className="relative bg-white border border-gray-200 rounded-lg p-6 hover:shadow-xl transition-all duration-300 group overflow-hidden"
            >
              {/* Trending Badge */}
              {card.trending && (
                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                  HOT
                </div>
              )}

              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className={`${card.bgColor} rounded-lg p-3`}>
                  <Icon className={`w-6 h-6 ${card.color}`} />
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${getChangeColor(card.change)}`}>
                    {formatChange(card.change)}
                  </div>
                  <div className="text-xs text-gray-500">{card.subtitle}</div>
                </div>
              </div>

              {/* Main Content */}
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-600 mb-1">
                  {card.title}
                </h3>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {card.value}
                </div>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {card.description}
                </p>
              </div>

              {/* Details */}
              {card.details && (
                <div className="space-y-2 pt-4 border-t border-gray-100">
                  {card.details.map((detail, index) => (
                    <div key={index} className="flex justify-between text-xs">
                      <span className="text-gray-600">{detail.label}</span>
                      <span className="font-medium text-gray-900">{detail.value}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          );
        })}
      </div>

      {/* Summary Section */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Genel Durum</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Performance Indicators */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="font-semibold text-green-800">Yüksek Performans</div>
                <div className="text-sm text-green-600">Tüm metriklerde artış</div>
              </div>
            </div>
            <div className="text-2xl font-bold text-green-700">
              {cards.filter(c => c.change > 0).length}/8
            </div>
            <div className="text-sm text-green-600">Pozitif trend gösteren kart</div>
          </div>

          {/* Top Performers */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center">
                <Star className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="font-semibold text-yellow-800">En Yüksek Artış</div>
                <div className="text-sm text-yellow-600">Bu hafta</div>
              </div>
            </div>
            <div className="text-2xl font-bold text-yellow-700">
              +{Math.max(...cards.map(c => c.change)).toFixed(1)}%
            </div>
            <div className="text-sm text-yellow-600">Yeni proje duyuruları</div>
          </div>

          {/* Engagement */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="font-semibold text-purple-800">Etkileşim Seviyesi</div>
                <div className="text-sm text-purple-600">Ortalama</div>
              </div>
            </div>
            <div className="text-2xl font-bold text-purple-700">Mükemmel</div>
            <div className="text-sm text-purple-600">%87.6 etkileşim oranı</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="flex flex-wrap gap-3">
          <button className="bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors">
            Detaylı Rapor Al
          </button>
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
            Verileri Dışa Aktar
          </button>
          <button className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors">
            AI Analiz Başlat
          </button>
        </div>
      </div>
    </div>
  );
};

export default MagazineSummaryCards;
