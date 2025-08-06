"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Eye, TrendingUp } from "lucide-react";

interface RelatedNewsProps {
  newsId: string;
  category: string;
}

interface RelatedNewsItem {
  id: string;
  title: string;
  summary: string;
  image: string;
  category: string;
  publishDate: string;
  readTime: string;
  views: number;
  author: string;
}

export default function RelatedNews({ newsId, category }: RelatedNewsProps) {
  const [relatedNews, setRelatedNews] = useState<RelatedNewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    setTimeout(() => {
      const mockRelatedNews: RelatedNewsItem[] = [
        {
          id: "rel1",
          title: "TCMB Başkanı'ndan Kritik Enflasyon Açıklaması",
          summary: "Merkez Bankası Başkanı, enflasyonla mücadele konusunda kararlı olduklarını belirtti.",
          image: "https://images.unsplash.com/photo-1554224155-6972dc5b77d2?auto=format&fit=crop&w=600&q=80",
          category: "Ekonomi",
          publishDate: "1 saat önce",
          readTime: "4 dk",
          views: 2340,
          author: "Mehmet Kaya"
        },
        {
          id: "rel2",
          title: "Borsa İstanbul'da Günün En Yüksek Artışı",
          summary: "BIST 100 endeksi güne yükselişle başladı ve gün içinde yüzde 3 artış kaydetti.",
          image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80",
          category: "Ekonomi",
          publishDate: "3 saat önce",
          readTime: "6 dk",
          views: 1890,
          author: "Ayşe Demir"
        },
        {
          id: "rel3",
          title: "Dolar/TL Kurunda Dalgalanma Sürüyor",
          summary: "USD/TL paritesi, piyasa beklentileri doğrultusunda hareket ediyor.",
          image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80",
          category: "Ekonomi",
          publishDate: "5 saat önce",
          readTime: "3 dk",
          views: 3210,
          author: "Can Özkan"
        },
        {
          id: "rel4",
          title: "Avrupa Merkez Bankası Faiz Kararı",
          summary: "ECB'nin aldığı faiz kararı, Türkiye ekonomisi üzerinde de etkili olacak.",
          image: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=600&q=80",
          category: "Ekonomi",
          publishDate: "1 gün önce",
          readTime: "5 dk",
          views: 4560,
          author: "Zeynep Yıldız"
        }
      ];
      
      // Filter out current news and limit to 4 items
      const filtered = mockRelatedNews.filter(item => item.id !== newsId).slice(0, 4);
      setRelatedNews(filtered);
      setLoading(false);
    }, 800);
  }, [newsId, category]);

  if (loading) {
    return (
      <div className="mt-12">
        <div className="flex items-center gap-2 mb-8">
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-48 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse">
              <div className="w-full h-48 bg-gray-300 dark:bg-gray-600"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-4 w-3/4"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (relatedNews.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <div className="flex items-center gap-2 mb-8">
        <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          İlgili Haberler
        </h2>
        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
          ({category} kategorisinden)
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedNews.map((item) => (
          <article
            key={item.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 group"
          >
            <div className="relative">
              <Link href={`/haber/${item.id}`}>
                <Image
                  src={item.image}
                  alt={item.title}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                />
              </Link>
              
              <div className="absolute top-3 left-3">
                <span className="bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                  {item.category}
                </span>
              </div>
            </div>

            <div className="p-4">
              <Link href={`/haber/${item.id}`}>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                  {item.title}
                </h3>
              </Link>

              <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                {item.summary}
              </p>

              <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  {item.publishDate}
                </div>
                <div className="flex items-center gap-1">
                  <Eye size={12} />
                  {item.views.toLocaleString()}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.author}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {item.readTime} okuma
                  </p>
                </div>
                
                <Link href={`/haber/${item.id}`}>
                  <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm transition-colors">
                    Oku →
                  </button>
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* View More Button */}
      <div className="text-center mt-8">
        <Link href={`/kategori/${category.toLowerCase()}`}>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200">
            {category} Kategorisindeki Tüm Haberler
          </button>
        </Link>
      </div>
    </div>
  );
}
