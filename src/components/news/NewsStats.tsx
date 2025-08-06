"use client";

import { useState, useEffect } from "react";
import { BarChart3, Users, Eye, MessageCircle, TrendingUp, Calendar, Globe, Award } from "lucide-react";

interface NewsStats {
  totalNews: number;
  totalViews: number;
  totalComments: number;
  activeUsers: number;
  dailyNews: number;
  weeklyGrowth: number;
  monthlyGrowth: number;
  topCategory: string;
}

export default function NewsStats() {
  const [stats, setStats] = useState<NewsStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    setTimeout(() => {
      setStats({
        totalNews: 2847,
        totalViews: 1547892,
        totalComments: 23456,
        activeUsers: 8942,
        dailyNews: 147,
        weeklyGrowth: 12.5,
        monthlyGrowth: 34.8,
        topCategory: "Ekonomi"
      });
      setLoading(false);
    }, 500);
  }, []);

  if (loading || !stats) {
    return (
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 animate-pulse">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  const statsCards = [
    {
      title: "Toplam Haber",
      value: stats.totalNews.toLocaleString(),
      change: `+${stats.dailyNews} bugün`,
      icon: <BarChart3 className="w-8 h-8" />,
      color: "from-blue-500 to-blue-600",
      textColor: "text-blue-600"
    },
    {
      title: "Toplam Görüntüleme",
      value: `${(stats.totalViews / 1000000).toFixed(1)}M`,
      change: `+${stats.weeklyGrowth}% bu hafta`,
      icon: <Eye className="w-8 h-8" />,
      color: "from-green-500 to-green-600",
      textColor: "text-green-600"
    },
    {
      title: "Aktif Kullanıcı",
      value: `${(stats.activeUsers / 1000).toFixed(1)}K`,
      change: "şu anda aktif",
      icon: <Users className="w-8 h-8" />,
      color: "from-purple-500 to-purple-600",
      textColor: "text-purple-600"
    },
    {
      title: "Toplam Yorum",
      value: `${(stats.totalComments / 1000).toFixed(1)}K`,
      change: `+${stats.monthlyGrowth}% bu ay`,
      icon: <MessageCircle className="w-8 h-8" />,
      color: "from-orange-500 to-orange-600",
      textColor: "text-orange-600"
    }
  ];

  const achievementCards = [
    {
      title: "En Popüler Kategori",
      value: stats.topCategory,
      description: "Bu ayki en çok okunan kategori",
      icon: <Award className="w-6 h-6" />,
      color: "bg-yellow-100 dark:bg-yellow-900",
      textColor: "text-yellow-600"
    },
    {
      title: "Haftalık Büyüme",
      value: `%${stats.weeklyGrowth}`,
      description: "Okuyucu sayısında artış",
      icon: <TrendingUp className="w-6 h-6" />,
      color: "bg-green-100 dark:bg-green-900",
      textColor: "text-green-600"
    },
    {
      title: "Günlük Ortalama",
      value: `${stats.dailyNews} haber`,
      description: "Her gün yayınlanan haber",
      icon: <Calendar className="w-6 h-6" />,
      color: "bg-blue-100 dark:bg-blue-900",
      textColor: "text-blue-600"
    },
    {
      title: "Küresel Erişim",
      value: "47 ülke",
      description: "Haberlerimize erişim sağlanan ülke",
      icon: <Globe className="w-6 h-6" />,
      color: "bg-purple-100 dark:bg-purple-900",
      textColor: "text-purple-600"
    }
  ];

  return (
    <div className="mt-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Platform İstatistikleri
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Net Haberler platformunun canlı istatistikleri ve performans verileri
        </p>
      </div>

      {/* Ana İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((card, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${card.color} text-white`}>
                {card.icon}
              </div>
              <div className={`text-2xl font-bold ${card.textColor}`}>
                {card.value}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {card.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {card.change}
            </p>
          </div>
        ))}
      </div>

      {/* Başarı Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {achievementCards.map((card, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-lg ${card.color}`}>
                <div className={card.textColor}>
                  {card.icon}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {card.title}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {card.description}
                </p>
              </div>
            </div>
            <div className={`text-xl font-bold ${card.textColor}`}>
              {card.value}
            </div>
          </div>
        ))}
      </div>

      {/* Kategori Performansı */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Kategori Performansı (Bu Ay)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: "Ekonomi", articles: 387, views: "1.2M", growth: "+15%" },
            { name: "Gündem", articles: 542, views: "890K", growth: "+8%" },
            { name: "Spor", articles: 298, views: "750K", growth: "+22%" },
            { name: "Teknoloji", articles: 234, views: "680K", growth: "+35%" },
            { name: "Sağlık", articles: 156, views: "420K", growth: "+12%" },
            { name: "Kültür", articles: 143, views: "350K", growth: "+7%" }
          ].map((category) => (
            <div
              key={category.name}
              className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {category.name}
                </h4>
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                  {category.growth}
                </span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <div className="flex justify-between">
                  <span>Makale:</span>
                  <span className="font-medium">{category.articles}</span>
                </div>
                <div className="flex justify-between">
                  <span>Görüntüleme:</span>
                  <span className="font-medium">{category.views}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
