'use client';

import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, Users, Star, Zap, Sparkles, Eye, Target, BarChart3, Activity, Clock, Award } from 'lucide-react';

interface AiInsight {
  id: string;
  title: string;
  description: string;
  type: 'prediction' | 'trend' | 'sentiment' | 'recommendation';
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  celebrity?: string;
  timeframe: string;
  accuracy: number;
}

interface AiMetric {
  label: string;
  value: number;
  change: number;
  icon: any;
  color: string;
}

const MagazineAiPanel = () => {
  const [insights, setInsights] = useState<AiInsight[]>([]);
  const [metrics, setMetrics] = useState<AiMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('Tümü');

  const insightTypes = ['Tümü', 'Trend Tahmini', 'Popülerlik', 'Duygu Analizi', 'Öneriler'];

  useEffect(() => {
    const fetchAiData = () => {
      const mockInsights: AiInsight[] = [
        {
          id: '1',
          title: 'Hadise\'nin Yeni Albümü Viral Olacak',
          description: 'AI analizi, Hadise\'nin yeni albümü "Kalp Atışı"nın sosyal medyada viral olma potansiyelinin %94 olduğunu gösteriyor.',
          type: 'prediction',
          confidence: 94.3,
          impact: 'high',
          celebrity: 'Hadise',
          timeframe: '7 gün içinde',
          accuracy: 87.2
        },
        {
          id: '2',
          title: 'Can Yaman Trend Endeksi Yükseliyor',
          description: 'Hollywood projesi sayesinde Can Yaman\'ın popülerlik endeksi %23 artış gösteriyor.',
          type: 'trend',
          confidence: 89.7,
          impact: 'high',
          celebrity: 'Can Yaman',
          timeframe: '2 hafta',
          accuracy: 91.5
        },
        {
          id: '3',
          title: 'Moda Haftası Etkileşim Analizi',
          description: 'Milano Moda Haftası\'nda Türk ünlülerin etkileşim oranları %67 artış gösterdi.',
          type: 'sentiment',
          confidence: 76.8,
          impact: 'medium',
          timeframe: 'Şu an',
          accuracy: 82.3
        },
        {
          id: '4',
          title: 'Demet Özdemir Düğün Haberi Önerisi',
          description: 'AI sistemi, Demet Özdemir\'in düğün haberlerinin prime time\'da yayınlanmasını öneriyor.',
          type: 'recommendation',
          confidence: 83.4,
          impact: 'medium',
          celebrity: 'Demet Özdemir',
          timeframe: '3 gün içinde',
          accuracy: 79.8
        },
        {
          id: '5',
          title: 'Ebru Şahin Sosyal Medya Momentum',
          description: 'Ebru Şahin\'in sosyal medya aktivitesinde %45 artış tespit edildi. Yeni proje duyurusu bekleniyor.',
          type: 'prediction',
          confidence: 72.1,
          impact: 'medium',
          celebrity: 'Ebru Şahin',
          timeframe: '5 gün içinde',
          accuracy: 73.6
        },
        {
          id: '6',
          title: 'Kenan İmirzalıoğlu Pozitif Sentiment',
          description: 'Kenan İmirzalıoğlu hakkındaki haberlerde %89 pozitif duygu analizi sonucu.',
          type: 'sentiment',
          confidence: 91.2,
          impact: 'low',
          celebrity: 'Kenan İmirzalıoğlu',
          timeframe: 'Son 24 saat',
          accuracy: 94.1
        }
      ];

      const mockMetrics: AiMetric[] = [
        {
          label: 'AI Tahmin Doğruluğu',
          value: 87.3,
          change: 2.4,
          icon: Target,
          color: 'text-green-600'
        },
        {
          label: 'Trend Tespit Oranı',
          value: 91.7,
          change: 5.2,
          icon: TrendingUp,
          color: 'text-blue-600'
        },
        {
          label: 'Sentiment Analiz',
          value: 84.9,
          change: -1.8,
          icon: Brain,
          color: 'text-purple-600'
        },
        {
          label: 'Popülerlik Skoru',
          value: 76.4,
          change: 8.3,
          icon: Star,
          color: 'text-yellow-600'
        }
      ];

      // Simulate real-time updates
      const updatedMetrics = mockMetrics.map(metric => ({
        ...metric,
        value: metric.value + (Math.random() - 0.5) * 2,
        change: metric.change + (Math.random() - 0.5) * 1
      }));

      setInsights(mockInsights);
      setMetrics(updatedMetrics);
      setLoading(false);
    };

    fetchAiData();
    const interval = setInterval(fetchAiData, 25000);

    return () => clearInterval(interval);
  }, []);

  const filteredInsights = selectedType === 'Tümü' 
    ? insights 
    : insights.filter(insight => {
        if (selectedType === 'Trend Tahmini') return insight.type === 'prediction';
        if (selectedType === 'Popülerlik') return insight.type === 'trend';
        if (selectedType === 'Duygu Analizi') return insight.type === 'sentiment';
        if (selectedType === 'Öneriler') return insight.type === 'recommendation';
        return true;
      });

  const getInsightIcon = (type: string) => {
    const icons: { [key: string]: any } = {
      'prediction': Zap,
      'trend': TrendingUp,
      'sentiment': Brain,
      'recommendation': Target
    };
    return icons[type] || Brain;
  };

  const getInsightColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'prediction': 'bg-yellow-50 border-yellow-200 text-yellow-800',
      'trend': 'bg-blue-50 border-blue-200 text-blue-800',
      'sentiment': 'bg-purple-50 border-purple-200 text-purple-800',
      'recommendation': 'bg-green-50 border-green-200 text-green-800'
    };
    return colors[type] || 'bg-gray-50 border-gray-200 text-gray-800';
  };

  const getImpactColor = (impact: string) => {
    const colors: { [key: string]: string } = {
      'high': 'bg-red-100 text-red-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'low': 'bg-green-100 text-green-800'
    };
    return colors[impact] || 'bg-gray-100 text-gray-800';
  };

  const getImpactText = (impact: string) => {
    const texts: { [key: string]: string } = {
      'high': 'Yüksek Etki',
      'medium': 'Orta Etki',
      'low': 'Düşük Etki'
    };
    return texts[impact] || 'Bilinmiyor';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-60 bg-gray-200 rounded-lg"></div>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Brain className="w-6 h-6 text-purple-600" />
          AI Magazin Analizi
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Activity className="w-4 h-4 animate-pulse" />
          <span>AI Aktif</span>
        </div>
      </div>

      {/* AI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-5 h-5 ${metric.color}`} />
                <span className={`text-sm font-medium ${
                  metric.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.change >= 0 ? '+' : ''}{metric.change.toFixed(1)}%
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                %{metric.value.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">{metric.label}</div>
            </div>
          );
        })}
      </div>

      {/* Filter Buttons */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {insightTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedType === type
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AI Insights */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            AI Öngörüleri
          </h3>
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {filteredInsights.map((insight) => {
              const InsightIcon = getInsightIcon(insight.type);
              
              return (
                <div
                  key={insight.id}
                  className={`border rounded-lg p-4 ${getInsightColor(insight.type)}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <InsightIcon className="w-5 h-5" />
                      <h4 className="font-semibold">{insight.title}</h4>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(insight.impact)}`}>
                      {getImpactText(insight.impact)}
                    </span>
                  </div>

                  <p className="text-sm mb-3">{insight.description}</p>

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      {insight.celebrity && (
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          <span>{insight.celebrity}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{insight.timeframe}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span>Güven: %{insight.confidence.toFixed(1)}</span>
                      <span>Doğruluk: %{insight.accuracy.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Real-time Analytics */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Gerçek Zamanlı Analiz
          </h3>
          
          {/* Celebrity Popularity Chart */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-gray-900 mb-3">Ünlü Popülerlik Sıralaması</h4>
            <div className="space-y-3">
              {[
                { name: 'Hadise', score: 94.3, change: 8.7 },
                { name: 'Can Yaman', score: 91.2, change: 5.4 },
                { name: 'Hande Erçel', score: 87.6, change: 2.1 },
                { name: 'Demet Özdemir', score: 83.9, change: -1.2 },
                { name: 'Ebru Şahin', score: 79.5, change: 3.8 }
              ].map((celebrity, index) => (
                <div key={celebrity.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-purple-600 text-white text-xs rounded-full flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="font-medium">{celebrity.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{celebrity.score.toFixed(1)}</span>
                    <span className={`text-xs ${
                      celebrity.change >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {celebrity.change >= 0 ? '+' : ''}{celebrity.change.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trend Categories */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Kategori Trendleri</h4>
            <div className="space-y-2">
              {[
                { category: 'Müzik', percentage: 89.2, icon: '🎵' },
                { category: 'Moda', percentage: 76.8, icon: '👗' },
                { category: 'Aşk', percentage: 71.4, icon: '💕' },
                { category: 'Film/Dizi', percentage: 68.9, icon: '🎬' }
              ].map((trend) => (
                <div key={trend.category} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{trend.icon}</span>
                    <span className="text-sm">{trend.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: `${trend.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{trend.percentage.toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Performance Summary */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg">
            <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-purple-600">
              {filteredInsights.length}
            </div>
            <div className="text-sm text-purple-700">Aktif AI Öngörüsü</div>
          </div>

          <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
            <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-green-600">
              %{(insights.reduce((sum, i) => sum + i.accuracy, 0) / insights.length).toFixed(1)}
            </div>
            <div className="text-sm text-green-700">Ortalama Doğruluk</div>
          </div>

          <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
            <Brain className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-blue-600">
              %{(insights.reduce((sum, i) => sum + i.confidence, 0) / insights.length).toFixed(1)}
            </div>
            <div className="text-sm text-blue-700">Ortalama Güven</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MagazineAiPanel;
