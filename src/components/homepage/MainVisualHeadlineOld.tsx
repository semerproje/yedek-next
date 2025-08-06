"use client";
import { useState, useEffect, useRef, useMemo, useCallback, memo } from "react";
import Link from "next/link";

import { collection, query, getDocs, where, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface News {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  images: Array<{url: string; caption?: string; alt?: string}>;
  author: string;
  source: string;
  createdAt: any;
  publishedAt: any;
  status: string;
  views: number;
  tags: string[];
  breaking: boolean;
  urgent: boolean;
  featured?: boolean;
}

interface ModuleSettings {
  leftSideCount: number;
  rightSideCount: number;
  autoRefreshMinutes: number;
  showWeather: boolean;
  showCurrency: boolean;
}

interface MainVisualHeadlineProps {
  moduleId?: string;
  manualNewsIds?: string[];
  autoFetch?: boolean;
  newsCount?: number;
  settings?: ModuleSettings;
}

// Mock veri, Firestore ile dinamik yapılabilir
const mansetList = [
  {
    id: "1",
    title: "Basında Dijitalleşme ve Son Trendler",
    summary: "Haber merkezlerinde dijital dönüşümün etkileri ve yeni yayıncılık araçları.",
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "2",
    title: "Kenya Sokaklarında Kanlı Protesto!",
    summary: "Kenya’da ekonomik kriz ve ifade özgürlüğü ihlalleri nedeniyle büyüyen protestoları derinlemesine analiz ettik.",
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "3",
    title: "Dijital Medya ve Okur Güveni",
    summary: "Türkiye’de medya güveni neden düşüyor? Araştırma sonuçlarını ve çözüm önerilerini inceledik.",
    image: "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=800&q=80",
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

export default memo(function MainVisualHeadline() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [featuredNews, setFeaturedNews] = useState<FeaturedNews[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper function to get image URL from news item (memoized)
  const getImageUrl = useCallback((newsItem: FeaturedNews | typeof mansetList[0]): string => {
    console.log('🖼️ Getting image for news', newsItem.id, ':', {
      imageUrl: ('imageUrl' in newsItem) ? newsItem.imageUrl : 'none',
      imagesCount: ('images' in newsItem && Array.isArray((newsItem as any).images)) ? (newsItem as any).images.length : 0,
      firstImageUrl: ('images' in newsItem && Array.isArray((newsItem as any).images) && (newsItem as any).images.length > 0) ? (newsItem as any).images[0]?.url || 'none' : 'none'
    });

    // Firebase FeaturedNews tipinde imageUrl'i kontrol et
    if ('imageUrl' in newsItem && newsItem.imageUrl) {
      return newsItem.imageUrl;
    }

    // Eğer images array'i varsa ilk görseli al
    if ('images' in newsItem && Array.isArray((newsItem as any).images) && (newsItem as any).images.length > 0) {
      const firstImage = (newsItem as any).images[0];
      if (firstImage && firstImage.url) {
        return firstImage.url;
      }
    }

    // Fallback mansetList tipinde image alanını kontrol et
    if ('image' in newsItem) {
      return (newsItem as typeof mansetList[0]).image || '';
    }

    // Varsayılan görsel
    return '';
  }, []);

  // Firebase'den öne çıkan haberleri yükle (sadece component mount olduğunda ve debounced)
  useEffect(() => {
    let isActive = true; // Cancel async operations if component unmounts
    
    const timeoutId = setTimeout(async () => {
      if (!isActive) return;
      
      async function loadFeaturedNews() {
        if (!db) {
          console.warn("Firebase db not initialized, using fallback data");
          if (isActive) setLoading(false);
          return;
        }

        try {
          // featuredNews koleksiyonu yerine doğrudan news koleksiyonundan güncel haberler çekelim
          const newsQuery = query(
            collection(db, 'news'),
            where('status', '==', 'published'),
            orderBy('publishedAt', 'desc'),
            limit(8)
          );
          
          const snapshot = await getDocs(newsQuery);
          
          if (!isActive) return; // Component unmounted
          
          if (!snapshot.empty) {
            const newsData = snapshot.docs.map((doc, index) => {
              const data = doc.data();
              return {
                id: doc.id,
                newsId: doc.id,
                title: data.title || 'Başlık Bulunamadı',
                summary: data.summary || data.content?.substring(0, 200) || 'Özet bulunamadı',
                imageUrl: data.imageUrl || (data.images && data.images[0]?.url) || '',
                category: data.category || 'Genel',
                author: data.author || 'Editör',
                isMainHeadline: index === 0, // İlk haber ana manşet olsun
                order: index,
                active: true,
                createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
                // Ek veriler
                images: data.images || [],
                content: data.content || ''
              };
            }) as FeaturedNews[];
            
            // Debug: console.log ile görsel URL'lerini kontrol et
            console.log('🖼️ Featured news images debug:', newsData.map(news => ({
              title: news.title.substring(0, 30),
              imageUrl: news.imageUrl,
              hasImage: !!news.imageUrl,
              imagesArray: (news as any).images?.length || 0
            })));
            
            setFeaturedNews(newsData);
            console.log('✅ Featured news loaded successfully:', newsData.length);
          } else {
            console.log('No published news found, using fallback');
            setFeaturedNews([]);
          }
        } catch (error) {
          console.error('Featured news loading error:', error);
          // Use fallback data on any error
          if (isActive) setFeaturedNews([]);
        } finally {
          if (isActive) setLoading(false);
        }
      }

      await loadFeaturedNews();
    }, 200); // 200ms debounce

    return () => {
      isActive = false;
      clearTimeout(timeoutId);
    };
  }, []); // Empty dependency array - only run once on mount

  // Memoize computed values to prevent unnecessary recalculations
  const { mainHeadline, otherNews, sliderNews, displayNews, currentNews, leftItems, rightItems } = useMemo(() => {
    // Ana manşet haberini bul
    const mainHeadline = featuredNews.find(news => news.isMainHeadline);
    
    // Diğer haberleri sıraya göre düzenle (ana manşet hariç)
    const otherNews = featuredNews
      .filter(news => !news.isMainHeadline)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
    
    // Slider için haberleri birleştir: ana manşet ilk sırada, sonra diğerleri
    const sliderNews = mainHeadline ? [mainHeadline, ...otherNews] : otherNews;
    
    // Eğer Firebase'den haber yoksa fallback kullan
    const displayNews = sliderNews.length > 0 ? sliderNews : mansetList;
    const currentNews = displayNews[activeIndex] || mansetList[0];
    
    // Sol ve sağ panel için haberleri ayır (11 haber: 1 ana + 5 sol + 5 sağ)
    const leftItems = displayNews.slice(1, Math.min(6, displayNews.length)); // Ana manşet sonrası ilk 5 haber
    const rightItems = displayNews.slice(6, Math.min(12, displayNews.length)); // Sonraki 5 haber

    return { mainHeadline, otherNews, sliderNews, displayNews, currentNews, leftItems, rightItems };
  }, [featuredNews, activeIndex]);

  // Memoize the navigation functions (now that displayNews is available)
  const goToPrev = useCallback(() => setActiveIndex(i => (i === 0 ? displayNews.length - 1 : i - 1)), [displayNews.length]);
  const goToNext = useCallback(() => setActiveIndex(i => (i === displayNews.length - 1 ? 0 : i + 1)), [displayNews.length]);

  // Active index'i sınırla
  useEffect(() => {
    if (activeIndex >= displayNews.length) {
      setActiveIndex(0);
    }
  }, [displayNews.length, activeIndex]);

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
            activeIndex={activeIndex >= 1 && activeIndex <= 5 ? activeIndex - 1 : -1}
          />
        </aside>
        {/* Orta: Manşet Slider */}
        <main className="flex flex-1 flex-col items-center justify-center px-0 xl:px-8" style={{ minHeight: 545, maxHeight: 545 }}>
          <div className="relative w-full flex flex-col items-center group" style={{ minHeight: 370, maxHeight: 370 }}>
            <Link href={`/haber/${'newsId' in currentNews ? currentNews.newsId : currentNews.id}`} aria-label={currentNews.title} tabIndex={0} style={{ background: "none", padding: 0, border: "none", cursor: "pointer" }}>
              <img
                src={getImageUrl(currentNews) || "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80"}
                alt={currentNews.title}
                className="w-full object-cover rounded-b-none rounded-t-3xl shadow-xl border border-gray-200 group-hover:scale-105 group-hover:shadow-2xl transition-all duration-500"
                style={{ minHeight: 370, maxHeight: 370, height: 370, background: "#eaeaea", objectPosition: "center", width: "100%" }}
                loading="eager"
                decoding="async"
                onError={(e) => {
                  // Fallback görsel yükleme hatası durumunda
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
            onItemClick={(_, idx) => setActiveIndex(idx + 6)} // +6 çünkü ana manşet + 5 sol haber sonrası
            activeIndex={activeIndex >= 6 && activeIndex <= 11 ? activeIndex - 6 : -1}
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
