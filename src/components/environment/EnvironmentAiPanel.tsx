'use client';

import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, Globe, TreePine, Zap, Wind, Droplets, Target, BarChart3, Activity, Clock, AlertTriangle } from 'lucide-react';

interface AiInsight {
  id: string;
  title: string;
  description: string;
  type: 'prediction' | 'alert' | 'recommendation' | 'analysis';
  confidence: number;
  urgency: 'low' | 'medium' | 'high';
  region?: string;
  timeframe: string;
  accuracy: number;
  environmentalImpact: number;
}

interface AiMetric {
  label: string;
  value: number;
  change: number;
  icon: any;
  color: string;
}

const EnvironmentAiPanel = () => {
  const [insights, setInsights] = useState<AiInsight[]>([]);
  const [metrics, setMetrics] = useState<AiMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('Tümü');

  const insightTypes = ['Tümü', 'Tahminler', 'Uyarılar', 'Öneriler', 'Analizler'];

  useEffect(() => {
    const fetchAiData = () => {
      const mockInsights: AiInsight[] = [
        {
          id: '1',
          title: 'Marmara Denizi Kirlilik Artışı',
          description: 'AI modeli Marmara Denizi\'nde kirlilik seviyesinin önümüzdeki 2 hafta içinde %23 artacağını öngörüyor.',
          type: 'prediction',
          confidence: 87.3,
          urgency: 'high',
          region: 'Marmara Bölgesi',
          timeframe: '2 hafta içinde',
          accuracy: 84.2,
          environmentalImpact: -75
        },
        {
          id: '2',
          title: 'İstanbul Hava Kalitesi Kritik',
          description: 'PM2.5 değerleri kritik eşiğe yaklaşıyor. Sağlık açısından risk oluşturacak seviyeye ulaşabilir.',
          type: 'alert',
          confidence: 92.1,
          urgency: 'high',
          region: 'İstanbul',
          timeframe: '24-48 saat',
          accuracy: 91.7,
          environmentalImpact: -60
        },
        {
          id: '3',
          title: 'Güneş Enerjisi Optimizasyonu',
          description: 'Güney Anadolu bölgesinde güneş paneli kurulumu için optimal lokasyonlar belirlendi.',
          type: 'recommendation',
          confidence: 89.4,
          urgency: 'medium',
          region: 'Güney Anadolu',
          timeframe: '6 ay içinde',
          accuracy: 88.9,
          environmentalImpact: 85
        },
        {
          id: '4',
          title: 'Orman Yangını Risk Analizi',
          description: 'Akdeniz ve Ege bölgelerinde yüksek sıcaklık ve düşük nem nedeniyle yangın riski artıyor.',
          type: 'alert',
          confidence: 85.7,
          urgency: 'high',
          region: 'Akdeniz-Ege',
          timeframe: '1 hafta içinde',
          accuracy: 87.3,
          environmentalImpact: -90
        },
        {
          id: '5',
          title: 'Su Tasarrufu Potansiyeli',
          description: 'Akıllı sulama sistemleri ile tarımsal su kullanımında %35 tasarruf sağlanabilir.',
          type: 'recommendation',
          confidence: 78.9,
          urgency: 'medium',
          region: 'İç Anadolu',
          timeframe: '3 ay içinde',
          accuracy: 82.1,
          environmentalImpact: 70
        },
        {
          id: '6',
          title: 'Rüzgar Enerjisi Verimlilik Analizi',
          description: 'Karadeniz kıyılarında rüzgar enerjisi potansiyeli %40 artış gösteriyor.',
          type: 'analysis',
          confidence: 91.8,
          urgency: 'low',
          region: 'Karadeniz',
          timeframe: 'Devam eden',
          accuracy: 89.5,
          environmentalImpact: 80
        }
      ];

      const mockMetrics: AiMetric[] = [
        {
          label: 'AI Tahmin Doğruluğu',
          value: 87.6,
          change: 3.2,
          icon: Target,
          color: 'text-green-600'
        },
        {
          label: 'Çevre Risk Tespiti',
          value: 92.3,
          change: 5.8,
          icon: AlertTriangle,
          color: 'text-red-600'
        },
        {
          label: 'Optimizasyon Oranı',
          value: 84.1,
          change: -1.4,
          icon: Brain,
          color: 'text-blue-600'
        },
        {
          label: 'Sürdürülebilirlik Skoru',
          value: 78.9,
          change: 7.6,
          icon: TreePine,
          color: 'text-green-600'
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
        if (selectedType === 'Tahminler') return insight.type === 'prediction';
        if (selectedType === 'Uyarılar') return insight.type === 'alert';
        if (selectedType === 'Öneriler') return insight.type === 'recommendation';
        if (selectedType === 'Analizler') return insight.type === 'analysis';
        return true;
      });

  const getInsightIcon = (type: string) => {
    const icons: { [key: string]: any } = {
      'prediction': TrendingUp,
      'alert': AlertTriangle,
      'recommendation': Target,
      'analysis': BarChart3
    };
    return icons[type] || Brain;
  };

  const getInsightColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'prediction': 'bg-blue-50 border-blue-200 text-blue-800',
      'alert': 'bg-red-50 border-red-200 text-red-800',
      'recommendation': 'bg-green-50 border-green-200 text-green-800',
      'analysis': 'bg-purple-50 border-purple-200 text-purple-800'
    };
    return colors[type] || 'bg-gray-50 border-gray-200 text-gray-800';
  };

  const getUrgencyColor = (urgency: string) => {
    const colors: { [key: string]: string } = {
      'high': 'bg-red-100 text-red-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'low': 'bg-green-100 text-green-800'
    };
    return colors[urgency] || 'bg-gray-100 text-gray-800';
  };

  const getUrgencyText = (urgency: string) => {
    const texts: { [key: string]: string } = {
      'high': 'Yüksek Öncelik',
      'medium': 'Orta Öncelik',
      'low': 'Düşük Öncelik'
    };
    return texts[urgency] || 'Bilinmiyor';
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
          <Brain className="w-6 h-6 text-green-600" />
          AI Çevre Analizi
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
                  ? 'bg-green-600 text-white shadow-lg'
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
            <Zap className="w-5 h-5 text-green-600" />
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
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(insight.urgency)}`}>
                      {getUrgencyText(insight.urgency)}
                    </span>
                  </div>

                  <p className="text-sm mb-3">{insight.description}</p>

                  <div className="flex items-center justify-between text-xs mb-2">
                    <div className="flex items-center gap-3">
                      {insight.region && (
                        <div className="flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          <span>{insight.region}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{insight.timeframe}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span>Güven: %{insight.confidence.toFixed(1)}</span>
                      <span>Doğruluk: %{insight.accuracy.toFixed(1)}</span>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      insight.environmentalImpact > 0 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {insight.environmentalImpact > 0 ? '+' : ''}{insight.environmentalImpact} Etki
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Real-time Environmental Data */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Gerçek Zamanlı Analiz
          </h3>
          
          {/* Environmental Quality Index */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-gray-900 mb-3">Çevre Kalite Endeksi</h4>
            <div className="space-y-3">
              {[
                { name: 'Hava Kalitesi', score: 67.4, trend: 2.3, icon: Wind, color: 'blue' },
                { name: 'Su Kalitesi', score: 72.8, trend: -1.7, icon: Droplets, color: 'cyan' },
                { name: 'Toprak Sağlığı', score: 78.2, trend: 4.1, icon: TreePine, color: 'green' },
                { name: 'Enerji Verimliliği', score: 84.6, trend: 6.8, icon: Zap, color: 'yellow' }
              ].map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IconComponent className={`w-4 h-4 text-${item.color}-600`} />
                      <span className="font-medium text-sm">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`bg-${item.color}-600 h-2 rounded-full`}
                          style={{ width: `${item.score}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold">{item.score.toFixed(1)}</span>
                      <span className={`text-xs ${
                        item.trend >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {item.trend >= 0 ? '+' : ''}{item.trend.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Regional Risk Assessment */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Bölgesel Risk Değerlendirmesi</h4>
            <div className="space-y-2">
              {[
                { region: 'Marmara', risk: 'Yüksek', score: 85, color: 'red' },
                { region: 'İç Anadolu', risk: 'Orta', score: 62, color: 'yellow' },
                { region: 'Karadeniz', risk: 'Düşük', score: 34, color: 'green' },
                { region: 'Akdeniz', risk: 'Yüksek', score: 78, color: 'red' }
              ].map((region) => (
                <div key={region.region} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full bg-${region.color}-500`}></div>
                    <span className="text-sm">{region.region}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded bg-${region.color}-100 text-${region.color}-800`}>
                      {region.risk}
                    </span>
                    <span className="text-sm font-medium">{region.score}</span>
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
          <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
            <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-green-600">
              {filteredInsights.length}
            </div>
            <div className="text-sm text-green-700">Aktif AI Öngörüsü</div>
          </div>

          <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
            <AlertTriangle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-blue-600">
              {filteredInsights.filter(i => i.urgency === 'high').length}
            </div>
            <div className="text-sm text-blue-700">Yüksek Öncelikli</div>
          </div>

          <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg">
            <Brain className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-purple-600">
              %{(insights.reduce((sum, i) => sum + i.accuracy, 0) / insights.length).toFixed(1)}
            </div>
            <div className="text-sm text-purple-700">Ortalama Doğruluk</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentAiPanel;
