'use client';

import React, { useState, useEffect } from 'react';
import { Palette, Music, Camera, BookOpen, Theater, Mic, TrendingUp, Clock, ChevronRight, Users } from 'lucide-react';

interface CultureTheme {
  id: string;
  title: string;
  description: string;
  icon: any;
  newsCount: number;
  trend: 'up' | 'down' | 'stable';
  trendValue: string;
  color: string;
  bgColor: string;
  category: string;
  isPopular: boolean;
  eventCount: number;
}

const CultureThemes = () => {
  const [themes, setThemes] = useState<CultureTheme[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', name: 'Tüm Temalar' },
    { id: 'visual', name: 'Görsel Sanatlar' },
    { id: 'performing', name: 'Sahne Sanatları' },
    { id: 'literature', name: 'Edebiyat' },
    { id: 'events', name: 'Etkinlikler' }
  ];

  useEffect(() => {
    const fetchThemes = () => {
      const mockThemes: CultureTheme[] = [
        {
          id: '1',
          title: 'Çağdaş Sanat ve Sergiler',
          description: 'Modern sanat akımları, güncel sergiler ve sanatçı röportajları',
          icon: Palette,
          newsCount: 1247,
          trend: 'up',
          trendValue: '+18%',
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          category: 'visual',
          isPopular: true,
          eventCount: 34
        },
        {
          id: '2',
          title: 'Müzik ve Konserler',
          description: 'Klasik müzikten moderne, festival ve konser haberleri',
          icon: Music,
          newsCount: 892,
          trend: 'up',
          trendValue: '+12%',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          category: 'performing',
          isPopular: true,
          eventCount: 67
        },
        {
          id: '3',
          title: 'Fotoğraf ve Görsel Sanatlar',
          description: 'Fotoğraf sergileri, dijital sanat ve görsel tasarım',
          icon: Camera,
          newsCount: 634,
          trend: 'up',
          trendValue: '+9%',
          color: 'text-pink-600',
          bgColor: 'bg-pink-50',
          category: 'visual',
          isPopular: false,
          eventCount: 23
        },
        {
          id: '4',
          title: 'Edebiyat ve Kitaplar',
          description: 'Yeni çıkan kitaplar, yazar söyleşileri ve edebiyat ödülleri',
          icon: BookOpen,
          newsCount: 756,
          trend: 'stable',
          trendValue: '0%',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          category: 'literature',
          isPopular: true,
          eventCount: 45
        },
        {
          id: '5',
          title: 'Tiyatro ve Drama',
          description: 'Tiyatro oyunları, oyuncu haberleri ve sahne sanatları',
          icon: Theater,
          newsCount: 423,
          trend: 'down',
          trendValue: '-3%',
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          category: 'performing',
          isPopular: false,
          eventCount: 29
        },
        {
          id: '6',
          title: 'Kültür Festivalleri',
          description: 'Ulusal ve uluslararası kültür festivali haberleri',
          icon: Mic,
          newsCount: 567,
          trend: 'up',
          trendValue: '+25%',
          color: 'text-indigo-600',
          bgColor: 'bg-indigo-50',
          category: 'events',
          isPopular: true,
          eventCount: 18
        },
        {
          id: '7',
          title: 'Müze ve Kültür Merkezleri',
          description: 'Müze ziyaretleri, koleksiyonlar ve kültürel miras',
          icon: Users,
          newsCount: 389,
          trend: 'up',
          trendValue: '+7%',
          color: 'text-teal-600',
          bgColor: 'bg-teal-50',
          category: 'visual',
          isPopular: false,
          eventCount: 12
        },
        {
          id: '8',
          title: 'Sinema ve Film',
          description: 'Film festivalleri, yönetmen haberleri ve sinema eleştirileri',
          icon: Camera,
          newsCount: 678,
          trend: 'up',
          trendValue: '+14%',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          category: 'performing',
          isPopular: true,
          eventCount: 41
        }
      ];

      setThemes(mockThemes);
      setLoading(false);
    };

    fetchThemes();
    const interval = setInterval(fetchThemes, 25000);

    return () => clearInterval(interval);
  }, []);

  const filteredThemes = selectedCategory === 'all' 
    ? themes 
    : themes.filter(theme => theme.category === selectedCategory);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
      default:
        return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Palette className="w-6 h-6 text-purple-600" />
            Kültür Temaları
          </h2>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            Anlık veriler
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredThemes.map((theme) => {
          const Icon = theme.icon;
          return (
            <div
              key={theme.id}
              className="group relative bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-purple-300"
            >
              {theme.isPopular && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  Popüler
                </div>
              )}

              <div className={`${theme.bgColor} rounded-lg p-3 mb-4 inline-block`}>
                <Icon className={`w-6 h-6 ${theme.color}`} />
              </div>

              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                {theme.title}
              </h3>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {theme.description}
              </p>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">
                    {theme.newsCount.toLocaleString()} haber
                  </span>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(theme.trend)}
                    <span className={`text-xs font-medium ${
                      theme.trend === 'up' ? 'text-green-600' : 
                      theme.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {theme.trendValue}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {theme.eventCount} etkinlik
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <span className="text-xs text-gray-500 font-medium">
                  {categories.find(cat => cat.id === theme.category)?.name}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredThemes.length === 0 && (
        <div className="text-center py-12">
          <Palette className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Bu kategoride tema bulunmuyor.</p>
        </div>
      )}

      {/* Summary Statistics */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {themes.reduce((sum, theme) => sum + theme.newsCount, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Toplam Kültür Haberi</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {themes.reduce((sum, theme) => sum + theme.eventCount, 0)}
            </div>
            <div className="text-sm text-gray-600">Aktif Etkinlik</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {themes.filter(theme => theme.trend === 'up').length}
            </div>
            <div className="text-sm text-gray-600">Yükselen Tema</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {themes.filter(theme => theme.isPopular).length}
            </div>
            <div className="text-sm text-gray-600">Popüler Kategori</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CultureThemes;
