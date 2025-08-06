'use client';

import React, { useState, useEffect } from 'react';
import { ExternalLink, User, Calendar, Tag, Bookmark, Share2, Eye, Star, Sparkles, Camera, Heart } from 'lucide-react';

interface MagazineNews {
  id: string;
  title: string;
  content: string;
  celebrity: string;
  category: string;
  publishedAt: string;
  views: number;
  likes: number;
  trending?: boolean;
  exclusive?: boolean;
  imageUrl?: string;
  source: string;
}

const MagazineNewsGrid = () => {
  const [news, setNews] = useState<MagazineNews[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Tümü');

  const categories = [
    'Tümü', 'Ünlüler', 'Moda', 'Aşk & İlişkiler', 'Güzellik', 
    'Kırmızı Halı', 'Scandals', 'Düğün', 'Doğum', 'Müzik'
  ];

  useEffect(() => {
    const fetchMagazineNews = () => {
      const mockNews: MagazineNews[] = [
        {
          id: '1',
          title: 'Hadise\'nin Yeni Albümü Müzik Dünyasında Sürpriz Yaratıyor',
          content: 'Pop yıldızı Hadise, 3 yıl aradan sonra yeni albümü "Kalp Atışı" ile müzik dünyasına dönüyor. Albümün ilk single\'ı sosyal medyada viral oldu.',
          celebrity: 'Hadise',
          category: 'Müzik',
          publishedAt: '2024-01-15T10:30:00Z',
          views: 156789,
          likes: 12450,
          trending: true,
          source: 'Magazin Plus'
        },
        {
          id: '2',
          title: 'Kenan İmirzalıoğlu ve Sinem Kobal Çifti Maldivler\'de Romantik Tatil',
          content: 'Türkiye\'nin sevilen oyuncu çifti Kenan İmirzalıoğlu ve Sinem Kobal, 10. evlilik yıldönümlerini Maldivler\'de kutluyor.',
          celebrity: 'Kenan İmirzalıoğlu & Sinem Kobal',
          category: 'Aşk & İlişkiler',
          publishedAt: '2024-01-15T09:15:00Z',
          views: 89234,
          likes: 8750,
          source: 'Celeb Daily'
        },
        {
          id: '3',
          title: 'Hande Erçel Milano Moda Haftası\'nda Büyüledi',
          content: 'Genç oyuncu Hande Erçel, Milano Moda Haftası\'nda katıldığı defilede tüm dikkatleri üzerine çekti. Giydiği özel tasarım elbise sosyal medyada beğeni topladı.',
          celebrity: 'Hande Erçel',
          category: 'Moda',
          publishedAt: '2024-01-15T08:45:00Z',
          views: 203456,
          likes: 15670,
          trending: true,
          exclusive: true,
          source: 'Fashion Türkiye'
        },
        {
          id: '4',
          title: 'Can Yaman Hollywood\'da Yeni Proje İmzaladı',
          content: 'Uluslararası kariyerine devam eden Can Yaman, Netflix\'in yeni dizisi için anlaştı. Dizi 2024 yaz aylarında çekilmeye başlanacak.',
          celebrity: 'Can Yaman',
          category: 'Ünlüler',
          publishedAt: '2024-01-15T07:20:00Z',
          views: 178923,
          likes: 14230,
          exclusive: true,
          source: 'Hollywood Türk'
        },
        {
          id: '5',
          title: 'Demet Özdemir\'in Gizli Düğün Hazırlıkları',
          content: 'Demet Özdemir ve sevgilisi Oğuzhan Koç\'un gizlice düğün hazırlığı yaptığı iddia ediliyor. Çiftin 2024 bahar aylarında nikah kıyacağı konuşuluyor.',
          celebrity: 'Demet Özdemir',
          category: 'Düğün',
          publishedAt: '2024-01-15T06:30:00Z',
          views: 134567,
          likes: 11890,
          source: 'Celeb News'
        },
        {
          id: '6',
          title: 'Acun Ilıcalı\'nın Yeni TV Şovu Büyük İlgi Görüyor',
          content: 'Medya patronu Acun Ilıcalı\'nın yeni reality şovu "Survivor 2024" için hazırlıklar tamamlandı. Ünlü yarışmacılar Dominik\'e hareket etti.',
          celebrity: 'Acun Ilıcalı',
          category: 'Ünlüler',
          publishedAt: '2024-01-15T05:45:00Z',
          views: 98765,
          likes: 7890,
          source: 'TV Guide TR'
        },
        {
          id: '7',
          title: 'Ebru Şahin\'in Hamilelik Dedikoduları',
          content: 'Genç oyuncu Ebru Şahin, son dönemde çıkan hamilelik dedikodularına sosyal medya hesabından açıklık getirdi.',
          celebrity: 'Ebru Şahin',
          category: 'Doğum',
          publishedAt: '2024-01-15T04:15:00Z',
          views: 167432,
          likes: 13240,
          source: 'Dizi Magazin'
        },
        {
          id: '8',
          title: 'Meryem Uzerli Yeni Güzellik Markası Lansmanında',
          content: 'Meryem Uzerli, kendi güzellik markasını tanıttığı özel etkinlikte konuklarla bir araya geldi. Organik ürün serisi büyük ilgi gördü.',
          celebrity: 'Meryem Uzerli',
          category: 'Güzellik',
          publishedAt: '2024-01-15T03:30:00Z',
          views: 87654,
          likes: 6540,
          trending: true,
          source: 'Beauty Life'
        }
      ];

      // Simulate real-time updates
      const updatedNews = mockNews.map(item => ({
        ...item,
        views: item.views + Math.floor(Math.random() * 100),
        likes: item.likes + Math.floor(Math.random() * 50)
      }));

      setNews(updatedNews);
      setLoading(false);
    };

    fetchMagazineNews();
    const interval = setInterval(fetchMagazineNews, 30000);

    return () => clearInterval(interval);
  }, []);

  const filteredNews = selectedCategory === 'Tümü' 
    ? news 
    : news.filter(item => item.category === selectedCategory);

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Az önce';
    if (diffInHours < 24) return `${diffInHours} saat önce`;
    return `${Math.floor(diffInHours / 24)} gün önce`;
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Ünlüler': 'bg-yellow-100 text-yellow-800',
      'Moda': 'bg-pink-100 text-pink-800',
      'Aşk & İlişkiler': 'bg-red-100 text-red-800',
      'Güzellik': 'bg-purple-100 text-purple-800',
      'Kırmızı Halı': 'bg-orange-100 text-orange-800',
      'Scandals': 'bg-gray-100 text-gray-800',
      'Düğün': 'bg-green-100 text-green-800',
      'Doğum': 'bg-blue-100 text-blue-800',
      'Müzik': 'bg-indigo-100 text-indigo-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 rounded-lg"></div>
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
          <Sparkles className="w-6 h-6 text-pink-600" />
          Magazin Haberleri
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Canlı</span>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-pink-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNews.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
          >
            {/* Image Placeholder */}
            <div className="relative h-48 bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
              <Camera className="w-12 h-12 text-gray-400" />
              {item.trending && (
                <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Trending
                </div>
              )}
              {item.exclusive && (
                <div className="absolute top-3 right-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  Özel Haber
                </div>
              )}
            </div>

            <div className="p-4">
              {/* Category and Celebrity */}
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                  {item.category}
                </span>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <User className="w-3 h-3" />
                  <span>{item.celebrity}</span>
                </div>
              </div>

              {/* Title */}
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-pink-600 transition-colors">
                {item.title}
              </h3>

              {/* Content */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {item.content}
              </p>

              {/* Stats */}
              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{formatViews(item.views)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    <span>{formatViews(item.likes)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{getTimeAgo(item.publishedAt)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-500">{item.source}</span>
                <div className="flex items-center gap-2">
                  <button className="p-1 text-gray-400 hover:text-pink-600 transition-colors">
                    <Bookmark className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show More Button */}
      <div className="mt-8 text-center">
        <button className="bg-pink-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-pink-700 transition-colors">
          Daha Fazla Magazin Haberi
        </button>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-pink-600">{filteredNews.length}</div>
          <div className="text-sm text-gray-600">Aktif Haber</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {filteredNews.filter(n => n.trending).length}
          </div>
          <div className="text-sm text-gray-600">Trending</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {filteredNews.filter(n => n.exclusive).length}
          </div>
          <div className="text-sm text-gray-600">Özel Haber</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-600">
            {new Set(filteredNews.map(n => n.celebrity)).size}
          </div>
          <div className="text-sm text-gray-600">Ünlü</div>
        </div>
      </div>
    </div>
  );
};

export default MagazineNewsGrid;
