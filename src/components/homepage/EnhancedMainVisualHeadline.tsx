"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Pause, Eye, Clock, User } from "lucide-react";
import { useFeaturedNews, useAnalytics } from "./hooks/useHomepage";
import { HomepageModuleService } from "@/lib/firestore/homepage-services";
import { News, ModuleSettings } from "@/types/homepage";

interface EnhancedMainVisualHeadlineProps {
  moduleId?: string;
  manualNewsIds?: string[];
  autoFetch?: boolean;
  newsCount?: number;
  settings?: ModuleSettings & {
    enableAutoplay?: boolean;
    autoplaySpeed?: number;
    showAuthor?: boolean;
    showDate?: boolean;
    showViews?: boolean;
    showCategory?: boolean;
    overlayOpacity?: number;
    navigationStyle?: 'dots' | 'arrows' | 'both' | 'none';
    transitionEffect?: 'slide' | 'fade' | 'zoom' | 'flip';
    pauseOnHover?: boolean;
    showProgressBar?: boolean;
    preloadImages?: boolean;
  };
}

// Fallback featured news
const fallbackFeaturedNews: News[] = [
  {
    id: "featured-fallback-1",
    title: "Ana sayfa haberleri yükleniyor...",
    summary: "En önemli haberler burada görünecek.",
    content: "Öne çıkan haberler yükleniyor...",
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
    featured: true
  }
];

