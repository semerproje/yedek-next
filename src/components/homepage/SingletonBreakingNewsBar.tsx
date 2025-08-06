'use client';

import { useEffect, useState } from 'react';
import { News } from '@/types/homepage';
import BreakingNewsManager from '@/lib/BreakingNewsManager';

interface SingletonBreakingNewsBarProps {
  newsCount?: number;
  settings?: {
    autoRotate?: boolean;
    rotateInterval?: number;
    showIcon?: boolean;
    backgroundColor?: 'red' | 'blue' | 'black';
  };
  testId?: string; // For identifying which instance this is
}

const SingletonBreakingNewsBar: React.FC<SingletonBreakingNewsBarProps> = ({
  newsCount = 5,
  settings = {
    autoRotate: true,
    rotateInterval: 5000,
    showIcon: true,
    backgroundColor: 'red'
  },
  testId = 'default'
}) => {
  const [news, setNews] = useState<News[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchBreakingNews = async () => {
    try {
      console.log(`🔍 [${testId}] Requesting breaking news...`);
      const manager = BreakingNewsManager.getInstance();
      const breakingNews = await manager.getBreakingNews(newsCount);
      setNews(breakingNews);
      console.log(`✅ [${testId}] Received ${breakingNews.length} items`);
    } catch (error) {
      console.error(`❌ [${testId}] Error:`, error);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBreakingNews();
  }, [newsCount, testId]);

  useEffect(() => {
    if (!settings?.autoRotate || news.length <= 1) return;
    
    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % news.length);
    }, settings.rotateInterval || 5000);
    
    return () => clearTimeout(timer);
  }, [currentIndex, news.length, settings?.autoRotate, settings?.rotateInterval]);

  const handleNewsClick = () => {
    if (currentNews && currentNews.id !== 'fallback-1') {
      // Navigate to news detail page
      window.open(`/news/${currentNews.category}/${currentNews.id}`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-gray-400 to-gray-500 text-white py-3 px-6 text-sm animate-pulse">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="flex-grow">
            <span className="bg-white bg-opacity-30 px-3 py-1 rounded-full text-xs font-bold">
              SON DAKİKA
            </span>
            <div className="mt-2 text-sm font-medium">
              Haberler yükleniyor...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 px-6 text-sm">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"/>
            </svg>
          </div>
          <div className="flex-grow">
            <span className="bg-white bg-opacity-30 px-3 py-1 rounded-full text-xs font-bold">
              SON DAKİKA
            </span>
            <div className="mt-2 text-sm font-medium">
              Şu anda son dakika haberi bulunmuyor
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentNews = news[currentIndex];
  
  const getBackgroundClass = () => {
    switch (settings.backgroundColor) {
      case 'blue':
        return 'bg-gradient-to-r from-blue-600 to-blue-700';
      case 'black':
        return 'bg-gradient-to-r from-gray-800 to-black';
      default:
        return 'bg-gradient-to-r from-red-600 to-red-700';
    }
  };

  return (
    <div className={`${getBackgroundClass()} text-white py-3 px-6 relative overflow-hidden shadow-lg`}>
      <div className="flex items-center space-x-4">
        {settings.showIcon && (
          <div className="flex-shrink-0 w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <svg className="w-5 h-5 fill-current animate-pulse" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
        )}
        
        <div className="flex-grow min-w-0">
          <div className="flex items-center space-x-3 mb-2">
            <span className="bg-white bg-opacity-30 px-3 py-1 rounded-full text-xs font-bold tracking-wide">
              SON DAKİKA
            </span>
            {testId && testId !== 'default' && (
              <span className="text-xs opacity-60 bg-black bg-opacity-20 px-2 py-1 rounded">
                [{testId}]
              </span>
            )}
          </div>
          
          <div 
            className="text-base font-semibold leading-tight mb-1 hover:text-yellow-200 transition-colors cursor-pointer"
            onClick={handleNewsClick}
          >
            {currentNews.title}
          </div>
          
          {currentNews.summary && (
            <div className="text-sm opacity-90 leading-relaxed line-clamp-2">
              {currentNews.summary}
            </div>
          )}
        </div>

        {news.length > 1 && (
          <div className="flex-shrink-0 flex flex-col items-center">
            <div className="text-xs opacity-75 mb-1">
              {currentIndex + 1}/{news.length}
            </div>
            <div className="flex space-x-1">
              {news.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-white' 
                      : 'bg-white bg-opacity-40'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Moving gradient overlay for visual appeal */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-10 animate-pulse pointer-events-none"></div>

      {/* Progress indicator for auto-rotation */}
      {settings.autoRotate && news.length > 1 && (
        <div className="absolute bottom-0 left-0 h-1 bg-white bg-opacity-20 w-full">
          <div 
            className="h-full bg-white bg-opacity-80 transition-all duration-100 ease-linear"
            style={{
              width: '0%',
              animation: `progress ${settings.rotateInterval || 5000}ms linear infinite`
            }}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default SingletonBreakingNewsBar;
