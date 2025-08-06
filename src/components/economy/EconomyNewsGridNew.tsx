"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, User, TrendingUp } from 'lucide-react';

interface EconomyNews {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  publishedAt: string;
  readTime: number;
  author: string;
  tags: string[];
}

function handleImageError(e: React.SyntheticEvent<HTMLImageElement, Event>) {
  const target = e.target as HTMLImageElement;
  target.src = 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80';
}

const EconomyNewsGrid = () => {
  const [news, setNews] = useState<EconomyNews[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock ekonomi haberleri - Firebase entegrasyonu için hazır
  const mockEconomyNews: EconomyNews[] = [
    {
      id: '1',
      title: 'TCMB Faiz Kararı: Politika Faizi %45 Seviyesinde Sabit Tutuldu',
      excerpt: 'Merkez Bankası Para Politikası Kurulu, politika faizini %45 seviyesinde tutma kararı aldı. Enflasyonla mücadele stratejisi devam ediyor.',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
      category: 'Para Politikası',
      publishedAt: '2025-01-28T10:30:00Z',
      readTime: 5,
      author: 'Ekonomi Editörü',
      tags: ['TCMB', 'Faiz', 'Enflasyon']
    },
    {
      id: '2',
      title: 'Borsa İstanbul Güne Yükselişle Başladı: BIST 100 8.200 Üzerinde',
      excerpt: 'BIST 100 endeksi günün ilk saatlerinde %2,5 artışla 8.200 seviyesini aştı. Bankacılık ve holding hisseleri öne çıkıyor.',
      image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80',
      category: 'Borsa',
      publishedAt: '2025-01-28T09:15:00Z',
      readTime: 4,
      author: 'Piyasa Analisti',
      tags: ['Borsa', 'BIST100', 'Yatırım']
    },
    {
      id: '3',
      title: 'Dolar/TL Paritesinde Son Durum: 34,20 Seviyesinde Seyrediyor',
      excerpt: 'Amerikan doları Türk lirası karşısında 34,20 seviyesinde işlem görüyor. Piyasalar TCMB kararlarını yakından takip ediyor.',
      image: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&w=800&q=80',
      category: 'Döviz',
      publishedAt: '2025-01-28T08:45:00Z',
      readTime: 3,
      author: 'Döviz Uzmanı',
      tags: ['USD', 'TL', 'Döviz']
    },
    {
      id: '4',
      title: '2025 Enflasyon Beklentileri: Yıl Sonu %25 Hedefi Mümkün mü?',
      excerpt: 'Ekonomistler 2025 yıl sonu enflasyonunun %25 seviyesine gerileyebileceğini belirtiyor. Detaylı analiz ve tahminler.',
      image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=800&q=80',
      category: 'Enflasyon',
      publishedAt: '2025-01-28T07:30:00Z',
      readTime: 6,
      author: 'Prof. Dr. Ekonomist',
      tags: ['Enflasyon', 'Tahmin', '2025']
    },
    {
      id: '5',
      title: 'Teknoloji Sektöründe Dev Yatırım: 2 Milyar TL\'lik Proje',
      excerpt: 'Türkiye\'nin önde gelen teknoloji şirketleri bu yıl toplam 2 milyar TL tutarında yatırım yapacağını açıkladı.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      category: 'Teknoloji',
      publishedAt: '2025-01-28T06:00:00Z',
      readTime: 4,
      author: 'Teknoloji Editörü',
      tags: ['Teknoloji', 'Yatırım', 'İnovasyon']
    },
    {
      id: '6',
      title: 'Otomotiv İhracatında Yeni Rekor: 35 Milyar Dolar',
      excerpt: 'Türk otomotiv sektörü 2024 yılını 35 milyar dolarlık ihracat ile tamamladı. 2025 hedefi 40 milyar dolar.',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
      category: 'İhracat',
      publishedAt: '2025-01-27T18:30:00Z',
      readTime: 5,
      author: 'Sanayi Muhabiri',
      tags: ['Otomotiv', 'İhracat', 'Rekor']
    }
  ];

  useEffect(() => {
    // Simüle edilmiş veri yükleme - Firebase bağlantısı için hazır
    const loadNews = async () => {
      try {
        // Burada gerçek Firebase sorgusu yapılabilir
        await new Promise(resolve => setTimeout(resolve, 2000));
        setNews(mockEconomyNews);
      } catch (error) {
        console.error('Ekonomi haberleri yüklenemedi:', error);
        setNews(mockEconomyNews); // Fallback
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryColor = (category: string) => {
    const colorMap: { [key: string]: string } = {
      'Para Politikası': 'bg-red-600',
      'Borsa': 'bg-green-600',
      'Döviz': 'bg-blue-600',
      'Enflasyon': 'bg-orange-600',
      'Teknoloji': 'bg-purple-600',
      'İhracat': 'bg-teal-600'
    };
    return colorMap[category] || 'bg-gray-600';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Son Ekonomi Haberleri</h2>
            <p className="text-sm text-gray-600 mt-1">Güncel gelişmeler ve analizler</p>
          </div>
          <TrendingUp className="h-6 w-6 text-green-600" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Son Ekonomi Haberleri</h2>
          <p className="text-sm text-gray-600 mt-1">Güncel gelişmeler ve analizler</p>
        </div>
        <TrendingUp className="h-6 w-6 text-green-600" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((item) => (
          <Link 
            key={item.id} 
            href={`/haber/${item.id}`}
            className="group block hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
          >
            <article className="border border-gray-100 rounded-lg overflow-hidden h-full flex flex-col">
              <div className="relative h-48 bg-gray-100">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={handleImageError}
                />
                <div className="absolute top-3 left-3">
                  <span className={`${getCategoryColor(item.category)} text-white text-xs font-medium px-2 py-1 rounded`}>
                    {item.category}
                  </span>
                </div>
                <div className="absolute top-3 right-3 flex gap-1">
                  {item.tags.slice(0, 2).map((tag, index) => (
                    <span key={index} className="bg-black/50 text-white text-xs px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
                  {item.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mt-auto">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{item.author}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{item.readTime} dk</span>
                    </div>
                    <span>{formatDate(item.publishedAt)}</span>
                  </div>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default EconomyNewsGrid;
