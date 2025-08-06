"use client";

import { useEffect, useState } from 'react';
import { TrendingUp, AlertTriangle, Users, Globe } from 'lucide-react';

interface WorldSummary {
  id: string;
  title: string;
  count: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: any;
  description: string;
  color: string;
  bgColor: string;
}

const WorldSummaryCardsNew = () => {
  const [summaryData, setSummaryData] = useState<WorldSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simüle edilmiş dünya özet verileri
    const mockSummaryData: WorldSummary[] = [
      {
        id: '1',
        title: 'Aktif Diplomatik Görüşmeler',
        count: '47',
        change: '+12',
        changeType: 'positive',
        icon: Users,
        description: 'Bu hafta gerçekleştirilen toplantı sayısı',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50'
      },
      {
        id: '2',
        title: 'Küresel Kriz Alanları',
        count: '18',
        change: '-3',
        changeType: 'positive',
        icon: AlertTriangle,
        description: 'Çözüme kavuşan kriz sayısında azalma',
        color: 'text-red-600',
        bgColor: 'bg-red-50'
      },
      {
        id: '3',
        title: 'Uluslararası Anlaşmalar',
        count: '156',
        change: '+24',
        changeType: 'positive',
        icon: Globe,
        description: 'Bu ay imzalanan anlaşma sayısı',
        color: 'text-green-600',
        bgColor: 'bg-green-50'
      },
      {
        id: '4',
        title: 'Ticaret Hacmi Artışı',
        count: '%8.4',
        change: '+2.1%',
        changeType: 'positive',
        icon: TrendingUp,
        description: 'Küresel ticaret hacmindeki yıllık artış',
        color: 'text-purple-600',
        bgColor: 'bg-purple-50'
      }
    ];

    setTimeout(() => {
      setSummaryData(mockSummaryData);
      setLoading(false);
    }, 800);
  }, []);

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
              <div className="w-12 h-4 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="w-16 h-8 bg-gray-200 rounded"></div>
              <div className="w-full h-4 bg-gray-200 rounded"></div>
              <div className="w-3/4 h-3 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {summaryData.map((item) => {
        const IconComponent = item.icon;
        return (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${item.bgColor} p-2 rounded-lg`}>
                <IconComponent className={`w-6 h-6 ${item.color}`} />
              </div>
              <span className={`text-sm font-medium ${getChangeColor(item.changeType)}`}>
                {item.change}
              </span>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-gray-900">{item.count}</h3>
              <p className="text-sm font-medium text-gray-700">{item.title}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{item.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WorldSummaryCardsNew;
