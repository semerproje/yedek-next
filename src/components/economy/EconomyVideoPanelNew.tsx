"use client";

import { useEffect, useState } from 'react';
import { PlayCircle, Clock, Eye } from 'lucide-react';

interface VideoData {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: number;
  publishedAt: string;
  description: string;
  youtubeId?: string;
}

const EconomyVideoPanel = () => {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock video verileri - YouTube API entegrasyonu için hazır
  const mockVideos: VideoData[] = [
    {
      id: '1',
      title: 'TCMB Faiz Kararı Analizi: Piyasalara Etkisi',
      thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
      duration: '12:45',
      views: 25430,
      publishedAt: '2025-01-28T10:00:00Z',
      description: 'Merkez Bankası\'nın son faiz kararının piyasalar üzerindeki etkilerini değerlendiriyoruz.',
      youtubeId: 'dQw4w9WgXcQ'
    },
    {
      id: '2',
      title: 'Borsa İstanbul Haftalık Değerlendirme',
      thumbnail: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80',
      duration: '8:32',
      views: 18750,
      publishedAt: '2025-01-27T16:30:00Z',
      description: 'Bu haftaki borsa performansı ve gelecek hafta beklentileri.',
      youtubeId: 'dQw4w9WgXcQ'
    },
    {
      id: '3',
      title: 'Döviz Kurları: 2025 Tahminleri',
      thumbnail: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&w=800&q=80',
      duration: '15:20',
      views: 31200,
      publishedAt: '2025-01-26T14:15:00Z',
      description: '2025 yılı döviz kuru beklentileri ve yatırım stratejileri.',
      youtubeId: 'dQw4w9WgXcQ'
    }
  ];

  useEffect(() => {
    // Simüle edilmiş veri yükleme
    const timer = setTimeout(() => {
      setVideos(mockVideos);
      setSelectedVideo(mockVideos[0]);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 gün önce';
    if (diffDays < 7) return `${diffDays} gün önce`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} hafta önce`;
    return `${Math.floor(diffDays / 30)} ay önce`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ekonomi Videoları</h3>
        <div className="space-y-4">
          <div className="animate-pulse">
            <div className="bg-gray-200 h-40 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Ekonomi Videoları</h3>
        <p className="text-sm text-gray-600">Uzman analizleri ve değerlendirmeler</p>
      </div>

      {/* Seçili Video */}
      {selectedVideo && (
        <div className="mb-6">
          <div className="relative group cursor-pointer rounded-lg overflow-hidden">
            <img
              src={selectedVideo.thumbnail}
              alt={selectedVideo.title}
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center group-hover:bg-opacity-50 transition-all">
              <PlayCircle className="h-16 w-16 text-white group-hover:scale-110 transition-transform" />
            </div>
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
              {selectedVideo.duration}
            </div>
          </div>
          
          <div className="mt-3">
            <h4 className="font-semibold text-gray-900 mb-2">{selectedVideo.title}</h4>
            <p className="text-sm text-gray-600 mb-2">{selectedVideo.description}</p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{formatViews(selectedVideo.views)} görüntüleme</span>
              </div>
              <span>{formatDate(selectedVideo.publishedAt)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Video Listesi */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Diğer Videolar</h4>
        {videos.filter(v => v.id !== selectedVideo?.id).map((video) => (
          <div
            key={video.id}
            onClick={() => setSelectedVideo(video)}
            className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div className="relative flex-shrink-0">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-20 h-12 object-cover rounded"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <PlayCircle className="h-4 w-4 text-white" />
              </div>
              <div className="absolute bottom-0 right-0 bg-black bg-opacity-75 text-white text-xs px-1 rounded-tl">
                {video.duration}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h5 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                {video.title}
              </h5>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{formatViews(video.views)}</span>
                </div>
                <span>•</span>
                <span>{formatDate(video.publishedAt)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EconomyVideoPanel;
