"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Volume2, VolumeX, RotateCcw } from "lucide-react";
import { useBreakingNews, useAnalytics } from "./hooks/useHomepage";
import { HomepageModuleService } from "@/lib/firestore/homepage-services";
import { News, ModuleSettings } from "@/types/homepage";

interface EnhancedBreakingNewsBarProps {
  moduleId?: string;
  manualNewsIds?: string[];
  autoFetch?: boolean;
  newsCount?: number;
  settings?: ModuleSettings & {
    autoRotate?: boolean;
    rotateInterval?: number;
    backgroundColor?: 'red' | 'blue' | 'black';
    showIcon?: boolean;
    enableSound?: boolean;
    animationType?: 'slide' | 'fade' | 'marquee';
    pauseOnHover?: boolean;
    showTimestamp?: boolean;
    maxLength?: number;
  };
}

// Fallback breaking news for offline/error states
const fallbackBreakingNews: News[] = [
  {
    id: "breaking-fallback-1",
    title: "Son dakika: Sistem çevrimiçi, tüm haberler yükleniyor...",
    summary: "Haberler yükleniyor...",
    content: "Sistem başlatılıyor...",
    category: "sistem",
    images: [],
    author: "Sistem",
    source: "NetNext",
    createdAt: new Date(),
    publishedAt: new Date(),
    status: "published",
    views: 0,
    tags: ["sistem"],
    breaking: true,
    urgent: true,
    featured: false
  }
];

