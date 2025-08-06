'use client';

import React, { useState, useEffect } from 'react';
import { Vote, TrendingUp, Users, Building, Crown, AlertTriangle, Clock, BarChart3 } from 'lucide-react';

interface PoliticsTheme {
  id: string;
  title: string;
  description: string;
  trendLevel: 'rising' | 'hot' | 'stable' | 'declining';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  voterImpact: number;
  discussionCount: number;
  lastUpdate: string;
  relatedParties: string[];
  publicOpinion: number;
}

const PoliticsThemes = () => {
  const [themes, setThemes] = useState<PoliticsTheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const filters = [
    { id: 'all', name: 'Tümü', icon: Vote },
    { id: 'government', name: 'Hükümet', icon: Building },
    { id: 'opposition', name: 'Muhalefet', icon: Users },
    { id: 'parliament', name: 'Meclis', icon: Crown },
    { id: 'urgent', name: 'Acil', icon: AlertTriangle },
  ];

  useEffect(() => {
    const fetchThemes = () => {
      const mockThemes: PoliticsTheme[] = [
        {
          id: '1',
          title: 'Ekonomi Reformu Tartışmaları',
          description: 'Yeni ekonomi paketi ve enflasyonla mücadele politikaları gündemde',
          trendLevel: 'hot',
          urgency: 'high',
          category: 'government',
          voterImpact: 87,
          discussionCount: 2341,
          lastUpdate: '5 dakika önce',
          relatedParties: ['AK Parti', 'CHP', 'İYİ Parti'],
          publicOpinion: 62
        },
        {
          id: '2',
          title: 'Seçim Yasası Değişiklikleri',
          description: 'Yeni seçim sistemine yönelik yasal düzenlemeler konuşuluyor',
          trendLevel: 'rising',
          urgency: 'critical',
          category: 'parliament',
          voterImpact: 94,
          discussionCount: 1876,
          lastUpdate: '12 dakika önce',
          relatedParties: ['Meclis Komisyonu', 'YSK'],
          publicOpinion: 45
        },
        {
          id: '3',
          title: 'Dış Politika Stratejileri',
          description: 'AB müzakereleri ve bölgesel diplomasi girişimleri',
          trendLevel: 'stable',
          urgency: 'medium',
          category: 'government',
          voterImpact: 71,
          discussionCount: 1234,
          lastUpdate: '28 dakika önce',
          relatedParties: ['Dışişleri', 'AB Komisyonu'],
          publicOpinion: 58
        },
        {
          id: '4',
          title: 'Yerel Yönetim Reformları',
          description: 'Büyükşehir belediyeleri ve il özel idarelerine yeni yetkiler',
          trendLevel: 'rising',
          urgency: 'medium',
          category: 'government',
          voterImpact: 76,
          discussionCount: 987,
          lastUpdate: '45 dakika önce',
          relatedParties: ['Belediyeler Birliği', 'İçişleri'],
          publicOpinion: 69
        },
        {
          id: '5',
          title: 'Anayasa Tartışmaları',
          description: 'Yeni anayasa çalışmaları ve hukuk reformu önerileri',
          trendLevel: 'hot',
          urgency: 'high',
          category: 'parliament',
          voterImpact: 89,
          discussionCount: 2156,
          lastUpdate: '1 saat önce',
          relatedParties: ['Anayasa Komisyonu', 'Hukuk Reformu'],
          publicOpinion: 52
        },
        {
          id: '6',
          title: 'Sosyal Güvenlik Reformu',
          description: 'Emeklilik sistemi ve sosyal güvenlik düzenlemeleri',
          trendLevel: 'declining',
          urgency: 'low',
          category: 'government',
          voterImpact: 82,
          discussionCount: 756,
          lastUpdate: '2 saat önce',
          relatedParties: ['SGK', 'Çalışma Bakanlığı'],
          publicOpinion: 74
        }
      ];

      setThemes(mockThemes);
      setLoading(false);
    };

    fetchThemes();
    const interval = setInterval(fetchThemes, 25000);

    return () => clearInterval(interval);
  }, []);

  const filteredThemes = selectedFilter === 'all' 
    ? themes 
    : selectedFilter === 'urgent'
    ? themes.filter(theme => theme.urgency === 'critical' || theme.urgency === 'high')
    : themes.filter(theme => theme.category === selectedFilter);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'hot': return '🔥';
      case 'rising': return '📈';
      case 'stable': return '➡️';
      case 'declining': return '📉';
      default: return '📊';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'hot': return 'text-red-600 bg-red-50 border-red-200';
      case 'rising': return 'text-green-600 bg-green-50 border-green-200';
      case 'stable': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'declining': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'Kritik';
      case 'high': return 'Yüksek';
      case 'medium': return 'Orta';
      case 'low': return 'Düşük';
      default: return 'Belirsiz';
    }
  };

  const getOpinionColor = (opinion: number) => {
    if (opinion >= 70) return 'text-green-600';
    if (opinion >= 50) return 'text-blue-600';
    if (opinion >= 30) return 'text-yellow-600';
    return 'text-red-600';
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
          <TrendingUp className="w-6 h-6 text-blue-600" />
          Politik Gündem
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <BarChart3 className="w-4 h-4" />
          <span>{filteredThemes.length} konu</span>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map((filter) => {
          const Icon = filter.icon;
          const isSelected = selectedFilter === filter.id;
          return (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                isSelected
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {filter.name}
            </button>
          );
        })}
      </div>

      {/* Trending Alert */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6 border border-blue-200">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-blue-800 font-semibold text-sm">En Çok Konuşulan</span>
        </div>
        <div className="text-blue-700 font-medium">
          {themes.sort((a, b) => b.discussionCount - a.discussionCount)[0]?.title}
        </div>
        <div className="text-blue-600 text-sm mt-1">
          {themes.sort((a, b) => b.discussionCount - a.discussionCount)[0]?.discussionCount.toLocaleString()} tartışma
        </div>
      </div>

      {/* Themes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredThemes.map((theme) => (
          <div
            key={theme.id}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-all duration-300 cursor-pointer group"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium border ${getTrendColor(theme.trendLevel)}`}>
                <span>{getTrendIcon(theme.trendLevel)}</span>
                <span className="capitalize">{theme.trendLevel}</span>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(theme.urgency)}`}>
                {getUrgencyText(theme.urgency)}
              </div>
            </div>

            {/* Content */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {theme.title}
            </h3>
            
            <p className="text-gray-600 text-sm mb-4">
              {theme.description}
            </p>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="text-center p-2 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">
                  {theme.voterImpact}%
                </div>
                <div className="text-xs text-blue-700">Seçmen Etkisi</div>
              </div>
              <div className="text-center p-2 bg-purple-50 rounded-lg">
                <div className={`text-lg font-bold ${getOpinionColor(theme.publicOpinion)}`}>
                  {theme.publicOpinion}%
                </div>
                <div className="text-xs text-purple-700">Halk Desteği</div>
              </div>
            </div>

            {/* Related Parties */}
            <div className="mb-4">
              <div className="text-xs text-gray-500 mb-2">İlgili Taraflar:</div>
              <div className="flex flex-wrap gap-1">
                {theme.relatedParties.slice(0, 2).map((party, index) => (
                  <span key={index} className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200">
                    {party}
                  </span>
                ))}
                {theme.relatedParties.length > 2 && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                    +{theme.relatedParties.length - 2}
                  </span>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{theme.discussionCount.toLocaleString()} tartışma</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{theme.lastUpdate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {themes.filter(t => t.urgency === 'critical').length}
            </div>
            <div className="text-sm text-red-700">Kritik Konular</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {themes.filter(t => t.trendLevel === 'rising').length}
            </div>
            <div className="text-sm text-green-700">Yükselen Gündem</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(themes.reduce((acc, t) => acc + t.publicOpinion, 0) / themes.length)}%
            </div>
            <div className="text-sm text-blue-700">Ortalama Destek</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {themes.reduce((acc, t) => acc + t.discussionCount, 0).toLocaleString()}
            </div>
            <div className="text-sm text-purple-700">Toplam Tartışma</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoliticsThemes;
