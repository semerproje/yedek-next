'use client';

import React, { useState, useEffect } from 'react';
import { Vote, Users, Building, Crown, Scale, Globe, TrendingUp, Clock, Eye, MessageCircle, Share2 } from 'lucide-react';

interface PoliticsNewsItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  readTime: number;
  views: number;
  comments: number;
  shares: number;
  source: string;
  isBreaking: boolean;
  politicalParty?: string;
}

const PoliticsNewsGrid = () => {
  const [newsItems, setNewsItems] = useState<PoliticsNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'Tümü', icon: Vote, color: 'blue' },
    { id: 'government', name: 'Hükümet', icon: Building, color: 'indigo' },
    { id: 'parliament', name: 'Meclis', icon: Users, color: 'purple' },
    { id: 'parties', name: 'Partiler', icon: Crown, color: 'pink' },
    { id: 'elections', name: 'Seçimler', icon: Vote, color: 'green' },
    { id: 'foreign', name: 'Dış Politika', icon: Globe, color: 'cyan' },
    { id: 'justice', name: 'Adalet', icon: Scale, color: 'orange' },
    { id: 'local', name: 'Yerel Yönetim', icon: Building, color: 'teal' },
  ];

  useEffect(() => {
    const fetchNewsData = () => {
      const mockNews: PoliticsNewsItem[] = [
        {
          id: '1',
          title: 'Yeni Ekonomi Reformu Paketi Mecliste Görüşülüyor',
          summary: 'Hükümetin hazırladığı kapsamlı ekonomi reformu paketi, bugün Meclis\'te görüşülmeye başlandı.',
          category: 'parliament',
          impact: 'high',
          timestamp: '2 dakika önce',
          readTime: 4,
          views: 12543,
          comments: 89,
          shares: 234,
          source: 'Politika Masası',
          isBreaking: true,
          politicalParty: 'Hükümet'
        },
        {
          id: '2',
          title: 'AB Müzakereleri Yeni Aşamaya Geçiyor',
          summary: 'Avrupa Birliği ile yürütülen müzakere süreci, yeni fasılların açılmasıyla devam ediyor.',
          category: 'foreign',
          impact: 'high',
          timestamp: '15 dakika önce',
          readTime: 6,
          views: 8921,
          comments: 67,
          shares: 156,
          source: 'Dış Politika',
          isBreaking: false
        },
        {
          id: '3',
          title: 'Yerel Seçim Takvimi Belirlendi',
          summary: 'YSK, 2024 yerel seçimlerinin takvimini açıkladı. Seçim kampanyaları başlıyor.',
          category: 'elections',
          impact: 'medium',
          timestamp: '32 dakika önce',
          readTime: 3,
          views: 15678,
          comments: 123,
          shares: 289,
          source: 'Seçim Merkezi',
          isBreaking: false
        },
        {
          id: '4',
          title: 'Anayasa Mahkemesi Kararı Bekleniyor',
          summary: 'Önemli bir anayasal meseleyle ilgili Anayasa Mahkemesi\'nden karar bekleniyor.',
          category: 'justice',
          impact: 'high',
          timestamp: '1 saat önce',
          readTime: 5,
          views: 9834,
          comments: 78,
          shares: 167,
          source: 'Hukuk Masası',
          isBreaking: false
        },
        {
          id: '5',
          title: 'Büyükşehir Belediyesi Yeni Projeleri Açıkladı',
          summary: 'İstanbul Büyükşehir Belediyesi, 2024 yılı için planlanan yeni projeleri tanıttı.',
          category: 'local',
          impact: 'medium',
          timestamp: '2 saat önce',
          readTime: 4,
          views: 6789,
          comments: 45,
          shares: 112,
          source: 'Yerel Haberler',
          isBreaking: false
        },
        {
          id: '6',
          title: 'Parti Liderleri Zirve Toplantısı',
          summary: 'Meclis\'teki parti liderleri, güncel konuları görüşmek üzere zirve toplantısı yapacak.',
          category: 'parties',
          impact: 'medium',
          timestamp: '3 saat önce',
          readTime: 3,
          views: 7456,
          comments: 56,
          shares: 134,
          source: 'Politik Analiz',
          isBreaking: false
        },
        {
          id: '7',
          title: 'Dış Ticaret Verileri Açıklandı',
          summary: 'Ticaret Bakanlığı, son çeyrek dış ticaret verilerini açıkladı.',
          category: 'government',
          impact: 'low',
          timestamp: '4 saat önce',
          readTime: 2,
          views: 5432,
          comments: 34,
          shares: 87,
          source: 'Ekonomi Politik',
          isBreaking: false
        },
        {
          id: '8',
          title: 'NATO Zirvesi Hazırlıkları Sürüyor',
          summary: 'Türkiye\'nin NATO zirvesine katılım hazırlıkları devam ediyor.',
          category: 'foreign',
          impact: 'medium',
          timestamp: '5 saat önce',
          readTime: 4,
          views: 8765,
          comments: 67,
          shares: 156,
          source: 'Savunma Haberleri',
          isBreaking: false
        }
      ];

      setNewsItems(mockNews);
      setLoading(false);
    };

    fetchNewsData();
    const interval = setInterval(fetchNewsData, 30000);

    return () => clearInterval(interval);
  }, []);

  const filteredNews = selectedCategory === 'all' 
    ? newsItems 
    : newsItems.filter(item => item.category === selectedCategory);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getImpactText = (impact: string) => {
    switch (impact) {
      case 'critical': return 'Kritik';
      case 'high': return 'Yüksek';
      case 'medium': return 'Orta';
      case 'low': return 'Düşük';
      default: return 'Belirsiz';
    }
  };

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.color || 'blue';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
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
          <Vote className="w-6 h-6 text-blue-600" />
          Politik Haberler
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <TrendingUp className="w-4 h-4" />
          <span>{filteredNews.length} haber</span>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.id;
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                isSelected
                  ? `bg-${category.color}-100 text-${category.color}-700 border border-${category.color}-200`
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {category.name}
            </button>
          );
        })}
      </div>

      {/* Breaking News Banner */}
      {filteredNews.some(item => item.isBreaking) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-red-800 font-semibold text-sm uppercase tracking-wide">Son Dakika</span>
          </div>
          {filteredNews.filter(item => item.isBreaking).map(item => (
            <div key={item.id} className="text-red-700 font-medium">
              {item.title}
            </div>
          ))}
        </div>
      )}

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNews.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-all duration-300 cursor-pointer group"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getImpactColor(item.impact)}`}>
                {getImpactText(item.impact)} Etki
              </div>
              {item.isBreaking && (
                <div className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-bold border border-red-200">
                  CANLI
                </div>
              )}
            </div>

            {/* Content */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
              {item.title}
            </h3>
            
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {item.summary}
            </p>

            {/* Category & Party */}
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${getCategoryColor(item.category)}-100 text-${getCategoryColor(item.category)}-700 border border-${getCategoryColor(item.category)}-200`}>
                {categories.find(cat => cat.id === item.category)?.name}
              </span>
              {item.politicalParty && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200">
                  {item.politicalParty}
                </span>
              )}
            </div>

            {/* Meta Info */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{item.readTime} dk</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span>{item.views.toLocaleString()}</span>
                </div>
              </div>
              <span>{item.timestamp}</span>
            </div>

            {/* Engagement */}
            <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100">
              <span className="text-xs text-gray-500 font-medium">{item.source}</span>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  <span>{item.comments}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Share2 className="w-3 h-3" />
                  <span>{item.shares}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center mt-8">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
          Daha Fazla Haber Yükle
        </button>
      </div>
    </div>
  );
};

export default PoliticsNewsGrid;
