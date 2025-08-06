"use client";

import { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Laptop, 
  Cpu, 
  Wifi,
  Battery,
  Shield,
  Zap,
  Globe,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  RefreshCw,
  Star,
  Users,
  Clock
} from 'lucide-react';

interface TechSummaryCard {
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

const TechnologySummaryCardsNew = () => {
  const [summaryCards, setSummaryCards] = useState<TechSummaryCard[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadSummaryData();
  }, []);

  const loadSummaryData = () => {
    const cards: TechSummaryCard[] = [
      {
        id: '1',
        title: 'Global Smartphone Market',
        value: '1.45B',
        trend: 12.3,
        trendDirection: 'up',
        description: 'Küresel akıllı telefon satışları ve pazar analizi',
        icon: Smartphone,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        category: 'mobile',
        lastUpdate: '2 saat önce',
        details: {
          metric1: { label: 'Q4 Sales', value: '387M units' },
          metric2: { label: 'Market Leader', value: 'Samsung 23%' },
          metric3: { label: 'Avg Price', value: '$487' },
        },
      },
      {
        id: '2',
        title: 'AI Processing Power',
        value: '847 PFLOPS',
        trend: 156.7,
        trendDirection: 'up',
        description: 'Dünya genelinde AI hesaplama kapasitesi',
        icon: Cpu,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        category: 'ai',
        lastUpdate: '1 saat önce',
        details: {
          metric1: { label: 'GPU Clusters', value: '12,400' },
          metric2: { label: 'Top Provider', value: 'NVIDIA 67%' },
          metric3: { label: 'Energy Use', value: '2.3 TWh' },
        },
      },
      {
        id: '3',
        title: 'Global Internet Users',
        value: '5.18B',
        trend: 4.8,
        trendDirection: 'up',
        description: 'Dünya genelinde internet kullanıcı sayısı',
        icon: Globe,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        category: 'internet',
        lastUpdate: '3 saat önce',
        details: {
          metric1: { label: 'Penetration', value: '64.6%' },
          metric2: { label: 'Mobile Users', value: '4.32B' },
          metric3: { label: 'Avg Speed', value: '67.2 Mbps' },
        },
      },
      {
        id: '4',
        title: 'Cybersecurity Threats',
        value: '4.2M',
        trend: -8.3,
        trendDirection: 'down',
        description: 'Bu ay tespit edilen siber güvenlik tehditleri',
        icon: Shield,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        category: 'security',
        lastUpdate: '30 dakika önce',
        details: {
          metric1: { label: 'Malware', value: '2.8M' },
          metric2: { label: 'Phishing', value: '1.1M' },
          metric3: { label: 'Prevented', value: '97.3%' },
        },
      },
      {
        id: '5',
        title: '5G Network Coverage',
        value: '67.8%',
        trend: 23.4,
        trendDirection: 'up',
        description: 'Küresel 5G ağ kapsama oranı',
        icon: Wifi,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        category: 'network',
        lastUpdate: '4 saat önce',
        details: {
          metric1: { label: 'Countries', value: '156' },
          metric2: { label: 'Base Stations', value: '3.2M' },
          metric3: { label: 'Avg Speed', value: '1.2 Gbps' },
        },
      },
      {
        id: '6',
        title: 'Electric Vehicle Sales',
        value: '14.2M',
        trend: 67.9,
        trendDirection: 'up',
        description: 'Global elektrikli araç satış rakamları',
        icon: Battery,
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50',
        category: 'automotive',
        lastUpdate: '6 saat önce',
        details: {
          metric1: { label: 'Market Share', value: '18.1%' },
          metric2: { label: 'Tesla Lead', value: '19.9%' },
          metric3: { label: 'Charging Pts', value: '2.7M' },
        },
      },
      {
        id: '7',
        title: 'Cloud Computing Revenue',
        value: '$247B',
        trend: 28.6,
        trendDirection: 'up',
        description: 'Küresel bulut bilişim gelir analizi',
        icon: Laptop,
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-50',
        category: 'cloud',
        lastUpdate: '8 saat önce',
        details: {
          metric1: { label: 'AWS Share', value: '31.2%' },
          metric2: { label: 'Azure Share', value: '24.7%' },
          metric3: { label: 'Growth Rate', value: '+28.6%' },
        },
      },
      {
        id: '8',
        title: 'Renewable Energy Tech',
        value: '3,847 GW',
        trend: 15.2,
        trendDirection: 'up',
        description: 'Yenilenebilir enerji teknolojileri kapasitesi',
        icon: Zap,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        category: 'energy',
        lastUpdate: '12 saat önce',
        details: {
          metric1: { label: 'Solar', value: '1,847 GW' },
          metric2: { label: 'Wind', value: '1,234 GW' },
          metric3: { label: 'Efficiency', value: '+18.3%' },
        },
      },
    ];

    setSummaryCards(cards);
  };

  const categories = [
    { id: 'all', name: 'Tümü', count: summaryCards.length },
    { id: 'mobile', name: 'Mobil', count: summaryCards.filter(c => c.category === 'mobile').length },
    { id: 'ai', name: 'AI', count: summaryCards.filter(c => c.category === 'ai').length },
    { id: 'network', name: 'Network', count: summaryCards.filter(c => c.category === 'network').length },
    { id: 'security', name: 'Güvenlik', count: summaryCards.filter(c => c.category === 'security').length },
    { id: 'cloud', name: 'Cloud', count: summaryCards.filter(c => c.category === 'cloud').length },
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
        <h2 className="text-xl font-semibold text-gray-900">📊 Teknoloji Özeti</h2>
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
                ? 'bg-blue-100 text-blue-700 border border-blue-200'
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

      {/* Özet İstatistikler */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">⚡ Hızlı İstatistikler</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Toplam Tech Value', value: '$12.4T', trend: '+23%' },
            { label: 'Active Companies', value: '847K', trend: '+15%' },
            { label: 'Tech Jobs', value: '89.2M', trend: '+34%' },
            { label: 'R&D Investment', value: '$2.8T', trend: '+41%' },
          ].map((stat, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="text-xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
              <div className="text-xs font-semibold text-green-600">{stat.trend}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Global Tech Ranking */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🏆 Tech Liderlik Sıralaması</h3>
        <div className="space-y-2">
          {[
            { country: 'ABD', score: '94.2', rank: 1 },
            { country: 'Çin', score: '87.6', rank: 2 },
            { country: 'Japonya', score: '82.1', rank: 3 },
            { country: 'Güney Kore', score: '79.8', rank: 4 },
            { country: 'Almanya', score: '76.4', rank: 5 },
          ].map((item) => (
            <div key={item.rank} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {item.rank}
                </div>
                <span className="font-medium text-gray-900">{item.country}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-700">{item.score}</span>
                <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechnologySummaryCardsNew;
