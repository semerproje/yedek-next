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
  BookmarkPlus,
  Trophy
} from 'lucide-react';

interface SportVideo {
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
  isHighlight?: boolean;
  matchScore?: string;
}

const SportVideoPanelNew = () => {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const sportVideos: SportVideo[] = [
    {
      id: '1',
      title: 'Galatasaray - Fenerbahçe Derbisi Özetleri: 2-1 Tarihi Maç',
      description: 'Türkiye Süper Ligi\'nin 28. haftasında oynanan derbi maçının en güzel anları ve goller.',
      thumbnail: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=400&h=225&fit=crop',
      duration: '8:45',
      views: '3.2M',
      uploadTime: '2 saat önce',
      channel: 'Süper Lig TV',
      category: 'football',
      likes: '89K',
      isHighlight: true,
      matchScore: '2-1',
    },
    {
      id: '2',
      title: 'Anadolu Efes - Barcelona EuroLeague Yarı Final CANLI',
      description: 'EuroLeague yarı finalinde Anadolu Efes, Barcelona ile karşılaşıyor. Canlı yayın.',
      thumbnail: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=225&fit=crop',
      duration: 'CANLI',
      views: '1.8M',
      uploadTime: 'Canlı yayın',
      channel: 'EuroLeague TV',
      category: 'basketball',
      likes: '45K',
      isLive: true,
      matchScore: '89-76',
    },
    {
      id: '3',
      title: 'VakıfBank Dünya Şampiyonası Final Maçı Hazırlıkları',
      description: 'VakıfBank, FIVB Kulüpler Dünya Şampiyonası final maçı öncesi antrenman görüntüleri.',
      thumbnail: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400&h=225&fit=crop',
      duration: '12:30',
      views: '847K',
      uploadTime: '5 saat önce',
      channel: 'Voleybol Türkiye',
      category: 'volleyball',
      likes: '28K',
    },
    {
      id: '4',
      title: 'Lewis Hamilton Türkiye GP Pole Position Turu',
      description: 'Formula 1 Türkiye Grand Prix sıralama turlarında Lewis Hamilton\'ın pole position turu.',
      thumbnail: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=225&fit=crop',
      duration: '4:23',
      views: '1.2M',
      uploadTime: '1 gün önce',
      channel: 'F1 Turkish',
      category: 'motorsport',
      likes: '34K',
    },
    {
      id: '5',
      title: 'A Milli Takım EURO 2024 Hazırlık Kampı Görüntüleri',
      description: 'A Milli Futbol Takımı\'nın EURO 2024 hazırlık kampından özel görüntüler ve röportajlar.',
      thumbnail: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=225&fit=crop',
      duration: '15:18',
      views: '2.1M',
      uploadTime: '3 saat önce',
      channel: 'TFF TV',
      category: 'national',
      likes: '67K',
    },
    {
      id: '6',
      title: 'Beşiktaş Transfer Bombası: Yeni Yıldız Oyuncunun İlk Röportajı',
      description: 'Beşiktaş\'ın yeni transferi olan dünyaca ünlü futbolcunun ilk açıklamaları.',
      thumbnail: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=400&h=225&fit=crop',
      duration: '6:52',
      views: '1.5M',
      uploadTime: '6 saat önce',
      channel: 'Beşiktaş TV',
      category: 'transfer',
      likes: '42K',
    },
  ];

  const categories = [
    { id: 'all', name: 'Tümü', count: sportVideos.length },
    { id: 'football', name: 'Futbol', count: sportVideos.filter(v => v.category === 'football').length },
    { id: 'basketball', name: 'Basketbol', count: sportVideos.filter(v => v.category === 'basketball').length },
    { id: 'volleyball', name: 'Voleybol', count: sportVideos.filter(v => v.category === 'volleyball').length },
    { id: 'motorsport', name: 'Motor Sporları', count: sportVideos.filter(v => v.category === 'motorsport').length },
    { id: 'transfer', name: 'Transfer', count: sportVideos.filter(v => v.category === 'transfer').length },
  ];

  const filteredVideos = selectedCategory === 'all' 
    ? sportVideos 
    : sportVideos.filter(video => video.category === selectedCategory);

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
        <h2 className="text-xl font-semibold text-gray-900">🎥 Spor Videoları</h2>
        <a href="/spor/videolar" className="text-green-600 hover:text-green-700 flex items-center gap-1">
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
                ? 'bg-green-100 text-green-700 border border-green-200'
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

              {/* Highlight Badge */}
              {currentVideoData.isHighlight && (
                <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                  <Trophy className="w-3 h-3" />
                  ÖZET
                </div>
              )}

              {/* Match Score */}
              {currentVideoData.matchScore && (
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  {currentVideoData.matchScore}
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
                    ? 'bg-green-50 border border-green-200'
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
                  {video.isHighlight && (
                    <div className="absolute top-1 left-1 bg-yellow-500 text-white px-1 text-xs rounded">
                      ÖZET
                    </div>
                  )}
                  {video.matchScore && (
                    <div className="absolute top-1 right-1 bg-green-500 text-white px-1 text-xs rounded">
                      {video.matchScore}
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
                currentVideo === index ? 'bg-green-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Canlı Yayın Uyarısı */}
      {filteredVideos.some(video => video.isLive) && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-700">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="font-semibold">Canlı Yayınlar Devam Ediyor</span>
          </div>
          <p className="text-sm text-red-600 mt-1">
            Şu anda {filteredVideos.filter(v => v.isLive).length} canlı spor yayını bulunmaktadır.
          </p>
        </div>
      )}
    </div>
  );
};

export default SportVideoPanelNew;
