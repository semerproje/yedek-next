"use client";

import { useState } from 'react';
import { TrendingUp, DollarSign, BarChart3, Building2, CreditCard, Globe2, Factory, ShoppingCart } from 'lucide-react';

interface ThemeItem {
  id: string;
  name: string;
  count: number;
  color: string;
  bgColor: string;
  icon: React.ComponentType<any>;
  description: string;
}

const EconomyThemes = () => {
  const [selectedTheme, setSelectedTheme] = useState('borsa');

  const themes: ThemeItem[] = [
    {
      id: 'borsa',
      name: 'Borsa',
      count: 124,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      icon: TrendingUp,
      description: 'BIST 100 ve hisse analizleri'
    },
    {
      id: 'doviz',
      name: 'Döviz',
      count: 89,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      icon: DollarSign,
      description: 'USD, EUR ve diğer kurlar'
    },
    {
      id: 'enflasyon',
      name: 'Enflasyon',
      count: 67,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      icon: BarChart3,
      description: 'Fiyat artışları ve analiz'
    },
    {
      id: 'merkez-bankasi',
      name: 'Merkez Bankası',
      count: 54,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      icon: Building2,
      description: 'TCMB kararları ve politika'
    },
    {
      id: 'bankacilik',
      name: 'Bankacılık',
      count: 43,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      icon: CreditCard,
      description: 'Banka haberleri ve kredi'
    },
    {
      id: 'global',
      name: 'Global Piyasalar',
      count: 38,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      icon: Globe2,
      description: 'Dünya ekonomi gelişmeleri'
    },
    {
      id: 'sanayi',
      name: 'Sanayi',
      count: 31,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      icon: Factory,
      description: 'Üretim ve sanayi verileri'
    },
    {
      id: 'tuketim',
      name: 'Tüketim',
      count: 28,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      icon: ShoppingCart,
      description: 'Tüketici davranışları'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Ekonomi Konuları</h3>
        <p className="text-sm text-gray-600">Kategorilere göre haberleri keşfedin</p>
      </div>
      
      <div className="space-y-2">
        {themes.map((theme) => {
          const IconComponent = theme.icon;
          const isSelected = selectedTheme === theme.id;
          
          return (
            <button
              key={theme.id}
              onClick={() => setSelectedTheme(theme.id)}
              className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                isSelected
                  ? `border-blue-200 ${theme.bgColor} text-blue-900 shadow-sm`
                  : 'border-gray-100 hover:border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${isSelected ? 'bg-white shadow-sm' : theme.bgColor}`}>
                  <IconComponent className={`w-4 h-4 ${isSelected ? theme.color : theme.color}`} />
                </div>
                <div className="text-left">
                  <div className="font-medium text-sm">{theme.name}</div>
                  <div className="text-xs text-gray-500">{theme.description}</div>
                </div>
              </div>
              
              <div className="flex flex-col items-end">
                <span className={`text-sm font-semibold ${isSelected ? 'text-blue-600' : 'text-gray-500'}`}>
                  {theme.count}
                </span>
                <span className="text-xs text-gray-400">haber</span>
              </div>
            </button>
          );
        })}
      </div>
      
      {/* Seçili tema detayları */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <div className="text-sm text-gray-700">
          <strong>{themes.find(t => t.id === selectedTheme)?.name}</strong> kategorisinde{' '}
          <span className="font-semibold text-blue-600">
            {themes.find(t => t.id === selectedTheme)?.count}
          </span>{' '}
          haber bulunuyor.
        </div>
      </div>
    </div>
  );
};

export default EconomyThemes;
