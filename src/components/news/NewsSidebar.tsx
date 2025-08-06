"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { TrendingUp, Clock, Eye, MessageCircle, Users, Star, Award } from "lucide-react";
import { AvatarImage } from '@/components/ui/SafeImage';

interface TrendingNews {
  id: string;
  title: string;
  category: string;
  views: number;
  publishDate: string;
}

interface PopularAuthor {
  id: string;
  name: string;
  avatar: string;
  articles: number;
  followers: number;
}

export default function NewsSidebar() {
  const router = useRouter();
  const [trendingNews, setTrendingNews] = useState<TrendingNews[]>([]);
  const [popularAuthors, setPopularAuthors] = useState<PopularAuthor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API calls
    setTimeout(() => {
      setTrendingNews([
        {
          id: "t1",
          title: "Ekonomide Son Durum: Enflasyon Rakamları",
          category: "Ekonomi",
          views: 5420,
          publishDate: "1 saat önce"
        },
        {
          id: "t2",
          title: "Teknoloji Haberleri: ChatGPT Güncellemesi",
          category: "Teknoloji",
          views: 3890,
          publishDate: "3 saat önce"
        },
        {
          id: "t3",
          title: "Spor Dünyası: Transfer Haberleri",
          category: "Spor",
          views: 2750,
          publishDate: "5 saat önce"
        },
        {
          id: "t4",
          title: "Sağlık: Kış Hastalıklarından Korunma",
          category: "Sağlık",
          views: 2100,
          publishDate: "7 saat önce"
        },
        {
          id: "t5",
          title: "Eğitim Reformu Detayları Açıklandı",
          category: "Eğitim",
          views: 1850,
          publishDate: "9 saat önce"
        }
      ]);

      setPopularAuthors([
        {
          id: "a1",
          name: "Ahmet Yılmaz",
          avatar: "https://ui-avatars.com/api/?name=MK&background=f59e0b&color=ffffff&size=150",
          articles: 127,
          followers: 15400
        },
        {
          id: "a2",
          name: "Zeynep Kaya",
          avatar: "https://ui-avatars.com/api/?name=FD&background=8b5cf6&color=ffffff&size=150",
          articles: 89,
          followers: 12800
        },
        {
          id: "a3",
          name: "Murat Özkan",
          avatar: "https://ui-avatars.com/api/?name=AH&background=06b6d4&color=ffffff&size=150",
          articles: 156,
          followers: 18200
        },
        {
          id: "a4",
          name: "Elif Demir",
          avatar: "https://ui-avatars.com/api/?name=ED&background=ec4899&color=ffffff&size=150",
          articles: 73,
          followers: 9600
        }
      ]);

      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 animate-pulse">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((j) => (
                <div key={j} className="h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Trend Haberler */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-red-600" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Trend Haberler</h3>
        </div>
        
        <div className="space-y-4">
          {trendingNews.map((item, index) => (
            <Link key={item.id} href={`/haber/${item.id}`}>
              <div className="group cursor-pointer">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full">
                        {item.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <Eye size={10} />
                        {item.views.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={10} />
                        {item.publishDate}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <button 
          onClick={() => router.push('/trend-haberler' as any)}
          className="w-full mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium text-left"
        >
          Tüm Trend Haberleri Gör →
        </button>
      </div>

      {/* Popüler Yazarlar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Star className="w-5 h-5 text-yellow-500" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Popüler Yazarlar</h3>
        </div>
        
        <div className="space-y-4">
          {popularAuthors.map((author, index) => (
            <div 
              key={author.id} 
              onClick={() => router.push(`/yazar/${author.id}` as any)}
              className="cursor-pointer"
            >
              <div className="flex items-center gap-3 group p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="relative">
                  <AvatarImage
                    src={author.avatar}
                    alt={author.name}
                    size={40}
                  />
                  {index < 3 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      <Award size={12} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {author.name}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <span>{author.articles} makale</span>
                    <div className="flex items-center gap-1">
                      <Users size={10} />
                      {(author.followers / 1000).toFixed(1)}K takipçi
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={() => router.push('/yazarlar' as any)}
          className="w-full mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium text-left"
        >
          Tüm Yazarları Gör →
        </button>
      </div>

      {/* Haber Kategorileri */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Kategoriler</h3>
        
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: "Gündem", count: 542, color: "bg-red-500" },
            { name: "Ekonomi", count: 387, color: "bg-green-500" },
            { name: "Spor", count: 298, color: "bg-blue-500" },
            { name: "Teknoloji", count: 234, color: "bg-purple-500" },
            { name: "Sağlık", count: 156, color: "bg-pink-500" },
            { name: "Kültür", count: 143, color: "bg-indigo-500" }
          ].map((category) => (
            <Link key={category.name} href={`/kategori/${category.name.toLowerCase()}`}>
              <div className="group cursor-pointer p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {category.name}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {category.count} haber
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6">
        <h3 className="text-lg font-bold mb-2">Haberler Hakkında Bilgi Al</h3>
        <p className="text-sm text-blue-100 mb-4">
          Güncel haberleri ve analizleri e-posta ile alın.
        </p>
        <div className="space-y-3">
          <input
            type="email"
            placeholder="E-posta adresiniz"
            className="w-full px-3 py-2 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <button className="w-full bg-white text-blue-600 font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors text-sm">
            Abone Ol
          </button>
        </div>
      </div>
    </div>
  );
}
