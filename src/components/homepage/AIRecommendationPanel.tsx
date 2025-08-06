"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, 
  Sparkles, 
  TrendingUp, 
  Eye, 
  Clock, 
  User, 
  Target,
  Zap,
  Lightbulb,
  Star,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Settings
} from "lucide-react";
import { useModuleNews, useAnalytics, useLocalStorage } from "./hooks/useHomepage";
import { HomepageNewsService } from "@/lib/firestore/homepage-services";
import { News, HomepageModule, ModuleSettings } from "@/types/homepage";

interface AIRecommendationPanelProps {
  moduleId?: string;
  module?: HomepageModule;
  settings?: ModuleSettings & {
    maxItems?: number;
    showViews?: boolean;
    personalizeContent?: boolean;
    showReasonings?: boolean;
    enableFeedback?: boolean;
    refreshInterval?: number; // minutes
    aiModel?: 'basic' | 'advanced' | 'premium';
    categories?: string[];
    userBehaviorWeight?: number;
    contentSimilarityWeight?: number;
    recencyWeight?: number;
    popularityWeight?: number;
  };
}

// AI Recommendation reasons
const RECOMMENDATION_REASONS = [
  "İlgi alanlarınıza uygun",
  "Benzer içerikleri okudunuz",
  "Popülerlik artıyor",
  "Son zamanlarda trend",
  "Kişiselleştirilmiş seçim",
  "Editör önerisi",
  "Kategori tercihinize uygun",
  "Yüksek etkileşim",
  "Güncel konu",
  "Eksik kaldığınız haber"
];

// Mock user preferences for demonstration
const DEFAULT_USER_PREFERENCES = {
  categories: ['teknoloji', 'ekonomi', 'spor'],
  tags: ['AI', 'blockchain', 'startup', 'finans'],
  readingTime: 'evening',
  contentLength: 'medium',
  topics: ['innovation', 'business', 'science']
};

interface RecommendationCardProps {
  news: News;
  reason: string;
  score: number;
  index: number;
  showViews: boolean;
  showReasonings: boolean;
  enableFeedback: boolean;
  onNewsClick: (news: News) => void;
  onFeedback: (newsId: string, feedback: 'like' | 'dislike') => void;
}

