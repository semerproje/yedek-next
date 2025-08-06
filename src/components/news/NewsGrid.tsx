"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Eye, MessageCircle, Share2, Bookmark, TrendingUp } from "lucide-react";
import { collection, getDocs, query, orderBy, limit, where, startAfter, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useNewsFilters } from "@/contexts/NewsFiltersContext";

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  image: string;
  category: string;
  author: string;
  publishDate: string;
  readTime: string;
  views: number;
  comments: number;
  isBreaking: boolean;
  isTrending: boolean;
  tags: string[];
  // Filtreleme için ek alanlar
  _publishedAt?: Date;
  _createdAt?: Date;
}

export default function NewsGrid() {
  const {
    searchTerm,
    selectedCategory,
    selectedTime,
    selectedSort
  } = useNewsFilters();
  
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Firebase'den haberler getir
  const fetchNews = async (loadMore = false) => {
    try {
      setLoading(!loadMore);
      setError(null);

      // Basit sorgu - sadece yayınlanmış haberler, karmaşık indeks gerektirmeyen
      // Diğer filtreleri client-side yapacağız
      const baseConditions = [where('status', '==', 'published')];
      
      // Sıralama alanını belirle (views için farklı sorgu)
      let orderField = 'publishedAt';
      let orderDirection: 'desc' | 'asc' = 'desc';
      
      switch (selectedSort) {
        case 'popular':
        case 'trending':
          orderField = 'views';
          orderDirection = 'desc';
          break;
        case 'newest':
        default:
          orderField = 'publishedAt';
          orderDirection = 'desc';
          break;
      }

      let q;
      if (loadMore && lastVisible) {
        // Daha fazla haber yükle
        q = query(
          collection(db, 'news'),
          ...baseConditions,
          orderBy(orderField, orderDirection),
          startAfter(lastVisible),
          limit(20) // Daha fazla veri çek, filtreleme için
        );
      } else {
        // İlk yükleme
        q = query(
          collection(db, 'news'),
          ...baseConditions,
          orderBy(orderField, orderDirection),
          limit(20) // Daha fazla veri çek, filtreleme için
        );
      }

      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        setHasMore(false);
        if (!loadMore) {
          setNews([]);
        }
        return;
      }

      // Firebase verilerini component formatına dönüştür
      let newsItems: NewsItem[] = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || 'Başlık Bulunamadı',
          summary: data.summary || data.content?.substring(0, 200) || 'Özet bulunamadı',
          content: data.content || 'İçerik bulunamadı',
          image: data.imageUrl || (data.images && data.images[0]?.url) || 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=800&q=80',
          category: data.category || 'Genel',
          author: data.author || 'Yazar Belirtilmemiş',
          publishDate: data.publishedAt?.toDate ? 
            new Intl.RelativeTimeFormat('tr').format(
              Math.floor((data.publishedAt.toDate().getTime() - Date.now()) / (1000 * 60 * 60)), 
              'hour'
            ) : data.createdAt?.toDate ? 
              new Intl.RelativeTimeFormat('tr').format(
                Math.floor((data.createdAt.toDate().getTime() - Date.now()) / (1000 * 60 * 60)), 
                'hour'
              ) : 'Bilinmiyor',
          readTime: Math.max(1, Math.ceil((data.content?.length || 500) / 1000)) + ' dk',
          views: data.views || Math.floor(Math.random() * 1000) + 100,
          comments: data.comments || Math.floor(Math.random() * 50),
          isBreaking: data.breaking || data.priority === 'breaking' || false,
          isTrending: data.urgent || data.priority === 'urgent' || false,
          tags: data.tags || [data.category || 'Genel'],
          // Filtreleme için orijinal date objesini de saklayalım
          _publishedAt: data.publishedAt?.toDate?.(),
          _createdAt: data.createdAt?.toDate?.()
        };
      });

      // CLIENT-SIDE FİLTRELER (Firebase indeks gerektirmez)
      
      // Kategori filtresi
      if (selectedCategory && selectedCategory !== 'all') {
        newsItems = newsItems.filter(item => 
          item.category.toLowerCase() === selectedCategory.toLowerCase()
        );
      }

      // Zaman filtresi
      if (selectedTime && selectedTime !== 'all') {
        const now = new Date();
        const startDate = new Date();
        
        switch (selectedTime) {
          case 'today':
            startDate.setHours(0, 0, 0, 0);
            break;
          case 'week':
            startDate.setDate(now.getDate() - 7);
            break;
          case 'month':
            startDate.setMonth(now.getMonth() - 1);
            break;
          case 'year':
            startDate.setFullYear(now.getFullYear() - 1);
            break;
        }
        
        newsItems = newsItems.filter(item => {
          const itemDate = item._publishedAt || item._createdAt;
          return itemDate && itemDate >= startDate;
        });
      }

      // Arama filtresi
      if (searchTerm && searchTerm.trim()) {
        newsItems = newsItems.filter(item => 
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }

      // Sonuçları ilk 9'a limit et (sayfalama için)
      const paginatedItems = newsItems.slice(0, 9);

      // Son görülen dokümanı kaydet
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);

      if (loadMore) {
        setNews(prev => [...prev, ...paginatedItems]);
      } else {
        setNews(paginatedItems);
      }

      // Daha fazla veri var mı kontrol et (orijinal query'den)
      setHasMore(newsItems.length >= 9 && querySnapshot.docs.length >= 20);

    } catch (error) {
      console.error('Haberler getirilemedi:', error);
      setError('Haberler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.');
      
      // Hata durumunda örnek veri göster
      if (!loadMore) {
        setNews([
          {
            id: 'sample1',
            title: 'Firebase Bağlantısı Kuruluyor...',
            summary: 'Haberler Firebase veritabanından yükleniyor. Lütfen bekleyin.',
            content: 'Bağlantı kurulurken örnek içerik gösteriliyor.',
            image: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=800&q=80',
            category: 'Sistem',
            author: 'Sistem',
            publishDate: 'şimdi',
            readTime: '1 dk',
            views: 0,
            comments: 0,
            isBreaking: false,
            isTrending: false,
            tags: ['sistem']
          }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Filtreler değiştiğinde yeniden yükle
  useEffect(() => {
    setLastVisible(null);
    setPage(1);
    setHasMore(true);
    fetchNews();
  }, [selectedCategory, selectedTime, selectedSort, searchTerm]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
      fetchNews(true);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse">
            <div className="w-full h-48 bg-gray-300 dark:bg-gray-600"></div>
            <div className="p-6">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-4 w-3/4"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Hata Mesajı */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">!</span>
            </div>
            <p className="text-red-800 dark:text-red-200 font-medium">
              {error}
            </p>
          </div>
          <button
            onClick={() => {
              setError(null);
              fetchNews();
            }}
            className="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Güncel Haberler
        </h2>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {news.length} haber gösteriliyor
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((item) => (
          <article
            key={item.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 group"
          >
            <div className="relative">
              <Image
                src={item.image}
                alt={item.title}
                width={400}
                height={200}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Badges */}
              <div className="absolute top-3 left-3 flex gap-2">
                {item.isBreaking && (
                  <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                    SON DAKİKA
                  </span>
                )}
                {item.isTrending && (
                  <span className="bg-orange-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <TrendingUp size={12} />
                    TREND
                  </span>
                )}
              </div>

              <div className="absolute top-3 right-3">
                <span className="bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                  {item.category}
                </span>
              </div>

              <button className="absolute bottom-3 right-3 bg-white/90 dark:bg-gray-800/90 p-2 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors">
                <Bookmark size={16} className="text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <div className="p-6">
              <Link href={`/haber/${item.id}`}>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                  {item.title}
                </h3>
              </Link>

              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                {item.summary}
              </p>

              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  {item.publishDate}
                </div>
                <div className="flex items-center gap-1">
                  <Eye size={12} />
                  {item.views.toLocaleString()}
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle size={12} />
                  {item.comments}
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
                
                <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <Share2 size={16} className="text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              <div className="flex flex-wrap gap-1 mt-4">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && news.length > 0 && (
        <div className="text-center mt-8">
          <button
            onClick={loadMore}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
          >
            {loading ? 'Yükleniyor...' : 'Daha Fazla Haber Yükle'}
          </button>
        </div>
      )}

      {/* Hiç haber yok mesajı */}
      {!loading && news.length === 0 && !error && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Henüz haber bulunmuyor
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Şu anda gösterilecek yayınlanmış haber bulunmuyor.
          </p>
          <button
            onClick={() => fetchNews()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Yenile
          </button>
        </div>
      )}
    </div>
  );
}
