'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, TreePine, Eye, Leaf, Clock, Globe, Droplets, Wind, Zap } from 'lucide-react';

interface EnvironmentVideo {
  id: string;
  title: string;
  description: string;
  location: string;
  category: string;
  thumbnail: string;
  duration: string;
  views: number;
  likes: number;
  publishedAt: string;
  isLive?: boolean;
  isDocumentary?: boolean;
  source: string;
  impactLevel: 'low' | 'medium' | 'high';
}

const EnvironmentVideoPanel = () => {
  const [videos, setVideos] = useState<EnvironmentVideo[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<EnvironmentVideo | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Tümü');

  const categories = ['Tümü', 'Belgesel', 'Canlı İzleme', 'Eğitim', 'Doğa', 'Teknoloji', 'Haberler'];

  useEffect(() => {
    const fetchVideos = () => {
      const mockVideos: EnvironmentVideo[] = [
        {
          id: '1',
          title: 'Türkiye\'nin En Büyük Güneş Santrali Açılışı',
          description: 'Konya\'da kurulan 1.350 MW kapasiteli güneş enerji santralinin açılış töreni ve teknik detayları.',
          location: 'Konya',
          category: 'Haberler',
          thumbnail: '/api/placeholder/320/180',
          duration: '12:34',
          views: 234567,
          likes: 18943,
          publishedAt: '2024-01-15T10:30:00Z',
          isDocumentary: false,
          source: 'Enerji TV',
          impactLevel: 'high'
        },
        {
          id: '2',
          title: 'Marmara Denizi Canlı İzleme Kamerası',
          description: 'Marmara Denizi\'nin anlık durumu ve deniz salyası takibi için 7/24 canlı yayın.',
          location: 'Marmara Denizi',
          category: 'Canlı İzleme',
          thumbnail: '/api/placeholder/320/180',
          duration: '∞',
          views: 456789,
          likes: 32145,
          publishedAt: '2024-01-15T09:15:00Z',
          isLive: true,
          source: 'Deniz İzleme',
          impactLevel: 'high'
        },
        {
          id: '3',
          title: 'Kapadokya Rüzgar Enerjisi Belgeseli',
          description: 'Nevşehir\'de kurulan rüzgar türbinlerinin çevre üzerindeki olumlu etkilerini anlatan 45 dakikalık belgesel.',
          location: 'Nevşehir',
          category: 'Belgesel',
          thumbnail: '/api/placeholder/320/180',
          duration: '45:22',
          views: 189234,
          likes: 24567,
          publishedAt: '2024-01-15T08:45:00Z',
          isDocumentary: true,
          source: 'Doğa Belgeselleri',
          impactLevel: 'medium'
        },
        {
          id: '4',
          title: 'Plastik Geri Dönüşüm Süreci Eğitimi',
          description: 'Ev atıklarını nasıl doğru şekilde ayrıştıracağınızı öğreten eğitim videosu.',
          location: 'Türkiye',
          category: 'Eğitim',
          thumbnail: '/api/placeholder/320/180',
          duration: '8:17',
          views: 145678,
          likes: 19876,
          publishedAt: '2024-01-15T07:20:00Z',
          source: 'Çevre Eğitimi',
          impactLevel: 'medium'
        },
        {
          id: '5',
          title: 'Toros Dağları Orman Koruma Projesi',
          description: 'Toros Dağları\'nda yürütülen ağaçlandırma ve orman koruma çalışmalarının drone görüntüleri.',
          location: 'Toros Dağları',
          category: 'Doğa',
          thumbnail: '/api/placeholder/320/180',
          duration: '15:43',
          views: 98765,
          likes: 12543,
          publishedAt: '2024-01-15T06:30:00Z',
          isDocumentary: true,
          source: 'Orman Genel Müdürlüğü',
          impactLevel: 'high'
        },
        {
          id: '6',
          title: 'Akıllı Şehir Teknolojileri Fuarı',
          description: 'İstanbul\'da düzenlenen akıllı şehir teknolojileri fuarından öne çıkan çevre dostu inovasyonlar.',
          location: 'İstanbul',
          category: 'Teknoloji',
          thumbnail: '/api/placeholder/320/180',
          duration: '22:11',
          views: 167432,
          likes: 21987,
          publishedAt: '2024-01-15T05:45:00Z',
          source: 'Teknoloji Gündemi',
          impactLevel: 'medium'
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
    if (isPlaying && selectedVideo && !selectedVideo.isLive) {
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
      'Belgesel': TreePine,
      'Canlı İzleme': Eye,
      'Eğitim': Leaf,
      'Doğa': TreePine,
      'Teknoloji': Zap,
      'Haberler': Globe
    };
    return icons[category] || Play;
  };

  const getImpactColor = (impact: string) => {
    const colors: { [key: string]: string } = {
      'high': 'bg-red-500',
      'medium': 'bg-yellow-500',
      'low': 'bg-green-500'
    };
    return colors[impact] || 'bg-gray-500';
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
          <Play className="w-6 h-6 text-green-600" />
          Çevre Videoları
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
                  ? 'bg-green-600 text-white shadow-lg'
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
              <div className="relative aspect-video bg-gradient-to-br from-green-800 to-emerald-900 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20"></div>
                
                {selectedVideo.isLive && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 animate-pulse">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    CANLI
                  </div>
                )}

                {selectedVideo.isDocumentary && (
                  <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    BELGESEL
                  </div>
                )}

                {/* Impact Level Indicator */}
                <div className={`absolute bottom-4 right-4 w-4 h-4 rounded-full ${getImpactColor(selectedVideo.impactLevel)}`}></div>

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
                {!selectedVideo.isLive && (
                  <div className="mb-4">
                    <div className="flex items-center gap-3 text-white text-sm">
                      <span>{formatTime(currentTime)}</span>
                      <div className="flex-1 bg-gray-600 rounded-full h-1 overflow-hidden">
                        <div 
                          className="bg-green-500 h-full transition-all duration-300"
                          style={{ 
                            width: `${(currentTime / (parseInt(selectedVideo.duration.split(':')[0]) * 60 + parseInt(selectedVideo.duration.split(':')[1]))) * 100}%` 
                          }}
                        ></div>
                      </div>
                      <span>{selectedVideo.duration}</span>
                    </div>
                  </div>
                )}

                {/* Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button className="text-white hover:text-green-400 transition-colors">
                      <SkipBack className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="bg-green-600 text-white rounded-full p-2 hover:bg-green-700 transition-colors"
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4 ml-0.5" />
                      )}
                    </button>
                    <button className="text-white hover:text-green-400 transition-colors">
                      <SkipForward className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="text-white hover:text-green-400 transition-colors"
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
                      <TreePine className="w-4 h-4" />
                      <span>{formatViews(selectedVideo.likes)} beğeni</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Globe className="w-4 h-4" />
                      <span>{selectedVideo.location}</span>
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
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="relative w-20 h-12 bg-gradient-to-br from-green-200 to-emerald-300 rounded flex items-center justify-center flex-shrink-0">
                    <Play className="w-4 h-4 text-gray-600" />
                    
                    {video.isLive && (
                      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded">
                        LIVE
                      </div>
                    )}
                    
                    {!video.isLive && (
                      <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                        {video.duration}
                      </div>
                    )}

                    {/* Impact Level Indicator */}
                    <div className={`absolute bottom-1 left-1 w-2 h-2 rounded-full ${getImpactColor(video.impactLevel)}`}></div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-gray-900 line-clamp-2 mb-1">
                      {video.title}
                    </h4>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                      <CategoryIcon className="w-3 h-3" />
                      <span>{video.location}</span>
                      {video.isDocumentary && (
                        <span className="bg-blue-100 text-blue-800 px-1 rounded">BELGESEL</span>
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
          <div className="text-2xl font-bold text-green-600">{filteredVideos.length}</div>
          <div className="text-sm text-gray-600">Video</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">
            {filteredVideos.filter(v => v.isLive).length}
          </div>
          <div className="text-sm text-gray-600">Canlı</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {filteredVideos.filter(v => v.isDocumentary).length}
          </div>
          <div className="text-sm text-gray-600">Belgesel</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {formatViews(filteredVideos.reduce((sum, v) => sum + v.views, 0))}
          </div>
          <div className="text-sm text-gray-600">Toplam İzlenme</div>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentVideoPanel;
