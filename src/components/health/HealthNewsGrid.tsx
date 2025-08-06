'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Stethoscope, Activity, Shield, Microscope, Heart, Globe, Clock, TrendingUp } from 'lucide-react';

interface HealthNews {
  id: number;
  title: string;
  description: string;
  category: string;
  image: string;
  readTime: string;
  timeAgo: string;
  author: string;
  views: string;
  trending: boolean;
}

const HealthNewsGrid = () => {
  const [healthNews, setHealthNews] = useState<HealthNews[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', name: 'Tüm Haberler', icon: Globe },
    { id: 'covid', name: 'COVID-19', icon: Shield },
    { id: 'research', name: 'Araştırma', icon: Microscope },
    { id: 'cardiology', name: 'Kardiyoloji', icon: Heart },
    { id: 'technology', name: 'Tıp Teknoloji', icon: Activity },
    { id: 'general', name: 'Genel Sağlık', icon: Stethoscope }
  ];

  useEffect(() => {
    const fetchHealthNews = () => {
      const mockNews: HealthNews[] = [
        {
          id: 1,
          title: 'Yeni COVID-19 Varyantı İçin Güncellenmiş Aşı Onaylandı',
          description: 'Sağlık Bakanlığı, güncellenen COVID-19 aşısının etkili olduğunu açıkladı.',
          category: 'covid',
          image: '/assets/health1.jpg',
          readTime: '5 dk',
          timeAgo: '2 saat önce',
          author: 'Dr. Ayşe Kara',
          views: '12.4K',
          trending: true
        },
        {
          id: 2,
          title: 'Kalp Hastalıklarında Yapay Zeka Desteği',
          description: 'Kardiyolojide AI kullanımı erken teşhis oranlarını %35 artırdı.',
          category: 'cardiology',
          image: '/assets/health2.jpg',
          readTime: '7 dk',
          timeAgo: '4 saat önce',
          author: 'Prof. Dr. Mehmet Özkan',
          views: '8.7K',
          trending: true
        },
        {
          id: 3,
          title: 'Alzheimer Tedavisinde Çığır Açan Araştırma',
          description: 'Yeni ilaç denemeleri umut verici sonuçlar gösteriyor.',
          category: 'research',
          image: '/assets/health3.jpg',
          readTime: '6 dk',
          timeAgo: '6 saat önce',
          author: 'Dr. Zeynep Tunç',
          views: '15.2K',
          trending: false
        },
        {
          id: 4,
          title: 'Robotik Cerrahi Sistemleri Türkiye\'de',
          description: 'Yeni nesil robotik cerrahi cihazları hastanelerde kullanımda.',
          category: 'technology',
          image: '/assets/health4.jpg',
          readTime: '4 dk',
          timeAgo: '8 saat önce',
          author: 'Dr. Can Yıldız',
          views: '6.1K',
          trending: false
        },
        {
          id: 5,
          title: 'Beslenme Alışkanlıklarında Yeni Yaklaşımlar',
          description: 'Uzmanlar dengeli beslenme için yeni önerilerde bulundu.',
          category: 'general',
          image: '/assets/health5.jpg',
          readTime: '3 dk',
          timeAgo: '10 saat önce',
          author: 'Dyt. Pınar Akar',
          views: '9.3K',
          trending: false
        },
        {
          id: 6,
          title: 'Mental Sağlıkta Dijital Terapiler',
          description: 'Online terapi platformları etkililik gösteriyor.',
          category: 'technology',
          image: '/assets/health6.jpg',
          readTime: '5 dk',
          timeAgo: '12 saat önce',
          author: 'Psik. Dr. Emre Kılıç',
          views: '7.8K',
          trending: false
        }
      ];

      setHealthNews(mockNews);
      setLoading(false);
    };

    fetchHealthNews();
    const interval = setInterval(fetchHealthNews, 30000);

    return () => clearInterval(interval);
  }, []);

  const filteredNews = selectedCategory === 'all' 
    ? healthNews 
    : healthNews.filter(news => news.category === selectedCategory);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="h-48 bg-gray-200 rounded-lg"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
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
            <Stethoscope className="w-6 h-6 text-green-600" />
            Sağlık Haberleri
          </h2>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            Son güncelleme: {new Date().toLocaleTimeString('tr-TR')}
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {category.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNews.map((news) => (
          <Link key={news.id} href={`/haber/${news.id}`}>
            <article className="group cursor-pointer bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-green-300">
              <div className="relative">
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent z-10" />
                  {news.trending && (
                    <div className="absolute top-3 left-3 z-20 flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      <TrendingUp className="w-3 h-3" />
                      Trend
                    </div>
                  )}
                  <div className="absolute top-3 right-3 z-20 bg-black/70 text-white px-2 py-1 rounded text-xs">
                    {news.readTime}
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                    {categories.find(cat => cat.id === news.category)?.name || 'Genel'}
                  </span>
                  <span className="text-xs text-gray-500">{news.timeAgo}</span>
                </div>

                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                  {news.title}
                </h3>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {news.description}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="font-medium">{news.author}</span>
                  <div className="flex items-center gap-1">
                    <Activity className="w-3 h-3" />
                    {news.views} görüntülenme
                  </div>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>

      {filteredNews.length === 0 && (
        <div className="text-center py-12">
          <Stethoscope className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Bu kategoride henüz haber bulunmuyor.</p>
        </div>
      )}
    </div>
  );
};

export default HealthNewsGrid;
