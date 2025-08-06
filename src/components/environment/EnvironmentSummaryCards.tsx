'use client';

import React, { useState, useEffect } from 'react';
import { Leaf, TrendingUp, Globe, TreePine, Droplets, Wind, Zap, Recycle, Clock, Eye, AlertTriangle, Target } from 'lucide-react';

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
  urgent?: boolean;
  details?: {
    label: string;
    value: string;
  }[];
}

const EnvironmentSummaryCards = () => {
  const [cards, setCards] = useState<SummaryCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummaryData = () => {
      const mockCards: SummaryCard[] = [
        {
          id: '1',
          title: 'Hava Kalite Endeksi',
          subtitle: 'Türkiye ortalaması',
          value: '67.4',
          change: 3.2,
          icon: Wind,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          description: 'PM2.5 ve NO2 seviyelerine göre',
          details: [
            { label: 'İstanbul', value: '52.3' },
            { label: 'Ankara', value: '64.7' },
            { label: 'İzmir', value: '71.2' },
            { label: 'Antalya', value: '78.9' }
          ]
        },
        {
          id: '2',
          title: 'Karbon Emisyonu',
          subtitle: 'Bu yıl',
          value: '412.8M',
          change: -2.7,
          icon: Globe,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          description: 'Ton CO₂ eşdeğeri azalma',
          details: [
            { label: 'Enerji Sektörü', value: '156.2M ton' },
            { label: 'Ulaştırma', value: '89.4M ton' },
            { label: 'Sanayi', value: '112.7M ton' },
            { label: 'Diğer', value: '54.5M ton' }
          ]
        },
        {
          id: '3',
          title: 'Yenilenebilir Enerji',
          subtitle: 'Toplam üretim',
          value: '34.6%',
          change: 8.4,
          icon: Zap,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          description: 'Elektrik üretimindeki payı',
          details: [
            { label: 'Hidroelektrik', value: '18.7%' },
            { label: 'Rüzgar', value: '9.2%' },
            { label: 'Güneş', value: '4.8%' },
            { label: 'Jeotermal', value: '1.9%' }
          ]
        },
        {
          id: '4',
          title: 'Su Kalitesi',
          subtitle: 'İçme suyu',
          value: '84.3%',
          change: 1.8,
          icon: Droplets,
          color: 'text-cyan-600',
          bgColor: 'bg-cyan-50',
          description: 'WHO standartlarına uygun',
          details: [
            { label: 'Büyükşehirler', value: '91.2%' },
            { label: 'İl Merkezleri', value: '87.6%' },
            { label: 'İlçeler', value: '79.4%' },
            { label: 'Köyler', value: '68.7%' }
          ]
        },
        {
          id: '5',
          title: 'Orman Varlığı',
          subtitle: 'Türkiye toprakları',
          value: '22.6%',
          change: 0.9,
          icon: TreePine,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          description: 'Son 5 yılda artış',
          details: [
            { label: 'Karadeniz', value: '47.3%' },
            { label: 'Akdeniz', value: '31.8%' },
            { label: 'Ege', value: '28.4%' },
            { label: 'Diğer', value: '15.2%' }
          ]
        },
        {
          id: '6',
          title: 'Geri Dönüşüm Oranı',
          subtitle: 'Plastik atık',
          value: '28.4%',
          change: 12.3,
          icon: Recycle,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          description: 'Yıllık artış gösteriyor',
          details: [
            { label: 'PET', value: '45.7%' },
            { label: 'HDPE', value: '32.1%' },
            { label: 'PP', value: '21.8%' },
            { label: 'Diğer', value: '15.3%' }
          ]
        },
        {
          id: '7',
          title: 'Biyoçeşitlilik',
          subtitle: 'Koruma altında',
          value: '12.8%',
          change: 5.6,
          icon: Leaf,
          color: 'text-emerald-600',
          bgColor: 'bg-emerald-50',
          description: 'Toplam alan oranı',
          urgent: true,
          details: [
            { label: 'Milli Parklar', value: '47 adet' },
            { label: 'Tabiat Parkları', value: '263 adet' },
            { label: 'Ramsar Alanları', value: '14 adet' },
            { label: 'Biyosfer Rezervi', value: '1 adet' }
          ]
        },
        {
          id: '8',
          title: 'Çevre Yatırımları',
          subtitle: 'Bu yıl',
          value: '8.7B₺',
          change: 23.4,
          icon: Target,
          color: 'text-indigo-600',
          bgColor: 'bg-indigo-50',
          description: 'Kamu ve özel sektör toplamı',
          details: [
            { label: 'Atıksu Arıtma', value: '3.2B₺' },
            { label: 'Yenilenebilir Enerji', value: '2.8B₺' },
            { label: 'Hava Kalitesi', value: '1.4B₺' },
            { label: 'Diğer', value: '1.3B₺' }
          ]
        }
      ];

      // Simulate real-time updates
      const updatedCards = mockCards.map(card => {
        let newValue = card.value;
        
        if (typeof card.value === 'string' && card.value.includes('%')) {
          const numericValue = parseFloat(card.value.replace('%', ''));
          newValue = `${(numericValue + (Math.random() - 0.5) * 1).toFixed(1)}%`;
        } else if (typeof card.value === 'string' && card.value.includes('M')) {
          const numericValue = parseFloat(card.value.replace('M', ''));
          newValue = `${(numericValue + (Math.random() - 0.5) * 5).toFixed(1)}M`;
        } else if (typeof card.value === 'string' && card.value.includes('B₺')) {
          const numericValue = parseFloat(card.value.replace('B₺', ''));
          newValue = `${(numericValue + (Math.random() - 0.5) * 0.3).toFixed(1)}B₺`;
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
          <TreePine className="w-6 h-6 text-green-600" />
          Çevre Özet Kartları
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
              {/* Urgent Badge */}
              {card.urgent && (
                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                  ACİL
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
          {/* Environmental Health */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="font-semibold text-green-800">Çevre Sağlığı</div>
                <div className="text-sm text-green-600">Genel durum değerlendirmesi</div>
              </div>
            </div>
            <div className="text-2xl font-bold text-green-700">
              {cards.filter(c => c.change > 0 && !c.urgent).length}/8
            </div>
            <div className="text-sm text-green-600">Pozitif trend gösteren alan</div>
          </div>

          {/* Critical Areas */}
          <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="font-semibold text-red-800">Kritik Alanlar</div>
                <div className="text-sm text-red-600">Acil müdahale gereken</div>
              </div>
            </div>
            <div className="text-2xl font-bold text-red-700">
              {cards.filter(c => c.urgent || c.change < -5).length}
            </div>
            <div className="text-sm text-red-600">Alan dikkat gerektiriyor</div>
          </div>

          {/* Investment Growth */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="font-semibold text-blue-800">Yatırım Büyümesi</div>
                <div className="text-sm text-blue-600">Çevre sektörü</div>
              </div>
            </div>
            <div className="text-2xl font-bold text-blue-700">+23.4%</div>
            <div className="text-sm text-blue-600">Yıllık artış oranı</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="flex flex-wrap gap-3">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
            Detaylı Çevre Raporu
          </button>
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
            Verileri İndir
          </button>
          <button className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors">
            AI Analiz Başlat
          </button>
          <button className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-200 transition-colors">
            Uyarı Sistemi
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentSummaryCards;
