"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { collection, query, getDocs, where, orderBy, limit, documentId } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { News, ModuleSettings } from "@/types/homepage";
import { getNewsByModule, getFeaturedNews, getRandomNews } from "@/data/mockNewsData";

interface HeadlineNewsGridProps {
  moduleId?: string;
  manualNewsIds?: string[];
  autoFetch?: boolean;
  newsCount?: number;
  settings?: ModuleSettings;
}

function NewsImage({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Fallback SVG
  const fallback = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDQwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgNzVIMjI1VjEyNUgxNzVWNzVaIiBmaWxsPSIjOUI5QkEzIi8+CjxwYXRoIGQ9Ik0yMDAgODVDMTk0LjQ3NyA4NSAxOTAgODkuNDc3MSAxOTAgOTVDMTkwIDEwMC41MjMgMTk0LjQ3NyAxMDUgMjAwIDEwNUMyMDUuNTIzIDEwNSAyMTAgMTAwLjUyMyAyMTAgOTVDMjEwIDg5LjQ3NzEgMjA1LjUyMyA4NSAyMDAgODVaIiBmaWxsPSIjOUI5QkEzIi8+Cjwvc3ZnPgo=";
  
  // Boş veya geçersiz src kontrolü
  if (!src || src.trim() === '' || src === 'undefined' || src === 'null') {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center`}>
        <img
          src={fallback}
          alt="Varsayılan görsel"
          className="w-full h-full object-cover opacity-50"
          loading="lazy"
        />
      </div>
    );
  }
  
  const handleLoad = () => {
    setLoading(false);
  };
  
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    
    if (!error && target.src !== fallback) {
      // İlk hata - fallback görseline geç
      setError(true);
      setLoading(false);
      target.src = fallback;
    } else if (target.src === fallback) {
      // Fallback görsel de yüklenemedi - data URL kullan
      target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236b7280' font-family='sans-serif' font-size='16'%3EGörsel Yüklenemedi%3C/text%3E%3C/svg%3E";
      setLoading(false);
    }
  };
  
  return (
    <div className={`${className} bg-gray-100 relative`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-pulse w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-sm">Yükleniyor...</span>
          </div>
        </div>
      )}
      <img
        src={src}
        alt={alt || "Haber görseli"}
        className="w-full h-full object-cover"
        loading="lazy"
        draggable={false}
        style={{ userSelect: "none" }}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
}

// Fallback veri
const fallbackNews: News[] = [
  {
    id: "fallback-grid-1",
    title: "Dijital Medya ve Okur Güveni",
    summary: "Türkiye'de medya güveni neden düşüyor? Araştırma sonuçlarını ve çözüm önerilerini inceledik.",
    content: "Dijital medya güvenine dair kapsamlı araştırma...",
    category: "teknoloji",
    images: [{ url: "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=800&q=80" }],
    author: "Editör",
    source: "NetNext",
    createdAt: new Date(),
    publishedAt: new Date(),
    status: "published",
    views: 1250,
    tags: ["medya", "güven"],
    breaking: false,
    urgent: false,
    featured: false
  },
  {
    id: "fallback-grid-2",
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
    featured: false
  },
  {
    id: "fallback-grid-3",
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
    views: 980,
    tags: ["dijital", "medya"],
    breaking: false,
    urgent: false,
    featured: false
  },
  {
    id: "fallback-grid-4",
    title: "İzmir'de Makilik Alanda Yangın",
    summary: "İzmir'in Dikili ilçesinde çöplükte çıkan ve makilik alana sıçrayan yangına müdahale ediliyor.",
    content: "Yangın müdahale çalışmaları devam ediyor...",
    category: "gundem",
    images: [{ url: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=700&q=80" }],
    author: "Editör",
    source: "NetNext",
    createdAt: new Date(),
    publishedAt: new Date(),
    status: "published",
    views: 1800,
    tags: ["yangın", "izmir"],
    breaking: false,
    urgent: false,
    featured: false
  },
  {
    id: "fallback-grid-5",
    title: "Vergi Düzenlemeleri ve Ekonomiye Etkileri",
    summary: "Yeni vergi düzenlemeleri ve ekonomiye etkileri hakkında detaylı analiz.",
    content: "Vergi reformları üzerine kapsamlı değerlendirme...",
    category: "ekonomi",
    images: [{ url: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=400&q=80" }],
    author: "Editör",
    source: "NetNext",
    createdAt: new Date(),
    publishedAt: new Date(),
    status: "published",
    views: 1420,
    tags: ["vergi", "ekonomi"],
    breaking: false,
    urgent: false,
    featured: false
  },
  {
    id: "fallback-grid-6",
    title: "Spor Gündemi: Transfer Sezonu",
    summary: "Transfer sezonunun öne çıkan gelişmeleri ve transfer bombaları.",
    content: "Transfer sezonunda yaşanan gelişmelerin detaylı analizi...",
    category: "spor",
    images: [{ url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80" }],
    author: "Editör",
    source: "NetNext",
    createdAt: new Date(),
    publishedAt: new Date(),
    status: "published",
    views: 2250,
    tags: ["spor", "transfer"],
    breaking: false,
    urgent: false,
    featured: false
  }
];

// Helper function to get image URL from news item
function getImageUrl(newsItem: News): string {
  // İlk olarak images array'ini kontrol et
  if (newsItem.images && Array.isArray(newsItem.images) && newsItem.images.length > 0) {
    const firstImage = newsItem.images[0];
    if (firstImage && firstImage.url) {
      return firstImage.url;
    }
  }

  // Varsayılan görsel
  return '';
}

// Helper function to get category color
function getCategoryColor(category: string): string {
  const colors: { [key: string]: string } = {
    teknoloji: 'bg-blue-600',
    ekonomi: 'bg-green-600',
    spor: 'bg-orange-600',
    gundem: 'bg-red-600',
    saglik: 'bg-purple-600',
    cevre: 'bg-emerald-600',
    egitim: 'bg-indigo-600',
    savunma: 'bg-gray-700',
    bilim: 'bg-cyan-600',
    enerji: 'bg-yellow-600',
    politika: 'bg-rose-600',
    dunya: 'bg-teal-600'
  };
  return colors[category] || 'bg-blue-600';
}

// Helper function to get category display name
function getCategoryName(category: string): string {
  const names: { [key: string]: string } = {
    teknoloji: 'TEKNOLOJİ',
    ekonomi: 'EKONOMİ',
    spor: 'SPOR',
    gundem: 'GÜNDEM',
    saglik: 'SAĞLIK',
    cevre: 'ÇEVRE',
    egitim: 'EĞİTİM',
    savunma: 'SAVUNMA',
    bilim: 'BİLİM',
    enerji: 'ENERJİ',
    politika: 'POLİTİKA',
    dunya: 'DÜNYA'
  };
  return names[category] || category.toUpperCase();
}

export default function HeadlineNewsGrid({ 
  moduleId, 
  manualNewsIds = [], 
  autoFetch = true, 
  newsCount = 6,
  settings = {
    gridColumns: 3,
    showCategories: true,
    showAuthor: true,
    showDate: true
  }
}: HeadlineNewsGridProps) {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(newsCount);

  useEffect(() => {
    let isActive = true;
    
    const timeoutId = setTimeout(async () => {
      if (!isActive) return;
      
      async function loadNews() {
        try {
          let newsData: News[] = [];

          // Mock data'dan haberleri al
          const mockGridNews = getNewsByModule('headlineNewsGrid');
          if (mockGridNews.length > 0) {
            newsData = mockGridNews.slice(0, newsCount);
            console.log('✅ Headline news grid mock data loaded:', newsData.length);
          } else {
            // Mock data yoksa featured news'leri al
            const featuredNews = getFeaturedNews(newsCount);
            if (featuredNews.length > 0) {
              newsData = featuredNews;
              console.log('✅ Featured news loaded for grid:', newsData.length);
            } else {
            // Random news al
            newsData = getRandomNews(newsCount);
            console.log('✅ Random news loaded for grid:', newsData.length);
          }
        }

        // Eğer mock data yoksa Firebase'den çekmeye çalış
        if (newsData.length === 0 && db) {
          // Manuel seçim varsa bu haberleri getir
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

          // Otomatik seçim veya manuel seçim yeterli değilse
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
          console.error('Headline grid news loading error:', error);
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

  if (loading) {
    return (
      <section className="w-full py-8 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Haberler yükleniyor...</p>
          </div>
        </div>
      </section>
    );
  }

  const gridCols = settings?.gridColumns || 3;
  const gridClass = gridCols === 2 ? 'md:grid-cols-2' : gridCols === 4 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-2 lg:grid-cols-3';

  return (
    <section className="w-full py-8 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Manşet Haberler</h2>
          <div className="text-sm text-gray-500">
            {news.length} haber • Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
          </div>
        </div>
        
        <div className={`grid grid-cols-1 ${gridClass} gap-6`}>
          {news.slice(0, displayCount).map((item, index) => (
            <article 
              key={item.id} 
              className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                item.featured ? 'ring-2 ring-blue-200' : ''
              }`}
            >
              <Link href={`/haber/${item.category}/${item.id}`} className="block">
                <div className="relative">
                  <NewsImage
                    src={getImageUrl(item)}
                    alt={item.title}
                    className="w-full h-48"
                  />
                  
                  {/* Gradient overlay for better text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  
                  {settings?.showCategories && (
                    <div className="absolute top-3 left-3">
                      <span className={`inline-block text-white text-xs font-semibold px-3 py-1 rounded-full ${
                        getCategoryColor(item.category)
                      }`}>
                        {getCategoryName(item.category)}
                      </span>
                    </div>
                  )}
                  
                  {item.breaking && (
                    <div className="absolute top-3 right-3">
                      <span className="inline-block bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full animate-pulse">
                        🚨 SON DAKİKA
                      </span>
                    </div>
                  )}

                  {item.featured && (
                    <div className="absolute bottom-3 right-3">
                      <span className="inline-block bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                        ⭐ ÖNE ÇIKAN
                      </span>
                    </div>
                  )}

                  {/* News index for grid positioning */}
                  {index < 3 && (
                    <div className="absolute bottom-3 left-3">
                      <span className="bg-white/90 text-gray-800 text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center">
                        {index + 1}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 transition-colors leading-tight">
                    {item.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {item.summary}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                    <div className="flex items-center space-x-3">
                      {settings?.showAuthor && (
                        <div className="flex items-center space-x-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                          <span>{item.author}</span>
                        </div>
                      )}
                      {settings?.showDate && (
                        <div className="flex items-center space-x-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                          <span>
                            {new Date(item.publishedAt?.seconds * 1000 || item.createdAt).toLocaleDateString('tr-TR', {
                              day: 'numeric',
                              month: 'short'
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                        <span>{(item.views || 0).toLocaleString('tr-TR')}</span>
                      </div>
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex items-center space-x-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                          </svg>
                          <span>{item.tags[0]}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {/* Load more button if there are more news */}
        {news.length > displayCount && (
          <div className="text-center mt-8">
            <button 
              onClick={() => setDisplayCount(prev => Math.min(prev + 6, news.length))}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Daha Fazla Haber Göster
              <svg className="ml-2 -mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
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
      `}</style>
    </section>
  );
}
