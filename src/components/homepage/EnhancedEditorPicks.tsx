"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Star, 
  TrendingUp, 
  Eye, 
  Clock, 
  User, 
  Edit3, 
  Zap,
  Award,
  Heart,
  Bookmark,
  Share2
} from "lucide-react";
import { useModuleNews, useAnalytics } from "./hooks/useHomepage";
import { HomepageNewsService } from "@/lib/firestore/homepage-services";
import { News, HomepageModule, ModuleSettings } from "@/types/homepage";

interface EnhancedEditorPicksProps {
  moduleId?: string;
  module?: HomepageModule;
  settings?: ModuleSettings & {
    showAuthor?: boolean;
    showViews?: boolean;
    hybridMode?: boolean; // manual + auto selection
    autoPickCriteria?: {
      minViews?: number;
      maxAge?: number; // hours
      categories?: string[];
      tags?: string[];
      engagement?: 'high' | 'medium' | 'low';
    };
    displayStyle?: 'grid' | 'featured' | 'mixed';
    animationType?: 'fade' | 'slide' | 'stagger';
    showRanking?: boolean;
    showEditorialBadge?: boolean;
  };
}

// Fallback editor picks
const fallbackEditorPicks: News[] = [
  {
    id: "editor-pick-1",
    title: "Editör seçimi haberleri yükleniyor...",
    summary: "En önemli editör seçimi haberleri burada görünecek.",
    content: "Özenle seçilmiş haberler yükleniyor...",
    category: "gundem",
    images: [{ 
      url: "/images/placeholder-news.jpg", 
      caption: "Editör seçimi", 
      alt: "Placeholder" 
    }],
    author: "Editör",
    source: "NetNext",
    createdAt: new Date(),
    publishedAt: new Date(),
    status: "published",
    views: 150,
    tags: ["editör seçimi"],
    breaking: false,
    urgent: false,
    featured: true
  }
];

interface EditorPickCardProps {
  news: News;
  rank: number;
  displayStyle: 'grid' | 'featured' | 'mixed';
  showAuthor: boolean;
  showViews: boolean;
  showRanking: boolean;
  showEditorialBadge: boolean;
  onNewsClick: (news: News) => void;
  animationDelay: number;
}

