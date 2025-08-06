"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Eye, 
  Clock, 
  User, 
  ArrowRight, 
  Filter, 
  Grid3X3, 
  List,
  RefreshCw,
  ChevronDown 
} from "lucide-react";
import { useModuleNews, useAnalytics, useInfiniteScroll, useIntersectionObserver } from "./hooks/useHomepage";
import { HomepageNewsService } from "@/lib/firestore/homepage-services";
import { News, HomepageModule, ModuleSettings } from "@/types/homepage";

interface EnhancedHeadlineNewsGridProps {
  moduleId?: string;
  module?: HomepageModule;
  settings?: ModuleSettings & {
    gridColumns?: number;
    showCategories?: boolean;
    sortBy?: 'views' | 'publishedAt' | 'featured';
    enableInfiniteScroll?: boolean;
    animationType?: 'fade' | 'slide' | 'scale';
    cardStyle?: 'modern' | 'minimal' | 'compact';
    showFilters?: boolean;
    categoriesFilter?: string[];
    masonry?: boolean;
    lazyLoad?: boolean;
    preloadImages?: boolean;
  };
}

// Fallback news data
const fallbackNews: News[] = [
  {
    id: "headline-fallback-1",
    title: "Güncel haberler yükleniyor...",
    summary: "En güncel haberler burada görünecek.",
    content: "Haberler yükleniyor...",
    category: "gundem",
    images: [{ 
      url: "/images/placeholder-news.jpg", 
      caption: "Haber görseli", 
      alt: "Placeholder" 
    }],
    author: "Editör",
    source: "NetNext",
    createdAt: new Date(),
    publishedAt: new Date(),
    status: "published",
    views: 0,
    tags: ["gundem"],
    breaking: false,
    urgent: false,
    featured: false
  }
];

// Category filter options
const CATEGORY_OPTIONS = [
  { value: 'all', label: 'Tümü', color: 'gray' },
  { value: 'gundem', label: 'Gündem', color: 'red' },
  { value: 'ekonomi', label: 'Ekonomi', color: 'green' },
  { value: 'spor', label: 'Spor', color: 'blue' },
  { value: 'teknoloji', label: 'Teknoloji', color: 'purple' },
  { value: 'saglik', label: 'Sağlık', color: 'pink' },
  { value: 'kultur', label: 'Kültür', color: 'yellow' },
  { value: 'dunya', label: 'Dünya', color: 'indigo' },
  { value: 'politika', label: 'Politika', color: 'gray' }
];

// Sort options
const SORT_OPTIONS = [
  { value: 'publishedAt', label: 'En Yeni' },
  { value: 'views', label: 'En Çok Okunan' },
  { value: 'featured', label: 'Öne Çıkan' }
];

interface NewsCardProps {
  news: News;
  style: 'modern' | 'minimal' | 'compact';
  showCategory: boolean;
  onNewsClick: (news: News) => void;
  lazyLoad: boolean;
  animationType: 'fade' | 'slide' | 'scale';
  index: number;
}

