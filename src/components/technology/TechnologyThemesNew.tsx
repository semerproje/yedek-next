"use client";

import { useState } from 'react';
import { 
  Brain, 
  Smartphone, 
  Car, 
  Gamepad2, 
  Shield, 
  Rocket, 
  Zap, 
  Code,
  ChevronRight,
  TrendingUp,
  Users,
  Clock
} from 'lucide-react';
import Link from 'next/link';

interface TechTheme {
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
}

const TechnologyThemesNew = () => {
  const [activeTheme, setActiveTheme] = useState<string | null>(null);

  const techThemes: TechTheme[] = [
    {
      id: 'ai',
      title: 'Yapay Zeka',
      description: 'Machine Learning, Deep Learning, AI modelleri ve uygulamaları',
      icon: Brain,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      newsCount: 247,
      growthRate: '+89%',
      trending: true,
      lastUpdate: '2 saat önce',
      subcategories: ['ChatGPT', 'Machine Learning', 'Computer Vision', 'NLP'],
    },
    {
      id: 'mobile',
      title: 'Mobil Teknoloji',
      description: 'Akıllı telefonlar, uygulamalar ve mobil innovation',
      icon: Smartphone,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      newsCount: 189,
      growthRate: '+45%',
      trending: true,
      lastUpdate: '1 saat önce',
      subcategories: ['iOS', 'Android', 'Mobile Apps', '5G'],
    },
    {
      id: 'automotive',
      title: 'Otomotiv Tech',
      description: 'Elektrikli araçlar, otonom sürüş ve akıllı ulaşım',
      icon: Car,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      newsCount: 156,
      growthRate: '+67%',
      trending: true,
      lastUpdate: '3 saat önce',
      subcategories: ['Tesla', 'Autonomous', 'EV Batteries', 'Smart Cities'],
    },
    {
      id: 'gaming',
      title: 'Gaming & VR',
      description: 'Video oyunları, sanal gerçeklik ve metaverse',
      icon: Gamepad2,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      newsCount: 134,
      growthRate: '+34%',
      trending: false,
      lastUpdate: '4 saat önce',
      subcategories: ['VR/AR', 'Metaverse', 'Game Dev', 'Esports'],
    },
    {
      id: 'cybersecurity',
      title: 'Siber Güvenlik',
      description: 'Cybersecurity, data protection ve privacy teknolojileri',
      icon: Shield,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      newsCount: 112,
      growthRate: '+56%',
      trending: true,
      lastUpdate: '5 saat önce',
      subcategories: ['Encryption', 'Privacy', 'Blockchain Security', 'Zero Trust'],
    },
    {
      id: 'space',
      title: 'Uzay Teknolojisi',
      description: 'SpaceX, NASA, uydu teknolojileri ve uzay araştırmaları',
      icon: Rocket,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      newsCount: 98,
      growthRate: '+78%',
      trending: true,
      lastUpdate: '6 saat önce',
      subcategories: ['SpaceX', 'Satellites', 'Mars', 'Space Mining'],
    },
    {
      id: 'blockchain',
      title: 'Blockchain & Crypto',
      description: 'Cryptocurrency, DeFi, NFT ve blockchain uygulamaları',
      icon: Zap,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      newsCount: 87,
      growthRate: '+23%',
      trending: false,
      lastUpdate: '7 saat önce',
      subcategories: ['Bitcoin', 'Ethereum', 'DeFi', 'NFT'],
    },
    {
      id: 'software',
      title: 'Software Development',
      description: 'Programming languages, frameworks ve development tools',
      icon: Code,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      newsCount: 145,
      growthRate: '+41%',
      trending: false,
      lastUpdate: '8 saat önce',
      subcategories: ['React', 'Python', 'Cloud Computing', 'DevOps'],
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">🚀 Teknoloji Temaları</h2>
        <Link href="/teknoloji/temalar" className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
          <span>Tümünü Keşfet</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Ana Tema Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {techThemes.map((theme) => {
          const IconComponent = theme.icon;
          return (
            <div
              key={theme.id}
              className={`${theme.bgColor} rounded-lg p-4 border border-gray-100 hover:shadow-md transition-all duration-300 cursor-pointer group ${
                activeTheme === theme.id ? 'ring-2 ring-blue-500' : ''
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
              
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {theme.title}
              </h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {theme.description}
              </p>
              
              {/* İstatistikler */}
              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
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

              {/* Alt Kategoriler (Expanded State) */}
              {activeTheme === theme.id && (
                <div className="mt-4 pt-3 border-t border-gray-200">
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
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Trending Topics */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🔥 Trend Konular</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { topic: 'GPT-5 Release', count: '2.4K' },
            { topic: 'Apple M4 Chip', count: '1.8K' },
            { topic: 'Quantum Computing', count: '1.2K' },
            { topic: 'Tesla Robotaxi', count: '987' },
            { topic: 'Meta Quest 4', count: '756' },
            { topic: 'Ethereum 2.0', count: '654' },
            { topic: 'Azure AI Studio', count: '543' },
            { topic: 'Samsung S25 Ultra', count: '432' },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div className="font-medium text-gray-900 text-sm mb-1">{item.topic}</div>
              <div className="text-xs text-gray-500">{item.count} tartışma</div>
            </div>
          ))}
        </div>
      </div>

      {/* Hızlı Erişim */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex flex-wrap gap-2">
          {['#AI', '#MachineLearning', '#BlockChain', '#VirtualReality', '#ElectricVehicles', '#CyberSecurity', '#SpaceTech', '#MobileTech'].map((tag, index) => (
            <button
              key={index}
              className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm hover:bg-blue-100 transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechnologyThemesNew;
