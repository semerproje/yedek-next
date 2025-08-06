'use client';

import React, { useState, useEffect } from 'react';
import {
  AASystemStats,
  AANewsDocument,
  AACategoryMapping,
  AAAutoSchedule,
  AAAPILog,
  AISettings
} from '@/lib/firebase/models';
import {
  AANewsService,
  AACategoryService,
  AAScheduleService,
  AAStatsService,
  AAAPILogService,
  AISettingsService,
  AARealtimeService
} from '@/lib/firebase/services';
import { ultraPremiumAAService } from '@/lib/services/ultraPremiumAAService';
import { geminiService } from '@/lib/services/geminiService';

export default function UltraAAManagerPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<AASystemStats | null>(null);
  const [schedules, setSchedules] = useState<AAAutoSchedule[]>([]);
  const [newsList, setNewsList] = useState<AANewsDocument[]>([]);
  const [categoryMappings, setCategoryMappings] = useState<AACategoryMapping[]>([]);

  // Real-time Firestore listeners
  useEffect(() => {
    console.log('🔥 Setting up Firestore real-time listeners...');
    
    const unsubscribes: (() => void)[] = [];

    // Stats listener
    const statsUnsubscribe = AARealtimeService.subscribeToStats((firestoreStats) => {
      console.log('📊 Real-time stats updated:', firestoreStats);
      setStats(firestoreStats);
    });
    unsubscribes.push(statsUnsubscribe);

    // News listener
    const newsUnsubscribe = AARealtimeService.subscribeToNews((firestoreNews) => {
      console.log('📰 Real-time news updated:', firestoreNews.length, 'items');
      setNewsList(firestoreNews);
    });
    unsubscribes.push(newsUnsubscribe);

    // Schedules listener
    const schedulesUnsubscribe = AARealtimeService.subscribeToSchedules((firestoreSchedules) => {
      console.log('⏰ Real-time schedules updated:', firestoreSchedules.length, 'items');
      setSchedules(firestoreSchedules);
    });
    unsubscribes.push(schedulesUnsubscribe);

    // Initial data load
    loadInitialData();

    return () => {
      console.log('🔥 Cleaning up Firestore listeners...');
      unsubscribes.forEach(unsubscribe => unsubscribe());
    };
  }, []);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      console.log('🚀 Loading initial data from Firestore...');

      // Load category mappings
      const mappings = await AACategoryService.getAllMappings();
      if (mappings.length === 0) {
        console.log('📂 No category mappings found, initializing defaults...');
        await AACategoryService.initializeDefaultMappings();
        const newMappings = await AACategoryService.getAllMappings();
        setCategoryMappings(newMappings);
      } else {
        setCategoryMappings(mappings);
      }

      // Recalculate stats
      await AAStatsService.recalculateStats();

      console.log('✅ Initial data loaded successfully');
    } catch (error) {
      console.error('❌ Error loading initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Test real AA API connection with Firestore logging
  const testAAConnection = async () => {
    try {
      setIsLoading(true);
      console.log('🔄 Testing AA API connection...');
      
      // Test real AA API connection
      const testResult = await ultraPremiumAAService.testConnection();
      
      if (testResult.success) {
        // Log successful test to Firestore
        await AAAPILogService.logOperation({
          operation: 'connection_test',
          endpoint: '/test',
          status: 'success',
          response_time: testResult.response_time || 0,
          parameters: {},
          result_count: 1
        });

        alert('✅ AA API Bağlantısı Başarılı!\n\n' + 
              `📡 Response Time: ${testResult.response_time}ms\n` +
              `🔗 Endpoint: ${testResult.endpoint}\n` +
              `📊 Status: ${testResult.status}`);
        
        console.log('✅ AA API connection test successful:', testResult);
      } else {
        // Log failed test to Firestore
        await AAAPILogService.logOperation({
          operation: 'connection_test',
          endpoint: '/test',
          status: 'error',
          response_time: 0,
          parameters: {},
          error_message: testResult.message
        });

        alert('❌ AA API Bağlantısı Başarısız:\n' + testResult.message);
        console.error('❌ AA API connection test failed:', testResult);
      }
    } catch (error) {
      console.error('❌ AA Connection Test Error:', error);
      
      // Log error to Firestore
      await AAAPILogService.logOperation({
        operation: 'connection_test',
        endpoint: '/test',
        status: 'error',
        response_time: 0,
        parameters: {},
        error_message: error instanceof Error ? error.message : 'Unknown error'
      });

      alert('❌ Bağlantı Hatası: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata'));
    } finally {
      setIsLoading(false);
    }
  };

  // Manual fetch with real Firestore integration
  const handleManualFetch = async (params: any) => {
    // Extract parameters first (outside try block for error logging)
    const { categories = [], count = 10, date_range = 'today' } = params;
    
    try {
      setIsLoading(true);
      console.log('🔄 Starting manual AA fetch to Firestore...', params);

      // Fetch from AA API
      const aaResponse = await ultraPremiumAAService.fetchNews({
        categories,
        count,
        date_range
      });

      // Save to Firestore
      const savedNewsIds = [];
      for (const newsItem of aaResponse.news) {
        try {
          const newsDoc: Omit<AANewsDocument, 'id' | 'createdAt' | 'updatedAt'> = {
            aa_id: newsItem.id,
            title: newsItem.title,
            content: newsItem.content,
            summary: newsItem.summary,
            category: newsItem.category,
            priority: 'rutin',
            status: 'draft',
            publishDate: newsItem.published_at ? new Date(newsItem.published_at) : new Date(),
            source: 'AA',
            originalData: newsItem,
            aiEnhanced: false,
            hasPhotos: !!(newsItem.media?.photos?.length),
            hasVideos: !!(newsItem.media?.videos?.length),
            hasDocuments: !!(newsItem.media?.documents?.length),
            mediaUrls: [
              ...(newsItem.media?.photos || []),
              ...(newsItem.media?.videos || []),
              ...(newsItem.media?.documents || [])
            ],
            viewCount: 0,
            shareCount: 0,
            author: newsItem.author || 'AA',
            tags: newsItem.tags || [],
            slug: newsItem.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')
          };

          const savedId = await AANewsService.createNews(newsDoc);
          savedNewsIds.push(savedId);
          console.log('💾 Saved news to Firestore, ID:', savedId);
        } catch (saveError) {
          console.error('❌ Error saving news item:', saveError);
        }
      }

      // Log the operation
      await AAAPILogService.logOperation({
        operation: 'manual_fetch',
        endpoint: '/news',
        status: 'success',
        response_time: Date.now() - new Date().getTime(),
        parameters: { categories, count, date_range },
        result_count: savedNewsIds.length
      });

      alert(`✅ Başarılı! ${savedNewsIds.length} haber Firestore'a kaydedildi.`);
      console.log(`✅ Manual fetch completed: ${savedNewsIds.length} news items saved to Firestore`);
      
    } catch (error) {
      console.error('❌ Manual fetch error:', error);
      
      // Log the error
      await AAAPILogService.logOperation({
        operation: 'manual_fetch',
        endpoint: '/news',
        status: 'error',
        response_time: 0,
        parameters: { categories, count, date_range },
        error_message: error instanceof Error ? error.message : 'Unknown error'
      });

      alert('❌ Hata: Manual fetch işlemi başarısız oldu. ' + (error instanceof Error ? error.message : 'Bilinmeyen hata'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🚀 Ultra Premium AA Manager</h1>
              <p className="mt-2 text-sm text-gray-600">
                🔥 Firestore Real-time Integration | 🤖 AI-Enhanced | 📊 Advanced Analytics
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={testAAConnection}
                disabled={isLoading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? '🔄' : '📡'} AA Test
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'dashboard', name: '📊 Dashboard', icon: '📊' },
              { id: 'manual-fetch', name: '🔄 Manual Fetch', icon: '🔄' },
              { id: 'categories', name: '📂 Categories', icon: '📂' },
              { id: 'auto-fetch', name: '⏰ Auto Fetch', icon: '⏰' },
              { id: 'news', name: '📰 News Management', icon: '📰' },
              { id: 'ai-settings', name: '🤖 AI Settings', icon: '🤖' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-700">İşlem devam ediyor...</span>
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && <DashboardTab stats={stats} />}
        {activeTab === 'manual-fetch' && <ManualFetchTab onFetch={handleManualFetch} />}
        {activeTab === 'categories' && <CategoriesTab />}
        {activeTab === 'auto-fetch' && <AutoFetchTab />}
        {activeTab === 'news' && <NewsTab />}
        {activeTab === 'ai-settings' && <AISettingsTab />}
      </div>
    </div>
  );
}

// Dashboard Tab Component with Firestore Real-time
function DashboardTab({ stats }: { stats: AASystemStats | null }) {
  if (!stats) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">📊 Dashboard</h2>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">🔥 Firestore veriler yükleniyor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">📊 Dashboard - 🔥 Firestore Real-time</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">📄</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Toplam Haber</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalNews}</p>
              <p className="text-xs text-gray-500">🔥 Firestore Real-time</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Yayınlanan</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.publishedNews}</p>
              <p className="text-xs text-gray-500">🔥 Live Data</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-2xl">📝</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Taslak</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.draftNews}</p>
              <p className="text-xs text-gray-500">🔥 Real-time</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-2xl">🤖</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">AI İyileştirilmiş</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.aiEnhancedNews}</p>
              <p className="text-xs text-gray-500">🔥 Firestore</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Son Aktivite</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Son Çekim:</span>
              <span className="text-sm font-medium">
                {stats.lastFetch ? new Date(stats.lastFetch).toLocaleString('tr-TR') : 'Henüz çekim yok'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Son Güncelleme:</span>
              <span className="text-sm font-medium">
                {stats.updatedAt ? new Date(stats.updatedAt).toLocaleString('tr-TR') : 'Bilinmiyor'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Bugün Çekilen:</span>
              <span className="text-sm font-medium">{0}</span> {/* daily_fetch_count not available in interface */}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Performans</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Başarı Oranı:</span>
              <span className="text-sm font-medium">
                {((stats.publishedNews / Math.max(stats.totalNews, 1)) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">AI Oranı:</span>
              <span className="text-sm font-medium">
                {((stats.aiEnhancedNews / Math.max(stats.totalNews, 1)) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Toplam Görüntülenme:</span>
              <span className="text-sm font-medium">{stats.totalViewCount || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🔥 Firestore Status</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              <span className="text-sm text-gray-600">Real-time Aktif</span>
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              <span className="text-sm text-gray-600">Otomatik Senkronizasyon</span>
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              <span className="text-sm text-gray-600">Ultra Premium Aktif</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simplified stub components for other tabs
function ManualFetchTab({ onFetch }: { onFetch: (params: any) => void }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">🔄 Manual Fetch - Firestore Integration</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600 mb-4">Manual fetch with real Firestore integration active!</p>
        <button
          onClick={() => onFetch({ categories: ['news'], count: 10 })}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          🔄 Test Fetch to Firestore
        </button>
      </div>
    </div>
  );
}

function CategoriesTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">📂 Categories - Firestore Management</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600">Category management with Firestore real-time updates</p>
      </div>
    </div>
  );
}

function AutoFetchTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">⏰ Auto Fetch - Scheduled Operations</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600">Automated fetch scheduling with Firestore persistence</p>
      </div>
    </div>
  );
}

function NewsTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">📰 News Management - Real-time</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600">News management with Firestore real-time updates</p>
      </div>
    </div>
  );
}