function RecommendationCard({
  news,
  reason,
  score,
  index,
  showViews,
  showReasonings,
  enableFeedback,
  onNewsClick,
  onFeedback
}: RecommendationCardProps) {
  const [imageError, setImageError] = useState(false);
  const [feedback, setFeedback] = useLocalStorage(`ai-feedback-${news.id}`, null);

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

  const getImageUrl = useCallback(() => {
    if (news.images && news.images.length > 0 && !imageError) {
      return news.images[0].url;
    }
    return '/images/placeholder-news.jpg';
  }, [news.images, imageError]);

  const getScoreColor = useCallback((score: number) => {
    if (score >= 0.8) return 'text-green-600 bg-green-100';
    if (score >= 0.6) return 'text-blue-600 bg-blue-100';
    if (score >= 0.4) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  }, []);

  const handleFeedback = useCallback((type: 'like' | 'dislike') => {
    setFeedback(type);
    onFeedback(news.id, type);
  }, [news.id, onFeedback, setFeedback]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all duration-200 overflow-hidden group"
    >
      <div className="flex space-x-3 p-3">
        {/* Image */}
        <div className="w-16 h-12 relative flex-shrink-0">
          <Image
            src={getImageUrl()}
            alt={news.title}
            fill
            className="object-cover rounded"
            sizes="64px"
            onError={() => setImageError(true)}
          />
          
          {/* AI Badge */}
          <div className="absolute -top-1 -right-1">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-full p-1">
              <Brain className="w-2 h-2 text-white" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <Link 
            href={`/haber/${news.id}`}
            onClick={() => onNewsClick(news)}
            className="block"
          >
            <h4 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-purple-600 transition-colors duration-200">
              {news.title}
            </h4>
            
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>{formatDate(news.publishedAt)}</span>
                
                {showViews && news.views > 0 && (
                  <>
                    <span>•</span>
                    <Eye className="w-3 h-3" />
                    <span>{formatViews(news.views)}</span>
                  </>
                )}
              </div>

              {/* AI Score */}
              <div className={`px-1.5 py-0.5 rounded text-xs font-medium ${getScoreColor(score)}`}>
                {Math.round(score * 100)}%
              </div>
            </div>
          </Link>

          {/* AI Reasoning */}
          {showReasonings && (
            <div className="mt-2 flex items-center space-x-1">
              <Lightbulb className="w-3 h-3 text-purple-500" />
              <span className="text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                {reason}
              </span>
            </div>
          )}

          {/* Feedback */}
          {enableFeedback && (
            <div className="flex items-center space-x-1 mt-2">
              <button
                onClick={() => handleFeedback('like')}
                className={`p-1 rounded transition-colors duration-200 ${
                  feedback === 'like' 
                    ? 'text-green-600 bg-green-100' 
                    : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                }`}
                title="Beğendim"
              >
                <ThumbsUp className="w-3 h-3" />
              </button>
              
              <button
                onClick={() => handleFeedback('dislike')}
                className={`p-1 rounded transition-colors duration-200 ${
                  feedback === 'dislike' 
                    ? 'text-red-600 bg-red-100' 
                    : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                }`}
                title="Beğenmedim"
              >
                <ThumbsDown className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function AIRecommendationPanel({
  moduleId = "ai-recommendations-default",
  module,
  settings = {}
}: AIRecommendationPanelProps) {
  // Hooks
  const { news: moduleNews, loading, error, refreshNews } = useModuleNews(module, true);
  const { trackModuleView, trackNewsClick } = useAnalytics();
  
  // State
  const [recommendations, setRecommendations] = useState<Array<News & { reason: string; score: number }>>([]);
  const [userPreferences, setUserPreferences] = useLocalStorage('ai-user-preferences', DEFAULT_USER_PREFERENCES);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [feedbackStats, setFeedbackStats] = useLocalStorage('ai-feedback-stats', { likes: 0, dislikes: 0 });

  // Settings with defaults
  const {
    maxItems = 10,
    showViews = true,
    personalizeContent = true,
    showReasonings = true,
    enableFeedback = true,
    refreshInterval = 30,
    aiModel = 'advanced',
    categories = [],
    userBehaviorWeight = 0.4,
    contentSimilarityWeight = 0.3,
    recencyWeight = 0.2,
    popularityWeight = 0.1
  } = settings;

  // AI Recommendation Algorithm
  const calculateRecommendationScore = useCallback((news: News) => {
    let score = 0;
    let reasoning = '';

    // User behavior weight
    if (personalizeContent) {
      // Category preference
      if (userPreferences.categories.includes(news.category)) {
        score += userBehaviorWeight * 0.5;
        reasoning = 'Kategori tercihinize uygun';
      }

      // Tag preference
      const matchingTags = news.tags.filter(tag => 
        userPreferences.tags.some(userTag => 
          tag.toLowerCase().includes(userTag.toLowerCase())
        )
      );
      if (matchingTags.length > 0) {
        score += userBehaviorWeight * 0.3 * (matchingTags.length / news.tags.length);
        reasoning = 'İlgi alanlarınıza uygun';
      }

      // Topic matching
      const contentText = `${news.title} ${news.summary}`.toLowerCase();
      const topicMatches = userPreferences.topics.filter(topic =>
        contentText.includes(topic.toLowerCase())
      );
      if (topicMatches.length > 0) {
        score += userBehaviorWeight * 0.2;
        reasoning = 'Kişiselleştirilmiş seçim';
      }
    }

    // Content similarity (simplified)
    if (news.featured) {
      score += contentSimilarityWeight * 0.6;
      reasoning = reasoning || 'Editör önerisi';
    }
    
    if (news.breaking || news.urgent) {
      score += contentSimilarityWeight * 0.4;
      reasoning = reasoning || 'Güncel konu';
    }

    // Recency weight
    const ageHours = (Date.now() - new Date(news.publishedAt).getTime()) / (1000 * 60 * 60);
    if (ageHours <= 6) {
      score += recencyWeight * 0.8;
      reasoning = reasoning || 'Son zamanlarda trend';
    } else if (ageHours <= 24) {
      score += recencyWeight * 0.5;
      reasoning = reasoning || 'Güncel haber';
    }

    // Popularity weight
    const viewsScore = Math.min(news.views / 1000, 1);
    score += popularityWeight * viewsScore;
    if (news.views > 500 && !reasoning) {
      reasoning = 'Popülerlik artıyor';
    }

    // AI model complexity boost
    if (aiModel === 'premium') {
      score *= 1.2;
    } else if (aiModel === 'advanced') {
      score *= 1.1;
    }

    return {
      score: Math.min(score, 1),
      reason: reasoning || RECOMMENDATION_REASONS[Math.floor(Math.random() * RECOMMENDATION_REASONS.length)]
    };
  }, [userPreferences, personalizeContent, userBehaviorWeight, contentSimilarityWeight, recencyWeight, popularityWeight, aiModel]);

  // Generate recommendations
  useEffect(() => {
    if (!moduleNews.length) return;

    let newsToProcess = [...moduleNews];

    // Filter by categories if specified
    if (categories.length > 0) {
      newsToProcess = newsToProcess.filter(news => categories.includes(news.category));
    }

    // Calculate scores and reasons
    const scoredNews = newsToProcess.map(news => {
      const { score, reason } = calculateRecommendationScore(news);
      return { ...news, score, reason };
    });

    // Sort by score and take top items
    const topRecommendations = scoredNews
      .sort((a, b) => b.score - a.score)
      .slice(0, maxItems);

    setRecommendations(topRecommendations);
  }, [moduleNews, categories, maxItems, calculateRecommendationScore]);

  // Auto-refresh
  useEffect(() => {
    if (!refreshInterval) return;

    const interval = setInterval(() => {
      refreshNews();
    }, refreshInterval * 60 * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval, refreshNews]);

  // Track module view
  useEffect(() => {
    if (recommendations.length > 0) {
      trackModuleView(moduleId, 'ai-recommendations');
    }
  }, [moduleId, trackModuleView, recommendations.length]);

  // Event handlers
  const handleNewsClick = useCallback(async (news: News) => {
    await trackNewsClick(news.id, moduleId, 'ai-recommendations');
    
    // Update user preferences based on clicked news
    if (personalizeContent) {
      const updatedPreferences = { ...userPreferences };
      
      // Add category if not already preferred
      if (!updatedPreferences.categories.includes(news.category)) {
        updatedPreferences.categories.push(news.category);
        // Keep only top 5 categories
        if (updatedPreferences.categories.length > 5) {
          updatedPreferences.categories = updatedPreferences.categories.slice(-5);
        }
      }
      
      // Add relevant tags
      news.tags.forEach(tag => {
        if (!updatedPreferences.tags.includes(tag)) {
          updatedPreferences.tags.push(tag);
        }
      });
      // Keep only top 10 tags
      if (updatedPreferences.tags.length > 10) {
        updatedPreferences.tags = updatedPreferences.tags.slice(-10);
      }
      
      setUserPreferences(updatedPreferences);
    }
  }, [trackNewsClick, moduleId, personalizeContent, userPreferences, setUserPreferences]);

  const handleFeedback = useCallback((newsId: string, feedback: 'like' | 'dislike') => {
    const updatedStats = { ...feedbackStats };
    if (feedback === 'like') {
      updatedStats.likes += 1;
    } else {
      updatedStats.dislikes += 1;
    }
    setFeedbackStats(updatedStats);

    // Update user preferences based on feedback
    const news = recommendations.find(r => r.id === newsId);
    if (news && personalizeContent) {
      const updatedPreferences = { ...userPreferences };
      
      if (feedback === 'like') {
        // Boost preference for this category and tags
        if (!updatedPreferences.categories.includes(news.category)) {
          updatedPreferences.categories.unshift(news.category);
        }
        news.tags.forEach(tag => {
          if (!updatedPreferences.tags.includes(tag)) {
            updatedPreferences.tags.unshift(tag);
          }
        });
      } else {
        // Reduce preference for this category and tags
        updatedPreferences.categories = updatedPreferences.categories.filter(cat => cat !== news.category);
        updatedPreferences.tags = updatedPreferences.tags.filter(tag => !news.tags.includes(tag));
      }
      
      setUserPreferences(updatedPreferences);
    }
  }, [feedbackStats, setFeedbackStats, recommendations, personalizeContent, userPreferences, setUserPreferences]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refreshNews();
    setTimeout(() => setIsRefreshing(false), 1000);
  }, [refreshNews]);

  if (!loading && recommendations.length === 0 && !error) {
    return null;
  }

  const accuracyRate = feedbackStats.likes + feedbackStats.dislikes > 0 
    ? Math.round((feedbackStats.likes / (feedbackStats.likes + feedbackStats.dislikes)) * 100)
    : 85; // Default rate

  return (
    <div className="w-full max-w-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              AI Öneriler
            </h3>
            <p className="text-xs text-gray-500">
              %{accuracyRate} doğruluk oranı
            </p>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="p-1.5 text-gray-400 hover:text-purple-600 transition-colors duration-200"
          title="Yenile"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* AI Model Badge */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2 text-xs">
          <Sparkles className="w-3 h-3 text-purple-500" />
          <span className="text-purple-600 font-medium">
            {aiModel === 'premium' ? 'Premium AI' : aiModel === 'advanced' ? 'Gelişmiş AI' : 'Temel AI'}
          </span>
        </div>
        
        {personalizeContent && (
          <div className="flex items-center space-x-1 text-xs text-blue-600">
            <Target className="w-3 h-3" />
            <span>Kişiselleştirilmiş</span>
          </div>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto mb-3"></div>
            <p className="text-sm text-gray-600">AI öneriler hazırlanıyor...</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-red-600">Hata: {error}</p>
        </div>
      )}

      {/* Recommendations */}
      {!loading && !error && recommendations.length > 0 && (
        <div className="space-y-3">
          <AnimatePresence>
            {recommendations.map((recommendation, index) => (
              <RecommendationCard
                key={recommendation.id}
                news={recommendation}
                reason={recommendation.reason}
                score={recommendation.score}
                index={index}
                showViews={showViews}
                showReasonings={showReasonings}
                enableFeedback={enableFeedback}
                onNewsClick={handleNewsClick}
                onFeedback={handleFeedback}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Statistics */}
      {enableFeedback && (feedbackStats.likes > 0 || feedbackStats.dislikes > 0) && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-green-600">
                <ThumbsUp className="w-3 h-3" />
                <span>{feedbackStats.likes}</span>
              </div>
              <div className="flex items-center space-x-1 text-red-600">
                <ThumbsDown className="w-3 h-3" />
                <span>{feedbackStats.dislikes}</span>
              </div>
            </div>
            <span className="text-gray-500">Geri bildirimleriniz</span>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && recommendations.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-3">
            <Brain className="w-12 h-12 mx-auto" />
          </div>
          <h4 className="text-sm font-medium text-gray-900 mb-1">
            Henüz öneri yok
          </h4>
          <p className="text-xs text-gray-600">
            AI size özel öneriler hazırlıyor.
          </p>
        </div>
      )}
    </div>
  );
}