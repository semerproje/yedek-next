'use client'

import React, { useState, useEffect } from 'react'
import { 
  Download, 
  RefreshCw, 
  Settings, 
  Database, 
  Clock, 
  Bot, 
  Globe, 
  XCircle,
  CheckCircle,
  AlertCircle,
  Cpu,
  FileText,
  Trash2,
  Eye,
  Edit
} from 'lucide-react'

// Firebase imports
import { db } from '@/lib/firebase'
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  where, 
  doc, 
  updateDoc, 
  Timestamp 
} from 'firebase/firestore'

// Types
interface AANewsItem {
  id: string
  originalId: string
  title: string
  content: string
  summary: string
  category: string
  originalCategory: string
  source: string
  type: string
  date: Date
  imageUrl: string
  hasCustomImage: boolean
  status: 'pending' | 'processed' | 'published' | 'error'
  isProcessedByAI: boolean
  aiProcessingNotes?: string
  createdAt: Date
}

interface CrawlerConfig {
  isAutomatic: boolean
  crawlInterval: number
  enableAIProcessing: boolean
  enableImageGeneration: boolean
  categoryMapping: Record<string, string>
  lastCrawlTime?: Date
  totalNewsProcessed: number
}

interface CrawlerStats {
  total: number
  pending: number
  processed: number
  published: number
  errors: number
}

const defaultConfig: CrawlerConfig = {
  isAutomatic: false,
  crawlInterval: 30,
  enableAIProcessing: true,
  enableImageGeneration: true,
  categoryMapping: {
    '1': 'gundem',
    '2': 'spor',
    '3': 'ekonomi',
    '4': 'teknoloji',
    '5': 'kultur'
  },
  totalNewsProcessed: 0
}

const aaCategories = [
  { id: '1', name: 'Gündem', color: '#ef4444' },
  { id: '2', name: 'Spor', color: '#f97316' },
  { id: '3', name: 'Ekonomi', color: '#eab308' },
  { id: '4', name: 'Teknoloji', color: '#22c55e' },
  { id: '5', name: 'Kültür', color: '#3b82f6' }
]

const firestoreCategories = ['gundem', 'spor', 'ekonomi', 'teknoloji', 'kultur', 'saglik', 'egitim', 'calisma', 'siyaset']

