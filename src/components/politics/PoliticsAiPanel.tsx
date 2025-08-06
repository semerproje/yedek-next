'use client';

import React, { useState, useEffect } from 'react';
import { Bot, Brain, TrendingUp, AlertTriangle, Target, Users, BarChart3, Zap, Activity, Crown } from 'lucide-react';

interface PoliticsAiData {
  predictions: Array<{
    id: string;
    title: string;
    description: string;
    probability: number;
    timeframe: string;
    category: 'election' | 'policy' | 'coalition' | 'crisis' | 'reform';
    impact: 'low' | 'medium' | 'high' | 'critical';
  }>;
  alerts: Array<{
    id: string;
    message: string;
    severity: 'info' | 'warning' | 'critical';
    timestamp: string;
  }>;
  recommendations: Array<{
    id: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    category: string;
  }>;
  sentimentAnalysis: {
    government: number;
    opposition: number;
    public: number;
    media: number;
  };
}

const PoliticsAiPanel = () => {
  const [aiData, setAiData] = useState<PoliticsAiData>({
    predictions: [],
    alerts: [],
    recommendations: [],
    sentimentAnalysis: { government: 0, opposition: 0, public: 0, media: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'predictions' | 'alerts' | 'recommendations' | 'sentiment'>('predictions');

  useEffect(() => {
    const fetchAiData = () => {
      const mockData: PoliticsAiData = {
        predictions: [
          {
            id: '1',
            title: 'Ekonomi Paketi Onaylanma Olasılığı',
            description: 'Mevcut parlamenter destek seviyelerine göre paket %78 olasılıkla onaylanacak',
            probability: 78,
            timeframe: '2 hafta içinde',
            category: 'policy',
            impact: 'high'
          },
          {
            id: '2',
            title: 'Yerel Seçim Sonuç Tahmini',
            description: 'Büyükşehirlerde mevcut dengelerin değişme olasılığı analiz ediliyor',
            probability: 62,
            timeframe: '6 ay içinde',
            category: 'election',
            impact: 'critical'
          },
          {
            id: '3',
            title: 'Koalisyon Değişikliği Riski',
            description: 'Mevcut politik ittifaklarda değişiklik olasılığı düşük seviyede',
            probability: 23,
            timeframe: '1 yıl içinde',
            category: 'coalition',
            impact: 'medium'
          },
          {
            id: '4',
            title: 'Anayasa Reformu Geçiş Şansı',
            description: 'Önerilen anayasa değişikliklerinin meclisten geçme olasılığı',
            probability: 45,
            timeframe: '6 ay içinde',
            category: 'reform',
            impact: 'high'
          }
        ],
        alerts: [
          {
            id: '1',
            message: 'Hükümet onay oranında önemli düşüş tespit edildi',
            severity: 'warning',
            timestamp: '5 dakika önce'
          },
          {
            id: '2',
            message: 'Sosyal medyada politik gerginlik artışı gözleniyor',
            severity: 'info',
            timestamp: '15 dakika önce'
          },
          {
            id: '3',
            message: 'Muhalefet partilerinde birleşme sinyalleri',
            severity: 'critical',
            timestamp: '45 dakika önce'
          }
        ],
        recommendations: [
          {
            id: '1',
            title: 'Halkla İlişkiler Stratejisi',
            description: 'Ekonomi paketinin halka daha iyi anlatılması öneriliyor',
            priority: 'high',
            category: 'İletişim'
          },
          {
            id: '2',
            title: 'Meclis Komisyon Çalışması',
            description: 'Anayasa komisyonunda daha geniş uzlaşı aranmalı',
            priority: 'medium',
            category: 'Yasama'
          },
          {
            id: '3',
            title: 'Yerel Yönetim Koordinasyonu',
            description: 'Büyükşehir belediyeleriyle iş birliği artırılmalı',
            priority: 'medium',
            category: 'Yönetim'
          }
        ],
        sentimentAnalysis: {
          government: 58 + (Math.random() - 0.5) * 10,
          opposition: 72 + (Math.random() - 0.5) * 8,
          public: 43 + (Math.random() - 0.5) * 12,
          media: 51 + (Math.random() - 0.5) * 6
        }
      };

      setAiData(mockData);
      setLoading(false);
    };

    fetchAiData();
    const interval = setInterval(fetchAiData, 30000);

    return () => clearInterval(interval);
  }, []);

  const tabs = [
    { id: 'predictions', name: 'Tahminler', icon: Brain, color: 'blue' },
    { id: 'alerts', name: 'Uyarılar', icon: AlertTriangle, color: 'orange' },
    { id: 'recommendations', name: 'Öneriler', icon: Target, color: 'green' },
    { id: 'sentiment', name: 'Durum Analizi', icon: BarChart3, color: 'purple' }
  ];

  const getProbabilityColor = (probability: number) => {
    if (probability >= 80) return 'text-green-600 bg-green-50';
    if (probability >= 60) return 'text-blue-600 bg-blue-50';
    if (probability >= 40) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-50 border-red-200 text-red-700';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 'info': return 'bg-blue-50 border-blue-200 text-blue-700';
      default: return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSentimentColor = (value: number) => {
    if (value >= 70) return 'text-green-600';
    if (value >= 50) return 'text-blue-600';
    if (value >= 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
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
          <Bot className="w-6 h-6 text-blue-600" />
          AI Politik Analiz
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Activity className="w-4 h-4" />
          <span>Gerçek zamanlı</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? `bg-${tab.color}-100 text-${tab.color}-700 border border-${tab.color}-200`
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {activeTab === 'predictions' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Tahminleri</h3>
            {aiData.predictions.map((prediction) => (
              <div key={prediction.id} className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">{prediction.title}</h4>
                  <div className={`px-3 py-1 rounded-full text-sm font-bold ${getProbabilityColor(prediction.probability)}`}>
                    %{prediction.probability}
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-3">{prediction.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getImpactColor(prediction.impact)}`}>
                      {prediction.impact === 'critical' ? 'Kritik' : prediction.impact === 'high' ? 'Yüksek' : prediction.impact === 'medium' ? 'Orta' : 'Düşük'} Etki
                    </span>
                    <span className="text-xs text-gray-500">{prediction.timeframe}</span>
                  </div>
                  <span className="text-xs text-gray-500 capitalize">{prediction.category}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sistem Uyarıları</h3>
            {aiData.alerts.map((alert) => (
              <div key={alert.id} className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}>
                <div className="flex items-start justify-between">
                  <p className="font-medium">{alert.message}</p>
                  <span className="text-xs opacity-75">{alert.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Önerileri</h3>
            {aiData.recommendations.map((rec) => (
              <div key={rec.id} className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(rec.priority)}`}>
                    {rec.priority === 'high' ? 'Yüksek' : rec.priority === 'medium' ? 'Orta' : 'Düşük'} Öncelik
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-2">{rec.description}</p>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{rec.category}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'sentiment' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Durum Analizi</h3>
            
            {/* Sentiment Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Hükümet Desteği</span>
                  <Crown className="w-4 h-4 text-blue-600" />
                </div>
                <div className={`text-2xl font-bold ${getSentimentColor(aiData.sentimentAnalysis.government)}`}>
                  {aiData.sentimentAnalysis.government.toFixed(1)}%
                </div>
              </div>

              <div className="p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Muhalefet Desteği</span>
                  <Users className="w-4 h-4 text-purple-600" />
                </div>
                <div className={`text-2xl font-bold ${getSentimentColor(aiData.sentimentAnalysis.opposition)}`}>
                  {aiData.sentimentAnalysis.opposition.toFixed(1)}%
                </div>
              </div>

              <div className="p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Halk Desteği</span>
                  <Users className="w-4 h-4 text-green-600" />
                </div>
                <div className={`text-2xl font-bold ${getSentimentColor(aiData.sentimentAnalysis.public)}`}>
                  {aiData.sentimentAnalysis.public.toFixed(1)}%
                </div>
              </div>

              <div className="p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Medya Desteği</span>
                  <Zap className="w-4 h-4 text-orange-600" />
                </div>
                <div className={`text-2xl font-bold ${getSentimentColor(aiData.sentimentAnalysis.media)}`}>
                  {aiData.sentimentAnalysis.media.toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Trend Analysis */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Trend Analizi
              </h4>
              <p className="text-blue-700 text-sm">
                Son 7 günde hükümet desteği %2.3 düştü, muhalefet desteği %1.8 arttı. 
                Halkın ekonomi politikalarına bakışı karışık sinyaller veriyor.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PoliticsAiPanel;
