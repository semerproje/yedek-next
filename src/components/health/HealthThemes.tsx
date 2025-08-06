'use client';

import React, { useState, useEffect } from 'react';
import { Heart, Brain, Shield, Dumbbell, Pill, Activity, Users, TrendingUp, Clock, ChevronRight } from 'lucide-react';

interface HealthTheme {
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
}

const HealthThemes = () => {
  const [themes, setThemes] = useState<HealthTheme[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', name: 'Tüm Temalar' },
    { id: 'chronic', name: 'Kronik Hastalıklar' },
    { id: 'prevention', name: 'Koruyucu Sağlık' },
    { id: 'mental', name: 'Mental Sağlık' },
    { id: 'fitness', name: 'Fitness & Beslenme' }
  ];

  useEffect(() => {
    const fetchThemes = () => {
      const mockThemes: HealthTheme[] = [
        {
          id: '1',
          title: 'Kardiyovasküler Sağlık',
          description: 'Kalp ve damar sağlığı ile ilgili en güncel gelişmeler',
          icon: Heart,
          newsCount: 847,
          trend: 'up',
          trendValue: '+12%',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          category: 'chronic',
          isPopular: true
        },
        {
          id: '2',
          title: 'Nöroloji ve Beyin Sağlığı',
          description: 'Beyin sağlığı, Alzheimer ve nörolojik hastalıklar',
          icon: Brain,
          newsCount: 634,
          trend: 'up',
          trendValue: '+8%',
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          category: 'chronic',
          isPopular: true
        },
        {
          id: '3',
          title: 'COVID-19 ve Aşılar',
          description: 'Pandemi güncellemeleri ve aşı gelişmeleri',
          icon: Shield,
          newsCount: 1243,
          trend: 'down',
          trendValue: '-5%',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          category: 'prevention',
          isPopular: false
        },
        {
          id: '4',
          title: 'Beslenme ve Diyet',
          description: 'Sağlıklı beslenme önerileri ve diyet programları',
          icon: Dumbbell,
          newsCount: 726,
          trend: 'up',
          trendValue: '+15%',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          category: 'fitness',
          isPopular: true
        },
        {
          id: '5',
          title: 'İlaç ve Tedavi Yöntemleri',
          description: 'Yeni ilaçlar ve alternatif tedavi yaklaşımları',
          icon: Pill,
          newsCount: 592,
          trend: 'stable',
          trendValue: '0%',
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          category: 'chronic',
          isPopular: false
        },
        {
          id: '6',
          title: 'Mental Sağlık ve Psikoloji',
          description: 'Ruh sağlığı, stres yönetimi ve psikolojik destek',
          icon: Activity,
          newsCount: 456,
          trend: 'up',
          trendValue: '+20%',
          color: 'text-indigo-600',
          bgColor: 'bg-indigo-50',
          category: 'mental',
          isPopular: true
        },
        {
          id: '7',
          title: 'Kadın Sağlığı',
          description: 'Kadınlara özel sağlık konuları ve öneriler',
          icon: Users,
          newsCount: 383,
          trend: 'up',
          trendValue: '+7%',
          color: 'text-pink-600',
          bgColor: 'bg-pink-50',
          category: 'prevention',
          isPopular: false
        },
        {
          id: '8',
          title: 'Yaşlı Sağlığı',
          description: 'Yaşlılık döneminde sağlık ve bakım önerileri',
          icon: Heart,
          newsCount: 294,
          trend: 'up',
          trendValue: '+3%',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          category: 'chronic',
          isPopular: false
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
        return <Activity className="w-4 h-4 text-gray-500" />;
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
            <Activity className="w-6 h-6 text-green-600" />
            Sağlık Temaları
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
                  ? 'bg-green-600 text-white shadow-md'
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
              className="group relative bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-green-300"
            >
              {theme.isPopular && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  Popüler
                </div>
              )}

              <div className={`${theme.bgColor} rounded-lg p-3 mb-4 inline-block`}>
                <Icon className={`w-6 h-6 ${theme.color}`} />
              </div>

              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                {theme.title}
              </h3>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {theme.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">
                    {theme.newsCount.toLocaleString()} haber
                  </span>
                </div>

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

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <span className="text-xs text-gray-500 font-medium">
                  {categories.find(cat => cat.id === theme.category)?.name}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-green-600 transition-colors" />
              </div>
            </div>
          );
        })}
      </div>

      {filteredThemes.length === 0 && (
        <div className="text-center py-12">
          <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Bu kategoride tema bulunmuyor.</p>
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {themes.reduce((sum, theme) => sum + theme.newsCount, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Toplam Sağlık Haberi</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {themes.filter(theme => theme.trend === 'up').length}
            </div>
            <div className="text-sm text-gray-600">Yükselen Tema</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {themes.filter(theme => theme.isPopular).length}
            </div>
            <div className="text-sm text-gray-600">Popüler Kategori</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthThemes;
