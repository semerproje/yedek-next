'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Star, Eye, Heart, Clock, Camera, Music, Mic } from 'lucide-react';

interface MagazineVideo {
  id: string;
  title: string;
  description: string;
  celebrity: string;
  category: string;
  thumbnail: string;
  duration: string;
  views: number;
  likes: number;
  publishedAt: string;
  isLive?: boolean;
  isExclusive?: boolean;
  source: string;
}

const MagazineVideoPanel = () => {
  const [videos, setVideos] = useState<MagazineVideo[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<MagazineVideo | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Tümü');

  const categories = ['Tümü', 'Röportaj', 'Kırmızı Halı', 'Backstage', 'Müzik', 'Moda', 'Canlı Yayın'];

  useEffect(() => {
    const fetchVideos = () => {
      const mockVideos: MagazineVideo[] = [
        {
          id: '1',
          title: 'Hadise Özel Röportajı: Yeni Albüm Sürprizi',
          description: 'Pop yıldızı Hadise, yeni albümü "Kalp Atışı" hakkında özel açıklamalar yapıyor.',
          celebrity: 'Hadise',
          category: 'Röportaj',
          thumbnail: '/api/placeholder/320/180',
          duration: '8:42',
          views: 234567,
          likes: 18943,
          publishedAt: '2024-01-15T10:30:00Z',
          isExclusive: true,
          source: 'Magazin TV'
        },
        {
          id: '2',
          title: 'Can Yaman Hollywood\'da: Set Görüntüleri',
          description: 'Can Yaman\'ın Netflix projesi setinden özel görüntüler ve röportaj.',
          celebrity: 'Can Yaman',
          category: 'Backstage',
          thumbnail: '/api/placeholder/320/180',
          duration: '12:15',
          views: 456789,
          likes: 32145,
          publishedAt: '2024-01-15T09:15:00Z',
          source: 'Hollywood News TR'
        },
        {
          id: '3',
          title: 'Hande Erçel Milano Moda Haftası Canlı',
          description: 'Hande Erçel Milano Moda Haftası\'ndan canlı yayın ve defileler.',
          celebrity: 'Hande Erçel',
          category: 'Moda',
          thumbnail: '/api/placeholder/320/180',
          duration: '25:33',
          views: 189234,
          likes: 24567,
          publishedAt: '2024-01-15T08:45:00Z',
          isLive: true,
          source: 'Fashion TV'
        },
        {
          id: '4',
          title: 'Demet Özdemir Düğün Hazırlıkları',
          description: 'Demet Özdemir düğün hazırlıkları hakkında özel açıklamalar.',
          celebrity: 'Demet Özdemir',
          category: 'Röportaj',
          thumbnail: '/api/placeholder/320/180',
          duration: '6:28',
          views: 145678,
          likes: 19876,
          publishedAt: '2024-01-15T07:20:00Z',
          source: 'Celeb News'
        },
        {
          id: '5',
          title: 'Kenan İmirzalıoğlu Kırmızı Halı Momentleri',
          description: 'Kenan İmirzalıoğlu\'nun en unutulmaz kırmızı halı anları.',
          celebrity: 'Kenan İmirzalıoğlu',
          category: 'Kırmızı Halı',
          thumbnail: '/api/placeholder/320/180',
          duration: '4:51',
          views: 98765,
          likes: 12543,
          publishedAt: '2024-01-15T06:30:00Z',
          source: 'Red Carpet TR'
        },
        {
          id: '6',
          title: 'Ebru Şahin Canlı Yayın: Hayranlarla Sohbet',
          description: 'Ebru Şahin Instagram canlı yayınında hayranlarının sorularını yanıtlıyor.',
          celebrity: 'Ebru Şahin',
          category: 'Canlı Yayın',
          thumbnail: '/api/placeholder/320/180',
          duration: '18:14',
          views: 167432,
          likes: 21987,
          publishedAt: '2024-01-15T05:45:00Z',
          isLive: true,
          source: 'Instagram Live'
        }
      ];

      // Simulate real-time view updates
      const updatedVideos = mockVideos.map(video => ({
        ...video,
        views: video.views + Math.floor(Math.random() * 100),
        likes: video.likes + Math.floor(Math.random() * 50)
      }));

      setVideos(updatedVideos);
      if (!selectedVideo && updatedVideos.length > 0) {
        setSelectedVideo(updatedVideos[0]);
      }
      setLoading(false);
    };

    fetchVideos();
    const interval = setInterval(fetchVideos, 30000);

    return () => clearInterval(interval);
  }, [selectedVideo]);

  // Simulate video progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && selectedVideo) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const maxTime = parseInt(selectedVideo.duration.split(':')[0]) * 60 + 
                         parseInt(selectedVideo.duration.split(':')[1]);
          if (prev >= maxTime) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, selectedVideo]);

  const filteredVideos = selectedCategory === 'Tümü' 
    ? videos 
    : videos.filter(video => video.category === selectedCategory);

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Az önce';
    if (diffInHours < 24) return `${diffInHours} saat önce`;
    return `${Math.floor(diffInHours / 24)} gün önce`;
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: any } = {
      'Röportaj': Mic,
      'Kırmızı Halı': Star,
      'Backstage': Camera,
      'Müzik': Music,
      'Moda': Star,
      'Canlı Yayın': Play
    };
    return icons[category] || Play;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-80 bg-gray-200 rounded-lg"></div>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Play className="w-6 h-6 text-red-600" />
          Magazin Videoları
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
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
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Video Player */}
        <div className="lg:col-span-2">
          {selectedVideo && (
            <div className="bg-black rounded-lg overflow-hidden">
              {/* Video Player */}
              <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-black flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-pink-500/20"></div>
                
                {selectedVideo.isLive && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 animate-pulse">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    CANLI
                  </div>
                )}

                {selectedVideo.isExclusive && (
                  <div className="absolute top-4 right-4 bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold">
                    ÖZEL
                  </div>
                )}

                {/* Play Button */}
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="bg-white/20 backdrop-blur-sm rounded-full p-6 hover:bg-white/30 transition-all duration-300 group"
                >
                  {isPlaying ? (
                    <Pause className="w-12 h-12 text-white" />
                  ) : (
                    <Play className="w-12 h-12 text-white ml-1" />
                  )}
                </button>
              </div>

              {/* Video Controls */}
              <div className="bg-black p-4">
                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center gap-3 text-white text-sm">
                    <span>{formatTime(currentTime)}</span>
                    <div className="flex-1 bg-gray-600 rounded-full h-1 overflow-hidden">
                      <div 
                        className="bg-red-500 h-full transition-all duration-300"
                        style={{ 
                          width: `${(currentTime / (parseInt(selectedVideo.duration.split(':')[0]) * 60 + parseInt(selectedVideo.duration.split(':')[1]))) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <span>{selectedVideo.duration}</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button className="text-white hover:text-red-400 transition-colors">
                      <SkipBack className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="bg-red-600 text-white rounded-full p-2 hover:bg-red-700 transition-colors"
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4 ml-0.5" />
                      )}
                    </button>
                    <button className="text-white hover:text-red-400 transition-colors">
                      <SkipForward className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="text-white hover:text-red-400 transition-colors"
                    >
                      {isMuted ? (
                        <VolumeX className="w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Video Info */}
              <div className="bg-white p-4">
                <h3 className="font-bold text-lg text-gray-900 mb-2">
                  {selectedVideo.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  {selectedVideo.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{formatViews(selectedVideo.views)} görüntüleme</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span>{formatViews(selectedVideo.likes)} beğeni</span>
                    </div>
                  </div>
                  <span>{getTimeAgo(selectedVideo.publishedAt)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Video List */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Video Listesi</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredVideos.map((video) => {
              const CategoryIcon = getCategoryIcon(video.category);
              
              return (
                <div
                  key={video.id}
                  onClick={() => setSelectedVideo(video)}
                  className={`flex gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedVideo?.id === video.id
                      ? 'bg-red-50 border border-red-200'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="relative w-20 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded flex items-center justify-center flex-shrink-0">
                    <Play className="w-4 h-4 text-gray-500" />
                    
                    {video.isLive && (
                      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded">
                        LIVE
                      </div>
                    )}
                    
                    <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                      {video.duration}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-gray-900 line-clamp-2 mb-1">
                      {video.title}
                    </h4>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                      <CategoryIcon className="w-3 h-3" />
                      <span>{video.celebrity}</span>
                      {video.isExclusive && (
                        <span className="bg-yellow-100 text-yellow-800 px-1 rounded">ÖZEL</span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>{formatViews(video.views)} görüntüleme</span>
                      <span>{getTimeAgo(video.publishedAt)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Video Stats */}
      <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{filteredVideos.length}</div>
          <div className="text-sm text-gray-600">Video</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {filteredVideos.filter(v => v.isLive).length}
          </div>
          <div className="text-sm text-gray-600">Canlı</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {filteredVideos.filter(v => v.isExclusive).length}
          </div>
          <div className="text-sm text-gray-600">Özel</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {formatViews(filteredVideos.reduce((sum, v) => sum + v.views, 0))}
          </div>
          <div className="text-sm text-gray-600">Toplam İzlenme</div>
        </div>
      </div>
    </div>
  );
};

export default MagazineVideoPanel;
