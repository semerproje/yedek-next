"use client";

import { useState } from 'react';
import { Globe, Users, Building2, Zap, Shield, Handshake, Briefcase, Heart } from 'lucide-react';

interface WorldTheme {
  id: string;
  name: string;
  icon: any;
  count: number;
  color: string;
  bgColor: string;
  description: string;
}

const WorldThemesNew = () => {
  const [selectedTheme, setSelectedTheme] = useState<string>('all');

  const themes: WorldTheme[] = [
    {
      id: 'diplomacy',
      name: 'Diplomasi',
      icon: Handshake,
      count: 156,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 hover:bg-blue-100',
      description: 'Uluslararası ilişkiler ve anlaşmalar'
    },
    {
      id: 'economy',
      name: 'Küresel Ekonomi',
      icon: Briefcase,
      count: 234,
      color: 'text-green-600',
      bgColor: 'bg-green-50 hover:bg-green-100',
      description: 'Ticaret, finans ve ekonomik gelişmeler'
    },
    {
      id: 'security',
      name: 'Güvenlik',
      icon: Shield,
      count: 89,
      color: 'text-red-600',
      bgColor: 'bg-red-50 hover:bg-red-100',
      description: 'Savunma, terörizmle mücadele ve barış'
    },
    {
      id: 'energy',
      name: 'Enerji',
      icon: Zap,
      count: 127,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 hover:bg-yellow-100',
      description: 'Yenilenebilir enerji ve iklim politikaları'
    },
    {
      id: 'migration',
      name: 'Göç',
      icon: Users,
      count: 98,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 hover:bg-purple-100',
      description: 'Mülteci krizi ve göç politikaları'
    },
    {
      id: 'organizations',
      name: 'Uluslararası Örgütler',
      icon: Building2,
      count: 67,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 hover:bg-indigo-100',
      description: 'BM, NATO, AB ve diğer örgütler'
    },
    {
      id: 'humanitarian',
      name: 'İnsani Yardım',
      icon: Heart,
      count: 145,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50 hover:bg-pink-100',
      description: 'Afet yardımı ve insani krizler'
    },
    {
      id: 'global',
      name: 'Küresel Konular',
      icon: Globe,
      count: 189,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50 hover:bg-cyan-100',
      description: 'Pandemiler, iklim değişikliği, teknoloji'
    }
  ];

  const handleThemeClick = (themeId: string) => {
    setSelectedTheme(themeId);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">🌍 Dünya Temaları</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedTheme('all')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedTheme === 'all'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Tümü
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {themes.map((theme) => {
          const IconComponent = theme.icon;
          const isSelected = selectedTheme === theme.id;
          
          return (
            <button
              key={theme.id}
              onClick={() => handleThemeClick(theme.id)}
              className={`${theme.bgColor} ${
                isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
              } rounded-lg p-4 text-center transition-all duration-200 hover:shadow-md border border-gray-100`}
              title={theme.description}
            >
              <div className="space-y-2">
                <div className="flex justify-center">
                  <IconComponent className={`w-6 h-6 ${theme.color}`} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 leading-tight">
                    {theme.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {theme.count} haber
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {selectedTheme !== 'all' && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            {(() => {
              const selectedThemeData = themes.find(t => t.id === selectedTheme);
              if (!selectedThemeData) return null;
              const IconComponent = selectedThemeData.icon;
              return (
                <>
                  <IconComponent className={`w-5 h-5 ${selectedThemeData.color}`} />
                  <div>
                    <h4 className="font-medium text-gray-900">{selectedThemeData.name}</h4>
                    <p className="text-sm text-gray-600">{selectedThemeData.description}</p>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* İstatistikler */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {themes.reduce((sum, theme) => sum + theme.count, 0)}
            </div>
            <div className="text-sm text-gray-500">Toplam Haber</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">8</div>
            <div className="text-sm text-gray-500">Tema Kategorisi</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">47</div>
            <div className="text-sm text-gray-500">Ülke Kapsamı</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">156</div>
            <div className="text-sm text-gray-500">Kaynak Ajans</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorldThemesNew;
