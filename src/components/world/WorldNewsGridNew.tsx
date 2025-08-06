"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, User, MapPin, Globe } from 'lucide-react';

interface WorldNews {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  author: string;
  publishDate: string;
  readTime: string;
  category: string;
  country: string;
  priority: 'high' | 'medium' | 'low';
}

const WorldNewsGridNew = () => {
  const [news, setNews] = useState<WorldNews[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simüle edilmiş dünya haberleri verisi
    const mockWorldNews: WorldNews[] = [
      {
        id: '1',
        title: 'G20 Zirvesi\'nde Küresel Ekonomi Gündemi',
        summary: 'Dünya liderleri ekonomik işbirliği ve sürdürülebilir kalkınma konularında anlaşmaya vardı.',
        imageUrl: 'https://images.unsplash.com/photo-1541872705-1f73c6400ec9?auto=format&fit=crop&w=800&q=80',
        author: 'Ayşe Demir',
        publishDate: '2 saat önce',
        readTime: '4 dk',
        category: 'Diplomasi',
        country: 'Hindistan',
        priority: 'high'
      },
      {
        id: '2',
        title: 'Avrupa Birliği Yeni Enerji Politikası Açıkladı',
        summary: 'AB, 2030 yılına kadar yenilenebilir enerji hedeflerini %50 artırmayı planlıyor.',
        imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80',
        author: 'Mehmet Kaya',
        publishDate: '4 saat önce',
        readTime: '6 dk',
        category: 'Enerji',
        country: 'Belçika',
        priority: 'high'
      },
      {
        id: '3',
        title: 'Çin-ABD Ticaret Görüşmeleri Devam Ediyor',
        summary: 'İki ülke arasındaki ticaret anlaşmazlıklarının çözümü için yeni müzakere turu başladı.',
        imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
        author: 'Fatma Özkan',
        publishDate: '6 saat önce',
        readTime: '5 dk',
        category: 'Ticaret',
        country: 'ABD',
        priority: 'medium'
      },
      {
        id: '4',
        title: 'Afrika Birliği\'nden Barış Girişimi',
        summary: 'Kıtadaki çatışmaları sonlandırmak için kapsamlı bir barış planı hazırlandı.',
        imageUrl: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&w=800&q=80',
        author: 'Ali Yılmaz',
        publishDate: '8 saat önce',
        readTime: '7 dk',
        category: 'Barış',
        country: 'Etiyopya',
        priority: 'high'
      },
      {
        id: '5',
        title: 'Latin Amerika\'da Demokrasi Reformları',
        summary: 'Bölge ülkeleri demokratik kurumları güçlendirmek için ortak adımlar atıyor.',
        imageUrl: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=800&q=80',
        author: 'Zeynep Aktaş',
        publishDate: '10 saat önce',
        readTime: '5 dk',
        category: 'Politika',
        country: 'Brezilya',
        priority: 'medium'
      },
      {
        id: '6',
        title: 'Asya-Pasifik Güvenlik İşbirliği Zirvesi',
        summary: 'Bölgesel güvenlik ve denizcilik konularında yeni işbirliği anlaşmaları imzalandı.',
        imageUrl: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?auto=format&fit=crop&w=800&q=80',
        author: 'Murat Çelik',
        publishDate: '12 saat önce',
        readTime: '6 dk',
        category: 'Güvenlik',
        country: 'Singapur',
        priority: 'medium'
      }
    ];

    setTimeout(() => {
      setNews(mockWorldNews);
      setLoading(false);
    }, 1000);
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Diplomasi': 'bg-blue-100 text-blue-800',
      'Enerji': 'bg-green-100 text-green-800',
      'Ticaret': 'bg-purple-100 text-purple-800',
      'Barış': 'bg-orange-100 text-orange-800',
      'Politika': 'bg-indigo-100 text-indigo-800',
      'Güvenlik': 'bg-red-100 text-red-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="h-48 bg-gray-200 rounded-lg"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">🌍 Dünya Haberleri</h2>
        <Link href="/kategori/dunya/tum-haberler" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          Tümünü Gör →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((item) => (
          <article key={item.id} className="group cursor-pointer">
            <Link href={`/haber/${item.id}`}>
              <div className="space-y-4">
                {/* Resim */}
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                      {item.category}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                      {item.priority === 'high' ? 'Acil' : item.priority === 'medium' ? 'Önemli' : 'Normal'}
                    </span>
                  </div>
                </div>

                {/* İçerik */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {item.summary}
                  </p>
                </div>

                {/* Meta bilgiler */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>{item.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{item.publishDate}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{item.country}</span>
                    </div>
                    <span>•</span>
                    <span>{item.readTime}</span>
                  </div>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
};

export default WorldNewsGridNew;
