"use client";

import { useState } from "react";
import Image from "next/image";
import { Clock, Eye, MessageCircle, Share2, Bookmark, Heart, TrendingUp, Calendar } from "lucide-react";

interface NewsDetailHeaderProps {
  news: {
    id: string;
    title: string;
    summary: string;
    image: string;
    category: string;
    author: {
      name: string;
      avatar: string;
      bio: string;
      twitter: string;
      articles: number;
    };
    publishDate: string;
    lastUpdate: string;
    readTime: string;
    views: number;
    comments: number;
    likes: number;
    shares: number;
    isBreaking: boolean;
    isTrending: boolean;
    tags: string[];
  };
}

export default function NewsDetailHeader({ news }: NewsDetailHeaderProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(news.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: news.title,
        text: news.summary,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // TODO: Show toast notification
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <header className="relative">
      {/* Hero Image */}
      <div className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <Image
          src={news.image}
          alt={news.title}
          fill
          className="object-cover"
          priority
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Content Overlay */}
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-8">
            <div className="max-w-4xl">
              
              {/* Badges */}
              <div className="flex gap-3 mb-4">
                <span className="bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-full">
                  {news.category}
                </span>
                {news.isBreaking && (
                  <span className="bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full animate-pulse">
                    SON DAKİKA
                  </span>
                )}
                {news.isTrending && (
                  <span className="bg-orange-600 text-white text-sm font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <TrendingUp size={14} />
                    TREND
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                {news.title}
              </h1>

              {/* Summary */}
              <p className="text-lg md:text-xl text-gray-200 mb-6 leading-relaxed">
                {news.summary}
              </p>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <Image
                    src={news.author.avatar}
                    alt={news.author.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <span className="font-medium text-white">{news.author.name}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  {formatDate(news.publishDate)}
                </div>
                
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  {news.readTime} okuma
                </div>
                
                <div className="flex items-center gap-1">
                  <Eye size={16} />
                  {news.views.toLocaleString()} görüntüleme
                </div>
                
                <div className="flex items-center gap-1">
                  <MessageCircle size={16} />
                  {news.comments} yorum
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            
            {/* Left Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  isLiked 
                    ? "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400" 
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/50"
                }`}
              >
                <Heart size={18} className={isLiked ? "fill-current" : ""} />
                <span className="font-medium">{likeCount}</span>
              </button>

              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  isBookmarked 
                    ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400" 
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/50"
                }`}
              >
                <Bookmark size={18} className={isBookmarked ? "fill-current" : ""} />
                <span className="hidden sm:inline">Kaydet</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-all duration-200"
              >
                <Share2 size={18} />
                <span className="hidden sm:inline">Paylaş ({news.shares})</span>
              </button>
            </div>

            {/* Right - Last Update */}
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Son güncelleme: {formatDate(news.lastUpdate)}
            </div>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Etiketler:</span>
            {news.tags.map((tag) => (
              <span
                key={tag}
                className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-xs px-2 py-1 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