export default function EnhancedMainVisualHeadline({
  moduleId = "main-visual-default",
  manualNewsIds = [],
  autoFetch = true,
  newsCount = 5,
  settings = {}
}: EnhancedMainVisualHeadlineProps) {
  // Hooks
  const { featuredNews, loading, error } = useFeaturedNews();
  const { trackModuleView, trackNewsClick } = useAnalytics();
  
  // State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [moduleNews, setModuleNews] = useState<News[]>([]);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  
  // Refs
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Settings with defaults
  const {
    enableAutoplay = true,
    autoplaySpeed = 5000,
    showAuthor = true,
    showDate = true,
    showViews = true,
    showCategory = true,
    overlayOpacity = 0.6,
    navigationStyle = 'both',
    transitionEffect = 'slide',
    pauseOnHover = true,
    showProgressBar = true,
    preloadImages = true
  } = settings;

  // Get news data
  const displayNews = moduleNews.length > 0 ? moduleNews : 
                     featuredNews.length > 0 ? featuredNews : 
                     fallbackFeaturedNews;

  // Load module-specific news if manual IDs are provided
  useEffect(() => {
    const loadModuleNews = async () => {
      if (manualNewsIds.length > 0 && !autoFetch) {
        try {
          const module = await HomepageModuleService.getModule(moduleId);
          if (module) {
            setModuleNews(featuredNews.slice(0, newsCount));
          }
        } catch (err) {
          console.error('Error loading module news:', err);
        }
      } else {
        setModuleNews(featuredNews.slice(0, newsCount));
      }
    };

    loadModuleNews();
  }, [manualNewsIds, autoFetch, moduleId, featuredNews, newsCount]);

  // Preload images
  useEffect(() => {
    if (preloadImages && displayNews.length > 0) {
      displayNews.forEach((news) => {
        if (news.images && news.images.length > 0) {
          const img = new window.Image();
          img.onload = () => {
            setLoadedImages(prev => new Set(prev).add(news.images[0].url));
          };
          img.onerror = () => {
            setImageErrors(prev => new Set(prev).add(news.images[0].url));
          };
          img.src = news.images[0].url;
        }
      });
    }
  }, [displayNews, preloadImages]);

  // Auto-play logic
  useEffect(() => {
    if (!enableAutoplay || !isPlaying || isPaused || displayNews.length <= 1) {
      return;
    }

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayNews.length);
    }, autoplaySpeed);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enableAutoplay, isPlaying, isPaused, displayNews.length, autoplaySpeed]);

  // Track module view
  useEffect(() => {
    if (displayNews.length > 0) {
      trackModuleView(moduleId, 'main-visual');
    }
  }, [moduleId, trackModuleView, displayNews.length]);

  // Event handlers
  const handleNewsClick = useCallback(async (news: News) => {
    await trackNewsClick(news.id, moduleId, 'main-visual');
  }, [trackNewsClick, moduleId]);

  const handlePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const handlePrevious = useCallback(() => {
    setCurrentIndex(prev => 
      prev === 0 ? displayNews.length - 1 : prev - 1
    );
  }, [displayNews.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % displayNews.length);
  }, [displayNews.length]);

  const handleDotClick = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) {
      setIsPaused(true);
    }
  }, [pauseOnHover]);

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover) {
      setIsPaused(false);
    }
  }, [pauseOnHover]);

  // Format date helper
  const formatDate = useCallback((date: Date | string | number) => {
    const newsDate = new Date(date);
    return newsDate.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }, []);

  // Format views helper
  const formatViews = useCallback((views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  }, []);

  // Get category color
  const getCategoryColor = useCallback((category: string) => {
    const colors: Record<string, string> = {
      'gundem': 'bg-red-600',
      'ekonomi': 'bg-green-600',
      'spor': 'bg-blue-600',
      'teknoloji': 'bg-purple-600',
      'saglik': 'bg-pink-600',
      'kultur': 'bg-yellow-600',
      'dunya': 'bg-indigo-600',
      'politika': 'bg-gray-600'
    };
    return colors[category] || 'bg-gray-600';
  }, []);

  // Get image URL with fallback
  const getImageUrl = useCallback((news: News) => {
    if (news.images && news.images.length > 0) {
      const imageUrl = news.images[0].url;
      if (!imageErrors.has(imageUrl)) {
        return imageUrl;
      }
    }
    return '/images/placeholder-news.jpg';
  }, [imageErrors]);

  // Get transition variants
  const getTransitionVariants = useCallback(() => {
    switch (transitionEffect) {
      case 'fade':
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 }
        };
      case 'zoom':
        return {
          initial: { opacity: 0, scale: 1.1 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.9 }
        };
      case 'flip':
        return {
          initial: { opacity: 0, rotateY: 90 },
          animate: { opacity: 1, rotateY: 0 },
          exit: { opacity: 0, rotateY: -90 }
        };
      default: // slide
        return {
          initial: { opacity: 0, x: 100 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: -100 }
        };
    }
  }, [transitionEffect]);

  if (!loading && displayNews.length === 0 && !error) {
    return null;
  }

  const currentNews = displayNews[currentIndex];

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[500px] lg:h-[600px] overflow-hidden rounded-lg shadow-2xl"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center h-full bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Öne çıkan haberler yükleniyor...</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="flex items-center justify-center h-full bg-red-50">
          <div className="text-center">
            <div className="text-red-600 mb-2">⚠️</div>
            <p className="text-red-600">Haberler yüklenirken hata oluştu</p>
          </div>
        </div>
      )}

      {/* Main content */}
      {!loading && !error && currentNews && (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={getTransitionVariants().initial}
            animate={getTransitionVariants().animate}
            exit={getTransitionVariants().exit}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="relative w-full h-full"
          >
            {/* Background image */}
            <div className="absolute inset-0">
              <Image
                src={getImageUrl(currentNews)}
                alt={currentNews.images?.[0]?.alt || currentNews.title}
                fill
                className="object-cover"
                priority={currentIndex === 0}
                sizes="(max-width: 768px) 100vw, 1200px"
                onError={() => {
                  setImageErrors(prev => new Set(prev).add(currentNews.images?.[0]?.url || ''));
                }}
              />
              
              {/* Overlay */}
              <div 
                className="absolute inset-0 bg-black"
                style={{ opacity: overlayOpacity }}
              />
            </div>

            {/* Content overlay */}
            <div className="absolute inset-0 flex items-end">
              <div className="w-full p-6 lg:p-8">
                <Link 
                  href={`/haber/${currentNews.id}`}
                  onClick={() => handleNewsClick(currentNews)}
                  className="block group"
                >
                  {/* Category badge */}
                  {showCategory && currentNews.category && (
                    <div className="mb-3">
                      <span className={`
                        inline-block px-3 py-1 text-xs font-semibold text-white rounded-full
                        ${getCategoryColor(currentNews.category)}
                      `}>
                        {currentNews.category.toUpperCase()}
                      </span>
                    </div>
                  )}

                  {/* Title */}
                  <h1 className="text-2xl lg:text-4xl font-bold text-white mb-3 group-hover:text-gray-200 transition-colors duration-200">
                    {currentNews.title}
                  </h1>

                  {/* Summary */}
                  <p className="text-gray-200 text-lg mb-4 line-clamp-2">
                    {currentNews.summary}
                  </p>

                  {/* Meta information */}
                  <div className="flex flex-wrap items-center text-sm text-gray-300 space-x-4">
                    {showAuthor && (
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        <span>{currentNews.author}</span>
                      </div>
                    )}
                    
                    {showDate && (
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{formatDate(currentNews.publishedAt)}</span>
                      </div>
                    )}
                    
                    {showViews && currentNews.views > 0 && (
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        <span>{formatViews(currentNews.views)} görüntüleme</span>
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Navigation arrows */}
      {displayNews.length > 1 && (navigationStyle === 'arrows' || navigationStyle === 'both') && (
        <>
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-all duration-200"
            aria-label="Önceki haber"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-all duration-200"
            aria-label="Sonraki haber"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Navigation dots and controls */}
      {displayNews.length > 1 && (navigationStyle === 'dots' || navigationStyle === 'both') && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-3">
          {/* Dots */}
          <div className="flex space-x-2">
            {displayNews.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`
                  w-3 h-3 rounded-full transition-all duration-200
                  ${index === currentIndex 
                    ? 'bg-white scale-125' 
                    : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                  }
                `}
                aria-label={`Haber ${index + 1}`}
              />
            ))}
          </div>

          {/* Play/Pause button */}
          {enableAutoplay && (
            <button
              onClick={handlePlayPause}
              className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-all duration-200"
              aria-label={isPlaying ? "Duraklat" : "Oynat"}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      )}

      {/* Progress bar */}
      {showProgressBar && enableAutoplay && isPlaying && !isPaused && displayNews.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white bg-opacity-30">
          <motion.div
            className="h-full bg-white"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ 
              duration: autoplaySpeed / 1000, 
              ease: "linear",
              repeat: Infinity
            }}
            key={currentIndex}
          />
        </div>
      )}

      {/* Thumbnail navigation */}
      {displayNews.length > 1 && (
        <div className="absolute top-4 right-4 hidden lg:block">
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {displayNews.map((news, index) => (
              <button
                key={news.id}
                onClick={() => handleDotClick(index)}
                className={`
                  flex items-center space-x-2 p-2 rounded bg-black bg-opacity-50 text-white text-xs
                  transition-all duration-200 max-w-xs
                  ${index === currentIndex 
                    ? 'bg-opacity-75 border border-white' 
                    : 'hover:bg-opacity-75'
                  }
                `}
              >
                {news.images && news.images.length > 0 && (
                  <div className="w-8 h-6 relative flex-shrink-0">
                    <Image
                      src={getImageUrl(news)}
                      alt={news.title}
                      fill
                      className="object-cover rounded"
                      sizes="32px"
                    />
                  </div>
                )}
                <span className="truncate">{news.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}