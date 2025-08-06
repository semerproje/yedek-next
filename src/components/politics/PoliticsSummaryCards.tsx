'use client';

import React, { useState, useEffect } from 'react';
import { Crown, Users, Building, Vote, Scale, TrendingUp, TrendingDown, Activity, Globe } from 'lucide-react';

interface PoliticsSummaryCard {
  id: string;
  title: string;
  value: string;
  change: number;
  changeText: string;
  icon: any;
  color: string;
  description: string;
  trend: 'up' | 'down' | 'stable';
  importance: 'low' | 'medium' | 'high' | 'critical';
}

const PoliticsSummaryCards = () => {
  const [cards, setCards] = useState<PoliticsSummaryCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummaryData = () => {
      const mockCards: PoliticsSummaryCard[] = [
        {
          id: '1',
          title: 'Hükümet Onay Oranı',
          value: (52.3 + (Math.random() - 0.5) * 4).toFixed(1) + '%',
          change: -1.8 + (Math.random() - 0.5) * 2,
          changeText: 'Son hafta',
          icon: Crown,
          color: 'blue',
          description: 'Halkın hükümete güven endeksi',
          trend: 'down',
          importance: 'critical'
        },
        {
          id: '2',
          title: 'Meclis Katılım Oranı',
          value: (84.2 + (Math.random() - 0.5) * 3).toFixed(1) + '%',
          change: 2.1 + (Math.random() - 0.5) * 1.5,
          changeText: 'Bu ay',
          icon: Building,
          color: 'purple',
          description: 'Milletvekillerinin oturum katılımı',
          trend: 'up',
          importance: 'medium'
        },
        {
          id: '3',
          title: 'Seçmen Kayıt Oranı',
          value: (91.7 + (Math.random() - 0.5) * 2).toFixed(1) + '%',
          change: 0.8 + (Math.random() - 0.5) * 1,
          changeText: 'Son çeyrek',
          icon: Vote,
          color: 'green',
          description: 'Kayıtlı seçmen sayısı artışı',
          trend: 'up',
          importance: 'high'
        },
        {
          id: '4',
          title: 'Yasama Verimliliği',
          value: Math.floor(127 + Math.random() * 20).toString(),
          change: 12 + (Math.random() - 0.5) * 8,
          changeText: 'Çıkarılan yasa',
          icon: Scale,
          color: 'orange',
          description: 'Bu dönem çıkarılan yasa sayısı',
          trend: 'up',
          importance: 'medium'
        },
        {
          id: '5',
          title: 'Muhalefet Aktivitesi',
          value: (78.5 + (Math.random() - 0.5) * 6).toFixed(1) + '%',
          change: 4.3 + (Math.random() - 0.5) * 3,
          changeText: 'Soru önergesi',
          icon: Users,
          color: 'indigo',
          description: 'Muhalefet partilerinin meclis aktivitesi',
          trend: 'up',
          importance: 'medium'
        },
        {
          id: '6',
          title: 'Kamu Güveni Endeksi',
          value: (41.9 + (Math.random() - 0.5) * 8).toFixed(1) + '%',
          change: -3.2 + (Math.random() - 0.5) * 4,
          changeText: 'Kurumlara güven',
          icon: Building,
          color: 'red',
          description: 'Devlet kurumlarına güven seviyesi',
          trend: 'down',
          importance: 'high'
        },
        {
          id: '7',
          title: 'Diplomatik Aktivite',
          value: Math.floor(23 + Math.random() * 8).toString(),
          change: 18 + (Math.random() - 0.5) * 10,
          changeText: 'Uluslar arası görüşme',
          icon: Globe,
          color: 'cyan',
          description: 'Bu ay gerçekleşen diplomatik görüşme',
          trend: 'up',
          importance: 'medium'
        },
        {
          id: '8',
          title: 'Parti Sayısı',
          value: Math.floor(17 + Math.random() * 3).toString(),
          change: 0 + (Math.random() - 0.5) * 2,
          changeText: 'Aktif parti',
          icon: Users,
          color: 'pink',
          description: 'Mecliste temsil edilen parti sayısı',
          trend: 'stable',
          importance: 'low'
        }
      ];

      setCards(mockCards);
      setLoading(false);
    };

    fetchSummaryData();
    const interval = setInterval(fetchSummaryData, 20000);

    return () => clearInterval(interval);
  }, []);

  const getColorClasses = (color: string) => {
    const colors: { [key: string]: string } = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200',
      green: 'bg-green-50 text-green-600 border-green-200',
      orange: 'bg-orange-50 text-orange-600 border-orange-200',
      indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200',
      red: 'bg-red-50 text-red-600 border-red-200',
      cyan: 'bg-cyan-50 text-cyan-600 border-cyan-200',
      pink: 'bg-pink-50 text-pink-600 border-pink-200',
    };
    return colors[color] || colors.blue;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getChangeIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getImportanceBadge = (importance: string) => {
    switch (importance) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getImportanceText = (importance: string) => {
    switch (importance) {
      case 'critical': return 'Kritik';
      case 'high': return 'Yüksek';
      case 'medium': return 'Orta';
      case 'low': return 'Düşük';
      default: return 'Normal';
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Crown className="w-6 h-6 text-blue-600" />
          Politik Özet
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Activity className="w-4 h-4" />
          <span>Gerçek zamanlı güncellemeler</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg border ${getColorClasses(card.color)}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getImportanceBadge(card.importance)}`}>
                  {getImportanceText(card.importance)}
                </div>
              </div>

              {/* Content */}
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  {card.title}
                </h3>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {card.value}
                </div>
                <p className="text-xs text-gray-500">
                  {card.description}
                </p>
              </div>

              {/* Change Indicator */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  {getChangeIcon(card.trend)}
                  <span className={`text-sm font-medium ${getChangeColor(card.change)}`}>
                    {card.change > 0 ? '+' : ''}{card.change.toFixed(1)}%
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {card.changeText}
                </span>
              </div>

              {/* Hover Effect */}
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div 
                    className={`h-1 rounded-full transition-all duration-500 ${
                      card.trend === 'up' ? 'bg-green-500' : 
                      card.trend === 'down' ? 'bg-red-500' : 'bg-blue-500'
                    }`}
                    style={{ 
                      width: `${Math.abs(card.change) * 10}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Statistics */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <Crown className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-blue-600">
              {cards.filter(card => card.importance === 'critical').length}
            </div>
            <div className="text-sm text-blue-700">Kritik Metrik</div>
          </div>

          <div className="text-center p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-green-600">
              {cards.filter(card => card.trend === 'up').length}
            </div>
            <div className="text-sm text-green-700">Pozitif Trend</div>
          </div>

          <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
            <Activity className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-purple-600">
              {(cards.reduce((acc, card) => acc + Math.abs(card.change), 0) / cards.length).toFixed(1)}%
            </div>
            <div className="text-sm text-purple-700">Ortalama Değişim</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoliticsSummaryCards;
