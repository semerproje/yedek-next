"use client";

import { useState } from 'react';
import Image from 'next/image';
import { 
  Play, 
  Clock, 
  Eye, 
  ChevronLeft, 
  ChevronRight,
  ExternalLink,
  ThumbsUp,
  Share,
  BookmarkPlus
} from 'lucide-react';

interface TechVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  views: string;
  uploadTime: string;
  channel: string;
  category: string;
  likes: string;
  isLive?: boolean;
  isPremium?: boolean;
}

const TechnologyVideoPanelNew = () => {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const techVideos: TechVideo[] = [
    {
      id: '1',
      title: 'OpenAI GPT-5 Demo: Gerçek Zamanlı AI Asistanı',
      description: 'OpenAI\'nin yeni nesil GPT-5 modelinin canlı demo gösterimi. İnsan seviyesinde akıl yürütme kabiliyeti.',
      thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=225&fit=crop',
      duration: '14:32',
      views: '2.1M',
      uploadTime: '2 saat önce',
      channel: 'Tech İncelemeler',
      category: 'ai',
      likes: '47K',
      isLive: false,
      isPremium: true,
    },
    {
      id: '2',
      title: 'Apple M4 Çipi Detaylı İnceleme: Performans Testleri',
      description: 'Apple\'ın yeni M4 çipinin detaylı performans testleri ve karşılaştırmaları.',
      thumbnail: 'https://images.unsplash.com/photo-1637200532293-62b3a41ea3b1?w=400&h=225&fit=crop',
      duration: '18:45',
      views: '1.8M',
      uploadTime: '5 saat önce',
      channel: 'Apple Dünyası',
      category: 'hardware',
      likes: '32K',
      isLive: false,
    },
    {
      id: '3',
      title: 'Tesla Robotaxi Türkiye\'de: İlk Test Sürüşü CANLI',
      description: 'Tesla\'nın tam otonom robotaxi\'sinin Türkiye\'deki ilk test sürüşü canlı yayını.',
      thumbnail: 'https://images.unsplash.com/photo-1561043433-aaf687c4cf04?w=400&h=225&fit=crop',
      duration: 'CANLI',
      views: '847K',
      uploadTime: 'Canlı yayın',
      channel: 'Otonom Araçlar',
      category: 'automotive',
      likes: '28K',
      isLive: true,
    },
    {
      id: '4',
      title: 'Meta Quest 4 VR Deneyimi: 8K Sanal Gerçeklik',
      description: 'Meta\'nın yeni VR gözlüğü Quest 4 ile 8K çözünürlükte sanal gerçeklik deneyimi.',
      thumbnail: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=400&h=225&fit=crop',
      duration: '12:18',
      views: '1.2M',
      uploadTime: '8 saat önce',
      channel: 'VR Dünyası',
      category: 'vr',
      likes: '19K',
    },
    {
      id: '5',
      title: 'Quantum Computing Devrimi: IBM 1000-Qubit İşlemci',
      description: 'IBM\'in yeni kuantum işlemcisinin özellikleri ve gelecekteki potansiyel uygulamaları.',
      thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=225&fit=crop',
      duration: '22:15',
      views: '756K',
      uploadTime: '12 saat önce',
      channel: 'Quantum Tech',
      category: 'quantum',
      likes: '15K',
    },
    {
      id: '6',
      title: 'Samsung Galaxy S25 Ultra Sızıntıları: 200MP Kamera Detayları',
      description: 'Samsung\'un yeni amiral gemisi hakkında en son sızıntılar ve kamera teknolojisi.',
      thumbnail: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=225&fit=crop',
      duration: '9:42',
      views: '934K',
      uploadTime: '1 gün önce',
      channel: 'Mobil İncelemeler',
      category: 'mobile',
      likes: '22K',
    },
  ];

  const categories = [
    { id: 'all', name: 'Tümü', count: techVideos.length },
    { id: 'ai', name: 'Yapay Zeka', count: techVideos.filter(v => v.category === 'ai').length },
    { id: 'hardware', name: 'Donanım', count: techVideos.filter(v => v.category === 'hardware').length },
    { id: 'mobile', name: 'Mobil', count: techVideos.filter(v => v.category === 'mobile').length },
    { id: 'automotive', name: 'Otomotiv', count: techVideos.filter(v => v.category === 'automotive').length },
    { id: 'vr', name: 'VR/AR', count: techVideos.filter(v => v.category === 'vr').length },
  ];

  const filteredVideos = selectedCategory === 'all' 
    ? techVideos 
    : techVideos.filter(video => video.category === selectedCategory);

  const nextVideo = () => {
    setCurrentVideo((prev) => (prev + 1) % filteredVideos.length);
  };

  const prevVideo = () => {
    setCurrentVideo((prev) => (prev - 1 + filteredVideos.length) % filteredVideos.length);
  };

  const currentVideoData = filteredVideos[currentVideo];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">🎥 Teknoloji Videoları</h2>
        <a href="/teknoloji/videolar" className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
          <span>Tüm Videoları İzle</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Kategori Filtreleri */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => {
              setSelectedCategory(category.id);
              setCurrentVideo(0);
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {category.name}
            <span className="ml-2 bg-white px-2 py-1 rounded-full text-xs">
              {category.count}
            </span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ana Video Player */}
        <div className="lg:col-span-2">
          <div className="relative bg-black rounded-lg overflow-hidden group">
            <div className="relative aspect-video">
              <Image
                src={currentVideoData.thumbnail}
                alt={currentVideoData.title}
                fill
                className="object-cover"
              />
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 group-hover:bg-opacity-60 transition-all">
                <button className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-4 transition-all transform hover:scale-110">
                  <Play className="w-8 h-8 text-gray-900 ml-1" fill="currentColor" />
                </button>
              </div>

              {/* Live Badge */}
              {currentVideoData.isLive && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  CANLI
                </div>
              )}

              {/* Premium Badge */}
              {currentVideoData.isPremium && (
                <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  PREMIUM
                </div>
              )}

              {/* Duration */}
              <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                {currentVideoData.duration}
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevVideo}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextVideo}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Video Info */}
          <div className="mt-4">
            <h3 className="font-semibold text-lg text-gray-900 mb-2">
              {currentVideoData.title}
            </h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {currentVideoData.description}
            </p>
            
            {/* Video Stats */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {currentVideoData.views} görüntüleme
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {currentVideoData.uploadTime}
                </div>
                <span className="font-medium text-gray-700">{currentVideoData.channel}</span>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm">
                  <ThumbsUp className="w-4 h-4" />
                  {currentVideoData.likes}
                </button>
                <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full">
                  <Share className="w-4 h-4" />
                </button>
                <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full">
                  <BookmarkPlus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Video Playlist */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900">📋 Video Listesi</h4>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredVideos.map((video, index) => (
              <div
                key={video.id}
                onClick={() => setCurrentVideo(index)}
                className={`flex gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  currentVideo === index
                    ? 'bg-blue-50 border border-blue-200'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="relative w-20 h-12 flex-shrink-0">
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    className="object-cover rounded"
                  />
                  <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white px-1 text-xs rounded">
                    {video.duration}
                  </div>
                  {video.isLive && (
                    <div className="absolute top-1 left-1 bg-red-500 text-white px-1 text-xs rounded">
                      LIVE
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-medium text-sm text-gray-900 line-clamp-2 mb-1">
                    {video.title}
                  </h5>
                  <div className="text-xs text-gray-500">
                    <div>{video.channel}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span>{video.views} görüntüleme</span>
                      <span>•</span>
                      <span>{video.uploadTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video İndeksi */}
      <div className="flex justify-center mt-4">
        <div className="flex gap-2">
          {filteredVideos.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentVideo(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                currentVideo === index ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechnologyVideoPanelNew;
