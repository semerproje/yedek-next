"use client";

import { useState, useEffect } from 'react';
import { 
  Trophy, 
  Target, 
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  Clock,
  ExternalLink,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  BarChart3
} from 'lucide-react';

interface SportAnalytic {
  id: string;
  title: string;
  value: string;
  change: number;
  changeType: 'increase' | 'decrease';
  description: string;
  icon: any;
  color: string;
  bgColor: string;
}

interface SportPrediction {
  id: string;
  match: string;
  prediction: string;
  confidence: number;
  category: string;
  timestamp: string;
  teams: { home: string; away: string };
  odds: { home: string; draw: string; away: string };
}

const SportAiPanelNew = () => {
  const [sportAnalytics, setSportAnalytics] = useState<SportAnalytic[]>([]);
  const [sportPredictions, setSportPredictions] = useState<SportPrediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simüle edilmiş AI analytics ve tahminler
    const loadSportData = () => {
      const analytics: SportAnalytic[] = [
        {
          id: '1',
          title: 'Maç Tahmin Doğruluğu',
          value: '87.4%',
          change: 5.2,
          changeType: 'increase',
          description: 'AI tahmin sisteminin başarı oranı',
          icon: Target,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
        },
        {
          id: '2',
          title: 'Aktif Analiz',
          value: '247',
          change: 23,
          changeType: 'increase',
          description: 'Gerçek zamanlı analiz edilen maçlar',
          icon: Activity,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
        },
        {
          id: '3',
          title: 'Performans Skoru',
          value: '94.2',
          change: 2.1,
          changeType: 'increase',
          description: 'Takım performans analiz puanı',
          icon: BarChart3,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
        },
        {
          id: '4',
          title: 'Transfer Değeri',
          value: '€1.2B',
          change: -3.4,
          changeType: 'decrease',
          description: 'Analiz edilen toplam transfer değeri',
          icon: TrendingUp,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
        },
      ];

      const predictions: SportPrediction[] = [
        {
          id: '1',
          match: 'Galatasaray vs Fenerbahçe',
          prediction: 'Galatasaray Galibiyeti',
          confidence: 78,
          category: 'Süper Lig',
          timestamp: '2 saat sonra',
          teams: { home: 'Galatasaray', away: 'Fenerbahçe' },
          odds: { home: '2.10', draw: '3.40', away: '3.20' },
        },
        {
          id: '2',
          match: 'Anadolu Efes vs Barcelona',
          prediction: 'Efes Galibiyeti',
          confidence: 82,
          category: 'EuroLeague',
          timestamp: '1 gün sonra',
          teams: { home: 'Anadolu Efes', away: 'Barcelona' },
          odds: { home: '1.85', draw: '-', away: '1.95' },
        },
        {
          id: '3',
          match: 'VakıfBank vs Conegliano',
          prediction: 'VakıfBank 3-1',
          confidence: 89,
          category: 'CEV Şampiyonlar Ligi',
          timestamp: '3 saat sonra',
          teams: { home: 'VakıfBank', away: 'Conegliano' },
          odds: { home: '1.75', draw: '-', away: '2.05' },
        },
        {
          id: '4',
          match: 'Beşiktaş vs Trabzonspor',
          prediction: 'Beraberlik',
          confidence: 65,
          category: 'Süper Lig',
          timestamp: '1 hafta sonra',
          teams: { home: 'Beşiktaş', away: 'Trabzonspor' },
          odds: { home: '2.45', draw: '3.10', away: '2.90' },
        },
        {
          id: '5',
          match: 'A Milli Takım vs İtalya',
          prediction: 'İtalya Galibiyeti',
          confidence: 71,
          category: 'UEFA Nations League',
          timestamp: '2 hafta sonra',
          teams: { home: 'Türkiye', away: 'İtalya' },
          odds: { home: '3.50', draw: '3.20', away: '2.10' },
        },
      ];

      setSportAnalytics(analytics);
      setSportPredictions(predictions);
      setIsLoading(false);
    };

    loadSportData();
    
    // 30 saniyede bir güncelle
    const interval = setInterval(() => {
      const updatedAnalytics = sportAnalytics.map(analytic => ({
        ...analytic,
        change: analytic.change + (Math.random() - 0.5) * 2,
      }));
      setSportAnalytics(updatedAnalytics);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-green-100 text-green-700 border-green-200';
    if (confidence >= 60) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-red-100 text-red-700 border-red-200';
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 80) return 'Yüksek Güven';
    if (confidence >= 60) return 'Orta Güven';
    return 'Düşük Güven';
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-green-600" />
          <h2 className="text-xl font-semibold text-gray-900">🤖 Spor AI Analiz Merkezi</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-500">Gerçek Zamanlı AI Analizi</span>
        </div>
      </div>

      {/* Sport Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {sportAnalytics.map((analytic) => {
          const IconComponent = analytic.icon;
          const isPositive = analytic.changeType === 'increase';
          
          return (
            <div
              key={analytic.id}
              className={`${analytic.bgColor} rounded-lg p-4 border border-gray-100 hover:shadow-md transition-all duration-300`}
            >
              <div className="flex items-center justify-between mb-3">
                <IconComponent className={`w-6 h-6 ${analytic.color}`} />
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {Math.abs(analytic.change).toFixed(1)}%
                </div>
              </div>
              
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-gray-900">{analytic.value}</h3>
                <p className="text-sm font-medium text-gray-700">{analytic.title}</p>
                <p className="text-xs text-gray-500">{analytic.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Predictions */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">🎯 AI Maç Tahminleri</h3>
          <a href="/spor/ai-tahminler" className="text-green-600 hover:text-green-700 flex items-center gap-1">
            <span>Tümünü Gör</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <div className="space-y-4">
          {sportPredictions.slice(0, 4).map((prediction) => (
            <div
              key={prediction.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-300 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {prediction.match}
                  </h4>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-gray-600">{prediction.category}</span>
                    <span className="text-sm text-gray-400">•</span>
                    <span className="text-sm text-gray-600">{prediction.timestamp}</span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getConfidenceColor(prediction.confidence)}`}>
                  {getConfidenceText(prediction.confidence)}
                </span>
              </div>
              
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <div className="text-sm font-medium text-green-600 mb-1">
                    AI Tahmini: {prediction.prediction}
                  </div>
                  <div className="text-xs text-gray-500">
                    Güven Oranı: %{prediction.confidence}
                  </div>
                </div>
                
                {/* Odds */}
                <div className="flex items-center gap-2 text-xs">
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">{prediction.odds.home}</div>
                    <div className="text-gray-500">1</div>
                  </div>
                  {prediction.odds.draw !== '-' && (
                    <div className="text-center">
                      <div className="font-semibold text-gray-900">{prediction.odds.draw}</div>
                      <div className="text-gray-500">X</div>
                    </div>
                  )}
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">{prediction.odds.away}</div>
                    <div className="text-gray-500">2</div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${prediction.confidence}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 AI Performans Metrikleri</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Doğru Tahmin', value: '847/972', color: 'text-green-600', percentage: '87.1%' },
            { label: 'Analiz Edilen Maç', value: '2,456', color: 'text-blue-600', percentage: '+12%' },
            { label: 'Takım Performansı', value: '94.2/100', color: 'text-purple-600', percentage: '+2.1%' },
            { label: 'Transfer Değeri', value: '€1.2B', color: 'text-orange-600', percentage: '-3.4%' },
          ].map((metric, index) => (
            <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
              <div className={`text-xl font-bold ${metric.color}`}>
                {metric.value}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {metric.label}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {metric.percentage}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Analysis */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">⚡ Canlı Analiz</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-700">Galatasaray - Fenerbahçe</span>
              <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold animate-pulse">
                CANLI
              </span>
            </div>
            <div className="text-sm text-green-600 mb-1">
              AI Tahmin: Galatasaray avantajlı (%78 güven)
            </div>
            <div className="text-xs text-gray-600">
              Anlık skor: 2-1 (67. dakika)
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-700">Anadolu Efes - Barcelona</span>
              <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold">
                ANALİZ
              </span>
            </div>
            <div className="text-sm text-blue-600 mb-1">
              AI Tahmin: Efes galibiyeti (%82 güven)
            </div>
            <div className="text-xs text-gray-600">
              Maç saati: Yarın 20:00
            </div>
          </div>
        </div>
      </div>

      {/* Quick AI Tools */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-600 mr-2">Hızlı Analiz:</span>
          {['Maç Tahmini', 'Takım Analizi', 'Performans Skoru', 'Transfer Değeri', 'Canlı Analiz', 'İstatistik'].map((tool, index) => (
            <button
              key={index}
              className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-sm hover:bg-green-100 transition-colors flex items-center gap-1"
            >
              <Target className="w-3 h-3" />
              {tool}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SportAiPanelNew;
