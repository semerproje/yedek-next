'use client';

import React, { useState, useEffect } from 'react';
import { GraduationCap, BookOpen, Brain, Laptop, Users, Award, TrendingUp, Globe, School, Calculator } from 'lucide-react';

interface ThemeData {
  id: string;
  title: string;
  description: string;
  icon: any;
  count: number;
  trend: number;
  color: string;
  bgColor: string;
  featured?: boolean;
}

const EducationThemes = () => {
  const [themes, setThemes] = useState<ThemeData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchThemes = () => {
      // Eğitim konularını simüle et
      const mockThemes: ThemeData[] = [
        {
          id: '1',
          title: 'Yükseköğretim',
          description: 'Üniversiteler, yüksek lisans ve doktora programları',
          icon: GraduationCap,
          count: 1284,
          trend: 12.5,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          featured: true
        },
        {
          id: '2',
          title: 'Dijital Eğitim',
          description: 'Online kurslar, e-öğrenme ve teknoloji entegrasyonu',
          icon: Laptop,
          count: 956,
          trend: 28.3,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          featured: true
        },
        {
          id: '3',
          title: 'Sınavlar',
          description: 'YKS, ALES, KPSS ve diğer merkezi sınavlar',
          icon: Award,
          count: 789,
          trend: 8.7,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50'
        },
        {
          id: '4',
          title: 'Okul Öncesi Eğitim',
          description: 'Anaokulu, kreş ve erken çocukluk eğitimi',
          icon: Users,
          count: 654,
          trend: 15.2,
          color: 'text-pink-600',
          bgColor: 'bg-pink-50'
        },
        {
          id: '5',
          title: 'Özel Eğitim',
          description: 'Özel gereksinimli öğrenciler için eğitim programları',
          icon: Brain,
          count: 432,
          trend: 22.1,
          color: 'text-green-600',
          bgColor: 'bg-green-50'
        },
        {
          id: '6',
          title: 'Meslek Eğitimi',
          description: 'Teknik okullar ve meslek liselerinde eğitim',
          icon: Calculator,
          count: 567,
          trend: 6.4,
          color: 'text-indigo-600',
          bgColor: 'bg-indigo-50'
        },
        {
          id: '7',
          title: 'Öğretmen Eğitimi',
          description: 'Öğretmen yetiştirme ve mesleki gelişim programları',
          icon: School,
          count: 398,
          trend: 11.8,
          color: 'text-teal-600',
          bgColor: 'bg-teal-50'
        },
        {
          id: '8',
          title: 'Uluslararası Eğitim',
          description: 'Erasmus, değişim programları ve yurtdışı eğitim',
          icon: Globe,
          count: 234,
          trend: 34.5,
          color: 'text-cyan-600',
          bgColor: 'bg-cyan-50'
        }
      ];

      setThemes(mockThemes);
      setLoading(false);
    };

    fetchThemes();
  }, []);

  const formatTrend = (trend: number) => {
    const sign = trend >= 0 ? '+' : '';
    return `${sign}${trend.toFixed(1)}%`;
  };

  const getTrendColor = (trend: number) => {
    return trend >= 0 ? 'text-green-600' : 'text-red-600';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const featuredThemes = themes.filter(theme => theme.featured);
  const regularThemes = themes.filter(theme => !theme.featured);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-600" />
          Eğitim Konuları
        </h2>
        <div className="text-sm text-gray-500">
          {themes.length} konu
        </div>
      </div>

      {/* Öne Çıkan Konular */}
      {featuredThemes.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            Öne Çıkan Konular
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredThemes.map((theme) => {
              const Icon = theme.icon;
              return (
                <div
                  key={theme.id}
                  className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-lg transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full transform translate-x-8 -translate-y-8 opacity-10"></div>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`${theme.bgColor} rounded-lg p-3`}>
                      <Icon className={`w-6 h-6 ${theme.color}`} />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {theme.count.toLocaleString()}
                      </div>
                      <div className={`text-sm font-medium ${getTrendColor(theme.trend)}`}>
                        {formatTrend(theme.trend)}
                      </div>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {theme.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {theme.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                      Öne Çıkan
                    </span>
                    <div className="flex items-center gap-1">
                      <TrendingUp className={`w-4 h-4 ${getTrendColor(theme.trend)}`} />
                      <span className="text-sm text-gray-500">Bu hafta</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tüm Konular */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {regularThemes.map((theme) => {
          const Icon = theme.icon;
          return (
            <div
              key={theme.id}
              className="bg-white rounded-lg shadow-sm border p-5 hover:shadow-lg transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`${theme.bgColor} rounded-lg p-2 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-5 h-5 ${theme.color}`} />
                </div>
                <div className={`text-sm font-medium ${getTrendColor(theme.trend)}`}>
                  {formatTrend(theme.trend)}
                </div>
              </div>
              
              <h3 className="text-md font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {theme.title}
              </h3>
              
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {theme.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">
                  {theme.count.toLocaleString()}
                </span>
                <span className="text-xs text-gray-500">haber</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* İstatistik Özeti */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {themes.reduce((sum, theme) => sum + theme.count, 0).toLocaleString()}
            </div>
            <div className="text-sm text-blue-700">Toplam Haber</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">
              {themes.length}
            </div>
            <div className="text-sm text-indigo-700">Aktif Konu</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              +{(themes.reduce((sum, theme) => sum + theme.trend, 0) / themes.length).toFixed(1)}%
            </div>
            <div className="text-sm text-green-700">Ortalama Artış</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {featuredThemes.length}
            </div>
            <div className="text-sm text-purple-700">Öne Çıkan</div>
          </div>
        </div>
      </div>

      {/* Popüler Etiketler */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Popüler Etiketler</h3>
        <div className="flex flex-wrap gap-2">
          {[
            'YKS 2025', 'Dijital Dönüşüm', 'Uzaktan Eğitim', 'PISA', 'Öğretmen',
            'Üniversite', 'Lise', 'Anaokulu', 'KPSS', 'ALES', 'Burs', 'Scholarship',
            'EdTech', 'STEM', 'Kodlama', 'Robotik', 'Dil Eğitimi', 'Sanat Eğitimi'
          ].map((tag, index) => (
            <span
              key={index}
              className="bg-gray-100 hover:bg-blue-100 hover:text-blue-600 text-gray-600 px-3 py-1 rounded-full text-sm cursor-pointer transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EducationThemes;
