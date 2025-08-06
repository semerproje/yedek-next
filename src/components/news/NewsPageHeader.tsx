"use client";

import { Newspaper, TrendingUp, Clock, Search, Filter } from "lucide-react";

export default function NewsPageHeader() {
  return (
    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
              <Newspaper className="w-12 h-12" />
            </div>
            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
              <TrendingUp className="w-12 h-12" />
            </div>
            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
              <Clock className="w-12 h-12" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            Tüm Haberler
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed mb-8">
            Son dakika haberleri, güncel gelişmeler ve tüm kategorilerden haberler. 
            En güncel bilgilere anında ulaşın.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-blue-200">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Canlı Güncellemeler</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <span>Son Dakika</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
              <span>Trend Haberler</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span>Tüm Kategoriler</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
