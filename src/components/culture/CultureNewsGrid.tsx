'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Palette, Music, Camera, BookOpen, Theater, Mic, Clock, TrendingUp, Eye } from 'lucide-react';

interface CultureNews {
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

const CultureNewsGrid = () => {
  const [cultureNews, setCultureNews] = useState<CultureNews[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', name: 'Tüm Haberler', icon: Palette },
    { id: 'art', name: 'Sanat', icon: Camera },
    { id: 'music', name: 'Müzik', icon: Music },
    { id: 'literature', name: 'Edebiyat', icon: BookOpen },
    { id: 'theater', name: 'Tiyatro', icon: Theater },
    { id: 'events', name: 'Etkinlikler', icon: Mic }
  ];

  useEffect(() => {
    const fetchCultureNews = () => {
      const mockNews: CultureNews[] = [
        {
          id: 1,
          title: 'İstanbul Bienali 2025 Açılışa Hazırlanıyor',
          description: 'Dünya çapında sanatçıların katılacağı bienal 15 Eylül\'de kapılarını açacak.',
          category: 'art',
          image: '/assets/culture1.jpg',
          readTime: '6 dk',
          timeAgo: '1 saat önce',
          author: 'Ayşe Kültür',
          views: '15.2K',
          trending: true
        },
        {
          id: 2,
          title: 'Rock\'n Coke Festivali İstanbul\'da',
          description: 'Uluslararası müzik devlerinin sahne alacağı festival hazırlıkları tamamlandı.',
          category: 'music',
          image: '/assets/culture2.jpg',
          readTime: '4 dk',
          timeAgo: '2 saat önce',
          author: 'Mehmet Müzik',
          views: '23.8K',
          trending: true
        },
        {
          id: 3,
          title: 'Orhan Pamuk\'tan Yeni Roman: "İstanbul Rüyaları"',
          description: 'Nobel ödüllü yazarın beklenen yeni eseri kitap severlerin beğenisine sunuldu.',
          category: 'literature',
          image: '/assets/culture3.jpg',
          readTime: '5 dk',
          timeAgo: '3 saat önce',
          author: 'Zeynep Edebiyat',
          views: '18.7K',
          trending: false
        },
        {
          id: 4,
          title: 'Devlet Tiyatroları Yeni Sezona Başlıyor',
          description: 'Klasik ve çağdaş oyunların yer aldığı zengin repertuvar tiyatro severleri bekliyor.',
          category: 'theater',
          image: '/assets/culture4.jpg',
          readTime: '3 dk',
          timeAgo: '4 saat önce',
          author: 'Can Tiyatro',
          views: '9.3K',
          trending: false
        },
        {
          id: 5,
          title: 'Çağdaş Türk Resmi Sergisi Ankara\'da',
          description: 'Cumhuriyet dönemi Türk ressamlarının eserlerinden oluşan kapsamlı sergi.',
          category: 'art',
          image: '/assets/culture5.jpg',
          readTime: '7 dk',
          timeAgo: '5 saat önce',
          author: 'Pınar Sanat',
          views: '12.1K',
          trending: false
        },
        {
          id: 6,
          title: 'Bodrum Kültür Sanat Festivali Başladı',
          description: 'Antik tiyatroda klasik müzik konserleri ve modern dans gösterileri.',
          category: 'events',
          image: '/assets/culture6.jpg',
          readTime: '4 dk',
          timeAgo: '6 saat önce',
          author: 'Emre Etkinlik',
          views: '7.9K',
          trending: false
        }
      ];

      setCultureNews(mockNews);
      setLoading(false);
    };

    fetchCultureNews();
    const interval = setInterval(fetchCultureNews, 30000);

    return () => clearInterval(interval);
  }, []);

  const filteredNews = selectedCategory === 'all' 
    ? cultureNews 
    : cultureNews.filter(news => news.category === selectedCategory);

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
            <Palette className="w-6 h-6 text-purple-600" />
            Kültür Sanat Haberleri
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
                    ? 'bg-purple-600 text-white shadow-md'
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
            <article className="group cursor-pointer bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-purple-300">
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
                  <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded">
                    {categories.find(cat => cat.id === news.category)?.name || 'Genel'}
                  </span>
                  <span className="text-xs text-gray-500">{news.timeAgo}</span>
                </div>

                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                  {news.title}
                </h3>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {news.description}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="font-medium">{news.author}</span>
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
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
          <Palette className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Bu kategoride henüz haber bulunmuyor.</p>
        </div>
      )}

      {/* Featured Culture Events */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Öne Çıkan Kültür Etkinlikleri</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 text-center">
            <Music className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-lg font-bold text-purple-700">İstanbul Müzik Festivali</div>
            <div className="text-xs text-purple-600">15-30 Eylül</div>
          </div>

          <div className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-lg p-4 text-center">
            <Camera className="w-8 h-8 text-pink-600 mx-auto mb-2" />
            <div className="text-lg font-bold text-pink-700">Uluslararası Fotoğraf Sergisi</div>
            <div className="text-xs text-pink-600">1-15 Ekim</div>
          </div>

          <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-lg p-4 text-center">
            <BookOpen className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
            <div className="text-lg font-bold text-indigo-700">İstanbul Kitap Fuarı</div>
            <div className="text-xs text-indigo-600">20 Ekim - 5 Kasım</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CultureNewsGrid;
