'use client';

import React, { useState, useEffect } from 'react';
import { ExternalLink, MapPin, Calendar, Tag, Bookmark, Share2, Eye, Leaf, TreePine, Recycle, Globe, Droplets, Wind } from 'lucide-react';

interface EnvironmentNews {
  id: string;
  title: string;
  content: string;
  location: string;
  category: string;
  publishedAt: string;
  views: number;
  likes: number;
  urgent?: boolean;
  verified?: boolean;
  imageUrl?: string;
  source: string;
  impactLevel: 'low' | 'medium' | 'high';
}

const EnvironmentNewsGrid = () => {
  const [news, setNews] = useState<EnvironmentNews[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Tümü');

  const categories = [
    'Tümü', 'İklim Değişikliği', 'Hava Kirliliği', 'Su Kaynakları', 
    'Biyoçeşitlilik', 'Yenilenebilir Enerji', 'Geri Dönüşüm', 
    'Orman Koruma', 'Sürdürülebilirlik', 'Çevre Politikaları'
  ];

  useEffect(() => {
    const fetchEnvironmentNews = () => {
      const mockNews: EnvironmentNews[] = [
        {
          id: '1',
          title: 'Türkiye\'nin En Büyük Güneş Enerji Santrali Açıldı',
          content: 'Konya\'da kurulan 1.350 MW kapasiteli güneş enerji santrali, yılda 500 bin konutun elektrik ihtiyacını karşılayacak. Proje ile yıllık 1.2 milyon ton CO₂ emisyonu önlenecek.',
          location: 'Konya',
          category: 'Yenilenebilir Enerji',
          publishedAt: '2024-01-15T10:30:00Z',
          views: 156789,
          likes: 12450,
          urgent: true,
          verified: true,
          impactLevel: 'high',
          source: 'Enerji Bakanlığı'
        },
        {
          id: '2',
          title: 'İstanbul\'da Hava Kalitesi Kritik Seviyeye Ulaştı',
          content: 'Meteoroloji\'nin son verilerine göre İstanbul\'da PM2.5 değeri WHO limitlerinin 2 katına çıktı. Sağlık Bakanlığı vatandaşları açık havada egzersiz yapmama konusunda uyardı.',
          location: 'İstanbul',
          category: 'Hava Kirliliği',
          publishedAt: '2024-01-15T09:15:00Z',
          views: 234567,
          likes: 8750,
          urgent: true,
          impactLevel: 'high',
          source: 'Hava Kalitesi İzleme'
        },
        {
          id: '3',
          title: 'Kapadokya\'da Yeni Nesil Rüzgar Türbinleri Kuruldu',
          content: 'Nevşehir\'de 150 MW kapasiteli rüzgar enerjisi projesinin ilk etabı tamamlandı. Projede kullanılan türbinler %40 daha verimli enerji üretimi sağlıyor.',
          location: 'Nevşehir',
          category: 'Yenilenebilir Enerji',
          publishedAt: '2024-01-15T08:45:00Z',
          views: 89234,
          likes: 15670,
          verified: true,
          impactLevel: 'medium',
          source: 'Rüzgar Enerjisi Derneği'
        },
        {
          id: '4',
          title: 'Marmara Denizi\'nde Deniz Salyası Alarmı',
          content: 'Marmara Denizi\'nin güney kıyılarında deniz salyası yoğunluğu artışa geçti. Bilim insanları sıcaklık artışı ve besin kirliliğini neden gösteriyor.',
          location: 'Marmara Denizi',
          category: 'Su Kaynakları',
          publishedAt: '2024-01-15T07:20:00Z',
          views: 178923,
          likes: 14230,
          urgent: true,
          impactLevel: 'high',
          source: 'Deniz Bilimleri Enstitüsü'
        },
        {
          id: '5',
          title: 'Antalya\'da Plastik Atık Geri Dönüşüm Rekoru',
          content: 'Antalya Büyükşehir Belediyesi 2024 yılında 45 bin ton plastik atığı geri dönüştürdü. Bu rakam geçen yıla göre %23 artış gösteriyor.',
          location: 'Antalya',
          category: 'Geri Dönüşüm',
          publishedAt: '2024-01-15T06:30:00Z',
          views: 134567,
          likes: 11890,
          verified: true,
          impactLevel: 'medium',
          source: 'Antalya Belediyesi'
        },
        {
          id: '6',
          title: 'Karadeniz\'de Balık Popülasyonu %15 Azaldı',
          content: 'TÜBİTAK\'ın 5 yıllık araştırması Karadeniz\'de balık türlerinin sayısında ciddi azalma olduğunu ortaya koydu. İklim değişikliği ana neden olarak gösteriliyor.',
          location: 'Karadeniz',
          category: 'Biyoçeşitlilik',
          publishedAt: '2024-01-15T05:45:00Z',
          views: 98765,
          likes: 7890,
          impactLevel: 'high',
          source: 'TÜBİTAK'
        },
        {
          id: '7',
          title: 'Bursa\'da Elektrikli Otobüs Filosu Genişletildi',
          content: 'Bursa Büyükşehir Belediyesi 50 yeni elektrikli otobüsü hizmete aldı. Toplam elektrikli araç sayısı 120\'ye ulaştı, yıllık 800 ton CO₂ tasarrufu sağlanıyor.',
          location: 'Bursa',
          category: 'Sürdürülebilirlik',
          publishedAt: '2024-01-15T04:15:00Z',
          views: 167432,
          likes: 13240,
          impactLevel: 'medium',
          source: 'Bursa Belediyesi'
        },
        {
          id: '8',
          title: 'Toros Dağları\'nda Orman Koruma Projesi Başladı',
          content: 'Çevre ve Şehircilik Bakanlığı Toros Dağları\'nda 10 bin hektar alanda orman koruma ve rehabilitasyon projesini başlattı. 2 milyon fidan dikilecek.',
          location: 'Toros Dağları',
          category: 'Orman Koruma',
          publishedAt: '2024-01-15T03:30:00Z',
          views: 87654,
          likes: 6540,
          verified: true,
          impactLevel: 'high',
          source: 'Çevre Bakanlığı'
        }
      ];

      // Simulate real-time updates
      const updatedNews = mockNews.map(item => ({
        ...item,
        views: item.views + Math.floor(Math.random() * 100),
        likes: item.likes + Math.floor(Math.random() * 50)
      }));

      setNews(updatedNews);
      setLoading(false);
    };

    fetchEnvironmentNews();
    const interval = setInterval(fetchEnvironmentNews, 30000);

    return () => clearInterval(interval);
  }, []);

  const filteredNews = selectedCategory === 'Tümü' 
    ? news 
    : news.filter(item => item.category === selectedCategory);

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Az önce';
    if (diffInHours < 24) return `${diffInHours} saat önce`;
    return `${Math.floor(diffInHours / 24)} gün önce`;
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'İklim Değişikliği': 'bg-red-100 text-red-800',
      'Hava Kirliliği': 'bg-gray-100 text-gray-800',
      'Su Kaynakları': 'bg-blue-100 text-blue-800',
      'Biyoçeşitlilik': 'bg-green-100 text-green-800',
      'Yenilenebilir Enerji': 'bg-yellow-100 text-yellow-800',
      'Geri Dönüşüm': 'bg-purple-100 text-purple-800',
      'Orman Koruma': 'bg-emerald-100 text-emerald-800',
      'Sürdürülebilirlik': 'bg-teal-100 text-teal-800',
      'Çevre Politikaları': 'bg-indigo-100 text-indigo-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: any } = {
      'İklim Değişikliği': Globe,
      'Hava Kirliliği': Wind,
      'Su Kaynakları': Droplets,
      'Biyoçeşitlilik': TreePine,
      'Yenilenebilir Enerji': Leaf,
      'Geri Dönüşüm': Recycle,
      'Orman Koruma': TreePine,
      'Sürdürülebilirlik': Leaf,
      'Çevre Politikaları': Globe
    };
    return icons[category] || Leaf;
  };

  const getImpactColor = (impact: string) => {
    const colors: { [key: string]: string } = {
      'high': 'bg-red-500',
      'medium': 'bg-yellow-500',
      'low': 'bg-green-500'
    };
    return colors[impact] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <TreePine className="w-6 h-6 text-green-600" />
          Çevre Haberleri
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Canlı</span>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNews.map((item) => {
          const CategoryIcon = getCategoryIcon(item.category);
          
          return (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >
              {/* Image Placeholder */}
              <div className="relative h-48 bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                <CategoryIcon className="w-12 h-12 text-gray-400" />
                {item.urgent && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    Acil
                  </div>
                )}
                {item.verified && (
                  <div className="absolute top-3 right-3 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Doğrulandı
                  </div>
                )}
                {/* Impact Level Indicator */}
                <div className={`absolute bottom-3 left-3 w-3 h-3 rounded-full ${getImpactColor(item.impactLevel)}`}></div>
              </div>

              <div className="p-4">
                {/* Category and Location */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                    {item.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <MapPin className="w-3 h-3" />
                    <span>{item.location}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                  {item.title}
                </h3>

                {/* Content */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {item.content}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>{formatViews(item.views)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Leaf className="w-3 h-3" />
                      <span>{formatViews(item.likes)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{getTimeAgo(item.publishedAt)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-500">{item.source}</span>
                  <div className="flex items-center gap-2">
                    <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
                      <Bookmark className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Show More Button */}
      <div className="mt-8 text-center">
        <button className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors">
          Daha Fazla Çevre Haberi
        </button>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{filteredNews.length}</div>
          <div className="text-sm text-gray-600">Güncel Haber</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">
            {filteredNews.filter(n => n.urgent).length}
          </div>
          <div className="text-sm text-gray-600">Acil Durum</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {filteredNews.filter(n => n.verified).length}
          </div>
          <div className="text-sm text-gray-600">Doğrulanmış</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">
            {filteredNews.filter(n => n.impactLevel === 'high').length}
          </div>
          <div className="text-sm text-gray-600">Yüksek Etki</div>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentNewsGrid;
