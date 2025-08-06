"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Share2, Facebook, Twitter, MessageCircle, Link as LinkIcon, TrendingUp, Clock, Users, Award } from "lucide-react";

interface NewsDetailSidebarProps {
  news: {
    id: string;
    title: string;
    category: string;
    author: {
      name: string;
    };
  };
}

interface SidebarNews {
  id: string;
  title: string;
  image: string;
  category: string;
  publishDate: string;
  views: number;
}

export default function NewsDetailSidebar({ news }: NewsDetailSidebarProps) {
  const [relatedNews, setRelatedNews] = useState<SidebarNews[]>([]);
  const [popularNews, setPopularNews] = useState<SidebarNews[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // TODO: Replace with actual API calls
    setTimeout(() => {
      setRelatedNews([
        {
          id: "r1",
          title: "TCMB Başkanı'ndan Enflasyon Açıklaması",
          image: "https://images.unsplash.com/photo-1554224155-6972dc5b77d2?auto=format&fit=crop&w=300&q=80",
          category: "Ekonomi",
          publishDate: "1 saat önce",
          views: 2340
        },
        {
          id: "r2",
          title: "Borsa İstanbul'da Günün Kapanışı",
          image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=300&q=80",
          category: "Ekonomi",
          publishDate: "3 saat önce",
          views: 1890
        },
        {
          id: "r3",
          title: "Dolar/TL Kurunda Son Durum",
          image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=300&q=80",
          category: "Ekonomi",
          publishDate: "5 saat önce",
          views: 3210
        }
      ]);

      setPopularNews([
        {
          id: "p1",
          title: "Teknoloji Sektöründe Büyük Yatırım",
          image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=300&q=80",
          category: "Teknoloji",
          publishDate: "2 saat önce",
          views: 8950
        },
        {
          id: "p2",
          title: "Sağlık Bakanı'ndan Önemli Açıklamalar",
          image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?auto=format&fit=crop&w=300&q=80",
          category: "Sağlık",
          publishDate: "4 saat önce",
          views: 7650
        },
        {
          id: "p3",
          title: "İstanbul'da Ulaşım Projesi",
          image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=300&q=80",
          category: "Gündem",
          publishDate: "6 saat önce",
          views: 5430
        }
      ]);
    }, 600);
  }, [news.category]);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = encodeURIComponent(news.title);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(shareUrl)}`,
    whatsapp: `https://wa.me/?text=${shareText}%20${encodeURIComponent(shareUrl)}`
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link: ', err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Share Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Share2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Paylaş</h3>
        </div>
        
        <div className="space-y-3">
          <a
            href={shareLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 w-full p-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            <Facebook size={20} />
            <span className="font-medium">Facebook</span>
          </a>
          
          <a
            href={shareLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 w-full p-3 rounded-lg bg-sky-500 hover:bg-sky-600 text-white transition-colors"
          >
            <Twitter size={20} />
            <span className="font-medium">Twitter</span>
          </a>
          
          <a
            href={shareLinks.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 w-full p-3 rounded-lg bg-green-500 hover:bg-green-600 text-white transition-colors"
          >
            <MessageCircle size={20} />
            <span className="font-medium">WhatsApp</span>
          </a>
          
          <button
            onClick={copyLink}
            className="flex items-center gap-3 w-full p-3 rounded-lg bg-gray-600 hover:bg-gray-700 text-white transition-colors"
          >
            <LinkIcon size={20} />
            <span className="font-medium">
              {copied ? "Kopyalandı!" : "Linki Kopyala"}
            </span>
          </button>
        </div>
      </div>

      {/* Related News */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">İlgili Haberler</h3>
        </div>
        
        <div className="space-y-4">
          {relatedNews.map((item) => (
            <Link key={item.id} href={`/haber/${item.id}`}>
              <div className="group cursor-pointer">
                <div className="flex gap-3">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={80}
                    height={60}
                    className="rounded-lg object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <span className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 px-2 py-1 rounded-full">
                        {item.category}
                      </span>
                      <Clock size={10} />
                      <span>{item.publishDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <Link href={`/kategori/${news.category.toLowerCase()}`}>
          <button className="w-full mt-4 text-sm text-green-600 dark:text-green-400 hover:underline font-medium">
            {news.category} Kategorisindeki Tüm Haberler →
          </button>
        </Link>
      </div>

      {/* Popular News */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Award className="w-5 h-5 text-orange-600" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Popüler Haberler</h3>
        </div>
        
        <div className="space-y-4">
          {popularNews.map((item, index) => (
            <Link key={item.id} href={`/haber/${item.id}`}>
              <div className="group cursor-pointer">
                <div className="flex gap-3">
                  <div className="relative">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={80}
                      height={60}
                      className="rounded-lg object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute -top-2 -left-2 w-6 h-6 bg-orange-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <span className="bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400 px-2 py-1 rounded-full">
                        {item.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <Users size={10} />
                        {(item.views / 1000).toFixed(1)}K
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <Link href="/populer-haberler">
          <button className="w-full mt-4 text-sm text-orange-600 dark:text-orange-400 hover:underline font-medium">
            Tüm Popüler Haberleri Gör →
          </button>
        </Link>
      </div>

      {/* Author Info */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Yazar Hakkında</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          {news.author.name} tarafından yazılan diğer makaleleri okumak ve yazarı takip etmek için:
        </p>
        <Link href={`/yazar/${news.author.name.toLowerCase().replace(' ', '-')}`}>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
            Yazarın Diğer Makalelerini Gör
          </button>
        </Link>
      </div>

      {/* Newsletter */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl p-6">
        <h3 className="text-lg font-bold mb-2">Güncel Haberleri Kaçırma</h3>
        <p className="text-sm text-purple-100 mb-4">
          En son haberleri ve önemli gelişmeleri e-posta ile al.
        </p>
        <div className="space-y-3">
          <input
            type="email"
            placeholder="E-posta adresiniz"
            className="w-full px-3 py-2 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <button className="w-full bg-white text-purple-600 font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors text-sm">
            Abone Ol
          </button>
        </div>
      </div>
    </div>
  );
}
