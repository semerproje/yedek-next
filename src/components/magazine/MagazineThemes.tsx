'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, Clock, Star, Users, Heart, Crown, Camera, Music, Palette } from 'lucide-react';

interface MagazineTheme {
  id: string;
  title: string;
  description: string;
  trendScore: number;
  newsCount: number;
  engagementRate: number;
  category: string;
  celebrity?: string;
  isHot?: boolean;
  lastUpdated: string;
  color: string;
}

const MagazineThemes = () => {
  const [themes, setThemes] = useState<MagazineTheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('Tümü');

  const filters = ['Tümü', 'Trending', 'Ünlüler', 'Moda', 'Müzik', 'Aşk'];

  useEffect(() => {
    const fetchThemes = () => {
      const mockThemes: MagazineTheme[] = [
        {
          id: '1',
          title: 'Hadise\'nin Yeni Albümü',
          description: 'Pop starı Hadise\'nin beklenen yeni albümü "Kalp Atışı" sosyal medyada büyük yankı uyandırdı.',
          trendScore: 95.7,
          newsCount: 47,
          engagementRate: 89.3,
          category: 'Müzik',
          celebrity: 'Hadise',
          isHot: true,
          lastUpdated: '12 dakika önce',
          color: 'bg-gradient-to-r from-pink-500 to-rose-500'
        },
        {
          id: '2',
          title: 'Milano Moda Haftası',
          description: 'Türk ünlüler Milano Moda Haftası\'nda boy gösterdi. Hande Erçel ve Serenay Sarıkaya dikkat çekti.',
          trendScore: 87.2,
          newsCount: 34,
          engagementRate: 76.8,
          category: 'Moda',
          isHot: true,
          lastUpdated: '23 dakika önce',
          color: 'bg-gradient-to-r from-purple-500 to-indigo-500'
        },
        {
          id: '3',
          title: 'Can Yaman Hollywood Projesi',
          description: 'Can Yaman\'ın Netflix ile imzaladığı yeni proje Hollywood\'da büyük heyecan yarattı.',
          trendScore: 91.4,
          newsCount: 56,
          engagementRate: 83.5,
          category: 'Ünlüler',
          celebrity: 'Can Yaman',
          isHot: true,
          lastUpdated: '35 dakika önce',
          color: 'bg-gradient-to-r from-blue-500 to-cyan-500'
        },
        {
          id: '4',
          title: 'Demet Özdemir Düğün Hazırlığı',
          description: 'Demet Özdemir ve Oğuzhan Koç\'un gizli düğün hazırlığı dedikodular arasında en çok konuşulan konu.',
          trendScore: 78.9,
          newsCount: 28,
          engagementRate: 71.2,
          category: 'Aşk',
          celebrity: 'Demet Özdemir',
          lastUpdated: '1 saat önce',
          color: 'bg-gradient-to-r from-red-500 to-pink-500'
        },
        {
          id: '5',
          title: 'Survivor 2024 Ünlü Yarışmacılar',
          description: 'Acun Ilıcalı\'nın Survivor 2024 için seçtiği ünlü yarışmacılar açıklandı. Büyük sürprizler var.',
          trendScore: 84.6,
          newsCount: 41,
          engagementRate: 80.1,
          category: 'Ünlüler',
          celebrity: 'Acun Ilıcalı',
          lastUpdated: '2 saat önce',
          color: 'bg-gradient-to-r from-green-500 to-teal-500'
        },
        {
          id: '6',
          title: 'Meryem Uzerli Güzellik Markası',
          description: 'Meryem Uzerli kendi güzellik markasını tanıttı. Organik ürün serisi büyük ilgi görüyor.',
          trendScore: 72.3,
          newsCount: 19,
          engagementRate: 65.7,
          category: 'Güzellik',
          celebrity: 'Meryem Uzerli',
          lastUpdated: '3 saat önce',
          color: 'bg-gradient-to-r from-yellow-500 to-orange-500'
        },
        {
          id: '7',
          title: 'Kenan İmirzalıoğlu Maldivler Tatili',
          description: 'Kenan İmirzalıoğlu ve Sinem Kobal çifti 10. evlilik yıldönümlerini Maldivler\'de kutluyor.',
          trendScore: 69.8,
          newsCount: 25,
          engagementRate: 68.4,
          category: 'Aşk',
          celebrity: 'Kenan İmirzalıoğlu',
          lastUpdated: '4 saat önce',
          color: 'bg-gradient-to-r from-teal-500 to-blue-500'
        },
        {
          id: '8',
          title: 'Ebru Şahin Hamilelik Dedikoduları',
          description: 'Ebru Şahin son dönemde çıkan hamilelik dedikodularına sosyal medyadan açıklık getirdi.',
          trendScore: 77.1,
          newsCount: 32,
          engagementRate: 74.9,
          category: 'Ünlüler',
          celebrity: 'Ebru Şahin',
          lastUpdated: '5 saat önce',
          color: 'bg-gradient-to-r from-violet-500 to-purple-500'
        }
      ];

      // Simulate real-time trend score updates
      const updatedThemes = mockThemes.map(theme => ({
        ...theme,
        trendScore: theme.trendScore + (Math.random() - 0.5) * 2,
        newsCount: theme.newsCount + Math.floor(Math.random() * 3),
        engagementRate: theme.engagementRate + (Math.random() - 0.5) * 3
      }));

      setThemes(updatedThemes);
      setLoading(false);
    };

    fetchThemes();
    const interval = setInterval(fetchThemes, 30000);

    return () => clearInterval(interval);
  }, []);

  const filteredThemes = selectedFilter === 'Tümü' 
    ? themes 
    : themes.filter(theme => {
        if (selectedFilter === 'Trending') return theme.isHot;
        return theme.category === selectedFilter;
      });

  const sortedThemes = filteredThemes.sort((a, b) => b.trendScore - a.trendScore);

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: any } = {
      'Müzik': Music,
      'Moda': Palette,
      'Ünlüler': Star,
      'Aşk': Heart,
      'Güzellik': Sparkles
    };
    return icons[category] || Crown;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-40 bg-gray-200 rounded-lg"></div>
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
          <TrendingUp className="w-6 h-6 text-pink-600" />
          Trending Magazin Konuları
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>Son güncelleme: az önce</span>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedFilter === filter
                  ? 'bg-pink-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Themes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedThemes.map((theme, index) => {
          const CategoryIcon = getCategoryIcon(theme.category);
          
          return (
            <div
              key={theme.id}
              className="relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >
              {/* Gradient Header */}
              <div className={`${theme.color} p-4 text-white relative`}>
                {theme.isHot && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                    HOT
                  </div>
                )}
                
                <div className="flex items-center justify-between mb-2">
                  <CategoryIcon className="w-6 h-6" />
                  <div className="text-right">
                    <div className="text-lg font-bold">#{index + 1}</div>
                    <div className="text-xs opacity-90">Trend</div>
                  </div>
                </div>
                
                <h3 className="font-bold text-lg mb-1 line-clamp-2">{theme.title}</h3>
                {theme.celebrity && (
                  <div className="flex items-center gap-1 text-sm opacity-90">
                    <Star className="w-3 h-3" />
                    <span>{theme.celebrity}</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {theme.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-pink-600">
                      {theme.trendScore.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-500">Trend Skoru</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">
                      {theme.newsCount}
                    </div>
                    <div className="text-xs text-gray-500">Haber</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">
                      %{theme.engagementRate.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-500">Etkileşim</div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {theme.lastUpdated}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    theme.category === 'Müzik' ? 'bg-purple-100 text-purple-800' :
                    theme.category === 'Moda' ? 'bg-pink-100 text-pink-800' :
                    theme.category === 'Ünlüler' ? 'bg-yellow-100 text-yellow-800' :
                    theme.category === 'Aşk' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {theme.category}
                  </span>
                </div>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-300 pointer-events-none"></div>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-6 h-6 text-pink-600" />
            </div>
            <div className="text-xl font-bold text-pink-600">
              {sortedThemes.filter(t => t.isHot).length}
            </div>
            <div className="text-sm text-pink-700">Hot Trends</div>
          </div>

          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-xl font-bold text-blue-600">
              {new Set(sortedThemes.map(t => t.celebrity).filter(Boolean)).size}
            </div>
            <div className="text-sm text-blue-700">Aktif Ünlü</div>
          </div>

          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Star className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-xl font-bold text-green-600">
              {sortedThemes.reduce((sum, t) => sum + t.newsCount, 0)}
            </div>
            <div className="text-sm text-green-700">Toplam Haber</div>
          </div>

          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Heart className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-xl font-bold text-purple-600">
              {(sortedThemes.reduce((sum, t) => sum + t.engagementRate, 0) / sortedThemes.length).toFixed(1)}%
            </div>
            <div className="text-sm text-purple-700">Ort. Etkileşim</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MagazineThemes;
