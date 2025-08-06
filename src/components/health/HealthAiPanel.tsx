'use client';

import React, { useState, useEffect } from 'react';
import { Brain, Activity, TrendingUp, Users, AlertCircle, CheckCircle, Clock, Zap, Heart, Shield } from 'lucide-react';

interface HealthAiData {
  diagnosisAccuracy: number;
  patientsAnalyzed: number;
  riskPredictions: number;
  emergencyAlerts: number;
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
  type: 'prediction' | 'diagnosis' | 'alert' | 'recommendation';
  priority: 'high' | 'medium' | 'low';
  timeAgo: string;
  source: string;
}

const HealthAiPanel = () => {
  const [aiData, setAiData] = useState<HealthAiData>({
    diagnosisAccuracy: 0,
    patientsAnalyzed: 0,
    riskPredictions: 0,
    emergencyAlerts: 0,
    aiModelsActive: 0,
    processingTime: '0ms',
    confidenceScore: 0,
    lastUpdate: ''
  });

  const [insights, setInsights] = useState<AiInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('all');

  const insightTypes = [
    { id: 'all', name: 'Tümü', icon: Brain },
    { id: 'prediction', name: 'Tahminler', icon: TrendingUp },
    { id: 'diagnosis', name: 'Tanı', icon: Activity },
    { id: 'alert', name: 'Uyarılar', icon: AlertCircle },
    { id: 'recommendation', name: 'Öneriler', icon: CheckCircle }
  ];

  useEffect(() => {
    const fetchAiData = () => {
      // Simulate real-time AI data
      const newAiData: HealthAiData = {
        diagnosisAccuracy: 92.4 + (Math.random() - 0.5) * 2,
        patientsAnalyzed: 47832 + Math.floor(Math.random() * 100),
        riskPredictions: 1247 + Math.floor(Math.random() * 50),
        emergencyAlerts: 23 + Math.floor(Math.random() * 10),
        aiModelsActive: 15,
        processingTime: `${120 + Math.floor(Math.random() * 50)}ms`,
        confidenceScore: 89.2 + (Math.random() - 0.5) * 3,
        lastUpdate: new Date().toLocaleTimeString('tr-TR')
      };

      const mockInsights: AiInsight[] = [
        {
          id: 1,
          title: 'Kardiyovasküler Risk Artışı Tespit Edildi',
          description: 'AI analizi 65+ yaş grubunda kalp krizi riskinde %12 artış öngörüyor',
          confidence: 94.2,
          type: 'prediction',
          priority: 'high',
          timeAgo: '5 dk önce',
          source: 'CardioAI Model v3.2'
        },
        {
          id: 2,
          title: 'Erken Alzheimer Belirtileri',
          description: 'Nöral ağ analizi 3 hastada erken dönem Alzheimer işaretleri buldu',
          confidence: 87.8,
          type: 'diagnosis',
          priority: 'high',
          timeAgo: '12 dk önce',
          source: 'NeuroDetect AI'
        },
        {
          id: 3,
          title: 'Acil Müdahale Gerekli',
          description: 'Yoğun bakım hastasında kritik vital bulgular AI tarafından algılandı',
          confidence: 98.1,
          type: 'alert',
          priority: 'high',
          timeAgo: '18 dk önce',
          source: 'EmergencyAI System'
        },
        {
          id: 4,
          title: 'İlaç Dozu Optimizasyonu',
          description: 'AI, 15 hasta için ilaç dozajı ayarlaması öneriyor',
          confidence: 91.5,
          type: 'recommendation',
          priority: 'medium',
          timeAgo: '23 dk önce',
          source: 'PharmacyAI Assistant'
        },
        {
          id: 5,
          title: 'Epidemi Riski Değerlendirmesi',
          description: 'Grip salgını potansiyeli %67 olasılıkla önümüzdeki 2 hafta',
          confidence: 82.3,
          type: 'prediction',
          priority: 'medium',
          timeAgo: '35 dk önce',
          source: 'EpidemicWatch AI'
        },
        {
          id: 6,
          title: 'Beslenme Planı Optimizasyonu',
          description: 'Diyabet hastaları için kişiselleştirilmiş beslenme önerileri',
          confidence: 88.9,
          type: 'recommendation',
          priority: 'low',
          timeAgo: '1 saat önce',
          source: 'NutritionAI Pro'
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
      case 'prediction':
        return <TrendingUp className="w-4 h-4" />;
      case 'diagnosis':
        return <Activity className="w-4 h-4" />;
      case 'alert':
        return <AlertCircle className="w-4 h-4" />;
      case 'recommendation':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Brain className="w-4 h-4" />;
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
            <Brain className="w-6 h-6 text-purple-600" />
            Sağlık AI Sistemi
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
              <Brain className="w-5 h-5 text-purple-600" />
              <span className="text-xs font-medium text-purple-600">AI Doğruluğu</span>
            </div>
            <div className="text-2xl font-bold text-purple-900 mb-1">
              %{aiData.diagnosisAccuracy.toFixed(1)}
            </div>
            <div className="text-xs text-purple-600">Tanı Doğruluğu</div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="text-xs font-medium text-blue-600">Analiz</span>
            </div>
            <div className="text-2xl font-bold text-blue-900 mb-1">
              {aiData.patientsAnalyzed.toLocaleString()}
            </div>
            <div className="text-xs text-blue-600">Hasta Analizi</div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-xs font-medium text-green-600">Tahmin</span>
            </div>
            <div className="text-2xl font-bold text-green-900 mb-1">
              {aiData.riskPredictions.toLocaleString()}
            </div>
            <div className="text-xs text-green-600">Risk Tahmini</div>
          </div>

          <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-xs font-medium text-red-600">Acil</span>
            </div>
            <div className="text-2xl font-bold text-red-900 mb-1">
              {aiData.emergencyAlerts}
            </div>
            <div className="text-xs text-red-600">Acil Uyarı</div>
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
          <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
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
          <div className="bg-yellow-50 rounded-lg p-3">
            <div className="text-xl font-bold text-yellow-600 mb-1">
              24/7
            </div>
            <div className="text-xs text-gray-600">Kesintisiz Hizmet</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthAiPanel;
