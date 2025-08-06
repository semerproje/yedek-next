"use client";

import { useState, useEffect } from 'react';
import { 
  Brain, 
  Bot, 
  Cpu, 
  Zap,
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  Clock,
  ExternalLink,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface AiMetric {
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

interface AiNews {
  id: string;
  title: string;
  summary: string;
  importance: 'high' | 'medium' | 'low';
  timestamp: string;
  source: string;
}

const TechnologyAiPanelNew = () => {
  const [aiMetrics, setAiMetrics] = useState<AiMetric[]>([]);
  const [aiNews, setAiNews] = useState<AiNews[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simüle edilmiş AI metrics ve haberler
    const loadAiData = () => {
      const metrics: AiMetric[] = [
        {
          id: '1',
          title: 'AI Model Releases',
          value: '47',
          change: 23.5,
          changeType: 'increase',
          description: 'Bu ay yayınlanan yeni AI modelleri',
          icon: Brain,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
        },
        {
          id: '2',
          title: 'AI Startups Funding',
          value: '$2.8B',
          change: 34.2,
          changeType: 'increase',
          description: 'AI startup\'larına bu çeyrekte yapılan yatırım',
          icon: TrendingUp,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
        },
        {
          id: '3',
          title: 'AI Research Papers',
          value: '1,247',
          change: 18.7,
          changeType: 'increase',
          description: 'Bu ay yayınlanan AI araştırma makaleleri',
          icon: Bot,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
        },
        {
          id: '4',
          title: 'AI Job Postings',
          value: '34,567',
          change: -5.2,
          changeType: 'decrease',
          description: 'AI alanındaki aktif iş ilanları',
          icon: Users,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
        },
      ];

      const news: AiNews[] = [
        {
          id: '1',
          title: 'OpenAI GPT-5 Breakthrough: Human-Level Reasoning Achieved',
          summary: 'OpenAI\'nin yeni GPT-5 modeli, matematik ve mantık problemlerinde insan seviyesinde performans gösteriyor.',
          importance: 'high',
          timestamp: '2 saat önce',
          source: 'OpenAI Blog',
        },
        {
          id: '2',
          title: 'Google Gemini 2.0 Multimodal AI Released',
          summary: 'Google\'ın yeni Gemini 2.0 modeli, metin, resim, video ve ses işleme kabiliyetlerini bir araya getiriyor.',
          importance: 'high',
          timestamp: '5 saat önce',
          source: 'Google AI',
        },
        {
          id: '3',
          title: 'Meta LLaMA 3 Open Source Release',
          summary: 'Meta, LLaMA 3 modelini açık kaynak olarak yayınladı. 400B parametreli model araştırmacılara ücretsiz.',
          importance: 'medium',
          timestamp: '1 gün önce',
          source: 'Meta AI',
        },
        {
          id: '4',
          title: 'Microsoft Copilot for Everything: AI Integration Deepens',
          summary: 'Microsoft, tüm ürün yelpazesinde Copilot entegrasyonunu genişletiyor. Office, Windows, ve Azure da dahil.',
          importance: 'medium',
          timestamp: '2 gün önce',
          source: 'Microsoft',
        },
        {
          id: '5',
          title: 'AI Safety: EU AI Act Enforcement Begins',
          summary: 'Avrupa Birliği\'nin AI Yasası yürürlüğe girdi. Yüksek riskli AI uygulamaları için sıkı düzenlemeler.',
          importance: 'high',
          timestamp: '3 gün önce',
          source: 'EU Commission',
        },
      ];

      setAiMetrics(metrics);
      setAiNews(news);
      setIsLoading(false);
    };

    loadAiData();
    
    // 30 saniyede bir güncelle
    const interval = setInterval(() => {
      const updatedMetrics = aiMetrics.map(metric => ({
        ...metric,
        change: metric.change + (Math.random() - 0.5) * 2,
      }));
      setAiMetrics(updatedMetrics);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getImportanceText = (importance: string) => {
    switch (importance) {
      case 'high': return 'Yüksek Öncelik';
      case 'medium': return 'Orta Öncelik';
      case 'low': return 'Düşük Öncelik';
      default: return 'Normal';
    }
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
          <Sparkles className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-900">🤖 AI İntelligence Merkezi</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-500">Gerçek Zamanlı AI Verileri</span>
        </div>
      </div>

      {/* AI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {aiMetrics.map((metric) => {
          const IconComponent = metric.icon;
          const isPositive = metric.changeType === 'increase';
          
          return (
            <div
              key={metric.id}
              className={`${metric.bgColor} rounded-lg p-4 border border-gray-100 hover:shadow-md transition-all duration-300`}
            >
              <div className="flex items-center justify-between mb-3">
                <IconComponent className={`w-6 h-6 ${metric.color}`} />
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {Math.abs(metric.change).toFixed(1)}%
                </div>
              </div>
              
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-gray-900">{metric.value}</h3>
                <p className="text-sm font-medium text-gray-700">{metric.title}</p>
                <p className="text-xs text-gray-500">{metric.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI News Feed */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">📡 AI Haber Akışı</h3>
          <a href="/teknoloji/ai-haberler" className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
            <span>Tümünü Gör</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <div className="space-y-4">
          {aiNews.slice(0, 4).map((news) => (
            <div
              key={news.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-300 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-gray-900 line-clamp-2 flex-1 pr-4">
                  {news.title}
                </h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getImportanceColor(news.importance)}`}>
                  {getImportanceText(news.importance)}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                {news.summary}
              </p>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {news.timestamp}
                  </div>
                  <span className="font-medium text-gray-700">{news.source}</span>
                </div>
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  Devamını Oku →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Trend İndikatörleri */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 AI Trend İndikatörleri</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'AI Adoption Rate', value: '+127%', color: 'text-green-600' },
            { label: 'Model Performance', value: '+89%', color: 'text-blue-600' },
            { label: 'Research Activity', value: '+156%', color: 'text-purple-600' },
            { label: 'Investment Flow', value: '+234%', color: 'text-orange-600' },
          ].map((indicator, index) => (
            <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
              <div className={`text-xl font-bold ${indicator.color}`}>
                {indicator.value}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {indicator.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick AI Tools */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-600 mr-2">Hızlı Erişim:</span>
          {['ChatGPT', 'Claude', 'Gemini', 'Copilot', 'Midjourney', 'Stable Diffusion'].map((tool, index) => (
            <button
              key={index}
              className="bg-purple-50 text-purple-600 px-3 py-1 rounded-full text-sm hover:bg-purple-100 transition-colors flex items-center gap-1"
            >
              <Bot className="w-3 h-3" />
              {tool}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechnologyAiPanelNew;
