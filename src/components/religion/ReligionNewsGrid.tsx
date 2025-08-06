'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Clock, Eye, MessageCircle, Share2, Book, Church, Heart, Users, Star, Bookmark } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  author: string;
  publishDate: string;
  readTime: string;
  views: number;
  comments: number;
  category: string;
  tags: string[];
  featured: boolean;
}

const ReligionNewsGrid = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Tümü', icon: Book },
    { id: 'islam', name: 'İslam', icon: Star },
    { id: 'christianity', name: 'Hristiyanlık', icon: Church },
    { id: 'interfaith', name: 'Dinler Arası', icon: Users },
    { id: 'charity', name: 'Hayırseverlik', icon: Heart },
    { id: 'spirituality', name: 'Maneviyat', icon: Bookmark }
  ];

  useEffect(() => {
    const fetchNews = () => {
      // Din haberleri simülasyonu
      const mockNews: NewsItem[] = [
        {
          id: '1',
          title: 'Mevlid Kandili Türkiye Genelinde İhya Ediliyor',
          summary: 'Hz. Peygamber\'in doğum günü olan Mevlid Kandili, tüm cami ve dernek hanelerde düzenlenen programlarla kutlanıyor.',
          imageUrl: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=400&h=300&fit=crop',
          author: 'Dr. Ahmet Kılıç',
          publishDate: '2 saat önce',
          readTime: '4 dk',
          views: 15420,
          comments: 245,
          category: 'islam',
          tags: ['Mevlid Kandili', 'İslam', 'Kutlama'],
          featured: true
        },
        {
          id: '2',
          title: 'Dinler Arası Diyalog Konferansı İstanbul\'da Başladı',
          summary: 'Farklı inançlardan din adamları barış ve hoşgörü temasında bir araya geldi. Üç gün sürecek konferans...',
          imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
          author: 'Prof. Dr. Melek Özkan',
          publishDate: '4 saat önce',
          readTime: '6 dk',
          views: 8932,
          comments: 156,
          category: 'interfaith',
          tags: ['Dinler Arası', 'Diyalog', 'Barış'],
          featured: false
        },
        {
          id: '3',
          title: 'Ramazan Ayı Hazırlıkları Başladı',
          summary: 'Diyanet İşleri Başkanlığı Ramazan ayı için hazırlıklarını tamamladı. İftar programları ve teravih namazları...',
          imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
          author: 'İmam Hasan Demir',
          publishDate: '1 gün önce',
          readTime: '5 dk',
          views: 12567,
          comments: 89,
          category: 'islam',
          tags: ['Ramazan', 'Diyanet', 'İftar'],
          featured: true
        },
        {
          id: '4',
          title: 'Hayırsever İş İnsanı 1000 Aileye Yardım Etti',
          summary: 'Anonim bir hayırsever, ihtiyaç sahibi aileler için büyük bir yardım kampanyası düzenledi...',
          imageUrl: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=300&fit=crop',
          author: 'Zeynep Yılmaz',
          publishDate: '2 gün önce',
          readTime: '3 dk',
          views: 6789,
          comments: 134,
          category: 'charity',
          tags: ['Hayırseverlik', 'Yardım', 'Zekât'],
          featured: false
        },
        {
          id: '5',
          title: 'Noel Kutlamaları Hristiyanlarca İhya Edildi',
          summary: 'İstanbul\'daki kiliseler Noel kutlamaları için özel programlar düzenledi. Barış mesajları verildi...',
          imageUrl: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=400&h=300&fit=crop',
          author: 'Peder Yorgo',
          publishDate: '3 gün önce',
          readTime: '4 dk',
          views: 4567,
          comments: 67,
          category: 'christianity',
          tags: ['Noel', 'Hristiyanlık', 'Kutlama'],
          featured: false
        },
        {
          id: '6',
          title: 'Tasavvuf ve Modern Yaşam Semineri',
          summary: 'Tasavvufi düşüncenin günümüz yaşamına etkilerini konu alan seminer büyük ilgi gördü...',
          imageUrl: 'https://images.unsplash.com/photo-1481833761820-0509d3217039?w=400&h=300&fit=crop',
          author: 'Şeyh Mustafa Bey',
          publishDate: '1 hafta önce',
          readTime: '7 dk',
          views: 3456,
          comments: 78,
          category: 'spirituality',
          tags: ['Tasavvuf', 'Maneviyat', 'Seminer'],
          featured: false
        }
      ];

      setNewsItems(mockNews);
      setLoading(false);
    };

    fetchNews();
  }, []);

  const filteredNews = activeCategory === 'all' 
    ? newsItems 
    : newsItems.filter(item => item.category === activeCategory);

  const featuredNews = newsItems.filter(item => item.featured);
  const regularNews = filteredNews.filter(item => !item.featured);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="flex gap-4 mb-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded-lg w-24"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-96 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Book className="w-6 h-6 text-blue-600" />
          Din Haberleri
        </h2>
        <div className="text-sm text-gray-500">
          {filteredNews.length} haber
        </div>
      </div>

      {/* Kategori Filtreleri */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {category.name}
            </button>
          );
        })}
      </div>

      {/* Öne Çıkan Haberler */}
      {activeCategory === 'all' && featuredNews.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Öne Çıkan Haberler</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {featuredNews.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="relative h-48">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Öne Çıkan
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {item.publishDate}
                    </span>
                    <span>{item.readTime} okuma</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {item.summary}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {item.author}
                    </span>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {item.views.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        {item.comments}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tüm Haberler */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {regularNews.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            <div className="relative h-48">
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover"
              />
              <div className="absolute top-4 right-4">
                <button className="bg-white/90 hover:bg-white rounded-full p-2 transition-colors">
                  <Share2 className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {item.publishDate}
                </span>
                <span>{item.readTime} okuma</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                {item.title}
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-3">
                {item.summary}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {item.tags.slice(0, 2).map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  {item.author}
                </span>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {item.views.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    {item.comments}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredNews.length === 0 && (
        <div className="text-center py-12">
          <Book className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Bu kategoride haber bulunamadı
          </h3>
          <p className="text-gray-500">
            Farklı bir kategori seçmeyi deneyin
          </p>
        </div>
      )}

      {/* Haber İstatistikleri */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {newsItems.reduce((sum, item) => sum + item.views, 0).toLocaleString()}
            </div>
            <div className="text-sm text-blue-700">Toplam Okunma</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {newsItems.length}
            </div>
            <div className="text-sm text-purple-700">Haber Sayısı</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {newsItems.reduce((sum, item) => sum + item.comments, 0).toLocaleString()}
            </div>
            <div className="text-sm text-green-700">Toplam Yorum</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {featuredNews.length}
            </div>
            <div className="text-sm text-orange-700">Öne Çıkan</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReligionNewsGrid;
