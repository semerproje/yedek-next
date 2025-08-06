'use client';

import React, { useState, useEffect } from 'react';
import { Play, Clock, Users, ThumbsUp, Eye, Palette, Music, Camera, BookOpen, Theater } from 'lucide-react';

interface CultureVideo {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  viewCount: string;
  likeCount: string;
  uploadTime: string;
  author: string;
  authorTitle: string;
  category: string;
  isLive: boolean;
  quality: '4K' | 'HD' | 'SD';
}

const CultureVideoPanel = () => {
  const [videos, setVideos] = useState<CultureVideo[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', name: 'Tüm Videolar', icon: Palette },
    { id: 'art', name: 'Sanat', icon: Camera },
    { id: 'music', name: 'Müzik', icon: Music },
    { id: 'literature', name: 'Edebiyat', icon: BookOpen },
    { id: 'theater', name: 'Tiyatro', icon: Theater }
  ];

  useEffect(() => {
    const fetchVideos = () => {
      const mockVideos: CultureVideo[] = [
        {
          id: 1,
          title: 'İstanbul Bienali 2025: Çağdaş Sanatın Kalbi',
          description: 'Dünya çapında sanatçıların eserlerinin sergilendiği bienalden özel görüntüler',
          thumbnail: '/assets/video-culture1.jpg',
          duration: '15:42',
          viewCount: '89.2K',
          likeCount: '3.4K',
          uploadTime: '1 gün önce',
          author: 'Kültür TV',
          authorTitle: 'Sanat Editörü',
          category: 'art',
          isLive: false,
          quality: '4K'
        },
        {
          id: 2,
          title: 'CANLI: Rock\'n Coke Festival 2025 Ana Sahne',
          description: 'Türkiye\'nin en büyük müzik festivalinden canlı yayın',
          thumbnail: '/assets/video-culture2.jpg',
          duration: 'CANLI',
          viewCount: '12.8K',
          likeCount: '1.2K',
          uploadTime: 'Şimdi',
          author: 'Müzik Dünyası',
          authorTitle: 'Canlı Yayın',
          category: 'music',
          isLive: true,
          quality: 'HD'
        },
        {
          id: 3,
          title: 'Orhan Pamuk ile Edebiyat Üzerine Söyleşi',
          description: 'Nobel ödüllü yazarımızdan edebiyat dünyasına dair özel açıklamalar',
          thumbnail: '/assets/video-culture3.jpg',
          duration: '28:34',
          viewCount: '156.7K',
          likeCount: '8.9K',
          uploadTime: '3 gün önce',
          author: 'Kitap Programı',
          authorTitle: 'Edebiyat Uzmanı',
          category: 'literature',
          isLive: false,
          quality: 'HD'
        },
        {
          id: 4,
          title: 'Devlet Tiyatroları: Hamlet Prova Görüntüleri',
          description: 'Shakespeare\'in ölümsüz eseri Hamlet\'in yeni uyarlaması sahne arkası',
          thumbnail: '/assets/video-culture4.jpg',
          duration: '12:18',
          viewCount: '34.5K',
          likeCount: '1.8K',
          uploadTime: '2 gün önce',
          author: 'Tiyatro Dünyası',
          authorTitle: 'Sahne Sanatları',
          category: 'theater',
          isLive: false,
          quality: 'HD'
        },
        {
          id: 5,
          title: 'Çağdaş Türk Resmi: 100 Yılın Özeti',
          description: 'Cumhuriyet dönemi Türk resminin gelişimi ve önemli eserleri',
          thumbnail: '/assets/video-culture5.jpg',
          duration: '22:56',
          viewCount: '67.3K',
          likeCount: '4.2K',
          uploadTime: '1 hafta önce',
          author: 'Sanat Tarihi',
          authorTitle: 'Sanat Tarihçisi',
          category: 'art',
          isLive: false,
          quality: '4K'
        },
        {
          id: 6,
          title: 'Klasik Müzik: İstanbul Filarmoni Konseri',
          description: 'Cemal Reşit Rey Konser Salonu\'ndan unutulmaz bir akşam',
          thumbnail: '/assets/video-culture6.jpg',
          duration: '45:12',
          viewCount: '78.9K',
          likeCount: '5.6K',
          uploadTime: '4 gün önce',
          author: 'Klasik Müzik TV',
          authorTitle: 'Müzik Prodüktörü',
          category: 'music',
          isLive: false,
          quality: '4K'
        }
      ];

      setVideos(mockVideos);
      setLoading(false);
    };

    fetchVideos();
    const interval = setInterval(fetchVideos, 30000);

    return () => clearInterval(interval);
  }, []);

  const filteredVideos = selectedCategory === 'all' 
    ? videos 
    : videos.filter(video => video.category === selectedCategory);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="h-40 bg-gray-200 rounded-lg"></div>
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
            <Play className="w-6 h-6 text-purple-600" />
            Kültür Videoları
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span>{videos.filter(v => v.isLive).length} canlı yayın</span>
            </div>
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
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            className="group cursor-pointer bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-purple-300"
          >
            <div className="relative">
              <div className="relative h-40 bg-gray-200 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-purple-600 rounded-full p-3 shadow-lg">
                    <Play className="w-6 h-6 text-white fill-current" />
                  </div>
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-2 right-2 z-20">
                  {video.isLive ? (
                    <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                      CANLI
                    </div>
                  ) : (
                    <div className="bg-black/70 text-white px-2 py-1 rounded text-xs">
                      {video.duration}
                    </div>
                  )}
                </div>

                {/* Quality Badge */}
                <div className="absolute top-2 right-2 z-20">
                  <div className="bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
                    {video.quality}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                {video.title}
              </h3>

              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {video.description}
              </p>

              <div className="flex items-center gap-2 mb-3">
                <div className="text-sm font-medium text-gray-900">
                  {video.author}
                </div>
                <div className="text-xs text-gray-500">
                  {video.authorTitle}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {video.viewCount}
                  </div>
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="w-3 h-3" />
                    {video.likeCount}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {video.uploadTime}
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100">
                <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded">
                  {categories.find(cat => cat.id === video.category)?.name || 'Genel'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredVideos.length === 0 && (
        <div className="text-center py-12">
          <Play className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Bu kategoride video bulunmuyor.</p>
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div className="bg-red-50 rounded-lg p-3">
            <div className="text-xl font-bold text-red-600 mb-1">
              {videos.filter(v => v.isLive).length}
            </div>
            <div className="text-xs text-gray-600">Canlı Yayın</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-xl font-bold text-blue-600 mb-1">
              {videos.filter(v => v.quality === '4K').length}
            </div>
            <div className="text-xs text-gray-600">4K Video</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3">
            <div className="text-xl font-bold text-purple-600 mb-1">
              {videos.reduce((sum, v) => sum + parseInt(v.viewCount.replace('K', '000').replace('.', '')), 0) / 1000}K
            </div>
            <div className="text-xs text-gray-600">Toplam İzlenme</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-xl font-bold text-green-600 mb-1">
              {categories.length - 1}
            </div>
            <div className="text-xs text-gray-600">Kategori</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CultureVideoPanel;
