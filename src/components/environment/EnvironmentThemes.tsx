'use client';

import React, { useState, useEffect } from 'react';
import { TreePine, TrendingUp, Clock, Leaf, Globe, Droplets, Wind, Zap, Recycle, Thermometer } from 'lucide-react';

interface EnvironmentTheme {
  id: string;
  title: string;
  description: string;
  trendScore: number;
  impactLevel: 'low' | 'medium' | 'high';
  affectedRegions: number;
  category: string;
  isUrgent?: boolean;
  lastUpdated: string;
  color: string;
  carbonImpact?: number;
}

const EnvironmentThemes = () => {
  const [themes, setThemes] = useState<EnvironmentTheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('Tümü');

  const filters = ['Tümü', 'Acil', 'Yüksek Etki', 'İklim', 'Enerji', 'Su Kaynakları'];

  useEffect(() => {
    const fetchThemes = () => {
      const mockThemes: EnvironmentTheme[] = [
        {
          id: '1',
          title: 'Güneş Enerjisi Devrimi',
          description: 'Türkiye\'nin yenilenebilir enerji kapasitesi hızla artıyor. Yeni güneş ve rüzgar santralleri ile karbon emisyonu %15 azaldı.',
          trendScore: 92.4,
          impactLevel: 'high',
          affectedRegions: 17,
          category: 'Yenilenebilir Enerji',
          lastUpdated: '15 dakika önce',
          color: 'bg-gradient-to-r from-yellow-500 to-orange-500',
          carbonImpact: -1200000
        },
        {
          id: '2',
          title: 'Marmara Denizi Krizi',
          description: 'Deniz salyası ve kirlilik Marmara Denizi ekosistemini tehdit ediyor. Acil müdahale planları devreye girdi.',
          trendScore: 87.8,
          impactLevel: 'high',
          affectedRegions: 5,
          category: 'Su Kaynakları',
          isUrgent: true,
          lastUpdated: '23 dakika önce',
          color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
          carbonImpact: 850000
        },
        {
          id: '3',
          title: 'Hava Kalitesi Uyarısı',
          description: 'Büyük şehirlerde PM2.5 ve NO2 seviyeleri kritik eşiği aştı. Sağlık otoriteleri önlem alınmasını önerdi.',
          trendScore: 84.2,
          impactLevel: 'high',
          affectedRegions: 8,
          category: 'Hava Kirliliği',
          isUrgent: true,
          lastUpdated: '35 dakika önce',
          color: 'bg-gradient-to-r from-gray-500 to-slate-500'
        },
        {
          id: '4',
          title: 'Orman Koruma Başarısı',
          description: 'Son 5 yılda 2 milyon hektar alan ağaçlandırıldı. Türkiye\'nin orman varlığı %22,6\'ya yükseldi.',
          trendScore: 79.6,
          impactLevel: 'medium',
          affectedRegions: 15,
          category: 'Orman Koruma',
          lastUpdated: '1 saat önce',
          color: 'bg-gradient-to-r from-green-500 to-emerald-500',
          carbonImpact: -950000
        },
        {
          id: '5',
          title: 'Plastik Atık Sorunu',
          description: 'Akdeniz ve Ege\'de plastik kirliliği artışa geçti. Geri dönüşüm oranlarını artırmak için yeni projeler başlatıldı.',
          trendScore: 73.1,
          impactLevel: 'medium',
          affectedRegions: 7,
          category: 'Geri Dönüşüm',
          lastUpdated: '2 saat önce',
          color: 'bg-gradient-to-r from-purple-500 to-violet-500'
        },
        {
          id: '6',
          title: 'Karadeniz Balık Stokları',
          description: 'İklim değişikliği Karadeniz\'de balık türlerini etkiliyor. Hamsi popülasyonu %18 azaldı.',
          trendScore: 68.4,
          impactLevel: 'medium',
          affectedRegions: 3,
          category: 'Biyoçeşitlilik',
          lastUpdated: '3 saat önce',
          color: 'bg-gradient-to-r from-teal-500 to-blue-500'
        },
        {
          id: '7',
          title: 'Şehir İçi Ulaşım Dönüşümü',
          description: 'Elektrikli otobüs ve bisiklet yolları ile şehir içi ulaşım karbonsuzlaşıyor. 12 ilde yeni projeler başladı.',
          trendScore: 71.8,
          impactLevel: 'medium',
          affectedRegions: 12,
          category: 'Sürdürülebilirlik',
          lastUpdated: '4 saat önce',
          color: 'bg-gradient-to-r from-indigo-500 to-purple-500',
          carbonImpact: -340000
        },
        {
          id: '8',
          title: 'Su Tasarrufu Kampanyaları',
          description: 'Kuraklık nedeniyle su tasarrufu kampanyaları yoğunlaştı. Akıllı sulama sistemleri %30 tasarruf sağlıyor.',
          trendScore: 66.9,
          impactLevel: 'low',
          affectedRegions: 20,
          category: 'Su Yönetimi',
          lastUpdated: '5 saat önce',
          color: 'bg-gradient-to-r from-cyan-500 to-blue-500'
        }
      ];

      // Simulate real-time trend score updates
      const updatedThemes = mockThemes.map(theme => ({
        ...theme,
        trendScore: theme.trendScore + (Math.random() - 0.5) * 3,
        affectedRegions: theme.affectedRegions + Math.floor((Math.random() - 0.5) * 2)
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
        if (selectedFilter === 'Acil') return theme.isUrgent;
        if (selectedFilter === 'Yüksek Etki') return theme.impactLevel === 'high';
        if (selectedFilter === 'İklim') return theme.category.includes('İklim') || theme.category.includes('Hava');
        if (selectedFilter === 'Enerji') return theme.category.includes('Enerji');
        if (selectedFilter === 'Su Kaynakları') return theme.category.includes('Su');
        return true;
      });

  const sortedThemes = filteredThemes.sort((a, b) => b.trendScore - a.trendScore);

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: any } = {
      'Yenilenebilir Enerji': Zap,
      'Su Kaynakları': Droplets,
      'Hava Kirliliği': Wind,
      'Orman Koruma': TreePine,
      'Geri Dönüşüm': Recycle,
      'Biyoçeşitlilik': Leaf,
      'Sürdürülebilirlik': Globe,
      'Su Yönetimi': Droplets
    };
    return icons[category] || TreePine;
  };

  const getImpactColor = (impact: string) => {
    const colors: { [key: string]: string } = {
      'high': 'bg-red-100 text-red-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'low': 'bg-green-100 text-green-800'
    };
    return colors[impact] || 'bg-gray-100 text-gray-800';
  };

  const getImpactText = (impact: string) => {
    const texts: { [key: string]: string } = {
      'high': 'Yüksek Etki',
      'medium': 'Orta Etki',
      'low': 'Düşük Etki'
    };
    return texts[impact] || 'Bilinmiyor';
  };

  const formatCarbonImpact = (impact?: number) => {
    if (!impact) return null;
    const absImpact = Math.abs(impact);
    const sign = impact > 0 ? '+' : '-';
    if (absImpact >= 1000000) {
      return `${sign}${(absImpact / 1000000).toFixed(1)}M ton CO₂`;
    }
    return `${sign}${(absImpact / 1000).toFixed(0)}K ton CO₂`;
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
          <TrendingUp className="w-6 h-6 text-green-600" />
          Çevre Trendleri
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
                  ? 'bg-green-600 text-white shadow-lg'
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
                {theme.isUrgent && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                    ACİL
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
                <div className="text-sm opacity-90">{theme.category}</div>
              </div>

              {/* Content */}
              <div className="p-4">
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {theme.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">
                      {theme.trendScore.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-500">Trend Skoru</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">
                      {theme.affectedRegions}
                    </div>
                    <div className="text-xs text-gray-500">Etkilenen İl</div>
                  </div>
                </div>

                {/* Carbon Impact */}
                {theme.carbonImpact && (
                  <div className="mb-3">
                    <div className={`text-center p-2 rounded-lg ${
                      theme.carbonImpact > 0 ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
                    }`}>
                      <div className="text-sm font-medium">
                        {formatCarbonImpact(theme.carbonImpact)}
                      </div>
                      <div className="text-xs">
                        {theme.carbonImpact > 0 ? 'Emisyon Artışı' : 'Emisyon Azalışı'}
                      </div>
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {theme.lastUpdated}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(theme.impactLevel)}`}>
                    {getImpactText(theme.impactLevel)}
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
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-xl font-bold text-green-600">
              {sortedThemes.filter(t => t.trendScore > 80).length}
            </div>
            <div className="text-sm text-green-700">Yüksek Trend</div>
          </div>

          <div className="text-center p-4 bg-gradient-to-br from-red-50 to-rose-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Thermometer className="w-6 h-6 text-red-600" />
            </div>
            <div className="text-xl font-bold text-red-600">
              {sortedThemes.filter(t => t.isUrgent).length}
            </div>
            <div className="text-sm text-red-700">Acil Durum</div>
          </div>

          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Globe className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-xl font-bold text-blue-600">
              {sortedThemes.reduce((sum, t) => sum + t.affectedRegions, 0)}
            </div>
            <div className="text-sm text-blue-700">Toplam Etkilenen İl</div>
          </div>

          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Leaf className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-xl font-bold text-purple-600">
              {(sortedThemes.reduce((sum, t) => sum + t.trendScore, 0) / sortedThemes.length).toFixed(1)}
            </div>
            <div className="text-sm text-purple-700">Ort. Trend Skoru</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentThemes;
