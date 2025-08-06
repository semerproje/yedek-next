"use client";

import { useState } from 'react';
import { 
  Target, 
  Trophy, 
  Users, 
  Zap, 
  Car, 
  Medal, 
  Dumbbell,
  Bike,
  ChevronRight,
  TrendingUp,
  Clock,
  Globe
} from 'lucide-react';
import Link from 'next/link';

interface SportTheme {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  newsCount: number;
  growthRate: string;
  trending: boolean;
  lastUpdate: string;
  subcategories: string[];
  teams?: string[];
}

const SportThemesNew = () => {
  const [activeTheme, setActiveTheme] = useState<string | null>(null);

  const sportThemes: SportTheme[] = [
    {
      id: 'football',
      title: 'Futbol',
      description: 'Süper Lig, Avrupa Ligleri, Milli Takım ve transfer haberleri',
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      newsCount: 342,
      growthRate: '+34%',
      trending: true,
      lastUpdate: '5 dakika önce',
      subcategories: ['Süper Lig', 'Avrupa Ligleri', 'A Milli Takım', 'Transferler'],
      teams: ['Galatasaray', 'Fenerbahçe', 'Beşiktaş', 'Trabzonspor'],
    },
    {
      id: 'basketball',
      title: 'Basketbol',
      description: 'THY EuroLeague, BSL, NBA ve milli takım basketbolu',
      icon: Trophy,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      newsCount: 156,
      growthRate: '+28%',
      trending: true,
      lastUpdate: '12 dakika önce',
      subcategories: ['EuroLeague', 'BSL', 'NBA', 'FIBA'],
      teams: ['Efes', 'Fenerbahçe Beko', 'Galatasaray', 'Darüşşafaka'],
    },
    {
      id: 'volleyball',
      title: 'Voleybol',
      description: 'CEV Şampiyonlar Ligi, Sultanlar Ligi, Efeler Ligi',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      newsCount: 98,
      growthRate: '+45%',
      trending: true,
      lastUpdate: '18 dakika önce',
      subcategories: ['Sultanlar Ligi', 'Efeler Ligi', 'CEV', 'Milli Takımlar'],
      teams: ['VakıfBank', 'Eczacıbaşı', 'Galatasaray', 'Fenerbahçe'],
    },
    {
      id: 'tennis',
      title: 'Tenis',
      description: 'Grand Slam turnuvaları, ATP, WTA ve Türk tenisçiler',
      icon: Zap,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      newsCount: 76,
      growthRate: '+12%',
      trending: false,
      lastUpdate: '25 dakika önce',
      subcategories: ['Grand Slam', 'ATP', 'WTA', 'Türk Tenisçiler'],
    },
    {
      id: 'motorsport',
      title: 'Motor Sporları',
      description: 'Formula 1, Rally, MotoGP ve otomobil yarışları',
      icon: Car,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      newsCount: 89,
      growthRate: '+67%',
      trending: true,
      lastUpdate: '30 dakika önce',
      subcategories: ['Formula 1', 'Rally', 'MotoGP', 'TOSFED'],
    },
    {
      id: 'athletics',
      title: 'Atletizm',
      description: 'Dünya şampiyonaları, olimpiyatlar ve rekor denemeler',
      icon: Medal,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      newsCount: 45,
      growthRate: '+23%',
      trending: false,
      lastUpdate: '1 saat önce',
      subcategories: ['Dünya Şampiyonası', 'Olimpiyatlar', 'Rekorlar', 'Maratonlar'],
    },
    {
      id: 'fitness',
      title: 'Fitness & Sağlık',
      description: 'Fitness trendleri, beslenme, antrenman programları',
      icon: Dumbbell,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      newsCount: 134,
      growthRate: '+89%',
      trending: true,
      lastUpdate: '45 dakika önce',
      subcategories: ['Fitness', 'Beslenme', 'Antrenman', 'Wellness'],
    },
    {
      id: 'cycling',
      title: 'Bisiklet',
      description: 'Tour de France, Giro d\'Italia, Vuelta ve bisiklet sporları',
      icon: Bike,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      newsCount: 67,
      growthRate: '+15%',
      trending: false,
      lastUpdate: '2 saat önce',
      subcategories: ['Tour de France', 'Giro', 'Vuelta', 'Türkiye Turu'],
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">🏆 Spor Kategorileri</h2>
        <Link href="/spor/kategoriler" className="text-green-600 hover:text-green-700 flex items-center gap-1">
          <span>Tümünü Keşfet</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Ana Tema Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {sportThemes.map((theme) => {
          const IconComponent = theme.icon;
          return (
            <div
              key={theme.id}
              className={`${theme.bgColor} rounded-lg p-4 border border-gray-100 hover:shadow-md transition-all duration-300 cursor-pointer group ${
                activeTheme === theme.id ? 'ring-2 ring-green-500' : ''
              }`}
              onClick={() => setActiveTheme(activeTheme === theme.id ? null : theme.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <IconComponent className={`w-8 h-8 ${theme.color} group-hover:scale-110 transition-transform`} />
                {theme.trending && (
                  <div className="flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                    <TrendingUp className="w-3 h-3" />
                    HOT
                  </div>
                )}
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                {theme.title}
              </h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {theme.description}
              </p>
              
              {/* İstatistikler */}
              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <div className="flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  {theme.newsCount} haber
                </div>
                <div className={`font-semibold ${theme.growthRate.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {theme.growthRate}
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Clock className="w-3 h-3" />
                {theme.lastUpdate}
              </div>

              {/* Alt Kategoriler veya Takımlar (Expanded State) */}
              {activeTheme === theme.id && (
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {theme.subcategories.map((sub, index) => (
                        <span
                          key={index}
                          className="bg-white text-gray-600 px-2 py-1 rounded text-xs hover:bg-gray-50 cursor-pointer"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                    {theme.teams && (
                      <div className="flex flex-wrap gap-1 pt-2 border-t border-gray-100">
                        {theme.teams.map((team, index) => (
                          <span
                            key={index}
                            className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs hover:bg-green-200 cursor-pointer font-medium"
                          >
                            {team}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Günün Öne Çıkanları */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🔥 Günün Öne Çıkanları</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { topic: 'Galatasaray Derbisi', count: '2.4K' },
            { topic: 'Efes Finale Çıktı', count: '1.8K' },
            { topic: 'VakıfBank Şampiyon', count: '1.2K' },
            { topic: 'Transfer Bombası', count: '987' },
            { topic: 'Milli Takım Kadrosu', count: '756' },
            { topic: 'Formula 1 Pole', count: '654' },
            { topic: 'Wimbledon Finali', count: '543' },
            { topic: 'Şampiyonlar Ligi', count: '432' },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div className="font-medium text-gray-900 text-sm mb-1">{item.topic}</div>
              <div className="text-xs text-gray-500">{item.count} etkileşim</div>
            </div>
          ))}
        </div>
      </div>

      {/* Canlı Skorlar */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">⚽ Canlı Skorlar</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Süper Lig</span>
              <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold animate-pulse">
                CANLI
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold">GS - FB</span>
              <span className="text-lg font-bold text-green-600">2-1</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">67. dakika</div>
          </div>

          <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">EuroLeague</span>
              <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
                BİTTİ
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold">Efes - Barça</span>
              <span className="text-lg font-bold text-orange-600">89-76</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">Final</div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">CEV</span>
              <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold">
                YAKINDA
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold">VakıfBank - Conegliano</span>
              <span className="text-lg font-bold text-purple-600">20:00</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">Final maçı</div>
          </div>
        </div>
      </div>

      {/* Hızlı Erişim Etiketleri */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex flex-wrap gap-2">
          {['#Futbol', '#Basketbol', '#Voleybol', '#Transfer', '#MilliTakım', '#Şampiyonlar', '#Derbi', '#Galatasaray'].map((tag, index) => (
            <button
              key={index}
              className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-sm hover:bg-green-100 transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SportThemesNew;
