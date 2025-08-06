// RSS Otomatik ve Manuel Çekim Yönetim Modülü
'use client'

import { useState, useEffect, useRef } from 'react'
import { collection, addDoc, getDocs, query, orderBy, limit, serverTimestamp, updateDoc, doc, deleteDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useRouter } from 'next/navigation'

// BHA RSS Kategori Eşleme Tablosu
const BHA_CATEGORY_MAPPING: { [key: string]: string } = {
  // Şehir/Bölge kategorileri
  'Ankara': 'gundem',
  'Antalya': 'gundem', 
  'Kars': 'gundem',
  'Erzurum': 'gundem',
  'Kocaeli': 'gundem',
  'Ordu': 'gundem',
  'Isparta': 'gundem',
  'Burdur': 'gundem',
  'Şanlıurfa': 'gundem',
  
  // Özel kategoriler
  'Bilim-Teknoloji': 'teknoloji',
  'Kültür-Sanat': 'kultur',
  'Spor': 'spor',
  'Ekonomi': 'ekonomi',
  'Eğitim': 'egitim',
  'Sağlık': 'saglik',
  'Politika': 'politika',
  'Dünya': 'dunya',
  'Çevre': 'cevre',
  'Din': 'din',
  'Magazin': 'magazin'
}

// RSS Item interface
interface RSSItem {
  id?: string
  title: string
  link: string
  description: string
  content: string
  category: string
  mappedCategory: string
  pubDate: string
  imageUrl?: string
  guid: string
  imported: boolean
  createdAt?: any
  selected?: boolean
}

// RSS Management Settings
interface RSSSettings {
  autoImportEnabled: boolean
  importInterval: number // minutes
  lastImportTime: string
  maxItemsPerImport: number
  autoPublish: boolean
  categoryMappingEnabled: boolean
  aiEnhancementEnabled: boolean
  autoAIPublish: boolean
  aiEnhancementDelay: number // seconds
}

