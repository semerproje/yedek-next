"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { collection, query, getDocs, where, orderBy, limit } from "firebase/firestore";
import { db } from "../../lib/firebase";

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  imageUrl?: string;
  category: string;
  author: string;
  createdAt: Date;
  status: string;
}

function NewsImage({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  const [error, setError] = useState(false);
  const fallback = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236b7280' font-family='sans-serif' font-size='14'%3EGörsel Yükleniyor%3C/text%3E%3C/svg%3E";
  return (
    <img
      src={error ? fallback : src}
      alt={alt}
      className={className + " bg-gray-100"}
      loading="lazy"
      draggable={false}
      style={{ userSelect: "none" }}
      onError={() => setError(true)}
    />
  );
}

// Fallback veri
const fallbackNews = [
  {
    id: "1",
    title: "Dijital Medya ve Okur Güveni",
    imageUrl: "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=800&q=80",
    summary: "Türkiye'de medya güveni neden düşüyor? Araştırma sonuçlarını ve çözüm önerilerini inceledik.",
    category: "Teknoloji",
    author: "Editör",
    createdAt: new Date(),
    status: "published"
  },
  {
    id: "2",
    title: "Kenya Sokaklarında Kanlı Protesto!",
    imageUrl: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80",
    summary: "Kenya'da ekonomik kriz ve ifade özgürlüğü ihlalleri nedeniyle büyüyen protestoları derinlemesine analiz ettik.",
    category: "Dünya",
    author: "Editör",
    createdAt: new Date(),
    status: "published"
  },
  {
    id: "3",
    title: "Basında Dijitalleşme ve Son Trendler",
    imageUrl: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80",
    summary: "Haber merkezlerinde dijital dönüşümün etkileri ve yeni yayıncılık araçları.",
    category: "Teknoloji",
    author: "Editör",
    createdAt: new Date(),
    status: "published"
  },
  {
    id: "4",
    title: "İzmir'de Makilik Alanda Yangın",
    imageUrl: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=700&q=80",
    summary: "İzmir'in Dikili ilçesinde çöplükte çıkan ve makilik alana sıçrayan yangına müdahale ediliyor.",
    category: "Gündem",
    author: "Editör",
    createdAt: new Date(),
    status: "published"
  },
  {
    id: "5",
    title: "Vergi Düzenlemeleri ve Ekonomiye Etkileri",
    imageUrl: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=400&q=80",
    summary: "Yeni vergi düzenlemeleri ve ekonomiye etkileri hakkında detaylı analiz.",
    category: "Ekonomi",
    author: "Editör",
    createdAt: new Date(),
    status: "published"
  },
  {
    id: "6",
    title: "Spor Gündemi: Transfer Sezonu",
    imageUrl: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=400&q=80",
    summary: "Futbol ve basketbol dünyasında transfer sezonunun öne çıkan gelişmeleri.",
    category: "Spor",
    author: "Editör",
    createdAt: new Date(),
    status: "published"
  },
  {
    id: "7",
    title: "Kültür Sanat: Yeni Sergiler",
    imageUrl: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=400&q=80",
    summary: "Türkiye ve dünyadan yeni sanat sergileri ve kültürel etkinlikler.",
    category: "Kültür",
    author: "Editör",
    createdAt: new Date(),
    status: "published"
  },
  {
    id: "8",
    title: "Enerji Sektöründe Yenilikler",
    imageUrl: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=400&q=80",
    summary: "Enerji sektöründe son yenilikler ve sürdürülebilirlik çalışmaları.",
    category: "Enerji",
    author: "Editör",
    createdAt: new Date(),
    status: "published"
  }
];

function formatTimeAgo(date: Date) {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days} gün önce`;
  if (hours > 0) return `${hours} saat önce`;
  return "Az önce";
}

export default function HeadlineNewsGrid() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNews() {
      if (!db) {
        console.warn("Firebase db not initialized");
        setNews(fallbackNews);
        setLoading(false);
        return;
      }

      try {
        const newsQuery = query(
          collection(db, 'news'),
          where('status', '==', 'published'),
          orderBy('createdAt', 'desc'),
          limit(8)
        );
        
        const snapshot = await getDocs(newsQuery);
        
        if (!snapshot.empty) {
          const newsData = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date()
            };
          }) as NewsItem[];
          
          // En az 8 haber olduğundan emin ol
          if (newsData.length >= 8) {
            setNews(newsData);
          } else {
            // Eksik haberleri fallback ile tamamla
            const combined = [...newsData, ...fallbackNews.slice(newsData.length)];
            setNews(combined);
          }
        } else {
          setNews(fallbackNews);
        }
      } catch (error) {
        console.error('News loading error:', error);
        setNews(fallbackNews);
      } finally {
        setLoading(false);
      }
    }

    loadNews();
  }, []);

  if (loading) {
    return (
      <section className="w-full max-w-[1200px] mx-auto px-2 sm:px-0 mt-8">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Haberler yükleniyor...</p>
          </div>
        </div>
      </section>
    );
  }

  if (news.length < 8) return null;

  return (
    <section className="w-full max-w-[1200px] mx-auto px-2 sm:px-0 mt-8">
      {/* Masaüstü GRID */}
      <div className="hidden md:grid grid-cols-3 grid-rows-3 gap-6 auto-rows-fr">
        {/* Sol 3 kart */}
        {news.slice(0, 3).map((item, idx) => (
          <Link
            href={`/haber/${item.id}`}
            key={item.id}
            className="col-start-1 col-end-2 bg-white shadow rounded-lg overflow-hidden border hover:shadow-lg transition flex flex-col"
            style={{ gridRow: idx + 1 }}
          >
            <NewsImage src={item.imageUrl || ""} alt={item.title} className="w-full h-40 object-cover" />
            <div className="p-3 flex-1 flex flex-col">
              <h3 className="font-bold text-lg mb-1 group-hover:underline">{item.title}</h3>
              <p className="text-gray-700 text-[15px] leading-snug line-clamp-3">{item.summary}</p>
              <div className="flex items-center justify-between mt-auto pt-2">
                <span className="text-xs text-gray-400">{formatTimeAgo(item.createdAt)}</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{item.category}</span>
              </div>
            </div>
          </Link>
        ))}

        {/* Orta büyük manşet */}
        <Link
          href={`/haber/${news[3].id}`}
          className="col-start-2 col-end-3 row-start-1 row-end-3 bg-white shadow-lg rounded-lg border hover:shadow-xl transition flex flex-col"
        >
          <NewsImage src={news[3].imageUrl || ""} alt={news[3].title} className="w-full h-56 object-cover" />
          <div className="px-5 pt-6 pb-3 flex-1 flex flex-col justify-start">
            <h2 className="text-[2.1rem] font-extrabold leading-tight mb-2 group-hover:underline">{news[3].title}</h2>
            <p className="text-gray-700 text-[1.07rem] leading-snug mb-2 line-clamp-4">
              {news[3].summary}
            </p>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-xs text-gray-400">{formatTimeAgo(news[3].createdAt)}</span>
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{news[3].category}</span>
            </div>
          </div>
        </Link>

        {/* Sağ 2 kart */}
        {news.slice(5, 7).map((item, idx) => (
          <Link
            href={`/haber/${item.id}`}
            key={item.id}
            className="col-start-3 col-end-4 bg-white shadow rounded-lg overflow-hidden border hover:shadow-lg transition flex flex-col"
            style={{ gridRow: idx + 1 }}
          >
            <NewsImage src={item.imageUrl || ""} alt={item.title} className="w-full h-40 object-cover" />
            <div className="p-3 flex-1 flex flex-col">
              <h3 className="font-bold text-lg mb-1 group-hover:underline">{item.title}</h3>
              <p className="text-gray-700 text-[15px] leading-snug line-clamp-3">{item.summary}</p>
              <div className="flex items-center justify-between mt-auto pt-2">
                <span className="text-xs text-gray-400">{formatTimeAgo(item.createdAt)}</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{item.category}</span>
              </div>
            </div>
          </Link>
        ))}

        {/* Sağ sütunun en altına: Son haber */}
        <Link
          href={`/haber/${news[7].id}`}
          className="col-start-3 col-end-4 row-start-3 row-end-4 bg-white shadow rounded-lg overflow-hidden border hover:shadow-lg transition flex flex-col"
        >
          <NewsImage src={news[7].imageUrl || ""} alt={news[7].title} className="w-full h-40 object-cover" />
          <div className="p-3 flex-1 flex flex-col">
            <h3 className="font-bold text-lg mb-1 group-hover:underline">{news[7].title}</h3>
            <p className="text-gray-700 text-[15px] leading-snug line-clamp-3">{news[7].summary}</p>
            <div className="flex items-center justify-between mt-auto pt-2">
              <span className="text-xs text-gray-400">{formatTimeAgo(news[7].createdAt)}</span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{news[7].category}</span>
            </div>
          </div>
        </Link>

        {/* Alt sıra: Kalan haberlerin geniş kartları */}
        <Link
          href={`/haber/${news[4].id}`}
          className="col-start-2 col-end-3 row-start-3 row-end-4 bg-white shadow rounded-lg overflow-hidden border hover:shadow-lg transition flex flex-col"
        >
          <NewsImage src={news[4].imageUrl || ""} alt={news[4].title} className="w-full h-40 object-cover" />
          <div className="p-3 flex-1 flex flex-col">
            <h3 className="font-bold text-lg mb-1 group-hover:underline">{news[4].title}</h3>
            <p className="text-gray-700 text-[15px] leading-snug line-clamp-3">{news[4].summary}</p>
            <div className="flex items-center justify-between mt-auto pt-2">
              <span className="text-xs text-gray-400">{formatTimeAgo(news[4].createdAt)}</span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{news[4].category}</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Mobil liste */}
      <div className="md:hidden space-y-4">
        {news.map((item) => (
          <Link
            href={`/haber/${item.id}`}
            key={item.id}
            className="block bg-white shadow rounded-lg overflow-hidden border hover:shadow-lg transition"
          >
            <div className="flex">
              <NewsImage src={item.imageUrl || ""} alt={item.title} className="w-24 h-24 object-cover flex-shrink-0" />
              <div className="p-3 flex-1">
                <h3 className="font-bold text-base mb-1 line-clamp-2">{item.title}</h3>
                <p className="text-gray-700 text-sm leading-snug line-clamp-2">{item.summary}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-400">{formatTimeAgo(item.createdAt)}</span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{item.category}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
}
