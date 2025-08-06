'use client';

import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  BookOpen, 
  TrendingUp, 
  Target, 
  Lightbulb, 
  Users, 
  Award, 
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  BarChart3
} from 'lucide-react';

interface AiInsight {
  id: string;
  type: 'trend' | 'prediction' | 'recommendation' | 'alert';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  category: string;
  timestamp: string;
}

interface AiMetric {
  label: string;
  value: string;
  change: number;
  color: string;
}

const EducationAiPanel = () => {
  const [insights, setInsights] = useState<AiInsight[]>([]);
  const [metrics, setMetrics] = useState<AiMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'insights' | 'predictions' | 'recommendations'>('insights');

  useEffect(() => {
    const fetchAiData = () => {
      // AI analizlerini simüle et
      const mockInsights: AiInsight[] = [
        {
          id: '1',
          type: 'trend',
          title: 'Dijital Eğitim Talebi Artışı',
          description: 'Online kurs aramaları %340 arttı. Programlama ve veri bilimi en popüler konular.',
          confidence: 94,
          impact: 'high',
          category: 'Dijital Dönüşüm',
          timestamp: '15 dakika önce'
        },
        {
          id: '2',
          type: 'prediction',
          title: 'YKS 2025 Başvuru Tahminleri',
          description: 'AI modelleri 2.7M başvuru öngörüyor. Mühendislik bölümlerinde %15 artış bekleniyor.',
          confidence: 87,
          impact: 'high',
          category: 'Yükseköğretim',
          timestamp: '32 dakika önce'
        },
        {
          id: '3',
          type: 'recommendation',
          title: 'Öğretmen Eğitimi Önceliği',
          description: 'STEM alanlarında öğretmen yetkinlik geliştirme programları acil olarak uygulanmalı.',
          confidence: 91,
          impact: 'medium',
          category: 'Öğretmen Gelişimi',
          timestamp: '1 saat önce'
        },
        {
          id: '4',
          type: 'alert',
          title: 'Kayıt Oranlarında Düşüş Riski',
          description: 'Meslek liselerinde kayıt oranları %8 düşebilir. Erken müdahale gerekiyor.',
          confidence: 82,
          impact: 'medium',
          category: 'Meslek Eğitimi',
          timestamp: '2 saat önce'
        },
        {
          id: '5',
          type: 'trend',
          title: 'Uzaktan Eğitim Kalitesi',
          description: 'Hibrit eğitim modellerinde %23 başarı artışı gözlemleniyor.',
          confidence: 89,
          impact: 'medium',
          category: 'Eğitim Kalitesi',
          timestamp: '3 saat önce'
        }
      ];

      const mockMetrics: AiMetric[] = [
        { label: 'Başarı Tahmini', value: '%78.2', change: 4.1, color: 'text-green-600' },
        { label: 'Risk Skoru', value: '23/100', change: -12.3, color: 'text-blue-600' },
        { label: 'Trend Gücü', value: '8.7/10', change: 15.6, color: 'text-purple-600' },
        { label: 'AI Güven', value: '%91.4', change: 2.8, color: 'text-orange-600' }
      ];

      setInsights(mockInsights);
      setMetrics(mockMetrics);
      setLoading(false);
    };

    fetchAiData();
  }, []);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'trend':
        return <TrendingUp className="w-5 h-5 text-blue-600" />;
      case 'prediction':
        return <Target className="w-5 h-5 text-purple-600" />;
      case 'recommendation':
        return <Lightbulb className="w-5 h-5 text-yellow-600" />;
      case 'alert':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Brain className="w-5 h-5 text-gray-600" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getImpactText = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'Yüksek Etki';
      case 'medium':
        return 'Orta Etki';
      case 'low':
        return 'Düşük Etki';
      default:
        return 'Belirsiz';
    }
  };

  const filteredInsights = insights.filter(insight => {
    switch (activeTab) {
      case 'predictions':
        return insight.type === 'prediction';
      case 'recommendations':
        return insight.type === 'recommendation';
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-6"></div>
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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Brain className="w-6 h-6 text-blue-600" />
          AI Eğitim Analizi
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Zap className="w-4 h-4" />
          <span>Canlı</span>
        </div>
      </div>

      {/* AI Metrikleri */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {metrics.map((metric, index) => (
          <div key={index} className="text-center">
            <div className={`text-lg font-bold ${metric.color}`}>
              {metric.value}
            </div>
            <div className="text-xs text-gray-500 mb-1">{metric.label}</div>
            <div className={`text-xs font-medium ${
              metric.change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {metric.change >= 0 ? '+' : ''}{metric.change.toFixed(1)}%
            </div>
          </div>
        ))}
      </div>

      {/* Sekme Navigasyonu */}
      <div className="flex border-b border-gray-200 mb-6">
        {[
          { id: 'insights', label: 'Tüm Analizler', icon: BarChart3 },
          { id: 'predictions', label: 'Tahminler', icon: Target },
          { id: 'recommendations', label: 'Öneriler', icon: Lightbulb }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* AI İçgörüleri */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {filteredInsights.map((insight) => (
          <div
            key={insight.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {getInsightIcon(insight.type)}
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {insight.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">{insight.category}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">{insight.timestamp}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(insight.impact)}`}>
                  {getImpactText(insight.impact)}
                </span>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Güven</div>
                  <div className="text-sm font-semibold text-gray-900">
                    %{insight.confidence}
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-3">
              {insight.description}
            </p>
            
            {/* Güven Çubuğu */}
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    insight.confidence >= 90 ? 'bg-green-500' :
                    insight.confidence >= 80 ? 'bg-blue-500' :
                    insight.confidence >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${insight.confidence}%` }}
                ></div>
              </div>
              {insight.confidence >= 85 && (
                <CheckCircle className="w-4 h-4 text-green-600" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* AI Özeti */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Brain className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">AI Günlük Özet</h4>
              <p className="text-sm text-gray-600 mb-3">
                Bugün {insights.length} adet analiz gerçekleştirildi. Genel trend pozitif yönde, 
                dijital eğitim alanında güçlü büyüme sinyalleri var. YKS döneminde artış beklenebilir.
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Son güncelleme: {new Date().toLocaleTimeString('tr-TR')}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  18.2M öğrenci verisi analiz edildi
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationAiPanel;