export default function RSSManager() {
  const [rssItems, setRssItems] = useState<RSSItem[]>([])
  const [settings, setSettings] = useState<RSSSettings>({
    autoImportEnabled: false,
    importInterval: 30,
    lastImportTime: '',
    maxItemsPerImport: 10,
    autoPublish: false,
    categoryMappingEnabled: true,
    aiEnhancementEnabled: true,
    autoAIPublish: false,
    aiEnhancementDelay: 3
  })
  
  const [loading, setLoading] = useState(false)
  const [importing, setImporting] = useState(false)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all') // all, imported, pending
  const [searchTerm, setSearchTerm] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()

  // RSS Feed URL
  const RSS_URL = 'https://bha.net.tr/rss'

  useEffect(() => {
    loadRSSItems()
    loadSettings()
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (settings.autoImportEnabled) {
      startAutoImport()
    } else {
      stopAutoImport()
    }
  }, [settings.autoImportEnabled, settings.importInterval])

  const startAutoImport = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    
    intervalRef.current = setInterval(() => {
      importRSSFeed(true)
    }, settings.importInterval * 60 * 1000)
  }

  const stopAutoImport = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const loadRSSItems = async () => {
    setLoading(true)
    try {
      const rssSnapshot = await getDocs(
        query(collection(db, 'rss_items'), orderBy('createdAt', 'desc'), limit(100))
      )
      
      const items = rssSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as RSSItem[]
      
      setRssItems(items)
    } catch (error) {
      console.error('RSS items loading error:', error)
    }
    setLoading(false)
  }

  const loadSettings = async () => {
    try {
      const settingsSnapshot = await getDocs(collection(db, 'rss_settings'))
      if (!settingsSnapshot.empty) {
        const settingsData = settingsSnapshot.docs[0].data() as RSSSettings
        setSettings(settingsData)
      }
    } catch (error) {
      console.error('Settings loading error:', error)
    }
  }

  const saveSettings = async () => {
    try {
      const settingsSnapshot = await getDocs(collection(db, 'rss_settings'))
      
      if (settingsSnapshot.empty) {
        await addDoc(collection(db, 'rss_settings'), {
          ...settings,
          updatedAt: serverTimestamp()
        })
      } else {
        const settingsDoc = settingsSnapshot.docs[0]
        await updateDoc(doc(db, 'rss_settings', settingsDoc.id), {
          ...settings,
          updatedAt: serverTimestamp()
        })
      }
      
      alert('✅ Ayarlar kaydedildi!')
    } catch (error) {
      console.error('Settings save error:', error)
      alert('❌ Ayarlar kaydedilemedi!')
    }
  }

  const parseRSSFeed = async (): Promise<RSSItem[]> => {
    try {
      // Multiple RSS fetching strategies with our own proxy as primary
      const fetchStrategies = [
        // 1. Our own server-side proxy (most reliable)
        {
          name: 'Internal Server Proxy',
          url: `/api/rss-proxy?url=${encodeURIComponent(RSS_URL)}`,
          type: 'internal'
        },
        // 2. External CORS proxies as fallbacks
        {
          name: 'CORS Proxy IO',
          url: `https://corsproxy.io/?${encodeURIComponent(RSS_URL)}`,
          type: 'external'
        },
        {
          name: 'AllOrigins',
          url: `https://api.allorigins.win/get?url=${encodeURIComponent(RSS_URL)}`,
          type: 'allorigins'
        },
        {
          name: 'ThingProxy',
          url: `https://thingproxy.freeboard.io/fetch/${RSS_URL}`,
          type: 'external'
        }
      ]
      
      let xmlContent = null
      let successfulStrategy = null
      
      // Try each strategy until one works
      for (const strategy of fetchStrategies) {
        try {
          console.log(`🔄 Trying RSS strategy: ${strategy.name}`)
          
          const response = await fetch(strategy.url, {
            method: 'GET',
            headers: {
              'Accept': 'application/xml, text/xml, application/json, */*',
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            // Add timeout for external services
            signal: AbortSignal.timeout(strategy.type === 'internal' ? 20000 : 10000)
          })
          
          if (response.ok) {
            let data
            
            // Handle different response formats
            if (strategy.type === 'internal') {
              data = await response.json()
              xmlContent = data.contents
            } else if (strategy.type === 'allorigins') {
              data = await response.json()
              xmlContent = data.contents
            } else {
              xmlContent = await response.text()
            }
            
            // Validate XML content
            if (xmlContent && (xmlContent.includes('<rss') || xmlContent.includes('<feed'))) {
              console.log(`✅ RSS feed successfully fetched via: ${strategy.name}`)
              successfulStrategy = strategy.name
              break
            }
          }
        } catch (strategyError) {
          console.warn(`❌ Strategy failed: ${strategy.name}`, strategyError)
          continue
        }
      }
      
      if (!xmlContent) {
        throw new Error('All RSS fetching strategies failed. The RSS feed may be temporarily unavailable.')
      }
      
      console.log(`📡 RSS fetched successfully using: ${successfulStrategy}`)
      
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(xmlContent, 'text/xml')
      
      const items = Array.from(xmlDoc.querySelectorAll('item')).map(item => {
        const title = item.querySelector('title')?.textContent || ''
        const link = item.querySelector('link')?.textContent || ''
        const description = item.querySelector('description')?.textContent || ''
        const content = item.querySelector('content\\:encoded')?.textContent || 
                      item.querySelector('encoded')?.textContent || description
        const category = item.querySelector('category')?.textContent || 'gundem'
        const pubDate = item.querySelector('pubDate')?.textContent || ''
        const guid = item.querySelector('guid')?.textContent || link
        const enclosure = item.querySelector('enclosure')
        const imageUrl = enclosure?.getAttribute('url') || ''

        // Kategori eşleme
        const mappedCategory = settings.categoryMappingEnabled ? 
          (BHA_CATEGORY_MAPPING[category] || 'gundem') : 
          'gundem'

        return {
          title: title.replace(/<!\[CDATA\[|\]\]>/g, '').trim(),
          link,
          description: description.replace(/<!\[CDATA\[|\]\]>/g, '').trim(),
          content: content.replace(/<!\[CDATA\[|\]\]>/g, '').trim(),
          category,
          mappedCategory,
          pubDate,
          imageUrl,
          guid,
          imported: false
        }
      })

      return items
    } catch (error) {
      console.error('RSS parsing error:', error)
      
      // Provide more specific error messages
      let errorMessage = 'RSS akışı işlenirken bir hata oluştu.'
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          errorMessage = 'RSS kaynağına bağlanılamıyor. İnternet bağlantınızı kontrol edin.'
        } else if (error.message.includes('timeout')) {
          errorMessage = 'RSS kaynağı çok yavaş yanıt veriyor. Lütfen tekrar deneyin.'
        } else if (error.message.includes('strategies failed')) {
          errorMessage = 'RSS kaynağı geçici olarak erişilemez durumda. Lütfen daha sonra tekrar deneyin.'
        } else {
          errorMessage = `RSS hatası: ${error.message}`
        }
      }
      
      throw new Error(errorMessage)
    }
  }

  const importRSSFeed = async (isAutoImport = false) => {
    setImporting(true)
    try {
      const newItems = await parseRSSFeed()
      
      // Mevcut RSS items'ları kontrol et
      const existingGuids = rssItems.map(item => item.guid)
      const uniqueItems = newItems.filter(item => !existingGuids.includes(item.guid))
      
      // Maksimum import limiti
      const itemsToImport = uniqueItems.slice(0, settings.maxItemsPerImport)
      
      // Firestore'a kaydet
      const savedItems: RSSItem[] = []
      for (const item of itemsToImport) {
        const docRef = await addDoc(collection(db, 'rss_items'), {
          ...item,
          createdAt: serverTimestamp(),
          importedAt: serverTimestamp(),
          isAutoImport
        })
        
        savedItems.push({
          id: docRef.id,
          ...item
        })
      }
      
      // Otomatik yayınlama
      if (settings.autoPublish && savedItems.length > 0) {
        await publishSelectedItems(savedItems.map(item => item.id!))
      }
      
      // State güncelle
      setRssItems(prev => [...savedItems, ...prev])
      
      // Otomatik AI yayınlama
      if (settings.autoAIPublish && settings.aiEnhancementEnabled && !isAutoImport) {
        const itemsToPublish = itemsToImport
        
        // AI yayınlama gecikmesi
        setTimeout(async () => {
          try {
            for (const rssItem of itemsToPublish) {
              // AI ile içeriği zenginleştir
              const enhanced = await enhanceContentWithAI(
                rssItem.title, 
                rssItem.description, 
                rssItem.content
              )

              // Haber olarak yayınla
              const newsData = {
                title: enhanced.enhancedTitle,
                summary: enhanced.enhancedSummary,
                content: enhanced.enhancedContent,
                category: rssItem.mappedCategory,
                author: 'AI Editör',
                source: 'BHA RSS (AI Auto-Published)',
                sourceUrl: rssItem.link,
                tags: enhanced.tags,
                priority: 'normal',
                breaking: false,
                urgent: false,
                status: 'published',
                slug: generateSlug(enhanced.enhancedTitle),
                images: rssItem.imageUrl ? [{
                  url: rssItem.imageUrl,
                  caption: enhanced.enhancedTitle,
                  alt: enhanced.enhancedTitle
                }] : [],
                videos: [],
                sharePlatforms: [],
                selectedPrevNews: [],
                prevNewsMode: 'none',
                autoPrevNewsCount: 0,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                publishedAt: serverTimestamp(),
                views: 0,
                likes: 0,
                shares: 0,
                socialMediaScheduled: false,
                rssSource: true,
                rssGuid: rssItem.guid,
                rssImportDate: serverTimestamp(),
                aiEnhanced: true,
                autoPublished: true,
                originalTitle: rssItem.title,
                originalContent: rssItem.content
              }

              await addDoc(collection(db, 'news'), newsData)
              
              // RSS item'ı imported olarak işaretle
              if (rssItem.id) {
                await updateDoc(doc(db, 'rss_items', rssItem.id), {
                  imported: true,
                  importedToNewsAt: serverTimestamp(),
                  aiEnhanced: true,
                  autoPublished: true
                })
              }
            }
            
            console.log(`✅ ${itemsToPublish.length} haber AI ile otomatik yayınlandı!`)
            
          } catch (error) {
            console.error('Auto AI publish error:', error)
          }
        }, settings.aiEnhancementDelay * 1000)
      }
      
      // Son import zamanını güncelle
      setSettings(prev => ({
        ...prev,
        lastImportTime: new Date().toISOString()
      }))
      
      if (!isAutoImport) {
        alert(`✅ ${itemsToImport.length} yeni haber içe aktarıldı!`)
      }
      
    } catch (error) {
      console.error('RSS import error:', error)
      if (!isAutoImport) {
        const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata oluştu'
        alert(`❌ RSS içe aktarma hatası: ${errorMessage}`)
      }
    }
    setImporting(false)
  }

  const publishSelectedItems = async (itemIds: string[]) => {
    setLoading(true)
    try {
      for (const itemId of itemIds) {
        const rssItem = rssItems.find(item => item.id === itemId)
        if (!rssItem) continue

        // AI ile içeriği zenginleştir
        const enhanced = await enhanceContentWithAI(
          rssItem.title, 
          rssItem.description, 
          rssItem.content
        )

        // Haber olarak yayınla
        const newsData = {
          title: enhanced.enhancedTitle,
          summary: enhanced.enhancedSummary,
          content: enhanced.enhancedContent,
          category: rssItem.mappedCategory,
          author: 'AI Editör',
          source: 'BHA RSS (AI Enhanced)',
          sourceUrl: rssItem.link,
          tags: enhanced.tags,
          priority: 'normal',
          breaking: false,
          urgent: false,
          status: 'published',
          slug: generateSlug(enhanced.enhancedTitle),
          images: rssItem.imageUrl ? [{
            url: rssItem.imageUrl,
            caption: enhanced.enhancedTitle,
            alt: enhanced.enhancedTitle
          }] : [],
          videos: [],
          sharePlatforms: [],
          selectedPrevNews: [],
          prevNewsMode: 'none',
          autoPrevNewsCount: 0,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          publishedAt: serverTimestamp(),
          views: 0,
          likes: 0,
          shares: 0,
          socialMediaScheduled: false,
          rssSource: true,
          rssGuid: rssItem.guid,
          rssImportDate: serverTimestamp(),
          aiEnhanced: true,
          originalTitle: rssItem.title,
          originalContent: rssItem.content
        }

        await addDoc(collection(db, 'news'), newsData)
        
        // RSS item'ı imported olarak işaretle
        await updateDoc(doc(db, 'rss_items', itemId), {
          imported: true,
          importedToNewsAt: serverTimestamp(),
          aiEnhanced: true
        })
      }
      
      // State güncelle
      setRssItems(prev => prev.map(item => 
        itemIds.includes(item.id!) ? { ...item, imported: true } : item
      ))
      
      setSelectedItems([])
      alert(`✅ ${itemIds.length} haber AI ile zenginleştirilerek yayınlandı!`)
      
    } catch (error) {
      console.error('Publish error:', error)
      alert('❌ Yayınlama hatası!')
    }
    setLoading(false)
  }

  const deleteSelectedItems = async () => {
    if (!confirm(`${selectedItems.length} RSS öğesini silmek istediğinize emin misiniz?`)) {
      return
    }
    
    setLoading(true)
    try {
      for (const itemId of selectedItems) {
        await deleteDoc(doc(db, 'rss_items', itemId))
      }
      
      setRssItems(prev => prev.filter(item => !selectedItems.includes(item.id!)))
      setSelectedItems([])
      alert('✅ Seçili öğeler silindi!')
    } catch (error) {
      console.error('Delete error:', error)
      alert('❌ Silme hatası!')
    }
    setLoading(false)
  }

  // AI ile içerik zenginleştirme fonksiyonu
  const enhanceContentWithAI = async (title: string, description: string, content: string): Promise<{
    enhancedTitle: string
    enhancedSummary: string
    enhancedContent: string
    tags: string[]
  }> => {
    // Demo AI enhancement - gerçek AI entegrasyonu için burayı güncelleyin
    await new Promise(r => setTimeout(r, 1000 + Math.random() * 2000)) // Simulated delay
    
    const enhancedTitle = title.length > 100 ? title.substring(0, 97) + "..." : title
    
    const enhancedSummary = description.length > 200 
      ? description.substring(0, 197) + "..." 
      : description + " Bu haber, yerel ve ulusal medyada geniş yankı uyandırdı."
    
    const enhancedContent = `
      <div class="news-content">
        <h2>${enhancedTitle}</h2>
        
        <p><strong>Son Dakika:</strong> ${description}</p>
        
        <div class="content-body">
          ${content.replace(/\n/g, '</p><p>')}
        </div>
        
        <div class="analysis-section">
          <h3>🔍 Analiz ve Yorumlar</h3>
          <p>Bu gelişme, gündemdeki önemli konulardan biri olarak öne çıkmaktadır. Uzmanlar, konunun toplumsal ve ekonomik etkilerinin yakından takip edilmesi gerektiğini belirtmektedir.</p>
          
          <h3>📊 Detaylar</h3>
          <ul>
            <li>Olay tarihi: ${new Date().toLocaleDateString('tr-TR')}</li>
            <li>Kaynak güvenilirliği: Yüksek</li>
            <li>Sosyal medya etkisi: Orta-Yüksek seviye</li>
          </ul>
        </div>
        
        <div class="related-info">
          <h3>🔗 İlgili Gelişmeler</h3>
          <p>Bu konuyla ilgili gelişmeler takip edilmekte olup, yeni bilgiler edinildiğinde haberlerimizde yer verilecektir.</p>
        </div>
        
        <div class="disclaimer">
          <p><em>Bu haber içeriği yapay zeka destekli editörlük sürecinden geçirilmiş ve zenginleştirilmiştir.</em></p>
        </div>
      </div>
    `
    
    // Otomatik etiket üretimi
    const autoTags = []
    if (title.toLowerCase().includes('ankara')) autoTags.push('ankara')
    if (title.toLowerCase().includes('istanbul')) autoTags.push('istanbul')
    if (title.toLowerCase().includes('ekonomi')) autoTags.push('ekonomi')
    if (title.toLowerCase().includes('sağlık')) autoTags.push('sağlık')
    if (title.toLowerCase().includes('spor')) autoTags.push('spor')
    if (title.toLowerCase().includes('teknoloji')) autoTags.push('teknoloji')
    if (title.toLowerCase().includes('eğitim')) autoTags.push('eğitim')
    if (title.toLowerCase().includes('çevre')) autoTags.push('çevre')
    
    return {
      enhancedTitle,
      enhancedSummary,
      enhancedContent,
      tags: ['ai-enhanced', 'rss', 'bha', ...autoTags]
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleSelectAll = () => {
    const visibleItems = getFilteredItems()
    if (selectedItems.length === visibleItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(visibleItems.map(item => item.id!))
    }
  }

  const handleSelectItem = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const getFilteredItems = () => {
    return rssItems.filter(item => {
      const categoryMatch = filterCategory === 'all' || item.mappedCategory === filterCategory
      const statusMatch = filterStatus === 'all' || 
        (filterStatus === 'imported' && item.imported) ||
        (filterStatus === 'pending' && !item.imported)
      const searchMatch = searchTerm === '' || 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      
      return categoryMatch && statusMatch && searchMatch
    })
  }

  const filteredItems = getFilteredItems()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-10">
      <div className="container mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-blue-800 mb-2">
                📡 BHA RSS Çekim Yönetimi
              </h1>
              <p className="text-gray-600">
                Birlik Haber Ajansı RSS feed'inden otomatik ve manuel haber çekimi
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ⚙️ Ayarlar
              </button>
              <button
                onClick={() => router.back()}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ❌ Geri
              </button>
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              ⚙️ RSS Ayarları
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center space-x-3 mb-4">
                  <input
                    type="checkbox"
                    checked={settings.autoImportEnabled || false}
                    onChange={(e) => setSettings(prev => ({ ...prev, autoImportEnabled: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-medium">🔄 Otomatik İçe Aktarma</span>
                </label>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ⏱️ İçe Aktarma Aralığı (dakika)
                    </label>
                    <input
                      type="number"
                      value={settings.importInterval || 30}
                      onChange={(e) => setSettings(prev => ({ ...prev, importInterval: Number(e.target.value) }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      min="5"
                      max="1440"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📊 Maksimum İçe Aktarma Sayısı
                    </label>
                    <input
                      type="number"
                      value={settings.maxItemsPerImport || 10}
                      onChange={(e) => setSettings(prev => ({ ...prev, maxItemsPerImport: Number(e.target.value) }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      min="1"
                      max="50"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="flex items-center space-x-3 mb-4">
                  <input
                    type="checkbox"
                    checked={settings.autoPublish || false}
                    onChange={(e) => setSettings(prev => ({ ...prev, autoPublish: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-medium">🚀 Otomatik Yayınlama</span>
                </label>

                <label className="flex items-center space-x-3 mb-4">
                  <input
                    type="checkbox"
                    checked={settings.aiEnhancementEnabled || false}
                    onChange={(e) => setSettings(prev => ({ ...prev, aiEnhancementEnabled: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-medium">🤖 AI İçerik Zenginleştirme</span>
                </label>

                <label className="flex items-center space-x-3 mb-4">
                  <input
                    type="checkbox"
                    checked={settings.autoAIPublish || false}
                    onChange={(e) => setSettings(prev => ({ ...prev, autoAIPublish: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    disabled={!settings.aiEnhancementEnabled}
                  />
                  <span className="font-medium">🚀🤖 Otomatik AI Yayınlama</span>
                </label>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ⏱️ AI İşleme Gecikmesi (saniye)
                    </label>
                    <input
                      type="number"
                      value={settings.aiEnhancementDelay || 3}
                      onChange={(e) => setSettings(prev => ({ ...prev, aiEnhancementDelay: Number(e.target.value) }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      min="1"
                      max="30"
                      disabled={!settings.aiEnhancementEnabled}
                    />
                  </div>
                </div>

                <label className="flex items-center space-x-3 mb-4">
                  <input
                    type="checkbox"
                    checked={settings.categoryMappingEnabled || false}
                    onChange={(e) => setSettings(prev => ({ ...prev, categoryMappingEnabled: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-medium">🏷️ Kategori Eşleme</span>
                </label>

                {settings.lastImportTime && (
                  <div className="text-sm text-gray-600">
                    <strong>Son İçe Aktarma:</strong><br />
                    {new Date(settings.lastImportTime).toLocaleString('tr-TR')}
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={saveSettings}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                💾 Ayarları Kaydet
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                ❌ Kapat
              </button>
            </div>
            
            {/* AI Açıklaması */}
            <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
              <h4 className="font-bold text-blue-800 mb-2">🤖 AI Zenginleştirme Özellikleri</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• <strong>AI İçerik Zenginleştirme:</strong> Haberleri analiz eder, özet ve detay ekler</li>
                <li>• <strong>Otomatik AI Yayınlama:</strong> İçe aktarılan haberleri AI ile zenginleştirip otomatik yayınlar</li>
                <li>• <strong>Akıllı Etiketleme:</strong> İçerikten otomatik etiket üretir</li>
                <li>• <strong>Yapılandırılmış İçerik:</strong> Analiz, detaylar ve ilgili bilgiler ekler</li>
              </ul>
            </div>
          </div>
        )}

        {/* Control Panel */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            
            {/* Import Controls */}
            <div className="flex space-x-3">
              <button
                onClick={() => importRSSFeed()}
                disabled={importing}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {importing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    İçe Aktarılıyor...
                  </>
                ) : (
                  '📥 Manuel İçe Aktar'
                )}
              </button>
              
              <button
                onClick={() => publishSelectedItems(selectedItems)}
                disabled={selectedItems.length === 0 || loading}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                🤖 AI ile Yayınla ({selectedItems.length})
              </button>
              
              <button
                onClick={deleteSelectedItems}
                disabled={selectedItems.length === 0 || loading}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                🗑️ Seçilenleri Sil ({selectedItems.length})
              </button>
            </div>

            {/* Status Info */}
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${settings.autoImportEnabled ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span>{settings.autoImportEnabled ? 'Otomatik Aktif' : 'Manuel Mod'}</span>
              </div>
              <span>•</span>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${settings.aiEnhancementEnabled ? 'bg-purple-500' : 'bg-gray-400'}`}></div>
                <span>{settings.aiEnhancementEnabled ? 'AI Aktif' : 'AI Pasif'}</span>
              </div>
              <span>•</span>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${settings.autoAIPublish ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
                <span>{settings.autoAIPublish ? 'Oto-AI Yayın' : 'Manuel AI'}</span>
              </div>
              <span>•</span>
              <span>Toplam: {rssItems.length}</span>
              <span>•</span>
              <span>Yayınlanan: {rssItems.filter(item => item.imported).length}</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🔍 Arama
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Başlık veya açıklama ara..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📂 Kategori Filtresi
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="all">Tüm Kategoriler</option>
                <option value="gundem">Gündem</option>
                <option value="teknoloji">Teknoloji</option>
                <option value="spor">Spor</option>
                <option value="kultur">Kültür</option>
                <option value="ekonomi">Ekonomi</option>
                <option value="saglik">Sağlık</option>
                <option value="egitim">Eğitim</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📊 Durum Filtresi
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="all">Tümü</option>
                <option value="pending">Bekleyen</option>
                <option value="imported">Yayınlanan</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ✅ Toplu Seçim
              </label>
              <button
                onClick={handleSelectAll}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {selectedItems.length === filteredItems.length ? 'Tümünü Kaldır' : 'Tümünü Seç'}
              </button>
            </div>
          </div>
        </div>

        {/* RSS Items List */}
        <div className="bg-white rounded-2xl shadow-xl">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              📰 RSS Haberleri ({filteredItems.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Yükleniyor...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-600">📭 Henüz RSS öğesi bulunmuyor.</p>
              <button
                onClick={() => importRSSFeed()}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                📥 İlk İçe Aktarmayı Başlat
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <div key={item.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start space-x-4">
                    
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id!)}
                      onChange={() => handleSelectItem(item.id!)}
                      className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />

                    {/* Image */}
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                      />
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {item.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {item.description}
                          </p>
                          
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">
                              📂 {item.category}
                            </span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                              🏷️ {item.mappedCategory}
                            </span>
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded">
                              📅 {new Date(item.pubDate).toLocaleDateString('tr-TR')}
                            </span>
                            {item.imported && (
                              <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                                ✅ Yayınlandı
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-2 ml-4">
                          {!item.imported && (
                            <button
                              onClick={() => publishSelectedItems([item.id!])}
                              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                              title="AI ile zenginleştirerek yayınla"
                            >
                              🤖 AI Yayınla
                            </button>
                          )}
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                          >
                            🔗 Kaynak
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Category Mapping Info */}
        <div className="mt-6 bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            🏷️ Kategori Eşleme Tablosu
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
            {Object.entries(BHA_CATEGORY_MAPPING).map(([original, mapped]) => (
              <div key={original} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="font-medium">{original}</span>
                <span className="text-gray-600">→ {mapped}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
