"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, ExternalLink, Trophy, Target, Users, Zap, Car, Globe } from 'lucide-react';

interface SportNews {
  id: string;
  title: string;
  summary: string;
  category: string;
  publishTime: string;
  readTime: number;
  image: string;
  author: string;
  isBreaking?: boolean;
  tags: string[];
  team?: string;
}

const SportNewsGridNew = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [news, setNews] = useState<SportNews[]>([]);

  useEffect(() => {
    // Simüle edilmiş spor haberleri
    const sportNews: SportNews[] = [
      {
        id: '1',
        title: 'Galatasaray - Fenerbahçe Derbisi 2-1 Bitti: Tarihi Galibiyet!',
        summary: 'Türkiye Süper Ligi\'nin 28. haftasında oynanan derbi maçında Galatasaray, Fenerbahçe\'yi 2-1 mağlup etti.',
        category: 'football',
        publishTime: '1 saat önce',
        readTime: 4,
        image: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=800&h=600&fit=crop',
        author: 'Ahmet Futbol',
        isBreaking: true,
        tags: ['Süper Lig', 'Derbi', 'Galatasaray'],
        team: 'Galatasaray',
      },
      {
        id: '2',
        title: 'Beşiktaş Transfer Bombası: Dünya Yıldızı İmzaladı!',
        summary: 'Beşiktaş, Avrupa\'nın önde gelen takımlarından birinde oynayan yıldız futbolcuyu kadrosuna kattığını açıkladı.',
        category: 'transfer',
        publishTime: '3 saat önce',
        readTime: 5,
        image: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800&h=600&fit=crop',
        author: 'Zehra Transfer',
        tags: ['Transfer', 'Beşiktaş', 'Yeni Transfer'],
        team: 'Beşiktaş',
      },
      {
        id: '3',
        title: 'A Milli Takım EURO 2024 Hazırlıkları: Yeni Kadroda Sürprizler',
        summary: 'A Milli Futbol Takımı\'nın EURO 2024 hazırlık kampı kadrosu açıklandı. Kadrodaki genç oyuncular dikkat çekiyor.',
        category: 'national',
        publishTime: '5 saat önce',
        readTime: 6,
        image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop',
        author: 'Murat Milli',
        tags: ['A Milli Takım', 'EURO 2024', 'Kadro'],
      },
      {
        id: '4',
        title: 'Efes EuroLeague\'de Finalde: Barcelona\'yı Yendi',
        summary: 'Anadolu Efes, EuroLeague yarı finalinde Barcelona\'yı 89-76 yenerek finale yükseldi.',
        category: 'basketball',
        publishTime: '8 saat önce',
        readTime: 4,
        image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=600&fit=crop',
        author: 'Can Basketbol',
        tags: ['Basketbol', 'EuroLeague', 'Efes'],
        team: 'Anadolu Efes',
      },
      {
        id: '5',
        title: 'VakıfBank Dünya Şampiyonu: Voleybolda Tarihi Başarı',
        summary: 'VakıfBank, FIVB Kulüpler Dünya Şampiyonası\'nda finalde Conegliano\'yu yenerek şampiyon oldu.',
        category: 'volleyball',
        publishTime: '12 saat önce',
        readTime: 3,
        image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&h=600&fit=crop',
        author: 'Ayşe Voleybol',
        tags: ['Voleybol', 'VakıfBank', 'Dünya Şampiyonası'],
        team: 'VakıfBank',
      },
      {
        id: '6',
        title: 'Formula 1 Türkiye GP: Lewis Hamilton Pole Position\'da',
        summary: 'Formula 1 Türkiye Grand Prix\'si sıralama turlarında Lewis Hamilton pole position\'ı aldı.',
        category: 'motorsport',
        publishTime: '1 gün önce',
        readTime: 4,
        image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop',
        author: 'Emre Motor',
        tags: ['Formula 1', 'Hamilton', 'Türkiye GP'],
      },
      {
        id: '7',
        title: 'Wimbledon Şampiyonu: Novak Djokovic 7. Kez Zirveye Çıktı',
        summary: 'Novak Djokovic, Wimbledon finalinde Carlos Alcaraz\'ı yenerek 7. kez şampiyon oldu.',
        category: 'tennis',
        publishTime: '2 gün önce',
        readTime: 5,
        image: 'https://images.unsplash.com/photo-1526232761682-d26e85d9fdd6?w=800&h=600&fit=crop',
        author: 'Selin Tenis',
        tags: ['Tenis', 'Wimbledon', 'Djokovic'],
      },
      {
        id: '8',
        title: 'UEFA Şampiyonlar Ligi Kura Çekimi: Türk Takımlarının Rakipleri',
        summary: 'Şampiyonlar Ligi kura çekimi sonucu Galatasaray ve Fenerbahçe\'nin rakipleri belli oldu.',
        category: 'european',
        publishTime: '3 gün önce',
        readTime: 6,
        image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&h=600&fit=crop',
        author: 'UEFA Muhabiri',
        tags: ['Şampiyonlar Ligi', 'Kura', 'UEFA'],
      },
    ];

    setNews(sportNews);
  }, []);

  const categories = [
    { id: 'all', name: 'Tümü', icon: Globe, count: news.length },
    { id: 'football', name: 'Futbol', icon: Target, count: news.filter(n => n.category === 'football').length },
    { id: 'basketball', name: 'Basketbol', icon: Trophy, count: news.filter(n => n.category === 'basketball').length },
    { id: 'volleyball', name: 'Voleybol', icon: Users, count: news.filter(n => n.category === 'volleyball').length },
    { id: 'transfer', name: 'Transfer', icon: Zap, count: news.filter(n => n.category === 'transfer').length },
    { id: 'motorsport', name: 'Motor Sporları', icon: Car, count: news.filter(n => n.category === 'motorsport').length },
  ];

  const filteredNews = selectedCategory === 'all' 
    ? news 
    : news.filter(item => item.category === selectedCategory);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">⚽ Spor Haberleri</h2>
        <Link href="/spor/haberler" className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
          <span>Tümünü Gör</span>
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>

      {/* Kategori Filtreleri */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => {
          const IconComponent = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              {category.name}
              <span className="bg-white px-2 py-1 rounded-full text-xs">
                {category.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Haber Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNews.slice(0, 6).map((article) => (
          <article
            key={article.id}
            className="group cursor-pointer border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            {/* Haber Resmi */}
            <div className="relative h-48 overflow-hidden">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {article.isBreaking && (
                <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold animate-pulse">
                  SON DAKİKA
                </div>
              )}
              <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                {article.category.toUpperCase()}
              </div>
              {article.team && (
                <div className="absolute top-3 right-3 bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold">
                  {article.team}
                </div>
              )}
            </div>

            {/* Haber İçeriği */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-green-600 transition-colors mb-2">
                {article.title}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                {article.summary}
              </p>

              {/* Etiketler */}
              <div className="flex flex-wrap gap-1 mb-3">
                {article.tags.slice(0, 2).map((tag, index) => (
                  <span
                    key={index}
                    className="bg-green-50 text-green-600 px-2 py-1 rounded text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Meta Bilgiler */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {article.publishTime}
                  </div>
                  <span>{article.readTime} dk okuma</span>
                </div>
                <span className="font-medium text-gray-700">{article.author}</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Daha Fazla Haber Butonu */}
      <div className="text-center mt-8">
        <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium">
          Daha Fazla Spor Haberi Yükle
        </button>
      </div>
    </div>
  );
};

export default SportNewsGridNew;