export default function EnhancedBreakingNewsBar({
  moduleId = "breaking-news-default",
  manualNewsIds = [],
  autoFetch = true,
  newsCount = 5,
  settings = {}
}: EnhancedBreakingNewsBarProps) {
  // Hooks
  const { breakingNews, loading, error } = useBreakingNews();
  const { trackModuleView, trackNewsClick } = useAnalytics();
  
  // State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [moduleNews, setModuleNews] = useState<News[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  
  // Refs
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Settings with defaults
  const {
    autoRotate = true,
    rotateInterval = 5000,
    backgroundColor = 'red',
    showIcon = true,
    enableSound = false,
    animationType = 'slide',
    pauseOnHover = true,
    showTimestamp = false,
    maxLength = 120
  } = settings;

  // Get news data
  const displayNews = moduleNews.length > 0 ? moduleNews : 
                     breakingNews.length > 0 ? breakingNews : 
                     fallbackBreakingNews;

  // Load module-specific news if manual IDs are provided
  useEffect(() => {
    const loadModuleNews = async () => {
      if (manualNewsIds.length > 0 && !autoFetch) {
        try {
          const module = await HomepageModuleService.getModule(moduleId);
          if (module) {
            // This would require a method to get news by IDs
            // For now, we'll use the real-time breaking news
            setModuleNews(breakingNews.slice(0, newsCount));
          }
        } catch (err) {
          console.error('Error loading module news:', err);
        }
      } else {
        setModuleNews(breakingNews.slice(0, newsCount));
      }
    };

    loadModuleNews();
  }, [manualNewsIds, autoFetch, moduleId, breakingNews, newsCount]);

  // Auto-rotation logic
  useEffect(() => {
    if (!autoRotate || !isPlaying || isPaused || displayNews.length <= 1) {
      return;
    }

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayNews.length);
    }, rotateInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoRotate, isPlaying, isPaused, displayNews.length, rotateInterval]);

  // Track module view
  useEffect(() => {
    if (displayNews.length > 0) {
      trackModuleView(moduleId, 'breaking-bar');
    }
  }, [moduleId, trackModuleView, displayNews.length]);

  // Sound notification for new breaking news
  useEffect(() => {
    if (enableSound && isSoundEnabled && breakingNews.length > 0) {
      // Create or play notification sound
      if (!audioRef.current) {
        audioRef.current = new Audio('/sounds/breaking-news.mp3');
        audioRef.current.volume = 0.3;
      }
      
      try {
        audioRef.current.play().catch(() => {
          // Sound autoplay might be blocked
          console.log('Sound autoplay blocked');
        });
      } catch (err) {
        console.error('Error playing sound:', err);
      }
    }
  }, [breakingNews.length, enableSound, isSoundEnabled]);

  // Event handlers
  const handleNewsClick = useCallback(async (news: News) => {
    await trackNewsClick(news.id, moduleId, 'breaking-bar');
  }, [trackNewsClick, moduleId]);

  const handlePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const handleSoundToggle = useCallback(() => {
    setIsSoundEnabled(prev => !prev);
  }, []);

  const handlePrevious = useCallback(() => {
    setCurrentIndex(prev => 
      prev === 0 ? displayNews.length - 1 : prev - 1
    );
  }, [displayNews.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % displayNews.length);
  }, [displayNews.length]);

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

  // Truncate text helper
  const truncateText = useCallback((text: string, length: number) => {
    return text.length > length ? text.substring(0, length) + '...' : text;
  }, []);

  // Format timestamp
  const formatTimestamp = useCallback((date: Date | string | number) => {
    const newsDate = new Date(date);
    return newsDate.toLocaleTimeString('tr-TR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }, []);

  // Get background color classes
  const getBackgroundColor = useCallback(() => {
    switch (backgroundColor) {
      case 'red':
        return 'bg-red-600 border-red-700';
      case 'blue':
        return 'bg-blue-600 border-blue-700';
      case 'black':
        return 'bg-gray-900 border-gray-800';
      default:
        return 'bg-red-600 border-red-700';
    }
  }, [backgroundColor]);

  // Don't render if no news and loading is complete
  if (!loading && displayNews.length === 0 && !error) {
    return null;
  }

  const currentNews = displayNews[currentIndex];

  return (
    <div 
      ref={containerRef}
      className={`
        relative w-full border-l-4 ${getBackgroundColor()} 
        text-white shadow-lg overflow-hidden
        transition-all duration-300 ease-in-out
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center p-3">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          <span className="text-sm">Son dakika haberleri yükleniyor...</span>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="flex items-center justify-center p-3 bg-red-700">
          <AlertCircle className="w-4 h-4 mr-2" />
          <span className="text-sm">Haberler yüklenirken hata oluştu</span>
        </div>
      )}

      {/* Main content */}
      {!loading && !error && currentNews && (
        <div className="flex items-center">
          {/* Breaking news icon */}
          {showIcon && (
            <div className="flex-shrink-0 px-3 py-2 bg-white bg-opacity-20">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-xs font-bold uppercase tracking-wider">
                  SON DAKİKA
                </span>
              </div>
            </div>
          )}

          {/* News content */}
          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ 
                  opacity: 0, 
                  x: animationType === 'slide' ? 50 : 0,
                  scale: animationType === 'fade' ? 0.95 : 1
                }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  scale: 1
                }}
                exit={{ 
                  opacity: 0, 
                  x: animationType === 'slide' ? -50 : 0,
                  scale: animationType === 'fade' ? 0.95 : 1
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="py-2 px-3"
              >
                <Link 
                  href={`/haber/${currentNews.id}`}
                  onClick={() => handleNewsClick(currentNews)}
                  className="block hover:text-gray-200 transition-colors duration-200"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {truncateText(currentNews.title, maxLength)}
                    </span>
                    {showTimestamp && (
                      <span className="text-xs opacity-75 ml-2 flex-shrink-0">
                        {formatTimestamp(currentNews.publishedAt)}
                      </span>
                    )}
                  </div>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          {displayNews.length > 1 && (
            <div className="flex-shrink-0 flex items-center space-x-1 px-2">
              {/* Navigation dots */}
              <div className="flex space-x-1">
                {displayNews.slice(0, Math.min(displayNews.length, 5)).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`
                      w-1.5 h-1.5 rounded-full transition-all duration-200
                      ${index === currentIndex ? 'bg-white' : 'bg-white bg-opacity-40'}
                    `}
                    aria-label={`Haber ${index + 1}`}
                  />
                ))}
              </div>

              {/* Play/Pause button */}
              <button
                onClick={handlePlayPause}
                className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors duration-200"
                aria-label={isPlaying ? "Duraklat" : "Oynat"}
              >
                {isPlaying ? (
                  <div className="w-2 h-2 flex space-x-0.5">
                    <div className="w-0.5 h-2 bg-white"></div>
                    <div className="w-0.5 h-2 bg-white"></div>
                  </div>
                ) : (
                  <div className="w-0 h-0 border-l-2 border-l-white border-t border-t-transparent border-b border-b-transparent"></div>
                )}
              </button>

              {/* Sound toggle */}
              {enableSound && (
                <button
                  onClick={handleSoundToggle}
                  className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors duration-200"
                  aria-label={isSoundEnabled ? "Sesi kapat" : "Sesi aç"}
                >
                  {isSoundEnabled ? (
                    <Volume2 className="w-3 h-3" />
                  ) : (
                    <VolumeX className="w-3 h-3" />
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Progress bar for auto-rotation */}
      {autoRotate && isPlaying && !isPaused && displayNews.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white bg-opacity-30">
          <motion.div
            className="h-full bg-white"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ 
              duration: rotateInterval / 1000, 
              ease: "linear",
              repeat: Infinity
            }}
            key={currentIndex}
          />
        </div>
      )}
    </div>
  );
}