function AISettingsTab() {
  const [isTestLoading, setIsTestLoading] = useState(false);
  const [testResult, setTestResult] = useState('');

  const testGeminiConnection = async () => {
    setIsTestLoading(true);
    setTestResult('🔄 Gemini AI bağlantısı test ediliyor...');
    
    try {
      console.log('🔄 Testing Gemini AI connection...');
      
      // Test real Gemini AI connection
      const testResult = await geminiService.testConnection();
      
      if (testResult.success) {
        // Log successful test to Firestore
        await AAAPILogService.logOperation({
          operation: 'gemini_test',
          endpoint: '/gemini/test',
          status: 'success',
          response_time: testResult.response_time || 0,
          parameters: { test_text: 'Connection test' },
          result_count: 1
        });

        setTestResult(`✅ Gemini AI bağlantısı başarılı!\n\n` +
                     `📡 Response Time: ${testResult.response_time}ms\n` +
                     `🤖 Model: ${testResult.model}\n` +
                     `✨ Test Response: ${testResult.test_response}`);
        
        console.log('✅ Gemini AI connection test successful:', testResult);
      } else {
        // Log failed test to Firestore
        await AAAPILogService.logOperation({
          operation: 'gemini_test',
          endpoint: '/gemini/test',
          status: 'error',
          response_time: 0,
          parameters: { test_text: 'Connection test' },
          error_message: testResult.message
        });

        setTestResult(`❌ Gemini AI bağlantı hatası: ${testResult.message}`);
        console.error('❌ Gemini AI connection test failed:', testResult);
      }
    } catch (error) {
      console.error('❌ Gemini AI Test Error:', error);
      
      // Log error to Firestore
      await AAAPILogService.logOperation({
        operation: 'gemini_test',
        endpoint: '/gemini/test',
        status: 'error',
        response_time: 0,
        parameters: { test_text: 'Connection test' },
        error_message: error instanceof Error ? error.message : 'Unknown error'
      });

      setTestResult(`❌ Test hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    } finally {
      setIsTestLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">🤖 AI Settings - Gemini Integration</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="space-y-4">
          <p className="text-gray-600">AI enhancement settings with Firestore persistence</p>
          
          <button
            onClick={testGeminiConnection}
            disabled={isTestLoading}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {isTestLoading ? '🔄' : '🤖'} Test Gemini AI
          </button>
          
          {testResult && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">{testResult}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
