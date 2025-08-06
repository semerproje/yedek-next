"use client";
import { useState, useEffect, useRef, useMemo, useCallback, memo } from "react";
import Link from "next/link";

import { collection, query, getDocs, where, orderBy, limit, documentId } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { News, ModuleSettings } from "@/types/homepage";
import { getNewsByModule, getFeaturedNews } from "@/data/mockNewsData";

interface MainVisualHeadlineProps {
  moduleId?: string;
  manualNewsIds?: string[];
  autoFetch?: boolean;
  newsCount?: number;
  settings?: ModuleSettings;
}

// Fallback data - sadece Firebase'den veri gelmezhse kullanılacak
const fallbackNews: News[] = [
  {
    id: "fallback-1",
    title: "Basında Dijitalleşme ve Son Trendler",
    summary: "Haber merkezlerinde dijital dönüşümün etkileri ve yeni yayıncılık araçları.",
    content: "Dijitalleşmenin etkilerini detaylı olarak inceliyoruz...",
    category: "teknoloji",
    images: [{ url: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80" }],
    author: "Editör",
    source: "NetNext",
    createdAt: new Date(),
    publishedAt: new Date(),
    status: "published",
    views: 1250,
    tags: ["dijital", "medya"],
    breaking: false,
    urgent: false,
    featured: true
  },
  {
    id: "fallback-2", 
    title: "Kenya Sokaklarında Kanlı Protesto!",
    summary: "Kenya'da ekonomik kriz ve ifade özgürlüğü ihlalleri nedeniyle büyüyen protestoları derinlemesine analiz ettik.",
    content: "Kenya'daki protestoların detaylı analizi...",
    category: "dunya",
    images: [{ url: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80" }],
    author: "Editör",
    source: "NetNext",
    createdAt: new Date(),
    publishedAt: new Date(),
    status: "published",
    views: 2100,
    tags: ["kenya", "protesto"],
    breaking: false,
    urgent: false,
    featured: true
  },
  {
    id: "fallback-3",
    title: "Dijital Medya ve Okur Güveni",
    summary: "Türkiye'de medya güveni neden düşüyor? Araştırma sonuçlarını ve çözüm önerilerini inceledik.",
    content: "Medya güveni üzerine kapsamlı araştırma...",
    category: "teknoloji",
    images: [{ url: "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=800&q=80" }],
    author: "Editör",
    source: "NetNext", 
    createdAt: new Date(),
    publishedAt: new Date(),
    status: "published",
    views: 980,
    tags: ["medya", "güven"],
    breaking: false,
    urgent: false,
    featured: true
  }
];

const ScrollList = memo(function ScrollList({ items, onItemClick, activeIndex }: { 
  items: Array<{id: string; title: string; image: string}>; 
  onItemClick: (item: {id: string; title: string; image: string}, idx: number) => void; 
  activeIndex: number 
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const scrollDown = useCallback(() => {
    if (scrollRef.current)
      scrollRef.current.scrollBy({ top: 180, behavior: "smooth" });
  }, []);
  
  return (
    <div className="flex flex-col h-full relative">
      <div
        ref={scrollRef}
        className="flex flex-col gap-3 overflow-y-scroll custom-scrollbar scrollbar-hide hover:scrollbar-default transition-all flex-1"
        style={{ maxHeight: 540, minHeight: 540, paddingRight: 2 }}
      >
        {items.map((item, idx) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onItemClick(item, idx)}
            className={`flex gap-3 group rounded-xl p-2 transition items-center cursor-pointer hover:bg-blue-50 focus:bg-blue-100 outline-none ${activeIndex === idx ? "bg-blue-100 font-bold" : ""}`}
            tabIndex={0}
            aria-label={item.title}
          >
            <img
              src={item.image || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='56' viewBox='0 0 64 56'%3E%3Crect width='64' height='56' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236b7280' font-family='sans-serif' font-size='8'%3E%F0%9F%93%B0%3C/text%3E%3C/svg%3E"}
              alt={item.title}
              className="w-16 h-14 object-cover rounded shadow border border-gray-200"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='56' viewBox='0 0 64 56'%3E%3Crect width='64' height='56' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236b7280' font-family='sans-serif' font-size='8'%3E%F0%9F%93%B0%3C/text%3E%3C/svg%3E";
              }}
            />
            <span className="font-medium text-[1rem] group-hover:text-red-700 line-clamp-2 text-left">
              {item.title}
            </span>
          </button>
        ))}
      </div>
      <button
        onClick={scrollDown}
        className="absolute left-0 bottom-0 w-full flex items-center justify-center h-12 border-t border-gray-200 text-gray-600 bg-white hover:bg-blue-50 transition"
        style={{ borderBottomLeftRadius: "12px", borderBottomRightRadius: "12px" }}
        aria-label="Listeyi aşağı kaydır"
      >
        <svg width="28" height="28" fill="none"><path d="M8 12l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
    </div>
  );
});

export default memo(function MainVisualHeadline({ 
  moduleId, 
  manualNewsIds = [], 
  autoFetch = true, 
  newsCount = 10,
  settings = {
    leftSideCount: 5,
    rightSideCount: 5,
    autoRefreshMinutes: 5,
    showWeather: false,
    showCurrency: false
  }
}: MainVisualHeadlineProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper function to get image URL from news item (memoized)
  const getImageUrl = useCallback((newsItem: News): string => {
    // İlk olarak images array'ini kontrol et
    if (newsItem.images && Array.isArray(newsItem.images) && newsItem.images.length > 0) {
      const firstImage = newsItem.images[0];
      if (firstImage && firstImage.url) {
        return firstImage.url;
      }
    }

    // Varsayılan görsel
    return '';
  }, []);

  // Firebase'den haberleri yükle veya mock data kullan
  useEffect(() => {
    let isActive = true;
    
    const timeoutId = setTimeout(async () => {
      if (!isActive) return;
      
      async function loadNews() {
        try {
          let newsData: News[] = [];

          // Mock data'dan haberleri al
          const mockMainNews = getNewsByModule('mainVisualHeadline');
          if (mockMainNews.length > 0) {
            newsData = mockMainNews.slice(0, newsCount);
            console.log('✅ Main visual headline mock data loaded:', newsData.length);
          }

          // Eğer mock data yoksa Firebase'den çekmeye çalış
          if (newsData.length === 0 && db) {
            // Firebase kodları...
            if (manualNewsIds.length > 0) {
              const manualQuery = query(
                collection(db, 'news'),
                where(documentId(), 'in', manualNewsIds.slice(0, 10)),
                where('status', '==', 'published')
              );
              
              const snapshot = await getDocs(manualQuery);
              newsData = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                  id: doc.id,
                  title: data.title || 'Başlık Bulunamadı',
                  summary: data.summary || data.content?.substring(0, 200) || 'Özet bulunamadı',
                  content: data.content || '',
                  category: data.category || 'Genel',
                  images: data.images || [],
                  author: data.author || 'Editör',
                  source: data.source || 'NetNext',
                  createdAt: data.createdAt,
                  publishedAt: data.publishedAt,
                  status: data.status,
                  views: data.views || 0,
                  tags: data.tags || [],
                  breaking: data.breaking || false,
                  urgent: data.urgent || false,
                  featured: data.featured || false
                } as News;
              });

              newsData = manualNewsIds.map(id => newsData.find(n => n.id === id)).filter(Boolean) as News[];
            }

            if (autoFetch && newsData.length < newsCount) {
              const neededCount = newsCount - newsData.length;
              const existingIds = newsData.map(n => n.id);
              
              const autoQuery = query(
                collection(db, 'news'),
                where('status', '==', 'published'),
                orderBy('publishedAt', 'desc'),
                limit(neededCount + existingIds.length)
              );
              
              const snapshot = await getDocs(autoQuery);
              const autoNews = snapshot.docs
                .map(doc => {
                  const data = doc.data();
                  return {
                    id: doc.id,
                    title: data.title || 'Başlık Bulunamadı',
                    summary: data.summary || data.content?.substring(0, 200) || 'Özet bulunamadı',
                    content: data.content || '',
                    category: data.category || 'Genel',
                    images: data.images || [],
                    author: data.author || 'Editör',
                    source: data.source || 'NetNext',
                    createdAt: data.createdAt,
                    publishedAt: data.publishedAt,
                    status: data.status,
                    views: data.views || 0,
                    tags: data.tags || [],
                    breaking: data.breaking || false,
                    urgent: data.urgent || false,
                    featured: data.featured || false
                  } as News;
                })
                .filter(n => !existingIds.includes(n.id))
                .slice(0, neededCount);

              newsData = [...newsData, ...autoNews];
            }
          }
          
          if (!isActive) return;
          
          if (newsData.length > 0) {
            setNews(newsData);
          } else {
            console.log('No news found, using fallback');
            setNews(fallbackNews);
          }
        } catch (error) {
          console.error('Main visual headline news loading error:', error);
          if (isActive) setNews(fallbackNews);
        } finally {
          if (isActive) setLoading(false);
        }
      }

      await loadNews();
    }, 200);

    return () => {
      isActive = false;
      clearTimeout(timeoutId);
    };
  }, [manualNewsIds, autoFetch, newsCount]);

  // Memoize computed values
  const { displayNews, currentNews, leftItems, rightItems } = useMemo(() => {
    const displayNews = news.length > 0 ? news : fallbackNews;
    const currentNews = displayNews[activeIndex] || fallbackNews[0];
    
    // Sol ve sağ panel için haberleri ayır
    const leftCount = settings?.leftSideCount || 5;
    const rightCount = settings?.rightSideCount || 5;
    
    const leftItems = displayNews.slice(1, Math.min(1 + leftCount, displayNews.length));
    const rightItems = displayNews.slice(1 + leftCount, Math.min(1 + leftCount + rightCount, displayNews.length));

    return { displayNews, currentNews, leftItems, rightItems };
  }, [news, activeIndex, settings?.leftSideCount, settings?.rightSideCount]);

  // Navigation functions
  const goToPrev = useCallback(() => setActiveIndex(i => (i === 0 ? displayNews.length - 1 : i - 1)), [displayNews.length]);
  const goToNext = useCallback(() => setActiveIndex(i => (i === displayNews.length - 1 ? 0 : i + 1)), [displayNews.length]);

  // Active index'i sınırla
  useEffect(() => {
    if (activeIndex >= displayNews.length) {
      setActiveIndex(0);
    }
  }, [displayNews.length, activeIndex]);

  // Auto refresh
  useEffect(() => {
    const refreshMinutes = settings?.autoRefreshMinutes || 0;
    if (refreshMinutes > 0) {
      const interval = setInterval(() => {
        // Refresh logic burada olacak
        console.log('Auto refreshing main visual headline...');
      }, refreshMinutes * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [settings?.autoRefreshMinutes]);

  if (loading) {
    return (
      <section className="w-full flex justify-center bg-white py-4 border-b border-blue-100">
        <div className="w-full max-w-[1530px] flex items-center justify-center" style={{ minHeight: 545 }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Manşet haberleri yükleniyor...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full flex justify-center bg-white py-4 border-b border-blue-100">
      <div className="w-full max-w-[1530px] flex flex-row items-stretch gap-0">
        {/* Sol blok */}
        <aside className="hidden xl:flex flex-col w-[320px] min-w-[290px] max-w-[340px] border-r border-gray-100 pr-7">
          <ScrollList
            items={leftItems.map(news => ({
              id: news.id,
              title: news.title,
              image: getImageUrl(news)
            }))}
            onItemClick={(_, idx) => setActiveIndex(idx + 1)} // +1 çünkü ana manşet 0. indekste
            activeIndex={activeIndex >= 1 && activeIndex <= (settings?.leftSideCount || 5) ? activeIndex - 1 : -1}
          />
        </aside>
        
        {/* Orta: Manşet Slider */}
        <main className="flex flex-1 flex-col items-center justify-center px-0 xl:px-8" style={{ minHeight: 545, maxHeight: 545 }}>
          <div className="relative w-full flex flex-col items-center group" style={{ minHeight: 370, maxHeight: 370 }}>
            <Link href={`/haber/${currentNews.id}`} aria-label={currentNews.title} tabIndex={0} style={{ background: "none", padding: 0, border: "none", cursor: "pointer" }}>
              <img
                src={getImageUrl(currentNews) || "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80"}
                alt={currentNews.title}
                className="w-full object-cover rounded-b-none rounded-t-3xl shadow-xl border border-gray-200 group-hover:scale-105 group-hover:shadow-2xl transition-all duration-500"
                style={{ minHeight: 370, maxHeight: 370, height: 370, background: "#eaeaea", objectPosition: "center", width: "100%" }}
                loading="eager"
                decoding="async"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='370' viewBox='0 0 600 370'%3E%3Crect width='600' height='370' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236b7280' font-family='sans-serif' font-size='16'%3E%F0%9F%93%B0 Haber G%C3%B6rseli%3C/text%3E%3C/svg%3E";
                }}
              />
            </Link>
            
            {/* Slider prev/next */}
            <div className="absolute bottom-9 left-1/2 -translate-x-1/2 flex gap-7 z-20">
              <button onClick={goToPrev} className="w-12 h-12 bg-white/90 rounded-full shadow flex items-center justify-center text-2xl hover:bg-blue-50 hover:scale-110 border border-blue-100 transition" aria-label="Önceki manşet">
                <span aria-hidden="true">&larr;</span>
              </button>
              <button onClick={goToNext} className="w-12 h-12 bg-white/90 rounded-full shadow flex items-center justify-center text-2xl hover:bg-blue-50 hover:scale-110 border border-blue-100 transition" aria-label="Sonraki manşet">
                <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
            
            {/* Slider dots */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex justify-center gap-2">
              {displayNews.map((_, idx) => (
                <button
                  key={idx}
                  className={`w-3 h-3 rounded-full ${idx === activeIndex ? "bg-red-600" : "bg-gray-300"} transition`}
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Manşet ${idx + 1}`}
                />
              ))}
            </div>
          </div>
          
          {/* Başlık ve özet */}
          <div className="w-full px-2 max-w-[900px] text-center mt-2">
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-0 text-blue-900 drop-shadow cursor-pointer hover:underline"
              style={{ overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", minHeight: "2.7em", maxHeight: "2.7em", marginBottom: 0, lineHeight: 1.25 }}
              tabIndex={0}
            >
              {currentNews.title}
            </h1>
            <p className="text-lg md:text-xl font-light text-neutral-700 mt-2"
              style={{ overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", minHeight: "4.6em", maxHeight: "4.6em", marginTop: 0, lineHeight: 1.25 }}
              title={currentNews.summary}
            >
              {currentNews.summary}
            </p>
          </div>
        </main>
        
        {/* Sağ blok */}
        <aside className="hidden xl:flex flex-col w-[320px] min-w-[290px] max-w-[340px] border-l border-gray-100 pl-7">
          <ScrollList
            items={rightItems.map(news => ({
              id: news.id,
              title: news.title,
              image: getImageUrl(news)
            }))}
            onItemClick={(_, idx) => {
              const leftCount = settings?.leftSideCount || 5;
              setActiveIndex(idx + 1 + leftCount);
            }}
            activeIndex={(() => {
              const leftCount = settings?.leftSideCount || 5;
              const rightCount = settings?.rightSideCount || 5;
              return activeIndex >= 1 + leftCount && activeIndex < 1 + leftCount + rightCount 
                ? activeIndex - 1 - leftCount 
                : -1;
            })()}
          />
        </aside>
      </div>
      
      <style>{`
        .custom-scrollbar { scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 0; background: transparent;}
        .scrollbar-hide::-webkit-scrollbar { opacity:0; width:0; }
        .hover\\:scrollbar-default:hover::-webkit-scrollbar {
          opacity:1; width:8px; background: #eee;
        }
        .hover\\:scrollbar-default:hover::-webkit-scrollbar-thumb {
          background: #d1d5db; border-radius: 8px;
        }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </section>
  );
});