function EditorPickCard({
  news,
  rank,
  displayStyle,
  showAuthor,
  showViews,
  showRanking,
  showEditorialBadge,
  onNewsClick,
  animationDelay
}: EditorPickCardProps) {
  const [imageError, setImageError] = useState(false);

  const formatDate = useCallback((date: Date | string | number) => {
    const newsDate = new Date(date);
    return newsDate.toLocaleDateString('tr-TR', { 
      day: 'numeric', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  const formatViews = useCallback((views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  }, []);

  const getImageUrl = useCallback(() => {
    if (news.images && news.images.length > 0 && !imageError) {
      return news.images[0].url;
    }
    return '/images/placeholder-news.jpg';
  }, [news.images, imageError]);

  const getRankIcon = useCallback((rank: number) => {
    switch (rank) {
      case 1:
        return <Award className="w-4 h-4 text-yellow-500" />;
      case 2:
        return <Star className="w-4 h-4 text-gray-400" />;
      case 3:
        return <TrendingUp className="w-4 h-4 text-amber-600" />;
      default:
        return <span className="w-4 h-4 flex items-center justify-center text-xs font-bold text-gray-600 bg-gray-100 rounded-full">{rank}</span>;
    }
  }, []);

  if (displayStyle === 'featured' && rank === 1) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: animationDelay }}
        className="col-span-full bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Image */}
          <div className="relative h-64 lg:h-full">
            <Image
              src={getImageUrl()}
              alt={news.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 1024px) 100vw, 50vw"
              onError={() => setImageError(true)}
            />
            
            {showEditorialBadge && (
              <div className="absolute top-4 left-4">
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                  <Edit3 className="w-3 h-3" />
                  <span>EDİTÖR SEÇİMİ</span>
                </div>
              </div>
            )}

            {showRanking && (
              <div className="absolute top-4 right-4">
                <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-full p-2">
                  {getRankIcon(rank)}
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 flex flex-col justify-center">
            <Link 
              href={`/haber/${news.id}`}
              onClick={() => onNewsClick(news)}
              className="block"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                {news.title}
              </h2>
              
              <p className="text-gray-600 mb-4 line-clamp-3">
                {news.summary}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  {showAuthor && (
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{news.author}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatDate(news.publishedAt)}</span>
                  </div>
                  
                  {showViews && news.views > 0 && (
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{formatViews(news.views)}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <button className="p-1 text-gray-400 hover:text-red-500 transition-colors duration-200">
                    <Heart className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-blue-500 transition-colors duration-200">
                    <Bookmark className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-green-500 transition-colors duration-200">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: animationDelay }}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={getImageUrl()}
          alt={news.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={() => setImageError(true)}
        />
        
        {showRanking && (
          <div className="absolute top-3 left-3">
            <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-full p-1.5">
              {getRankIcon(rank)}
            </div>
          </div>
        )}

        {showEditorialBadge && (
          <div className="absolute top-3 right-3">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
              EDİTÖR
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <Link 
          href={`/haber/${news.id}`}
          onClick={() => onNewsClick(news)}
          className="block"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
            {news.title}
          </h3>
          
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {news.summary}
          </p>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-2">
              {showAuthor && (
                <>
                  <User className="w-3 h-3" />
                  <span>{news.author}</span>
                </>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{formatDate(news.publishedAt)}</span>
              </div>
              
              {showViews && news.views > 0 && (
                <div className="flex items-center space-x-1">
                  <Eye className="w-3 h-3" />
                  <span>{formatViews(news.views)}</span>
                </div>
              )}
            </div>
          </div>
        </Link>
      </div>
    </motion.div>
  );
}

export default function EnhancedEditorPicks({
  moduleId = "editor-picks-default",
  module,
  settings = {}
}: EnhancedEditorPicksProps) {
  // Hooks
  const { news: moduleNews, loading, error, refreshNews } = useModuleNews(module, true);
  const { trackModuleView, trackNewsClick } = useAnalytics();
  
  // State
  const [editorPicks, setEditorPicks] = useState<News[]>([]);
  const [autoPickedNews, setAutoPickedNews] = useState<News[]>([]);
  const [showAutoPickedOnly, setShowAutoPickedOnly] = useState(false);

  // Settings with defaults
  const {
    showAuthor = true,
    showViews = true,
    hybridMode = false,
    autoPickCriteria = {
      minViews: 100,
      maxAge: 24,
      categories: [],
      tags: [],
      engagement: 'high'
    },
    displayStyle = 'grid',
    animationType = 'stagger',
    showRanking = true,
    showEditorialBadge = true
  } = settings;

  // Auto-pick algorithm
  const calculateAutoPickScore = useCallback((news: News) => {
    let score = 0;
    
    // Views score (40% weight)
    if (news.views >= autoPickCriteria.minViews!) {
      score += (news.views / 1000) * 0.4;
    }
    
    // Recency score (20% weight)
    const ageHours = (Date.now() - new Date(news.publishedAt).getTime()) / (1000 * 60 * 60);
    if (ageHours <= autoPickCriteria.maxAge!) {
      score += (1 - ageHours / autoPickCriteria.maxAge!) * 0.2;
    }
    
    // Featured/breaking bonus (20% weight)
    if (news.featured) score += 0.15;
    if (news.breaking) score += 0.1;
    if (news.urgent) score += 0.05;
    
    // Category relevance (10% weight)
    if (autoPickCriteria.categories!.length === 0 || autoPickCriteria.categories!.includes(news.category)) {
      score += 0.1;
    }
    
    // Tag relevance (10% weight)
    if (autoPickCriteria.tags!.length === 0) {
      score += 0.1;
    } else {
      const matchingTags = news.tags.filter(tag => autoPickCriteria.tags!.includes(tag));
      score += (matchingTags.length / autoPickCriteria.tags!.length) * 0.1;
    }
    
    return score;
  }, [autoPickCriteria]);

  // Load editor picks
  useEffect(() => {
    let newsToDisplay = moduleNews.length > 0 ? moduleNews : fallbackEditorPicks;
    
    if (hybridMode) {
      // Combine manual selections with auto-picked
      const manualPicks = newsToDisplay.filter(news => 
        module?.manualNewsIds.includes(news.id) || false
      );
      
      // Auto-pick additional news
      const availableNews = newsToDisplay.filter(news => 
        !module?.manualNewsIds.includes(news.id)
      );
      
      const scoredNews = availableNews
        .map(news => ({ ...news, autoScore: calculateAutoPickScore(news) }))
        .sort((a, b) => b.autoScore - a.autoScore)
        .slice(0, Math.max(0, (module?.newsCount || 6) - manualPicks.length));
      
      setAutoPickedNews(scoredNews);
      
      // Combine manual and auto picks
      const combinedPicks = [
        ...manualPicks,
        ...scoredNews
      ].slice(0, module?.newsCount || 6);
      
      setEditorPicks(combinedPicks);
    } else {
      // Use manual selection or fallback to auto-pick
      if (module?.manualNewsIds.length) {
        const manualPicks = newsToDisplay.filter(news => 
          module.manualNewsIds.includes(news.id)
        );
        setEditorPicks(manualPicks.slice(0, module.newsCount || 6));
      } else {
        // Auto-pick based on score
        const scoredNews = newsToDisplay
          .map(news => ({ ...news, autoScore: calculateAutoPickScore(news) }))
          .sort((a, b) => b.autoScore - a.autoScore)
          .slice(0, module?.newsCount || 6);
        
        setEditorPicks(scoredNews);
        setAutoPickedNews(scoredNews);
      }
    }
  }, [moduleNews, module, hybridMode, calculateAutoPickScore]);

  // Track module view
  useEffect(() => {
    if (editorPicks.length > 0) {
      trackModuleView(moduleId, 'editor-picks');
    }
  }, [moduleId, trackModuleView, editorPicks.length]);

  // Event handlers
  const handleNewsClick = useCallback(async (news: News) => {
    await trackNewsClick(news.id, moduleId, 'editor-picks');
  }, [trackNewsClick, moduleId]);

  if (!loading && editorPicks.length === 0 && !error) {
    return null;
  }

  const displayNews = showAutoPickedOnly ? autoPickedNews : editorPicks;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
              <Edit3 className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {module?.title || 'Editör Seçimleri'}
            </h2>
          </div>
          
          {showEditorialBadge && (
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
              Özenle Seçildi
            </div>
          )}
        </div>

        {hybridMode && autoPickedNews.length > 0 && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAutoPickedOnly(!showAutoPickedOnly)}
              className={`
                px-3 py-1 text-sm rounded-full transition-colors duration-200
                ${showAutoPickedOnly
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
            >
              <Zap className="w-3 h-3 inline mr-1" />
              {showAutoPickedOnly ? 'Tümünü Göster' : 'Otomatik Seçim'}
            </button>
          </div>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Editör seçimleri yükleniyor...</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">Hata: {error}</p>
        </div>
      )}

      {/* Editor Picks Grid */}
      {!loading && !error && displayNews.length > 0 && (
        <div className={`
          ${displayStyle === 'featured' 
            ? 'grid grid-cols-1 gap-6' 
            : displayStyle === 'mixed'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          }
        `}>
          {displayNews.map((news, index) => (
            <EditorPickCard
              key={news.id}
              news={news}
              rank={index + 1}
              displayStyle={displayStyle}
              showAuthor={showAuthor}
              showViews={showViews}
              showRanking={showRanking}
              showEditorialBadge={showEditorialBadge}
              onNewsClick={handleNewsClick}
              animationDelay={animationType === 'stagger' ? index * 0.1 : 0}
            />
          ))}
        </div>
      )}

      {/* Statistics for hybrid mode */}
      {hybridMode && !showAutoPickedOnly && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {module?.manualNewsIds.length || 0}
              </div>
              <div className="text-sm text-gray-600">Manuel Seçim</div>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {autoPickedNews.length}
              </div>
              <div className="text-sm text-gray-600">Otomatik Seçim</div>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-green-600">
                {displayNews.reduce((sum, news) => sum + news.views, 0)}
              </div>
              <div className="text-sm text-gray-600">Toplam Görüntüleme</div>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {autoPickCriteria.engagement}
              </div>
              <div className="text-sm text-gray-600">Etkileşim Seviyesi</div>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && displayNews.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <Edit3 className="w-8 h-8" />
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Henüz editör seçimi yok
          </h3>
          <p className="text-gray-600">
            Editör seçimi haberleri burada görünecek.
          </p>
        </div>
      )}
    </div>
  );
}