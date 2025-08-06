'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Users, Clock, Eye, Crown } from 'lucide-react';

interface PoliticsVideo {
  id: string;
  title: string;
  description: string;
  category: 'live' | 'debate' | 'speech' | 'interview' | 'analysis' | 'documentary';
  duration: string;
  views: number;
  timestamp: string;
  thumbnail: string;
  isLive: boolean;
  speaker?: string;
  party?: string;
  importance: 'low' | 'medium' | 'high' | 'critical';
}

const PoliticsVideoPanel = () => {
  const [videos, setVideos] = useState<PoliticsVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPlaying, setCurrentPlaying] = useState<string | null>(null);
  const [muted, setMuted] = useState(true);

  const categories = [
    { id: 'all', name: 'Tümü', color: 'blue' },
    { id: 'live', name: 'Canlı', color: 'red' },
    { id: 'debate', name: 'Tartışma', color: 'purple' },
    { id: 'speech', name: 'Konuşma', color: 'green' },
    { id: 'interview', name: 'Röportaj', color: 'orange' },
    { id: 'analysis', name: 'Analiz', color: 'indigo' },
    { id: 'documentary', name: 'Belgesel', color: 'teal' },
  ];

  useEffect(() => {
    const fetchVideos = () => {
      const mockVideos: PoliticsVideo[] = [
        {
          id: '1',
          title: 'Meclis Genel Kurulu Canlı Yayını',
          description: 'Ekonomi paketi görüşmeleri devam ediyor',
          category: 'live',
          duration: 'CANLI',
          views: 45234,
          timestamp: 'Şu anda',
          thumbnail: '/api/placeholder/300/200',
          isLive: true,
          speaker: 'Meclis Başkanı',
          party: 'TBMM',
          importance: 'critical'
        },
        {
          id: '2',
          title: 'Cumhurbaşkanı Haftalık Değerlendirme',
          description: 'Güncel siyasi gelişmeler ve hükümet politikaları',
          category: 'speech',
          duration: '42:15',
          views: 128945,
          timestamp: '2 saat önce',
          thumbnail: '/api/placeholder/300/200',
          isLive: false,
          speaker: 'Cumhurbaşkanı',
          party: 'Hükümet',
          importance: 'high'
        },
        {
          id: '3',
          title: 'Parti Liderleri Televizyon Tartışması',
          description: 'Muhalefet liderleri ekonomi politikalarını tartışıyor',
          category: 'debate',
          duration: '67:30',
          views: 89567,
          timestamp: '4 saat önce',
          thumbnail: '/api/placeholder/300/200',
          isLive: false,
          speaker: 'Çoklu',
          party: 'Muhalefet',
          importance: 'high'
        },
        {
          id: '4',
          title: 'Dışişleri Bakanı Basın Açıklaması',
          description: 'AB müzakereleri ve dış politika değerlendirmesi',
          category: 'speech',
          duration: '28:45',
          views: 56234,
          timestamp: '6 saat önce',
          thumbnail: '/api/placeholder/300/200',
          isLive: false,
          speaker: 'Dışişleri Bakanı',
          party: 'Hükümet',
          importance: 'medium'
        },
        {
          id: '5',
          title: 'Anayasa Profesörü Röportajı',
          description: 'Yeni anayasa tartışmalarının hukuki boyutu',
          category: 'interview',
          duration: '35:20',
          views: 34567,
          timestamp: '8 saat önce',
          thumbnail: '/api/placeholder/300/200',
          isLive: false,
          speaker: 'Prof. Dr. Anayasa Uzmanı',
          party: 'Akademik',
          importance: 'medium'
        },
        {
          id: '6',
          title: 'Seçim Sistemi Analizi',
          description: 'Uzmanlar yeni seçim yasasını değerlendiriyor',
          category: 'analysis',
          duration: '52:10',
          views: 67890,
          timestamp: '12 saat önce',
          thumbnail: '/api/placeholder/300/200',
          isLive: false,
          speaker: 'Politik Analiz Ekibi',
          party: 'Medya',
          importance: 'high'
        }
      ];

      setVideos(mockVideos);
      setLoading(false);
    };

    fetchVideos();
    const interval = setInterval(fetchVideos, 35000);

    return () => clearInterval(interval);
  }, []);

  const filteredVideos = selectedCategory === 'all' 
    ? videos 
    : videos.filter(video => video.category === selectedCategory);

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getImportanceText = (importance: string) => {
    switch (importance) {
      case 'critical': return 'Kritik';
      case 'high': return 'Önemli';
      case 'medium': return 'Orta';
      case 'low': return 'Düşük';
      default: return 'Belirsiz';
    }
  };

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.color || 'blue';
  };

  const handlePlay = (videoId: string) => {
    setCurrentPlaying(currentPlaying === videoId ? null : videoId);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
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
          <Crown className="w-6 h-6 text-blue-600" />
          Politik Videolar
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Play className="w-4 h-4" />
          <span>{filteredVideos.length} video</span>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => {
          const isSelected = selectedCategory === category.id;
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                isSelected
                  ? `bg-${category.color}-100 text-${category.color}-700 border border-${category.color}-200`
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
              }`}
            >
              {category.name}
            </button>
          );
        })}
      </div>

      {/* Live Video Highlight */}
      {filteredVideos.some(video => video.isLive) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-red-800 font-semibold text-sm uppercase tracking-wide">Canlı Yayın</span>
          </div>
          {filteredVideos.filter(video => video.isLive).map(video => (
            <div key={video.id} className="flex items-center justify-between">
              <div>
                <div className="text-red-700 font-medium">{video.title}</div>
                <div className="text-red-600 text-sm">{video.description}</div>
              </div>
              <button 
                onClick={() => handlePlay(video.id)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                İzle
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Videos List */}
      <div className="space-y-4">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            className="flex gap-4 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300 cursor-pointer group"
          >
            {/* Thumbnail */}
            <div className="relative flex-shrink-0 w-32 h-20 bg-gray-200 rounded-lg overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <Play className="w-8 h-8 text-blue-600" />
              </div>
              
              {/* Duration/Live Badge */}
              <div className={`absolute bottom-2 right-2 px-2 py-1 rounded text-xs font-bold ${
                video.isLive 
                  ? 'bg-red-600 text-white' 
                  : 'bg-black/80 text-white'
              }`}>
                {video.duration}
              </div>

              {/* Play Button Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center">
                <button 
                  onClick={() => handlePlay(video.id)}
                  className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white"
                >
                  {currentPlaying === video.id ? (
                    <Pause className="w-5 h-5 text-gray-700" />
                  ) : (
                    <Play className="w-5 h-5 text-gray-700 ml-0.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {video.title}
                </h3>
                <div className={`px-2 py-1 rounded-full text-xs font-medium border flex-shrink-0 ml-2 ${getImportanceColor(video.importance)}`}>
                  {getImportanceText(video.importance)}
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {video.description}
              </p>

              {/* Speaker & Party */}
              <div className="flex items-center gap-3 mb-3">
                {video.speaker && (
                  <span className="text-sm font-medium text-gray-700">
                    {video.speaker}
                  </span>
                )}
                {video.party && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${getCategoryColor(video.category)}-100 text-${getCategoryColor(video.category)}-700 border border-${getCategoryColor(video.category)}-200`}>
                    {video.party}
                  </span>
                )}
              </div>

              {/* Meta Info */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{video.views.toLocaleString()} görüntüleme</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{video.timestamp}</span>
                  </div>
                </div>
                
                {/* Controls */}
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setMuted(!muted)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    {muted ? (
                      <VolumeX className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                    <Maximize className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center mt-6">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
          Daha Fazla Video Yükle
        </button>
      </div>
    </div>
  );
};

export default PoliticsVideoPanel;