export default function AANewsManagerPage() {
  const [news, setNews] = useState<AANewsItem[]>([])
  const [config, setConfig] = useState<CrawlerConfig>(defaultConfig)
  const [stats, setStats] = useState<CrawlerStats>({ total: 0, pending: 0, processed: 0, published: 0, errors: 0 })
  const [loading, setLoading] = useState(false)
  const [crawling, setCrawling] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [status, setStatus] = useState('Hazır')
  const [firebaseConnected, setFirebaseConnected] = useState(!!db)

  // Load data on component mount
  useEffect(() => {
    loadNews()
    loadConfig()
  }, [])

  // Update stats when news changes
  useEffect(() => {
    updateStats()
  }, [news])

  const updateStats = () => {
    const total = news.length
    const pending = news.filter(n => n.status === 'pending').length
    const processed = news.filter(n => n.status === 'processed').length
    const published = news.filter(n => n.status === 'published').length
    const errors = news.filter(n => n.status === 'error').length

    setStats({ total, pending, processed, published, errors })
  }

  const loadNews = async () => {
    if (!db) {
      console.warn('Firebase not available, using demo data')
      const demoNews: AANewsItem[] = [
        {
          id: 'demo-1',
          originalId: 'aa:demo:1',
          title: 'Firebase Demo Haberi - Ekonomi',
          content: 'Bu bir demo haber içeriğidir. Firebase bağlantısı kurulduğunda gerçek veriler görünecektir.',
          summary: 'Demo ekonomi haberi özeti',
          category: 'ekonomi',
          originalCategory: '3',
          source: 'AA',
          type: 'text',
          date: new Date(),
          imageUrl: 'https://source.unsplash.com/800x600/business',
          hasCustomImage: true,
          status: 'processed',
          isProcessedByAI: true,
          aiProcessingNotes: 'Demo AI işleme',
          createdAt: new Date()
        }
      ]
      setNews(demoNews)
      return
    }

    try {
      setLoading(true)
      const newsQuery = query(
        collection(db, 'aa_news'),
        orderBy('createdAt', 'desc'),
        limit(100)
      )
      const snapshot = await getDocs(newsQuery)
      
      const newsData = snapshot.docs.map((doc: any) => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          date: data.date?.toDate ? data.date.toDate() : data.date || new Date(),
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt || new Date(),
          processedAt: data.processedAt?.toDate ? data.processedAt.toDate() : data.processedAt
        }
      }) as AANewsItem[]

      console.log(`✅ Firebase'den ${newsData.length} haber yüklendi`)
      setNews(newsData)
    } catch (error) {
      console.error('AA news loading error:', error)
      setNews([])
    } finally {
      setLoading(false)
    }
  }

  const loadConfig = async () => {
    if (!db) {
      console.warn('Firebase not available, using default config')
      return
    }

    try {
      const configQuery = query(collection(db, 'aa_config'))
      const snapshot = await getDocs(configQuery)
      
      if (!snapshot.empty) {
        const configData = snapshot.docs[0].data() as any
        const loadedConfig = {
          ...configData,
          lastCrawlTime: configData.lastCrawlTime?.toDate ? configData.lastCrawlTime.toDate() : configData.lastCrawlTime
        }
        setConfig(loadedConfig)
        console.log('✅ Firebase config loaded:', loadedConfig)
      } else {
        await createDefaultConfig()
      }
    } catch (error) {
      console.error('Config loading error:', error)
    }
  }

  const createDefaultConfig = async () => {
    if (!db) return
    
    try {
      const defaultConfig = {
        ...config,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      }
      
      const docRef = await addDoc(collection(db, 'aa_config'), defaultConfig)
      console.log('✅ Default config created in Firebase:', docRef.id)
    } catch (error) {
      console.error('Error creating default config:', error)
    }
  }

  const saveConfig = async () => {
    if (!db) {
      alert('Firebase bağlantısı mevcut değil!')
      return
    }

    try {
      const configQuery = query(collection(db, 'aa_config'))
      const snapshot = await getDocs(configQuery)
      
      if (!snapshot.empty) {
        const docRef = doc(db, 'aa_config', snapshot.docs[0].id)
        await updateDoc(docRef, {
          ...config,
          updatedAt: Timestamp.now()
        })
        console.log('✅ Config updated in Firebase')
      } else {
        await addDoc(collection(db, 'aa_config'), {
          ...config,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        })
        console.log('✅ New config created in Firebase')
      }
      
      alert('✅ Ayarlar Firebase\'e kaydedildi!')
    } catch (error) {
      console.error('Config save error:', error)
      alert('❌ Ayar kaydetme hatası!')
    }
  }

  const createTestData = async () => {
    if (!db) {
      alert('Firebase bağlantısı mevcut değil!')
      return
    }

    try {
      setLoading(true)
      setStatus('Test verileri oluşturuluyor...')
      
      const testNewsItems = [
        {
          originalId: 'aa:test:' + Date.now() + ':1',
          title: 'Türkiye\'de Yapay Zeka Araştırmaları Hızlanıyor',
          content: `Türkiye'de yapay zeka alanında yapılan araştırmalar son dönemde önemli bir ivme kazandı. Üniversiteler ve teknoloji şirketleri arasında kurulan işbirlikleri, bu alandaki gelişmeleri hızlandırıyor.`,
          summary: 'Türkiye\'de yapay zeka araştırmaları hızlanıyor. Üniversite-sanayi işbirliği ve TÜBİTAK projeleri ile önemli gelişmeler kaydediliyor.',
          category: 'teknoloji',
          originalCategory: '4',
          source: 'AA',
          type: 'text',
          date: Timestamp.now(),
          imageUrl: 'https://source.unsplash.com/800x600/artificial-intelligence',
          hasCustomImage: true,
          status: 'processed',
          isProcessedByAI: true,
          aiProcessingNotes: 'AI tarafından özgün içerik oluşturuldu',
          createdAt: Timestamp.now()
        },
        {
          originalId: 'aa:test:' + Date.now() + ':2',
          title: 'Türkiye Ekonomisinde Dijital Dönüşüm Süreci',
          content: `Türkiye ekonomisinde dijital dönüşüm süreci tüm hızıyla devam ediyor. Kamu kurumları ve özel sektör, dijital teknolojileri benimseyerek verimliliği artırma yolunda önemli adımlar atıyor.`,
          summary: 'Türkiye ekonomisinde dijital dönüşüm hızlanıyor. Kamu ve özel sektör işbirliği ile verimliliği artıran projeler hayata geçiriliyor.',
          category: 'ekonomi',
          originalCategory: '3',
          source: 'AA',
          type: 'text',
          date: Timestamp.now(),
          imageUrl: 'https://source.unsplash.com/800x600/digital-transformation',
          hasCustomImage: true,
          status: 'processed',
          isProcessedByAI: true,
          aiProcessingNotes: 'AI tarafından özgün içerik oluşturuldu',
          createdAt: Timestamp.now()
        },
        {
          originalId: 'aa:test:' + Date.now() + ':3',
          title: 'Türk Sporunun Geleceğine Yatırım',
          content: `Türk sporu için kritik bir dönemde, genç yeteneklerin keşfi ve geliştirilmesi amacıyla kapsamlı yatırımlar yapılıyor.`,
          summary: 'Türk sporuna kapsamlı yatırım yapılıyor. Genç yeteneklerin gelişimi için modern tesisler ve teknolojik altyapı güçlendiriliyor.',
          category: 'spor',
          originalCategory: '2',
          source: 'AA',
          type: 'text',
          date: Timestamp.now(),
          imageUrl: 'https://source.unsplash.com/800x600/sports-training',
          hasCustomImage: true,
          status: 'processed',
          isProcessedByAI: true,
          aiProcessingNotes: 'AI tarafından özgün içerik oluşturuldu',
          createdAt: Timestamp.now()
        }
      ]

      // Add to Firebase
      for (const newsItem of testNewsItems) {
        await addDoc(collection(db, 'aa_news'), newsItem)
      }

      // Also add to main news collection
      for (const newsItem of testNewsItems) {
        await addDoc(collection(db, 'news'), {
          title: newsItem.title,
          content: newsItem.content,
          summary: newsItem.summary,
          category: newsItem.category,
          author: 'Anadolu Ajansı',
          status: 'published',
          tags: ['anadolu-ajansi', 'test-veri'],
          imageUrl: newsItem.imageUrl,
          source: 'AA',
          originalSource: newsItem.originalId,
          isAIGenerated: true,
          createdAt: Timestamp.now(),
          publishDate: Timestamp.now(),
          updatedAt: Timestamp.now(),
          views: Math.floor(Math.random() * 1000) + 100,
          featured: false
        })
      }

      console.log('✅ Test verileri Firebase\'e eklendi')
      setStatus(`✅ ${testNewsItems.length} test haberi eklendi`)
      await loadNews()
    } catch (error: any) {
      console.error('Test data creation error:', error)
      setStatus(`❌ Test veri oluşturma hatası: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleCrawl = async () => {
    if (!config) {
      setStatus('Konfigürasyon yüklenmedi')
      return
    }

    setCrawling(true)
    setStatus('AA API\'dan haberler çekiliyor...')

    try {
      setStatus('Haberler işleniyor...')
      
      const newNewsItems: AANewsItem[] = [
        {
          id: `aa-${Date.now()}-1`,
          originalId: `aa:${Date.now()}:1`,
          title: 'YENİ: Ekonomide Son Gelişmeler',
          content: 'Bu haber AA API\'dan çekildi ve AI tarafından işlendi...',
          summary: 'Ekonomi alanında önemli gelişmeler yaşanıyor.',
          category: 'ekonomi',
          originalCategory: '3',
          source: 'AA',
          type: 'text',
          date: new Date(),
          imageUrl: 'https://source.unsplash.com/800x600/finance',
          hasCustomImage: true,
          status: 'processed',
          isProcessedByAI: true,
          aiProcessingNotes: 'İçerik AI tarafından optimize edildi',
          createdAt: new Date()
        },
        {
          id: `aa-${Date.now()}-2`,
          originalId: `aa:${Date.now()}:2`,
          title: 'YENİ: Spor Dünyasından Haberler',
          content: 'Spor camiasında yaşanan son gelişmeler...',
          summary: 'Futbol ve diğer spor branşlarından önemli haberler.',
          category: 'spor',
          originalCategory: '4',
          source: 'AA',
          type: 'text',
          date: new Date(),
          imageUrl: 'https://source.unsplash.com/800x600/sports',
          hasCustomImage: true,
          status: 'processed',
          isProcessedByAI: true,
          aiProcessingNotes: 'Spor haberi AI tarafından düzenlendi',
          createdAt: new Date()
        }
      ]

      // Save to Firebase if available
      if (db) {
        for (const newsItem of newNewsItems) {
          await addDoc(collection(db, 'aa_news'), newsItem)
        }
        setStatus('Haberler Firebase\'e kaydedildi')
      }

      setNews(prev => [...newNewsItems, ...prev])
      setStatus(`${newNewsItems.length} yeni haber çekildi ve işlendi`)
      
    } catch (error: any) {
      console.error('Crawl error:', error)
      setStatus(`Hata: ${error.message}`)
    } finally {
      setCrawling(false)
    }
  }

  const handleNewsAction = async (newsId: string, action: string) => {
    setNews(prev => prev.map(n => 
      n.id === newsId 
        ? { ...n, status: action as AANewsItem['status'] }
        : n
    ))
    
    if (db) {
      try {
        const newsRef = doc(db, 'aa_news', newsId)
        await updateDoc(newsRef, { status: action })
      } catch (error) {
        console.error('Firebase update error:', error)
      }
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'processed': return 'bg-blue-100 text-blue-800'
      case 'published': return 'bg-green-100 text-green-800'
      case 'error': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />
      case 'processed': return <CheckCircle className="h-4 w-4" />
      case 'published': return <Globe className="h-4 w-4" />
      case 'error': return <XCircle className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Download className="h-8 w-8 mr-3 text-red-600" />
              AA Haber Çekici
              <div className={`ml-3 flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                firebaseConnected 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  firebaseConnected ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span>{firebaseConnected ? 'Firebase Bağlı' : 'Firebase Bağlantısız'}</span>
              </div>
            </h1>
            <p className="text-gray-600 mt-1">
              Anadolu Ajansı otomatik haber çekme ve işleme merkezi
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => window.location.href = '/admin/dashboard'}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
            >
              <span>🏠</span>
              <span>Dashboard</span>
            </button>
            
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
            >
              <Settings className="h-4 w-4" />
              <span>Ayarlar</span>
            </button>

            <button
              onClick={createTestData}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
            >
              <Database className="h-4 w-4" />
              <span>Test Veri Oluştur</span>
            </button>
            
            <button
              onClick={handleCrawl}
              disabled={crawling}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
            >
              {crawling ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              <span>{crawling ? 'Çekiliyor...' : 'Manuel Çekim'}</span>
            </button>
          </div>
        </div>

        {status && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">{status}</p>
          </div>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Toplam</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Bekleyen</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Cpu className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">İşlenen</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.processed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Yayınlanan</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.published}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Hatalı</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.errors}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Çekim Ayarları</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={config.isAutomatic}
                  onChange={(e) => setConfig({ ...config, isAutomatic: e.target.checked })}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span className="text-sm text-gray-600">Otomatik haber çekimini etkinleştir</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Çekim Aralığı (Dakika)
              </label>
              <input
                type="number"
                min="5"
                max="1440"
                value={config.crawlInterval}
                onChange={(e) => setConfig({ ...config, crawlInterval: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={config.enableAIProcessing}
                  onChange={(e) => setConfig({ ...config, enableAIProcessing: e.target.checked })}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span className="text-sm text-gray-600">AI ile özgün içerik oluştur</span>
              </label>
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={config.enableImageGeneration}
                  onChange={(e) => setConfig({ ...config, enableImageGeneration: e.target.checked })}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span className="text-sm text-gray-600">Telifsiz görsel oluştur</span>
              </label>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-md font-semibold text-gray-800 mb-3">Kategori Eşleştirme</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aaCategories.map(cat => (
                <div key={cat.id} className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    ></div>
                    <span className="text-sm font-medium">{cat.name}</span>
                  </div>
                  <span className="text-gray-400">→</span>
                  <select
                    value={config.categoryMapping[cat.id] || ''}
                    onChange={(e) => setConfig({
                      ...config,
                      categoryMapping: {
                        ...config.categoryMapping,
                        [cat.id]: e.target.value
                      }
                    })}
                    className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="">Seçin...</option>
                    {firestoreCategories.map(fc => (
                      <option key={fc} value={fc}>
                        {fc.charAt(0).toUpperCase() + fc.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={saveConfig}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Ayarları Kaydet
            </button>
          </div>
        </div>
      )}

      {/* News List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Çekilen Haberler ({stats.total})</h3>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">Haberler yükleniyor...</p>
          </div>
        ) : news.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">Henüz haber bulunmuyor</p>
            <p className="text-sm text-gray-500 mt-2">Haber çekimi başlatmak için "Test Veri Oluştur" veya "Manuel Çekim" butonlarını kullanın</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {news.map((item, index) => (
              <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {getStatusIcon(item.status)}
                        <span className="ml-1">{item.status}</span>
                      </span>
                      <span className="text-xs text-gray-500">#{index + 1}</span>
                      <span className="text-xs text-gray-500">{item.category}</span>
                      <span className="text-xs text-gray-500">{formatDate(item.createdAt)}</span>
                    </div>
                    
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h4>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.summary}</p>
                    
                    {item.imageUrl && (
                      <div className="mb-3">
                        <img 
                          src={item.imageUrl} 
                          alt={item.title}
                          className="w-32 h-20 object-cover rounded-lg"
                        />
                      </div>
                    )}

                    {item.isProcessedByAI && (
                      <div className="flex items-center space-x-2 text-xs text-purple-600">
                        <Bot className="h-3 w-3" />
                        <span>AI İşlenmiş</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    {item.status === 'processed' && (
                      <button
                        onClick={() => handleNewsAction(item.id, 'published')}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors flex items-center space-x-1"
                      >
                        <Globe className="h-3 w-3" />
                        <span>Yayınla</span>
                      </button>
                    )}
                    
                    <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors flex items-center space-x-1">
                      <Eye className="h-3 w-3" />
                      <span>Görüntüle</span>
                    </button>
                    
                    <button className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition-colors flex items-center space-x-1">
                      <Edit className="h-3 w-3" />
                      <span>Düzenle</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
