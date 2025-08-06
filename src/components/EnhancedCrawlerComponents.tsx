// Enhanced AA Crawler Components
// Medya ve video destekli AA crawler bileşenleri

import React, { useState } from 'react';
import { 
  Image as ImageIcon, 
  Video, 
  Play, 
  Download, 
  Eye, 
  ExternalLink,
  Grid,
  List,
  Filter
} from 'lucide-react';

interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'gallery' | 'file';
  url: string;
  title?: string;
  description?: string;
  thumbnail?: string;
  duration?: string;
  size?: string;
  format?: string;
}

interface EnhancedNewsItem {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'picture' | 'video' | 'graphic';
  date: string;
  category: string;
  media?: MediaItem[];
  gallery?: MediaItem[];
  videos?: MediaItem[];
  metadata?: {
    author?: string;
    location?: string;
    keywords?: string[];
  };
}

// Medya önizleme bileşeni
export function MediaPreview({ item }: { item: MediaItem }) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePreview = () => {
    setIsLoading(true);
    // Medya önizleme logic'i
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="relative group bg-gray-50 rounded-lg overflow-hidden">
      {item.type === 'image' ? (
        <div className="aspect-video bg-gray-200 flex items-center justify-center">
          <ImageIcon className="h-8 w-8 text-gray-400" />
          {item.thumbnail && (
            <img 
              src={item.thumbnail} 
              alt={item.title || 'Görsel'}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
        </div>
      ) : item.type === 'video' ? (
        <div className="aspect-video bg-gray-900 flex items-center justify-center relative">
          <Video className="h-8 w-8 text-white" />
          <button
            onClick={handlePreview}
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Play className="h-12 w-12 text-white" />
          </button>
          {item.duration && (
            <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
              {item.duration}
            </span>
          )}
        </div>
      ) : (
        <div className="aspect-video bg-blue-50 flex items-center justify-center">
          <Grid className="h-8 w-8 text-blue-400" />
        </div>
      )}
      
      <div className="p-3">
        <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
          {item.title || 'Medya öğesi'}
        </h4>
        {item.description && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
            {item.description}
          </p>
        )}
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-400 capitalize">
            {item.type}
          </span>
          <div className="flex space-x-1">
            <button
              onClick={handlePreview}
              className="p-1 text-gray-400 hover:text-gray-600"
              title="Önizle"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              className="p-1 text-gray-400 hover:text-gray-600"
              title="İndir"
            >
              <Download className="h-4 w-4" />
            </button>
            <button
              className="p-1 text-gray-400 hover:text-gray-600"
              title="Aç"
            >
              <ExternalLink className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced haber kartı bileşeni
export function EnhancedNewsCard({ news }: { news: EnhancedNewsItem }) {
  const [activeTab, setActiveTab] = useState<'content' | 'media' | 'gallery' | 'videos'>('content');
  
  const mediaCount = (news.media?.length || 0) + (news.gallery?.length || 0) + (news.videos?.length || 0);
  
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
              {news.title}
            </h3>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
              <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                {news.category}
              </span>
              <span>{new Date(news.date).toLocaleDateString('tr-TR')}</span>
              <span className="capitalize">{news.type}</span>
              {mediaCount > 0 && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                  {mediaCount} medya
                </span>
              )}
            </div>
          </div>
          
          {/* Type indicator */}
          <div className="ml-4">
            {news.type === 'picture' && <ImageIcon className="h-5 w-5 text-green-500" />}
            {news.type === 'video' && <Video className="h-5 w-5 text-red-500" />}
            {news.type === 'graphic' && <Grid className="h-5 w-5 text-purple-500" />}
            {news.type === 'text' && <List className="h-5 w-5 text-gray-500" />}
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('content')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'content'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          İçerik
        </button>
        
        {(news.media?.length || 0) > 0 && (
          <button
            onClick={() => setActiveTab('media')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'media'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Medya ({news.media?.length})
          </button>
        )}
        
        {(news.gallery?.length || 0) > 0 && (
          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'gallery'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Galeri ({news.gallery?.length})
          </button>
        )}
        
        {(news.videos?.length || 0) > 0 && (
          <button
            onClick={() => setActiveTab('videos')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'videos'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Videolar ({news.videos?.length})
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'content' && (
          <div>
            <p className="text-gray-700 leading-relaxed">
              {news.content}
            </p>
            {news.metadata && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                  {news.metadata.author && (
                    <div>
                      <span className="font-medium">Yazar:</span> {news.metadata.author}
                    </div>
                  )}
                  {news.metadata.location && (
                    <div>
                      <span className="font-medium">Konum:</span> {news.metadata.location}
                    </div>
                  )}
                  {news.metadata.keywords && news.metadata.keywords.length > 0 && (
                    <div className="col-span-2">
                      <span className="font-medium">Etiketler:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {news.metadata.keywords.map((keyword, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'media' && news.media && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {news.media.map((item, index) => (
              <MediaPreview key={`media-${index}`} item={item} />
            ))}
          </div>
        )}

        {activeTab === 'gallery' && news.gallery && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {news.gallery.map((item, index) => (
              <MediaPreview key={`gallery-${index}`} item={item} />
            ))}
          </div>
        )}

        {activeTab === 'videos' && news.videos && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {news.videos.map((item, index) => (
              <MediaPreview key={`video-${index}`} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Medya filtreleme bileşeni
export function MediaFilter({ onFilterChange }: { onFilterChange: (filters: any) => void }) {
  const [filters, setFilters] = useState({
    type: 'all',
    hasMedia: false,
    hasVideo: false,
    hasGallery: false
  });

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
      <div className="flex items-center space-x-4">
        <Filter className="h-5 w-5 text-gray-400" />
        
        <select
          value={filters.type}
          onChange={(e) => handleFilterChange('type', e.target.value)}
          className="text-sm border border-gray-300 rounded px-3 py-1"
        >
          <option value="all">Tüm Tipler</option>
          <option value="text">Metin</option>
          <option value="picture">Fotoğraf</option>
          <option value="video">Video</option>
          <option value="graphic">Grafik</option>
        </select>

        <label className="flex items-center space-x-2 text-sm">
          <input
            type="checkbox"
            checked={filters.hasMedia}
            onChange={(e) => handleFilterChange('hasMedia', e.target.checked)}
            className="rounded border-gray-300"
          />
          <span>Medya var</span>
        </label>

        <label className="flex items-center space-x-2 text-sm">
          <input
            type="checkbox"
            checked={filters.hasVideo}
            onChange={(e) => handleFilterChange('hasVideo', e.target.checked)}
            className="rounded border-gray-300"
          />
          <span>Video var</span>
        </label>

        <label className="flex items-center space-x-2 text-sm">
          <input
            type="checkbox"
            checked={filters.hasGallery}
            onChange={(e) => handleFilterChange('hasGallery', e.target.checked)}
            className="rounded border-gray-300"
          />
          <span>Galeri var</span>
        </label>
      </div>
    </div>
  );
}
