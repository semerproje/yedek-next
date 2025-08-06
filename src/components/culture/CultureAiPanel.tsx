'use client';

import React, { useState, useEffect } from 'react';
import { Palette, TrendingUp, Users, AlertCircle, CheckCircle, Clock, Zap, BookOpen, Music, Camera } from 'lucide-react';

interface CultureAiData {
  cultureScore: number;
  trendsAnalyzed: number;
  contentRecommendations: number;
  artistInsights: number;
  aiModelsActive: number;
  processingTime: string;
  confidenceScore: number;
  lastUpdate: string;
}

interface AiInsight {
  id: number;
  title: string;
  description: string;
  confidence: number;
  type: 'trend' | 'recommendation' | 'analysis' | 'prediction';
  priority: 'high' | 'medium' | 'low';
  timeAgo: string;
  source: string;
}

const CultureAiPanel = () => {
  const [aiData, setAiData] = useState<CultureAiData>({
    cultureScore: 0,
    trendsAnalyzed: 0,
    contentRecommendations: 0,
    artistInsights: 0,
    aiModelsActive: 0,
    processingTime: '0ms',
    confidenceScore: 0,
    lastUpdate: ''
  });

  const [insights, setInsights] = useState<AiInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('all');

  const insightTypes = [
    { id: 'all', name: 'Tümü', icon: Palette },
    { id: 'trend', name: 'Trendler', icon: TrendingUp },
    { id: 'recommendation', name: 'Öneriler', icon: CheckCircle },
    { id: 'analysis', name: 'Analiz', icon: Users },
    { id: 'prediction', name: 'Tahmin', icon: AlertCircle }
  ];

  useEffect(() => {
    const fetchAiData = () => {
      // Simulate real-time AI culture data
      const newAiData: CultureAiData = {
        cultureScore: 88.6 + (Math.random() - 0.5) * 3,
        trendsAnalyzed: 12847 + Math.floor(Math.random() * 200),
        contentRecommendations: 2341 + Math.floor(Math.random() * 100),
        artistInsights: 567 + Math.floor(Math.random() * 50),
        aiModelsActive: 8,
        processingTime: `${85 + Math.floor(Math.random() * 30)}ms`,
        confidenceScore: 91.4 + (Math.random() - 0.5) * 4,
        lastUpdate: new Date().toLocaleTimeString('tr-TR')
      };

      const mockInsights: AiInsight[] = [
        {
          id: 1,
          title: 'Dijital Sanat Trendinde Artış',
          description: 'AI analizi son 30 günde dijital sanat ilgisinde %67 artış tespit etti',
          confidence: 94.8,
          type: 'trend',
          priority: 'high',
          timeAgo: '8 dk önce',
          source: 'CultureTrend AI v2.1'
        },
        {
          id: 2,
          title: 'Müze Ziyaretçi Tahmini',
          description: 'Hafta sonu müze ziyaretçilerinde %23 artış bekleniyor',
          confidence: 87.2,
          type: 'prediction',
          priority: 'medium',
          timeAgo: '15 dk önce',
          source: 'VisitorPredict AI'
        },
        {
          id: 3,
          title: 'Kişiselleştirilmiş Sanat Önerileri',
          description: 'Kullanıcı profiline göre 1.247 kişiye özel sanat etkinliği önerildi',
          confidence: 92.6,
          type: 'recommendation',
          priority: 'medium',
          timeAgo: '22 dk önce',
          source: 'ArtRecommend AI'
        },
        {
          id: 4,
          title: 'Klasik Müzik İlgi Analizi',
          description: 'Genç nesilde klasik müzik ilgisi beklenenden %15 daha yüksek',
          confidence: 89.1,
          type: 'analysis',
          priority: 'low',
          timeAgo: '35 dk önce',
          source: 'MusicAnalytics AI'
        },
        {
          id: 5,
          title: 'Tiyatro Bilet Satış Tahmini',
          description: 'Yeni tiyatro oyunu için bilet satışları tahmin edilen seviyede',
          confidence: 85.7,
          type: 'prediction',
          priority: 'medium',
          timeAgo: '42 dk önce',
          source: 'TheaterForecast AI'
        },
        {
          id: 6,
          title: 'Sanatçı Popülarite Trendi',
          description: 'Yeni nesil Türk sanatçılarının sosyal medya etkisi artıyor',
          confidence: 91.3,
          type: 'trend',
          priority: 'high',
          timeAgo: '1 saat önce',
          source: 'ArtistTrend AI'
        }
      ];

      setAiData(newAiData);
      setInsights(mockInsights);
      setLoading(false);
    };

    fetchAiData();
    const interval = setInterval(fetchAiData, 20000);

    return () => clearInterval(interval);
  }, []);

  const filteredInsights = selectedType === 'all' 
    ? insights 
    : insights.filter(insight => insight.type === selectedType);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'trend':
        return <TrendingUp className="w-4 h-4" />;
      case 'recommendation':
        return <CheckCircle className="w-4 h-4" />;
      case 'analysis':
        return <Users className="w-4 h-4" />;
      case 'prediction':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Palette className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Palette className="w-6 h-6 text-purple-600" />
            Kültür AI Sistemi
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Aktif</span>
            </div>
            <span>•</span>
            <Clock className="w-4 h-4" />
            <span>{aiData.lastUpdate}</span>
          </div>
        </div>

        {/* AI Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Palette className="w-5 h-5 text-purple-600" />
              <span className="text-xs font-medium text-purple-600">Kültür Skoru</span>
            </div>
            <div className="text-2xl font-bold text-purple-900 mb-1">
              %{aiData.cultureScore.toFixed(1)}
            </div>
            <div className="text-xs text-purple-600">Genel Aktivite</div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span className="text-xs font-medium text-blue-600">Trendler</span>
            </div>
            <div className="text-2xl font-bold text-blue-900 mb-1">
              {aiData.trendsAnalyzed.toLocaleString()}
            </div>
            <div className="text-xs text-blue-600">Analiz Edilen</div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-xs font-medium text-green-600">Öneriler</span>
            </div>
            <div className="text-2xl font-bold text-green-900 mb-1">
              {aiData.contentRecommendations.toLocaleString()}
            </div>
            <div className="text-xs text-green-600">İçerik Önerisi</div>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-orange-600" />
              <span className="text-xs font-medium text-orange-600">Sanatçı</span>
            </div>
            <div className="text-2xl font-bold text-orange-900 mb-1">
              {aiData.artistInsights}
            </div>
            <div className="text-xs text-orange-600">İçgörü Analizi</div>
          </div>
        </div>

        {/* Type Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {insightTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedType === type.id
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {type.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* AI Insights */}
      <div className="space-y-4 mb-6">
        {filteredInsights.map((insight) => (
          <div
            key={insight.id}
            className="bg-gray-50 rounded-lg p-4 border-l-4 border-purple-500 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {getTypeIcon(insight.type)}
                <h3 className="font-semibold text-gray-900">{insight.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(insight.priority)}`}>
                  {insight.priority === 'high' ? 'Yüksek' : insight.priority === 'medium' ? 'Orta' : 'Düşük'}
                </span>
                <span className="text-xs text-gray-500">{insight.timeAgo}</span>
              </div>
            </div>

            <p className="text-gray-600 mb-3">{insight.description}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-700">
                    %{insight.confidence} güven
                  </span>
                </div>
                <span className="text-xs text-gray-500">{insight.source}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredInsights.length === 0 && (
        <div className="text-center py-12">
          <Palette className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Bu kategoride AI insight bulunmuyor.</p>
        </div>
      )}

      {/* System Status */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div className="bg-purple-50 rounded-lg p-3">
            <div className="text-xl font-bold text-purple-600 mb-1">
              {aiData.aiModelsActive}
            </div>
            <div className="text-xs text-gray-600">Aktif AI Modeli</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-xl font-bold text-green-600 mb-1">
              %{aiData.confidenceScore.toFixed(1)}
            </div>
            <div className="text-xs text-gray-600">Ortalama Güven</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-xl font-bold text-blue-600 mb-1">
              {aiData.processingTime}
            </div>
            <div className="text-xs text-gray-600">İşlem Süresi</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-3">
            <div className="text-xl font-bold text-orange-600 mb-1">
              24/7
            </div>
            <div className="text-xs text-gray-600">Kesintisiz Analiz</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CultureAiPanel;
