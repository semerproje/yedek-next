'use client';

import React, { useEffect, useState } from "react";
import Image from "next/image";

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  image: string;
  pubDateFormatted: string;
  source: string;
  url: string;
}

export default function EconomyNewsGrid() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with Firestore fetch
    setTimeout(() => {
      setNewsList([
        {
          id: "1",
          title: "Borsa Yükselişte",
          summary: "BIST 100 endeksi haftaya yükselişle başladı.",
          image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80",
          pubDateFormatted: "28 Tem 2025",
          source: "Net Haberler",
          url: "/haber/1",
        },
        {
          id: "2",
          title: "Dolar/TL Dalgalı Seyrediyor",
          summary: "Döviz piyasalarında hareketlilik devam ediyor.",
          image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
          pubDateFormatted: "28 Tem 2025",
          source: "Net Haberler",
          url: "/haber/2",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Yükleniyor...</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {newsList.map(news => (
        <a
          key={news.id}
          href={news.url}
          className="block bg-white rounded-2xl shadow-lg border border-gray-100 dark:bg-[#232c3a]/90 dark:border-[#2a3142] overflow-hidden hover:shadow-2xl transition-all"
        >
          <div className="relative w-full h-48">
            <Image
              src={news.image}
              alt={news.title}
              fill
              className="object-cover"
              onError={e => {
                (e.target as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80";
              }}
            />
          </div>
          <div className="p-4">
            <div className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              {news.title}
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-200 mb-2">
              {news.summary}
            </div>
            <div className="text-xs text-gray-400 dark:text-gray-400 flex justify-between">
              <span>{news.pubDateFormatted}</span>
              <span>{news.source}</span>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
