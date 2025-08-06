"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { collection, query, where, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

function handleImageError(e: React.SyntheticEvent<HTMLImageElement, Event>) {
  const target = e.target as HTMLImageElement;
  target.src = "/assets/placeholder-news.jpg";
}

interface NewsItem {
  id: string;
  title: string;
  summary?: string;
  image?: string;
  category: string;
  pubDate: Date;
}

export default function EnvironmentNewsGridFixed() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!db) return;
    
    const q = query(
      collection(db, "news"),
      where("category", "==", "environment"),
      orderBy("pubDate", "desc"),
      limit(12)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const news = snapshot.docs.map((doc) => ({ 
          id: doc.id, 
          ...doc.data() 
        })) as NewsItem[];
        setNewsList(news);
        setLoading(false);
      },
      (error) => {
        console.error("Haber yüklenirken hata:", error);
        setError("Haberler yüklenemedi");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-200 h-32 rounded"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {newsList.map((item) => (
        <Link 
          key={item.id} 
          href={`/haber/${item.id}`}
          className="group hover:shadow-lg transition-shadow duration-300"
        >
          <article className="bg-white rounded-lg overflow-hidden border border-gray-200">
            {item.image && (
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={handleImageError}
                />
              </div>
            )}
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                {item.title}
              </h3>
              {item.summary && (
                <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                  {item.summary}
                </p>
              )}
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                  Çevre
                </span>
                <time>
                  {item.pubDate && new Date(item.pubDate).toLocaleDateString('tr-TR')}
                </time>
              </div>
            </div>
          </article>
        </Link>
      ))}
    </div>
  );
}
