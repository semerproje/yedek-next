"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Play, Clock, Eye, Globe } from 'lucide-react';

interface WorldVideo {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: string;
  publishDate: string;
  category: string;
  country: string;
  isLive?: boolean;
}

const WorldVideoPanelNew = () => {
  const [videos, setVideos] = useState<WorldVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  useEffect(() => {
    // Simüle edilmiş dünya video verileri
    const mockWorldVideos: WorldVideo[] = [
      {
        id: '1',
        title: 'G20 Zirvesi Canlı Yayını',
        thumbnail: 'https://images.unsplash.com/photo-1541872705-1f73c6400ec9?auto=format&fit=crop&w=400&q=80',
        duration: 'CANLI',
        views: '125K',
        publishDate: '2 saat önce',
        category: 'Diplomasi',
        country: 'Hindistan',
        isLive: true
      },
      {
        id: '2',
        title: 'AB Enerji Krizine Çözüm Arayışları',
        thumbnail: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=400&q=80',
        duration: '12:34',
        views: '89K',
        publishDate: '5 saat önce',
        category: 'Enerji',
        country: 'Belçika'
      },
      {
        id: '3',
        title: 'Çin-ABD Ticaret Görüşmeleri Analizi',
        thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80',
        duration: '8:45',
        views: '156K',
        publishDate: '1 gün önce',
        category: 'Ekonomi',
        country: 'ABD'
      },
      {
        id: '4',
        title: 'Afrika Birliği Barış Girişimi',
        thumbnail: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&w=400&q=80',
        duration: '15:22',
        views: '67K',
        publishDate: '1 gün önce',
        category: 'Barış',
        country: 'Etiyopya'
      },
      {
        id: '5',
        title: 'Latin Amerika Demokrasi Raporu',
        thumbnail: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=400&q=80',
        duration: '6:18',
        views: '43K',
        publishDate: '2 gün önce',
        category: 'Politika',
        country: 'Brezilya'
      },
      {
        id: '6',
        title: 'Asya-Pasifik Güvenlik Zirvesi',
        thumbnail: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?auto=format&fit=crop&w=400&q=80',
        duration: '11:05',
        views: '92K',
        publishDate: '3 gün önce',
        category: 'Güvenlik',
        country: 'Singapur'
      },
      {
        id: '7',
        title: 'Küresel İklim Değişikliği Raporu',
        thumbnail: 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e5?auto=format&fit=crop&w=400&q=80',
        duration: '20:15',
        views: '234K',
        publishDate: '4 gün önce',
        category: 'Çevre',
        country: 'İsveç'
      },
      {
        id: '8',
        title: 'BM Genel Kurulu Özel Toplantısı',
        thumbnail: 'https://images.unsplash.com/photo-1541872705-1f73c6400ec9?auto=format&fit=crop&w=400&q=80',
        duration: '45:30',
        views: '189K',
        publishDate: '1 hafta önce',
        category: 'Diplomasi',
        country: 'ABD'
      }
    ];

    setTimeout(() => {
      setVideos(mockWorldVideos);
      setLoading(false);
    }, 1000);
  }, []);

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Diplomasi': 'bg-blue-100 text-blue-800',
      'Enerji': 'bg-green-100 text-green-800',
      'Ekonomi': 'bg-purple-100 text-purple-800',
      'Barış': 'bg-orange-100 text-orange-800',
      'Politika': 'bg-indigo-100 text-indigo-800',
      'Güvenlik': 'bg-red-100 text-red-800',
      'Çevre': 'bg-emerald-100 text-emerald-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-20 h-14 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">🎥 Dünya Videoları</h2>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-500">Canlı</span>
        </div>
      </div>

      <div className="space-y-4">
        {videos.slice(0, 6).map((video) => (
          <div
            key={video.id}
            className={`group cursor-pointer p-3 rounded-lg transition-colors ${
              selectedVideo === video.id ? 'bg-blue-50' : 'hover:bg-gray-50'
            }`}
            onClick={() => setSelectedVideo(video.id)}
          >
            <div className="flex gap-3">
              {/* Video Thumbnail */}
              <div className="relative w-20 h-14 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-4 h-4 text-white" />
                </div>
                <div className="absolute bottom-1 right-1">
                  {video.isLive ? (
                    <span className="bg-red-600 text-white text-xs px-1 rounded">CANLI</span>
                  ) : (
                    <span className="bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                      {video.duration}
                    </span>
                  )}
                </div>
              </div>

              {/* Video Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {video.title}
                </h3>
                
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getCategoryColor(video.category)}`}>
                      {video.category}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>{video.views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{video.publishDate}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Globe className="w-3 h-3" />
                    <span>{video.country}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Daha Fazla Video Linki */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <button className="w-full text-center text-blue-600 hover:text-blue-700 text-sm font-medium py-2 hover:bg-blue-50 rounded-lg transition-colors">
          Tüm Videoları Görüntüle →
        </button>
      </div>

      {/* Video İstatistikleri */}
      <div className="mt-4 grid grid-cols-2 gap-4 text-center">
        <div>
          <div className="text-lg font-bold text-gray-900">
            {videos.filter(v => v.isLive).length}
          </div>
          <div className="text-xs text-gray-500">Canlı Yayın</div>
        </div>
        <div>
          <div className="text-lg font-bold text-gray-900">
            {videos.length}
          </div>
          <div className="text-xs text-gray-500">Toplam Video</div>
        </div>
      </div>
    </div>
  );
};

export default WorldVideoPanelNew;
