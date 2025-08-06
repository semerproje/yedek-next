"use client";
import { useState, useEffect } from "react";
import { collection, query, getDocs, where, orderBy, limit, startAfter, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { News } from "@/types/homepage";
import { Category, CategoryPageData } from "@/types/category";
import Link from "next/link";

interface CategoryPageProps {
  categorySlug: string;
  title: string;
  description: string;
  headerComponent?: React.ComponentType<any>;
  showComponents?: {
    summaryCards?: boolean;
    themes?: boolean;
    kpiWidget?: boolean;
    aiPanel?: boolean;
    videoPanel?: boolean;
  };
}

function NewsCard({ news }: { news: News }) {
  const getImageUrl = (newsItem: News): string => {
    if (newsItem.images && Array.isArray(newsItem.images) && newsItem.images.length > 0) {
      const firstImage = newsItem.images[0];
      if (firstImage && firstImage.url) {
        return firstImage.url;
      }
    }
    return '';
  };

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link href={`/haber/${news.id}`} className="block">
        <div className="relative">
          {getImageUrl(news) && (
            <img
              src={getImageUrl(news)}
              alt={news.title}
              className="w-full h-48 object-cover"
              loading="lazy"
            />
          )}
          
          {news.breaking && (
            <div className="absolute top-3 right-3">
              <span className="inline-block bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded animate-pulse">
                🚨 FLAŞ
              </span>
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
            {news.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-3">
            {news.summary}
          </p>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-2">
              <span>👤 {news.author}</span>
              <span>📅 {new Date(
                news.publishedAt?.seconds ? 
                  news.publishedAt.seconds * 1000 : 
                  news.createdAt || Date.now()
              ).toLocaleDateString('tr-TR')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>👁️ {news.views || 0}</span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
          <div className="p-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse mb-1"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse mb-1 w-5/6"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CategoryPage({ 
  categorySlug, 
  title, 
  description,
  headerComponent: HeaderComponent,
  showComponents = {
    summaryCards: false,
    themes: false,
    kpiWidget: false,
    aiPanel: false,
    videoPanel: false
  }
}: CategoryPageProps) {
  const [news, setNews] = useState<News[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  
  const newsPerPage = 10;

  useEffect(() => {
    loadCategoryData();
  }, [categorySlug]);

  const loadCategoryData = async () => {
    try {
      setLoading(true);
      
      // Kategori bilgilerini yükle
      const categoryQuery = query(
        collection(db, 'categories'),
        where('slug', '==', categorySlug),
        where('active', '==', true)
      );
      
      const categorySnapshot = await getDocs(categoryQuery);
      
      if (!categorySnapshot.empty) {
        const categoryData = categorySnapshot.docs[0].data() as Category;
        setCategory({ ...categoryData, id: categorySnapshot.docs[0].id });
      }

      // İlk sayfa haberlerini yükle
      await loadNews(1, true);
      
    } catch (error) {
      console.error('Category data loading error:', error);
      setLoading(false);
    }
  };

  const loadNews = async (pageNum: number, reset: boolean = false) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      let newsQuery;
      
      if (pageNum === 1 || reset) {
        // İlk sayfa
        newsQuery = query(
          collection(db, 'news'),
          where('category', '==', categorySlug),
          where('status', '==', 'published'),
          limit(newsPerPage)
        );
      } else {
        // Sonraki sayfalar için son dokümanı kullan
        const lastDoc = news[news.length - 1];
        const lastDocSnapshot = await getDocs(query(
          collection(db, 'news'),
          where('category', '==', categorySlug),
          where('status', '==', 'published'),
          startAfter(lastDoc.publishedAt),
          limit(1)
        ));
        
        if (!lastDocSnapshot.empty) {
          newsQuery = query(
            collection(db, 'news'),
            where('category', '==', categorySlug),
            where('status', '==', 'published'),
            startAfter(lastDocSnapshot.docs[0]),
            limit(newsPerPage)
          );
        } else {
          setLoadingMore(false);
          return;
        }
      }

      const snapshot = await getDocs(newsQuery);
      const newsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || 'Başlık Bulunamadı',
          summary: data.summary || data.content?.substring(0, 200) || 'Özet bulunamadı',
          content: data.content || '',
          category: data.category || categorySlug,
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
      }).sort((a, b) => {
        // Tarihe göre sıralama (en yeni önce)
        const dateA = a.publishedAt?.toDate?.() || a.publishedAt || new Date(0);
        const dateB = b.publishedAt?.toDate?.() || b.publishedAt || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });

      if (reset) {
        setNews(newsData);
        setPage(1);
      } else {
        setNews(prev => [...prev, ...newsData]);
      }

      setHasMore(newsData.length === newsPerPage);
      setTotalCount(prev => reset ? newsData.length : prev + newsData.length);

    } catch (error: any) {
      console.warn('News loading error:', error?.message || error);
      
      // Firebase index hatası durumunda daha basit bir sorgu dene
      if (error?.code === 'failed-precondition' || error?.message?.includes('requires an index')) {
        try {
          console.log('Trying simpler query due to index requirement...');
          const simpleQuery = query(
            collection(db, 'news'),
            where('category', '==', categorySlug),
            limit(newsPerPage)
          );
          
          const snapshot = await getDocs(simpleQuery);
          const newsData = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              title: data.title || 'Başlık Bulunamadı',
              summary: data.summary || data.content?.substring(0, 200) || 'Özet bulunamadı',
              content: data.content || '',
              category: data.category || categorySlug,
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
          }).filter(n => n.status === 'published')
          .sort((a, b) => {
            // Tarihe göre sıralama (en yeni önce)
            const dateA = a.publishedAt?.toDate?.() || a.publishedAt || new Date(0);
            const dateB = b.publishedAt?.toDate?.() || b.publishedAt || new Date(0);
            return dateB.getTime() - dateA.getTime();
          });
          
          if (reset) {
            setNews(newsData);
            setPage(1);
          } else {
            setNews(prev => [...prev, ...newsData]);
          }

          setHasMore(newsData.length === newsPerPage);
          setTotalCount(prev => reset ? newsData.length : prev + newsData.length);
          
        } catch (simpleError) {
          console.warn('Simple query also failed:', simpleError);
        }
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadNews(nextPage, false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-2 bg-gradient-to-tr from-[#ffe7e1] via-[#f3f9fa] to-[#f7faff] dark:from-[#1a2536] dark:via-[#19212e] dark:to-[#232c3a] transition-colors duration-700">
        {HeaderComponent && <HeaderComponent />}
        <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 2xl:px-8 py-10 rounded-3xl shadow-2xl bg-white/80 backdrop-blur-xl border border-neutral-200 dark:bg-[#232c3a]/80 dark:border-neutral-800 transition-all duration-300">
          <div className="text-center mb-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Kategori haberleri yükleniyor...</p>
          </div>
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-2 bg-gradient-to-tr from-[#ffe7e1] via-[#f3f9fa] to-[#f7faff] dark:from-[#1a2536] dark:via-[#19212e] dark:to-[#232c3a] transition-colors duration-700">
      {HeaderComponent && <HeaderComponent />}
      
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 2xl:px-8 py-10 rounded-3xl shadow-2xl bg-white/80 backdrop-blur-xl border border-neutral-200 dark:bg-[#232c3a]/80 dark:border-neutral-800 transition-all duration-300">
        
        {/* Kategori başlığı */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {category?.name || title}
          </h1>
          <p className="text-gray-600">
            {category?.description || description}
          </p>
          <div className="mt-4 text-sm text-gray-500">
            Toplam {totalCount} haber bulundu
          </div>
        </div>

        {/* Haberler grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {news.map((newsItem) => (
            <NewsCard key={newsItem.id} news={newsItem} />
          ))}
        </div>

        {/* Daha fazla yükle butonu */}
        {hasMore && (
          <div className="text-center">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loadingMore ? 'Yükleniyor...' : 'Daha Fazla Haber Yükle'}
            </button>
          </div>
        )}

        {/* Haber yoksa mesaj */}
        {news.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📰</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Henüz haber bulunmuyor
            </h3>
            <p className="text-gray-500">
              Bu kategoride henüz yayınlanmış haber bulunmamaktadır.
            </p>
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
    </div>
  );
}
