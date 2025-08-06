'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Clock, Eye, MessageCircle, Share2, BookOpen, GraduationCap, School, Users, Award, Brain } from 'lucide-react';

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

const EducationNewsGrid = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Tümü', icon: BookOpen },
    { id: 'universities', name: 'Üniversiteler', icon: GraduationCap },
    { id: 'schools', name: 'Okullar', icon: School },
    { id: 'exams', name: 'Sınavlar', icon: Award },
    { id: 'research', name: 'Araştırma', icon: Brain },
    { id: 'policy', name: 'Eğitim Politikaları', icon: Users }
  ];

  useEffect(() => {
    const fetchNews = () => {
      // Eğitim haberleri simülasyonu
      const mockNews: NewsItem[] = [
        {
          id: '1',
          title: '2025 YKS Başvuruları Başladı: Kritik Tarihler ve Yenilikler',
          summary: 'Yükseköğretim Kurumları Sınavı başvuru süreci başladı. Bu yıl getirilen yenilikler ve önemli tarihler...',
          imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=300&fit=crop',
          author: 'Dr. Ayşe Kaya',
          publishDate: '2 saat önce',
          readTime: '5 dk',
          views: 2834,
          comments: 45,
          category: 'exams',
          tags: ['YKS', 'Sınavlar', 'Başvuru'],
          featured: true
        },
        {
          id: '2',
          title: 'Milli Eğitim Bakanlığı Dijital Dönüşüm Projesini Açıkladı',
          summary: 'Okullarda teknoloji entegrasyonu ve dijital eğitim materyalleri konusunda kapsamlı proje...',
          imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop',
          author: 'Prof. Dr. Mehmet Yılmaz',
          publishDate: '4 saat önce',
          readTime: '7 dk',
          views: 1892,
          comments: 32,
          category: 'policy',
          tags: ['Dijital Eğitim', 'Teknoloji', 'MEB'],
          featured: false
        },
        {
          id: '3',
          title: 'İstanbul Üniversitesi Yeni Araştırma Merkezini Açtı',
          summary: 'Yapay zeka ve makine öğrenmesi alanında kurulan yeni merkez, öğrencilere ve araştırmacılara...',
          imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=300&fit=crop',
          author: 'Doç. Dr. Fatma Öztürk',
          publishDate: '6 saat önce',
          readTime: '4 dk',
          views: 1456,
          comments: 28,
          category: 'universities',
          tags: ['Yapay Zeka', 'Araştırma', 'İstanbul Üniversitesi'],
          featured: false
        },
        {
          id: '4',
          title: 'Özel Okullar İçin Yeni Düzenlemeler Getiriliyor',
          summary: 'Özel eğitim kurumlarının denetimi ve kalite standartları konusunda yeni yasal düzenlemeler...',
          imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=300&fit=crop',
          author: 'Av. Zeynep Demir',
          publishDate: '8 saat önce',
          readTime: '6 dk',
          views: 1234,
          comments: 19,
          category: 'schools',
          tags: ['Özel Okullar', 'Düzenleme', 'Kalite'],
          featured: false
        },
        {
          id: '5',
          title: 'PISA 2024 Sonuçları: Türkiye\'nin Eğitim Performansı',
          summary: 'Uluslararası öğrenci değerlendirme programı sonuçları açıklandı. Türkiye\'nin başarı analizi...',
          imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop',
          author: 'Prof. Dr. Ali Çelik',
          publishDate: '1 gün önce',
          readTime: '8 dk',
          views: 3456,
          comments: 67,
          category: 'research',
          tags: ['PISA', 'Değerlendirme', 'Başarı'],
          featured: true
        },
        {
          id: '6',
          title: 'Uzaktan Eğitimde Yeni Teknolojiler ve Uygulamalar',
          summary: 'Pandemi sonrası uzaktan eğitim deneyimleri ışığında geliştirilen yeni teknolojiler...',
          imageUrl: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=400&h=300&fit=crop',
          author: 'Dr. Murat Koç',
          publishDate: '1 gün önce',
          readTime: '5 dk',
          views: 987,
          comments: 15,
          category: 'policy',
          tags: ['Uzaktan Eğitim', 'Teknoloji', 'İnovasyon'],
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
          <BookOpen className="w-6 h-6 text-blue-600" />
          Eğitim Haberleri
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
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Bu kategoride haber bulunamadı
          </h3>
          <p className="text-gray-500">
            Farklı bir kategori seçmeyi deneyin
          </p>
        </div>
      )}
    </div>
  );
};

export default EducationNewsGrid;