function NewsCard({ 
  news, 
  style, 
  showCategory, 
  onNewsClick, 
  lazyLoad, 
  animationType,
  index 
}: NewsCardProps) {
  const [ref, isIntersecting] = useIntersectionObserver({ threshold: 0.1 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const formatDate = useCallback((date: Date | string | number) => {
    const newsDate = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - newsDate.getTime());
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    
    if (diffHours < 1) {
      return 'Az önce';
    } else if (diffHours < 24) {
      return `${diffHours} saat önce`;
    } else {
      return newsDate.toLocaleDateString('tr-TR', { 
        day: 'numeric', 
        month: 'short' 
      });
    }
  }, []);

  const formatViews = useCallback((views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  }, []);

  const getCategoryColor = useCallback((category: string) => {
    const categoryOption = CATEGORY_OPTIONS.find(opt => opt.value === category);
    return categoryOption?.color || 'gray';
  }, []);

  const getImageUrl = useCallback(() => {
    if (news.images && news.images.length > 0 && !imageError) {
      return news.images[0].url;
    }
    return '/images/placeholder-news.jpg';
  }, [news.images, imageError]);

  const getAnimationVariants = useCallback(() => {
    const delay = index * 0.1;
    
    switch (animationType) {
      case 'slide':
        return {
          initial: { opacity: 0, y: 50 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay }
        };
      case 'scale':
        return {
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
          transition: { duration: 0.5, delay }
        };
      default: // fade
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.5, delay }
        };
    }
  }, [animationType, index]);

  const shouldLoad = !lazyLoad || isIntersecting;

  if (style === 'compact') {
    return (
      <motion.div
        ref={ref}
        {...getAnimationVariants()}
        className="flex space-x-3 p-3 bg-white rounded-lg border hover:shadow-md transition-shadow duration-200"
      >
        {shouldLoad && (
          <div className="w-20 h-16 relative flex-shrink-0">
            <Image
              src={getImageUrl()}
              alt={news.title}
              fill
              className="object-cover rounded"
              sizes="80px"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          </div>
        )}
        
        <div className="flex-1">
          <Link 
            href={`/haber/${news.id}`}
            onClick={() => onNewsClick(news)}
            className="block"
          >
            <h3 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors duration-200">
              {news.title}
            </h3>
            <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
              <span>{formatDate(news.publishedAt)}</span>
              {news.views > 0 && (
                <>
                  <span>•</span>
                  <span>{formatViews(news.views)}</span>
                </>
              )}
            </div>
          </Link>
        </div>
      </motion.div>
    );
  }

  if (style === 'minimal') {
    return (
      <motion.div
        ref={ref}
        {...getAnimationVariants()}
        className="bg-white rounded-lg border hover:shadow-lg transition-all duration-200"
      >
        <Link 
          href={`/haber/${news.id}`}
          onClick={() => onNewsClick(news)}
          className="block p-4"
        >
          {showCategory && news.category && (
            <div className="mb-2">
              <span className={`
                inline-block px-2 py-1 text-xs font-medium rounded-full
                bg-${getCategoryColor(news.category)}-100 text-${getCategoryColor(news.category)}-800
              `}>
                {CATEGORY_OPTIONS.find(opt => opt.value === news.category)?.label || news.category}
              </span>
            </div>
          )}
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors duration-200">
            {news.title}
          </h3>
          
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {news.summary}
          </p>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-2">
              <User className="w-3 h-3" />
              <span>{news.author}</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{formatDate(news.publishedAt)}</span>
              </div>
              {news.views > 0 && (
                <div className="flex items-center space-x-1">
                  <Eye className="w-3 h-3" />
                  <span>{formatViews(news.views)}</span>
                </div>
              )}
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  // Modern style (default)
  return (
    <motion.div
      ref={ref}
      {...getAnimationVariants()}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
    >
      {shouldLoad && (
        <div className="relative h-48 overflow-hidden">
          <Image
            src={getImageUrl()}
            alt={news.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
          
          {showCategory && news.category && (
            <div className="absolute top-3 left-3">
              <span className={`
                px-3 py-1 text-xs font-semibold text-white rounded-full shadow-lg
                bg-${getCategoryColor(news.category)}-600
              `}>
                {CATEGORY_OPTIONS.find(opt => opt.value === news.category)?.label || news.category}
              </span>
            </div>
          )}
          
          {news.breaking && (
            <div className="absolute top-3 right-3">
              <span className="px-2 py-1 text-xs font-bold text-white bg-red-600 rounded-full animate-pulse">
                SON DAKİKA
              </span>
            </div>
          )}
        </div>
      )}

      <div className="p-4">
        <Link 
          href={`/haber/${news.id}`}
          onClick={() => onNewsClick(news)}
          className="block"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
            {news.title}
          </h3>
          
          <p className="text-gray-600 text-sm line-clamp-3 mb-4">
            {news.summary}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <User className="w-3 h-3" />
              <span>{news.author}</span>
              <span>•</span>
              <Clock className="w-3 h-3" />
              <span>{formatDate(news.publishedAt)}</span>
            </div>
            
            {news.views > 0 && (
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Eye className="w-3 h-3" />
                <span>{formatViews(news.views)}</span>
              </div>
            )}
          </div>
        </Link>
      </div>
    </motion.div>
  );
}

export default function EnhancedHeadlineNewsGrid({
  moduleId = "headline-grid-default",
  module,
  settings = {}
}: EnhancedHeadlineNewsGridProps) {
  // Hooks
  const { news: moduleNews, loading, error, refreshNews } = useModuleNews(module, true);
  const { trackModuleView, trackNewsClick } = useAnalytics();
  
  // State
  const [displayNews, setDisplayNews] = useState<News[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSort, setSelectedSort] = useState<'views' | 'publishedAt' | 'featured'>('publishedAt');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Settings with defaults
  const {
    gridColumns = 3,
    showCategories = true,
    sortBy = 'publishedAt',
    enableInfiniteScroll = true,
    animationType = 'fade',
    cardStyle = 'modern',
    showFilters: enableFilters = true,
    categoriesFilter = [],
    masonry = false,
    lazyLoad = true,
    preloadImages = false
  } = settings;

  // Infinite scroll for additional news
  const fetchMoreNews = useCallback(async (page: number, limit: number) => {
    try {
      if (selectedCategory === 'all') {
        return await HomepageNewsService.getNewsByCategory('', limit);
      } else {
        return await HomepageNewsService.getNewsByCategory(selectedCategory, limit);
      }
    } catch (err) {
      console.error('Error fetching more news:', err);
      return [];
    }
  }, [selectedCategory]);

  const {
    items: infiniteNews,
    loading: loadingMore,
    hasMore,
    loadMore,
    reset
  } = useInfiniteScroll(fetchMoreNews, 12);

  // Combine and filter news
  useEffect(() => {
    let newsToDisplay = moduleNews.length > 0 ? moduleNews : fallbackNews;
    
    // Add infinite scroll news if enabled
    if (enableInfiniteScroll && infiniteNews.length > 0) {
      const combinedNews = [...newsToDisplay, ...infiniteNews];
      // Remove duplicates
      newsToDisplay = combinedNews.filter((news, index, self) => 
        index === self.findIndex(n => n.id === news.id)
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      newsToDisplay = newsToDisplay.filter(news => news.category === selectedCategory);
    }

    // Filter by allowed categories
    if (categoriesFilter.length > 0) {
      newsToDisplay = newsToDisplay.filter(news => 
        categoriesFilter.includes(news.category)
      );
    }

    // Sort news
    newsToDisplay.sort((a, b) => {
      switch (selectedSort) {
        case 'views':
          return b.views - a.views;
        case 'featured':
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        default: // publishedAt
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      }
    });

    setDisplayNews(newsToDisplay);
  }, [moduleNews, infiniteNews, selectedCategory, selectedSort, categoriesFilter, enableInfiniteScroll]);

  // Track module view
  useEffect(() => {
    if (displayNews.length > 0) {
      trackModuleView(moduleId, 'headline-grid');
    }
  }, [moduleId, trackModuleView, displayNews.length]);

  // Event handlers
  const handleNewsClick = useCallback(async (news: News) => {
    await trackNewsClick(news.id, moduleId, 'headline-grid');
  }, [trackNewsClick, moduleId]);

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
    if (enableInfiniteScroll) {
      reset();
    }
  }, [enableInfiniteScroll, reset]);

  const handleSortChange = useCallback((sort: 'views' | 'publishedAt' | 'featured') => {
    setSelectedSort(sort);
  }, []);

  const handleRefresh = useCallback(() => {
    refreshNews();
    if (enableInfiniteScroll) {
      reset();
    }
  }, [refreshNews, enableInfiniteScroll, reset]);

  // Get grid classes
  const getGridClasses = useCallback(() => {
    if (viewMode === 'list') {
      return 'space-y-4';
    }
    
    const columnClasses = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
      5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
      6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
    };
    
    return `grid ${columnClasses[gridColumns as keyof typeof columnClasses] || columnClasses[3]} gap-6`;
  }, [viewMode, gridColumns]);

  if (!loading && displayNews.length === 0 && !error) {
    return null;
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {module?.title || 'Güncel Haberler'}
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            {displayNews.length} haber bulundu
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Filters Toggle */}
          {enableFilters && (
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`
                p-2 rounded-lg transition-colors duration-200
                ${showFilters 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
            >
              <Filter className="w-5 h-5" />
            </button>
          )}

          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors duration-200"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filters */}
      {enableFilters && showFilters && (
        <div className="bg-white p-4 rounded-lg border mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORY_OPTIONS
                  .filter(option => 
                    categoriesFilter.length === 0 || 
                    option.value === 'all' || 
                    categoriesFilter.includes(option.value)
                  )
                  .map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleCategoryChange(option.value)}
                    className={`
                      px-3 py-1 text-sm rounded-full transition-colors duration-200
                      ${selectedCategory === option.value
                        ? `bg-${option.color}-600 text-white`
                        : `bg-${option.color}-100 text-${option.color}-800 hover:bg-${option.color}-200`
                      }
                    `}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sıralama
              </label>
              <select
                value={selectedSort}
                onChange={(e) => handleSortChange(e.target.value as any)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Haberler yükleniyor...</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">Hata: {error}</p>
        </div>
      )}

      {/* News Grid */}
      {!loading && !error && displayNews.length > 0 && (
        <div className={getGridClasses()}>
          {displayNews.map((news, index) => (
            <NewsCard
              key={news.id}
              news={news}
              style={cardStyle}
              showCategory={showCategories}
              onNewsClick={handleNewsClick}
              lazyLoad={lazyLoad}
              animationType={animationType}
              index={index}
            />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {enableInfiniteScroll && hasMore && !loading && (
        <div className="text-center mt-8">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="btn-primary"
          >
            {loadingMore ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Yükleniyor...
              </div>
            ) : (
              <div className="flex items-center">
                Daha Fazla Göster
                <ChevronDown className="w-4 h-4 ml-2" />
              </div>
            )}
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && displayNews.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <Grid3X3 className="w-8 h-8" />
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Henüz haber yok
          </h3>
          <p className="text-gray-600">
            Bu kategoride henüz haber bulunmuyor.
          </p>
        </div>
      )}
    </div>
  );
}