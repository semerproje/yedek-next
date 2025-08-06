'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Play, 
  Clock, 
  Eye, 
  ThumbsUp, 
  Share2, 
  BookOpen, 
  GraduationCap, 
  Users, 
  Star,
  TrendingUp,
  Calendar,
  User,
  PlayCircle
} from 'lucide-react';

interface VideoContent {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  duration: string;
  views: number;
  likes: number;
  publishDate: string;
  channel: string;
  category: string;
  featured?: boolean;
  live?: boolean;
}

const EducationVideoPanel = () => {
  const [videos, setVideos] = useState<VideoContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Tümü', icon: BookOpen },
    { id: 'university', name: 'Üniversite', icon: GraduationCap },
    { id: 'exam', name: 'Sınavlar', icon: Star },
    { id: 'conference', name: 'Konferans', icon: Users },
    { id: 'live', name: 'Canlı', icon: PlayCircle }
  ];

  useEffect(() => {
    const fetchVideos = () => {
      // Eğitim videolarını simüle et
      const mockVideos: VideoContent[] = [
        {
          id: '1',
          title: 'YKS 2025 Başvuru Süreci: Detaylı Rehber',
          description: 'YKS başvuru sürecinde dikkat edilmesi gereken tüm detaylar ve yenilikler.',
          thumbnailUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=225&fit=crop',
          duration: '18:42',
          views: 125420,
          likes: 8932,
          publishDate: '2 saat önce',
          channel: 'Eğitim Bakanlığı',
          category: 'exam',
          featured: true,
          live: false
        },
        {
          id: '2',
          title: 'Dijital Eğitim Dönüşümü Canlı Yayını',
          description: 'Okullarda teknoloji entegrasyonu ve gelecek vizyonu üzerine uzman görüşleri.',
          thumbnailUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=225&fit=crop',
          duration: 'CANLI',
          views: 15678,
          likes: 2341,
          publishDate: 'Şimdi canlı',
          channel: 'TRT Okul',
          category: 'live',
          featured: false,
          live: true
        },
        {
          id: '3',
          title: 'İstanbul Üniversitesi Tanıtım Günleri',
          description: 'Bölüm tanıtımları, kampüs turu ve öğrenci deneyimleri.',
          thumbnailUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=225&fit=crop',
          duration: '32:15',
          views: 89234,
          likes: 5678,
          publishDate: '1 gün önce',
          channel: 'İstanbul Üniversitesi',
          category: 'university',
          featured: false,
          live: false
        },
        {
          id: '4',
          title: 'Özel Eğitim Konferansı 2025',
          description: 'Özel gereksinimli öğrenciler için eğitim yöntemleri ve yenilikçi yaklaşımlar.',
          thumbnailUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=225&fit=crop',
          duration: '45:33',
          views: 34567,
          likes: 2890,
          publishDate: '2 gün önce',
          channel: 'Özel Eğitim Derneği',
          category: 'conference',
          featured: false,
          live: false
        },
        {
          id: '5',
          title: 'PISA 2024 Sonuçları Değerlendirmesi',
          description: 'Türkiye\'nin PISA performansı ve gelecek stratejileri üzerine analiz.',
          thumbnailUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=225&fit=crop',
          duration: '28:07',
          views: 67890,
          likes: 4321,
          publishDate: '3 gün önce',
          channel: 'Eğitim Araştırmaları',
          category: 'exam',
          featured: true,
          live: false
        },
        {
          id: '6',
          title: 'Meslek Lisesi Robotik Yarışması',
          description: 'Türkiye geneli meslek lisesi robotik yarışması final müsabakaları.',
          thumbnailUrl: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=400&h=225&fit=crop',
          duration: '1:12:45',
          views: 23456,
          likes: 1876,
          publishDate: '1 hafta önce',
          channel: 'MEB Meslek Eğitimi',
          category: 'conference',
          featured: false,
          live: false
        }
      ];

      setVideos(mockVideos);
      setLoading(false);
    };

    fetchVideos();
  }, []);

  const filteredVideos = activeCategory === 'all' 
    ? videos 
    : videos.filter(video => video.category === activeCategory);

  const featuredVideos = filteredVideos.filter(video => video.featured);
  const regularVideos = filteredVideos.filter(video => !video.featured);
  const liveVideos = videos.filter(video => video.live);

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const formatLikes = (likes: number) => {
    if (likes >= 1000) {
      return `${(likes / 1000).toFixed(1)}K`;
    }
    return likes.toString();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-32 h-20 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Play className="w-6 h-6 text-red-600" />
          Eğitim Videoları
        </h2>
        <div className="text-sm text-gray-500">
          {filteredVideos.length} video
        </div>
      </div>

      {/* Kategori Filtreleri */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeCategory === category.id
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {category.name}
            </button>
          );
        })}
      </div>

      {/* Canlı Yayınlar */}
      {liveVideos.length > 0 && activeCategory === 'all' && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            Canlı Yayınlar
          </h3>
          <div className="space-y-4">
            {liveVideos.map((video) => (
              <div
                key={video.id}
                className="flex gap-4 p-4 bg-red-50 rounded-lg border border-red-200"
              >
                <div className="relative flex-shrink-0">
                  <Image
                    src={video.thumbnailUrl}
                    alt={video.title}
                    width={160}
                    height={90}
                    className="rounded-lg object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-red-600 text-white rounded-full p-3 hover:bg-red-700 transition-colors cursor-pointer">
                      <Play className="w-6 h-6 fill-current" />
                    </div>
                  </div>
                  <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">
                    CANLI
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {video.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {video.channel}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {formatViews(video.views)} izlenme
                    </span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="w-4 h-4" />
                      {formatLikes(video.likes)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Öne Çıkan Videolar */}
      {featuredVideos.length > 0 && activeCategory === 'all' && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            Öne Çıkan Videolar
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredVideos.map((video) => (
              <div
                key={video.id}
                className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative">
                  <Image
                    src={video.thumbnailUrl}
                    alt={video.title}
                    width={400}
                    height={225}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/20">
                    <div className="bg-white/90 text-gray-900 rounded-full p-3 hover:bg-white transition-colors cursor-pointer">
                      <Play className="w-8 h-8 fill-current" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                    {video.duration}
                  </div>
                  <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded text-xs font-medium">
                    Öne Çıkan
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {video.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{video.channel}</span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {formatViews(video.views)}
                      </span>
                      <button className="hover:text-gray-700 transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tüm Videolar */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {regularVideos.map((video) => (
          <div
            key={video.id}
            className="flex gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div className="relative flex-shrink-0">
              <Image
                src={video.thumbnailUrl}
                alt={video.title}
                width={120}
                height={68}
                className="rounded-lg object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/20 rounded-lg">
                <div className="bg-white/90 text-gray-900 rounded-full p-2 hover:bg-white transition-colors">
                  <Play className="w-4 h-4 fill-current" />
                </div>
              </div>
              <div className="absolute bottom-1 right-1 bg-black/70 text-white px-1 py-0.5 rounded text-xs">
                {video.duration}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 text-sm">
                {video.title}
              </h3>
              <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                {video.description}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {video.channel}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {video.publishDate}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {formatViews(video.views)}
                  </span>
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="w-3 h-3" />
                    {formatLikes(video.likes)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredVideos.length === 0 && (
        <div className="text-center py-8">
          <Play className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Bu kategoride video bulunamadı
          </h3>
          <p className="text-gray-500">
            Farklı bir kategori seçmeyi deneyin
          </p>
        </div>
      )}

      {/* Video İstatistikleri */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xl font-bold text-red-600">
              {videos.reduce((sum, video) => sum + video.views, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">Toplam İzlenme</div>
          </div>
          <div>
            <div className="text-xl font-bold text-blue-600">
              {videos.length}
            </div>
            <div className="text-sm text-gray-500">Video Sayısı</div>
          </div>
          <div>
            <div className="text-xl font-bold text-green-600">
              {videos.reduce((sum, video) => sum + video.likes, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">Toplam Beğeni</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationVideoPanel;
