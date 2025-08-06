"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, ExternalLink, Cpu, Smartphone, Bot, Globe, Code, Zap } from 'lucide-react';

interface TechNews {
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
}

const TechnologyNewsGridNew = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [news, setNews] = useState<TechNews[]>([]);

  useEffect(() => {
    // Simüle edilmiş teknoloji haberleri
    const techNews: TechNews[] = [
      {
        id: '1',
        title: 'OpenAI GPT-5 Geliştirildi: Yapay Zeka Alanında Çığır Açan Yenilik',
        summary: 'OpenAI\'nin yeni nesil dil modeli GPT-5, insan seviyesinde akıl yürütme kabiliyeti ile dikkat çekiyor.',
        category: 'ai',
        publishTime: '2 saat önce',
        readTime: 5,
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
        author: 'Dr. Ayşe Kaya',
        isBreaking: true,
        tags: ['AI', 'OpenAI', 'Machine Learning'],
      },
      {
        id: '2',
        title: 'Apple Silicon M4 Çipi Tanıtıldı: Mac Performansında Devrim',
        summary: '3nm teknolojisi ile üretilen M4 çipi, %40 daha hızlı işlemci ve %35 daha verimli GPU sunuyor.',
        category: 'hardware',
        publishTime: '4 saat önce',
        readTime: 4,
        image: 'https://images.unsplash.com/photo-1637200532293-62b3a41ea3b1?w=800&h=600&fit=crop',
        author: 'Mehmet Özkan',
        tags: ['Apple', 'Chip', 'Hardware'],
      },
      {
        id: '3',
        title: 'Quantum Computing Atılımı: IBM 1000-Qubit Işlemciyi Duyurdu',
        summary: 'IBM\'in yeni kuantum işlemcisi, klasik bilgisayarları geride bırakacak hesaplama gücü vaat ediyor.',
        category: 'quantum',
        publishTime: '6 saat önce',
        readTime: 6,
        image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=600&fit=crop',
        author: 'Prof. Dr. Fatma Demir',
        tags: ['Quantum', 'IBM', 'Computing'],
      },
      {
        id: '4',
        title: 'Meta VR Gözlükleri 2024: Metaverse Deneyimi Gerçekçiliğe Kavuşuyor',
        summary: 'Yeni Meta Quest 4, 8K çözünürlük ve haptic feedback ile sanal gerçeklik deneyimini zirveye taşıyor.',
        category: 'vr',
        publishTime: '8 saat önce',
        readTime: 4,
        image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=800&h=600&fit=crop',
        author: 'Zeynep Aktaş',
        tags: ['VR', 'Meta', 'Metaverse'],
      },
      {
        id: '5',
        title: 'Tesla Robotaxi Ağı Türkiye\'ye Geliyor: Otonom Sürüş Devrimi',
        summary: 'Tesla\'nın tam otonom araçları 2024 sonunda Türkiye yollarında sürücüsüz taksi hizmeti verecek.',
        category: 'automotive',
        publishTime: '12 saat önce',
        readTime: 5,
        image: 'https://images.unsplash.com/photo-1561043433-aaf687c4cf04?w=800&h=600&fit=crop',
        author: 'Emre Yılmaz',
        tags: ['Tesla', 'Autonomous', 'Transport'],
      },
      {
        id: '6',
        title: 'Samsung Galaxy S25 Ultra Sızıntıları: 200MP Kamera ve AI Özellikleri',
        summary: 'Samsung\'un amiral gemisi Galaxy S25 Ultra, gelişmiş AI fotoğrafçılık ve video özellikleri ile geliyor.',
        category: 'mobile',
        publishTime: '14 saat önce',
        readTime: 3,
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop',
        author: 'Selin Çelik',
        tags: ['Samsung', 'Smartphone', 'Camera'],
      },
      {
        id: '7',
        title: 'Ethereum 2.0 Güncellemesi: Gas Ücretleri %90 Azaldı',
        summary: 'Ethereum\'un yeni proof-of-stake sistemi, işlem maliyetlerini dramatik şekilde düşürüyor.',
        category: 'blockchain',
        publishTime: '16 saat önce',
        readTime: 4,
        image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop',
        author: 'Berk Aydın',
        tags: ['Ethereum', 'Blockchain', 'Crypto'],
      },
      {
        id: '8',
        title: 'Microsoft Azure AI Studio: Kod Yazmadan AI Uygulamaları Geliştirin',
        summary: 'Microsoft\'un yeni platformu, geliştiricilerin AI uygulamalarını görsel araçlarla oluşturmasını sağlıyor.',
        category: 'software',
        publishTime: '18 saat önce',
        readTime: 5,
        image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop',
        author: 'Deniz Koçak',
        tags: ['Microsoft', 'AI Development', 'Cloud'],
      },
    ];

    setNews(techNews);
  }, []);

  const categories = [
    { id: 'all', name: 'Tümü', icon: Globe, count: news.length },
    { id: 'ai', name: 'Yapay Zeka', icon: Bot, count: news.filter(n => n.category === 'ai').length },
    { id: 'hardware', name: 'Donanım', icon: Cpu, count: news.filter(n => n.category === 'hardware').length },
    { id: 'mobile', name: 'Mobil', icon: Smartphone, count: news.filter(n => n.category === 'mobile').length },
    { id: 'software', name: 'Yazılım', icon: Code, count: news.filter(n => n.category === 'software').length },
    { id: 'blockchain', name: 'Blockchain', icon: Zap, count: news.filter(n => n.category === 'blockchain').length },
  ];

  const filteredNews = selectedCategory === 'all' 
    ? news 
    : news.filter(item => item.category === selectedCategory);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">📱 Teknoloji Haberleri</h2>
        <Link href="/teknoloji/haberler" className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
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
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
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
                <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                  SON DAKİKA
                </div>
              )}
              <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                {article.category.toUpperCase()}
              </div>
            </div>

            {/* Haber İçeriği */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors mb-2">
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
                    className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-medium"
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
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
          Daha Fazla Teknoloji Haberi Yükle
        </button>
      </div>
    </div>
  );
};

export default TechnologyNewsGridNew;
