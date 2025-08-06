"use client";

import { useState, useEffect } from 'react';
import { 
  Trophy, 
  Target, 
  Users, 
  Clock,
  Zap,
  Medal,
  Globe,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  RefreshCw,
  Star,
  Calendar
} from 'lucide-react';

interface SportSummaryCard {
  id: string;
  title: string;
  value: string;
  trend: number;
  trendDirection: 'up' | 'down' | 'neutral';
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  category: string;
  lastUpdate: string;
  details: {
    metric1: { label: string; value: string };
    metric2: { label: string; value: string };
    metric3: { label: string; value: string };
  };
}

const SportSummaryCardsNew = () => {
  const [summaryCards, setSummaryCards] = useState<SportSummaryCard[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadSummaryData();
  }, []);

  const loadSummaryData = () => {
    const cards: SportSummaryCard[] = [
      {
        id: '1',
        title: 'Aktif Futbol Ligleri',
        value: '247',
        trend: 8.3,
        trendDirection: 'up',
        description: 'Dünya genelinde aktif futbol lig sayısı',
        icon: Target,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        category: 'football',
        lastUpdate: '5 dakika önce',
        details: {
          metric1: { label: 'Maç Sayısı', value: '1,247' },
          metric2: { label: 'Takım Sayısı', value: '4,892' },
          metric3: { label: 'Oyuncu Sayısı', value: '97.3K' },
        },
      },
      {
        id: '2',
        title: 'Basketbol Seyircisi',
        value: '2.8M',
        trend: 15.7,
        trendDirection: 'up',
        description: 'Bu sezon basketbol maçlarına gelen toplam seyirci',
        icon: Trophy,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        category: 'basketball',
        lastUpdate: '12 dakika önce',
        details: {
          metric1: { label: 'Ortalama Seyirci', value: '8,547' },
          metric2: { label: 'En Yüksek', value: '23,456' },
          metric3: { label: 'Doluluk Oranı', value: '%76.3' },
        },
      },
      {
        id: '3',
        title: 'Transfer Değeri',
        value: '€847M',
        trend: 23.4,
        trendDirection: 'up',
        description: 'Bu sezon toplam transfer harcamaları',
        icon: Zap,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        category: 'transfer',
        lastUpdate: '1 saat önce',
        details: {
          metric1: { label: 'Transfer Sayısı', value: '1,456' },
          metric2: { label: 'En Yüksek', value: '€120M' },
          metric3: { label: 'Ortalama', value: '€580K' },
        },
      },
      {
        id: '4',
        title: 'Olimpiyat Madalyaları',
        value: '2,847',
        trend: 12.1,
        trendDirection: 'up',
        description: 'Paris 2024 Olimpiyatları toplam madalya sayısı',
        icon: Medal,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        category: 'olympic',
        lastUpdate: '2 saat önce',
        details: {
          metric1: { label: 'Altın', value: '949' },
          metric2: { label: 'Gümüş', value: '949' },
          metric3: { label: 'Bronz', value: '949' },
        },
      },
      {
        id: '5',
        title: 'Voleybol Organizasyonları',
        value: '89',
        trend: 34.2,
        trendDirection: 'up',
        description: 'Aktif voleybol turnuva ve lig sayısı',
        icon: Users,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        category: 'volleyball',
        lastUpdate: '3 saat önce',
        details: {
          metric1: { label: 'Kadın Ligleri', value: '45' },
          metric2: { label: 'Erkek Ligleri', value: '44' },
          metric3: { label: 'Toplam Takım', value: '1,247' },
        },
      },
      {
        id: '6',
        title: 'Tenis Turnuvaları',
        value: '156',
        trend: 7.8,
        trendDirection: 'up',
        description: 'ATP ve WTA turnuva sayısı (2024)',
        icon: Star,
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-50',
        category: 'tennis',
        lastUpdate: '4 saat önce',
        details: {
          metric1: { label: 'ATP', value: '89' },
          metric2: { label: 'WTA', value: '67' },
          metric3: { label: 'Grand Slam', value: '4' },
        },
      },
      {
        id: '7',
        title: 'Motor Sporları Yarışları',
        value: '234',
        trend: 19.5,
        trendDirection: 'up',
        description: 'Formula 1, MotoGP, Rally toplam yarış sayısı',
        icon: Zap,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        category: 'motorsport',
        lastUpdate: '6 saat önce',
        details: {
          metric1: { label: 'Formula 1', value: '24' },
          metric2: { label: 'MotoGP', value: '20' },
          metric3: { label: 'Rally', value: '190' },
        },
      },
      {
        id: '8',
        title: 'Spor Yayın Süresi',
        value: '14.2K',
        trend: 45.3,
        trendDirection: 'up',
        description: 'Toplam spor yayın saati (saat)',
        icon: Globe,
        color: 'text-teal-600',
        bgColor: 'bg-teal-50',
        category: 'broadcast',
        lastUpdate: '12 saat önce',
        details: {
          metric1: { label: 'Canlı Yayın', value: '8,547h' },
          metric2: { label: 'Özet', value: '3,247h' },
          metric3: { label: 'Analiz', value: '2,406h' },
        },
      },
    ];

    setSummaryCards(cards);
  };

  const categories = [
    { id: 'all', name: 'Tümü', count: summaryCards.length },
    { id: 'football', name: 'Futbol', count: summaryCards.filter(c => c.category === 'football').length },
    { id: 'basketball', name: 'Basketbol', count: summaryCards.filter(c => c.category === 'basketball').length },
    { id: 'volleyball', name: 'Voleybol', count: summaryCards.filter(c => c.category === 'volleyball').length },
    { id: 'tennis', name: 'Tenis', count: summaryCards.filter(c => c.category === 'tennis').length },
    { id: 'olympic', name: 'Olimpiyat', count: summaryCards.filter(c => c.category === 'olympic').length },
  ];

  const filteredCards = selectedCategory === 'all' 
    ? summaryCards 
    : summaryCards.filter(card => card.category === selectedCategory);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    loadSummaryData();
    setIsRefreshing(false);
  };

  const getTrendIcon = (direction: string) => {
    if (direction === 'up') return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (direction === 'down') return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <span className="w-4 h-4 text-gray-400">—</span>;
  };

  const getTrendColor = (direction: string) => {
    if (direction === 'up') return 'text-green-600';
    if (direction === 'down') return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">📊 Spor Dünyası Özeti</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Yenile
          </button>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-500">Canlı Veriler</span>
          </div>
        </div>
      </div>

      {/* Kategori Filtreleri */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-green-100 text-green-700 border border-green-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {category.name}
            <span className="ml-2 bg-white px-2 py-1 rounded-full text-xs">
              {category.count}
            </span>
          </button>
        ))}
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCards.map((card) => {
          const IconComponent = card.icon;
          return (
            <div
              key={card.id}
              className={`${card.bgColor} rounded-lg p-5 border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer group`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <IconComponent className={`w-8 h-8 ${card.color} group-hover:scale-110 transition-transform`} />
                <div className="flex items-center gap-1">
                  {getTrendIcon(card.trendDirection)}
                  <span className={`text-sm font-semibold ${getTrendColor(card.trendDirection)}`}>
                    {Math.abs(card.trend)}%
                  </span>
                </div>
              </div>

              {/* Main Value */}
              <div className="mb-3">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{card.value}</h3>
                <p className="text-sm font-medium text-gray-700">{card.title}</p>
                <p className="text-xs text-gray-500 mt-1">{card.description}</p>
              </div>

              {/* Detay Metrikleri */}
              <div className="space-y-2 mb-4">
                {Object.entries(card.details).map(([key, detail]) => (
                  <div key={key} className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">{detail.label}:</span>
                    <span className="font-semibold text-gray-900">{detail.value}</span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  {card.lastUpdate}
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Günün Spor İstatistikleri */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">⚡ Günün Spor İstatistikleri</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Toplam Maç', value: '1,247', trend: '+34' },
            { label: 'Canlı Skor', value: '89', trend: '+12' },
            { label: 'Transfer', value: '156', trend: '+23' },
            { label: 'Seyirci', value: '2.1M', trend: '+8%' },
          ].map((stat, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="text-xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
              <div className="text-xs font-semibold text-green-600">{stat.trend}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Lig Sıralaması Özeti */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🏆 Lig Liderleri</h3>
        <div className="space-y-2">
          {[
            { league: 'Süper Lig', leader: 'Galatasaray', points: '67', matches: '28' },
            { league: 'BSL', leader: 'Anadolu Efes', points: '24-4', matches: '28' },
            { league: 'Sultanlar Ligi', leader: 'VakıfBank', points: '26-2', matches: '28' },
            { league: 'EuroLeague', leader: 'Real Madrid', points: '22-6', matches: '28' },
            { league: 'La Liga', leader: 'Real Madrid', points: '78', matches: '32' },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>
                <div>
                  <span className="font-medium text-gray-900">{item.league}</span>
                  <div className="text-sm text-gray-500">{item.leader}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-700">{item.points}</div>
                <div className="text-xs text-gray-500">{item.matches} maç</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Yaklaşan Önemli Maçlar */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📅 Yaklaşan Önemli Maçlar</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { match: 'Galatasaray - Fenerbahçe', date: 'Bugün 20:00', category: 'Süper Lig' },
            { match: 'Anadolu Efes - Barcelona', date: 'Yarın 20:30', category: 'EuroLeague' },
            { match: 'VakıfBank - Conegliano', date: '2 gün sonra', category: 'CEV' },
            { match: 'A Milli Takım - İtalya', date: '1 hafta sonra', category: 'Nations League' },
          ].map((fixture, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{fixture.category}</span>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-gray-500" />
                  <span className="text-xs text-gray-500">{fixture.date}</span>
                </div>
              </div>
              <div className="font-semibold text-gray-900">{fixture.match}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SportSummaryCardsNew;
