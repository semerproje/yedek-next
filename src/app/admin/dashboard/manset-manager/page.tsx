'use client'

import React, { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, addDoc, getDocs, query, orderBy, Timestamp, where } from 'firebase/firestore'
import { PlusCircle, RefreshCw, CheckCircle, Search, Filter } from 'lucide-react'

interface MansetHaber {
  id?: string
  order: number
  title: string
  content: string
  category: string
  imageUrl: string
  url: string
  source: string
  sourceId?: string
  originalId?: string
  isActive: boolean
  isFeatured: boolean
  priority: string
}

interface AvailableNews {
  id: string
  title: string
  content: string
  category: string
  enhancedCategory?: string
  imageUrl?: string
  fallbackImageUrl?: string
  url?: string
  slug?: string
  source: 'aa_news' | 'news'
  createdAt: any
}

const MansetManagementPage = () => {
  const [mansetNews, setMansetNews] = useState<MansetHaber[]>([])
  const [availableNews, setAvailableNews] = useState<AvailableNews[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingNews, setLoadingNews] = useState(false)
  const [adding, setAdding] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedNews, setSelectedNews] = useState<string[]>([])

  const categories = [
    { value: 'all', label: 'Tüm Kategoriler' },
    { value: 'Gündem', label: 'Gündem' },
    { value: 'Politika', label: 'Politika' },
    { value: 'Ekonomi', label: 'Ekonomi' },
    { value: 'Spor', label: 'Spor' },
    { value: 'Teknoloji', label: 'Teknoloji' },
    { value: 'Kültür', label: 'Kültür' },
    { value: 'saglik', label: 'Sağlık' },
    { value: 'ekonomi', label: 'Ekonomi (Alt)' },
    { value: 'teknoloji', label: 'Teknoloji (Alt)' },
    { value: 'spor', label: 'Spor (Alt)' }
  ]

  // Mevcut manşet haberlerini yükle
  const loadMansetNews = async () => {
    setLoading(true)
    try {
      const mansetQuery = query(collection(db, 'manset'), orderBy('order', 'asc'))
      const snapshot = await getDocs(mansetQuery)
      const news = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as MansetHaber[]
      setMansetNews(news)
      console.log('✅ Manşet haberleri yüklendi:', news.length)
    } catch (error) {
      console.error('❌ Manşet yükleme hatası:', error)
    } finally {
      setLoading(false)
    }
  }

  // Firebase'den mevcut haberleri yükle
  const loadAvailableNews = async () => {
    setLoadingNews(true)
    try {
      // AA News koleksiyonundan son 50 haberi getir
      const aaNewsQuery = query(
        collection(db, 'aa_news'), 
        orderBy('createdAt', 'desc')
      )
      const aaNewsSnapshot = await getDocs(aaNewsQuery)
      
      // News koleksiyonundan yayınlanmış haberleri getir
      const newsQuery = query(
        collection(db, 'news'),
        where('status', '==', 'published'),
        orderBy('createdAt', 'desc')
      )
      const newsSnapshot = await getDocs(newsQuery)

      const aaNewsData = aaNewsSnapshot.docs.slice(0, 30).map(doc => ({
        id: doc.id,
        ...doc.data(),
        source: 'aa_news' as const
      })) as AvailableNews[]

      const newsData = newsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        source: 'news' as const
      })) as AvailableNews[]

      const allNews = [...aaNewsData, ...newsData]
      
      // Aynı başlıklı haberleri filtrele (title benzersizliği)
      const uniqueNews = allNews.filter((news, index, self) => {
        // Başlık benzersizliği kontrolü
        const titleMatch = self.findIndex((n) => 
          n.title.toLowerCase().trim() === news.title.toLowerCase().trim()
        )
        
        // İlk görülen aynı başlıklı haberi tut
        if (titleMatch !== index) {
          return false
        }
        
        // İçerik benzersizliği kontrolü (opsiyonel)
        if (news.content) {
          const contentMatch = self.findIndex((n) => 
            n.content && 
            n.content.toLowerCase().trim().substring(0, 100) === 
            news.content.toLowerCase().trim().substring(0, 100) &&
            n.id !== news.id
          )
          
          // Aynı içerikli ama farklı ID'li haberleri filtrele
          if (contentMatch !== -1 && contentMatch < index) {
            return false
          }
        }
        
        return true
      })

      setAvailableNews(uniqueNews)
      console.log('✅ Mevcut haberler yüklendi:', allNews.length, '→ Benzersiz:', uniqueNews.length)
    } catch (error) {
      console.error('❌ Haber yükleme hatası:', error)
    } finally {
      setLoadingNews(false)
    }
  }

  // Seçilen haberleri manşete ekle
  const addSelectedToManset = async () => {
    if (selectedNews.length === 0) {
      alert('Lütfen en az bir haber seçin!')
      return
    }

    const currentCount = mansetNews.length
    const remaining = 11 - currentCount
    
    if (remaining <= 0) {
      alert('Manşet zaten 11 habere sahip!')
      return
    }

    if (selectedNews.length > remaining) {
      alert(`En fazla ${remaining} haber daha ekleyebilirsiniz!`)
      return
    }

    setAdding(true)
    try {
      const selectedNewsData = availableNews.filter(news => selectedNews.includes(news.id))
      
      // Mevcut manşette aynı başlıklı haber var mı kontrol et
      const duplicateCheck = selectedNewsData.filter(news => 
        mansetNews.some(existingNews => 
          existingNews.title.toLowerCase().trim() === news.title.toLowerCase().trim()
        )
      )
      
      if (duplicateCheck.length > 0) {
        alert(`Bu haberler zaten manşette mevcut:\n${duplicateCheck.map(n => `• ${n.title}`).join('\n')}`)
        setAdding(false)
        return
      }
      
      const promises = selectedNewsData.map(async (news, index) => {
        const mansetData = {
          order: currentCount + index + 1,
          title: news.title,
          content: news.content || '',
          category: news.enhancedCategory || news.category || 'Gündem',
          imageUrl: news.fallbackImageUrl || news.imageUrl || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop',
          url: news.url || `/haber/${news.slug || news.id}`,
          source: news.source,
          sourceId: news.id,
          originalId: news.id,
          isActive: true,
          isFeatured: index < 3 && currentCount === 0, // İlk eklenenler featured olur
          priority: currentCount + index < 3 ? 'high' : 'normal',
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          publishedAt: Timestamp.now()
        }

        return addDoc(collection(db, 'manset'), mansetData)
      })

      await Promise.all(promises)
      
      alert(`✅ ${selectedNews.length} haber manşete eklendi!`)
      setSelectedNews([]) // Seçimi temizle
      await loadMansetNews() // Manşet listesini yenile
      
    } catch (error) {
      console.error('❌ Manşet ekleme hatası:', error)
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata'
      alert('Hata: ' + errorMessage)
    } finally {
      setAdding(false)
    }
  }

  // Haber seçimi toggle
  const toggleNewsSelection = (newsId: string) => {
    setSelectedNews(prev => 
      prev.includes(newsId) 
        ? prev.filter(id => id !== newsId)
        : [...prev, newsId]
    )
  }

  // Kategori filtresi uygula
  const filteredNews = selectedCategory === 'all' 
    ? availableNews 
    : availableNews.filter(news => 
        (news.enhancedCategory || news.category) === selectedCategory ||
        news.category === selectedCategory
      )

  // Manşette olmayan haberleri filtrele
  const newsNotInManset = filteredNews.filter(news => 
    !mansetNews.some(mansetItem => 
      mansetItem.title.toLowerCase().trim() === news.title.toLowerCase().trim() ||
      mansetItem.sourceId === news.id ||
      mansetItem.originalId === news.id
    )
  )

  useEffect(() => {
    loadMansetNews()
    loadAvailableNews()
  }, [])

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Manşet Yönetimi
        </h1>
        <p className="text-gray-600">
          Manuel haber seçimi ile manşet sayfası oluşturun
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Mevcut Manşet</p>
              <p className="text-2xl font-bold text-gray-900">{mansetNews.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <PlusCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Hedef</p>
              <p className="text-2xl font-bold text-gray-900">11</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100 text-orange-600 mr-4">
              <RefreshCw className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Eksik</p>
              <p className="text-2xl font-bold text-gray-900">{Math.max(0, 11 - mansetNews.length)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">İşlemler</h2>
        <div className="flex gap-4 flex-wrap">
          <button
            onClick={loadMansetNews}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Manşet Yenile
          </button>
          
          <button
            onClick={loadAvailableNews}
            disabled={loadingNews}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            <Search className={`h-4 w-4 mr-2 ${loadingNews ? 'animate-spin' : ''}`} />
            {loadingNews ? 'Yükleniyor...' : 'Haberleri Yükle'}
          </button>
          
          <button
            onClick={addSelectedToManset}
            disabled={adding || selectedNews.length === 0 || mansetNews.length >= 11}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            {adding ? 'Ekleniyor...' : `Seçilenleri Ekle (${selectedNews.length})`}
          </button>
        </div>
      </div>

      {/* News Selection */}
      {availableNews.length > 0 && (
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Haber Seçimi</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <select 
                    value={selectedCategory} 
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <span className="text-sm text-gray-600">
                  {newsNotInManset.length} haber • {selectedNews.length} seçili
                </span>
              </div>
            </div>
          </div>
          
          <div className="p-6 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {newsNotInManset.map((news) => (
                <div 
                  key={news.id} 
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedNews.includes(news.id) 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => toggleNewsSelection(news.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center mt-1 ${
                      selectedNews.includes(news.id) 
                        ? 'border-blue-500 bg-blue-500' 
                        : 'border-gray-300'
                    }`}>
                      {selectedNews.includes(news.id) && (
                        <CheckCircle className="h-3 w-3 text-white" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 mb-1 truncate">
                        {news.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {news.content?.substring(0, 100)}...
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="bg-gray-100 px-2 py-1 rounded">
                          {news.enhancedCategory || news.category}
                        </span>
                        <span className={`px-2 py-1 rounded ${
                          news.source === 'aa_news' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {news.source === 'aa_news' ? 'AA Haber' : 'İç Haber'}
                        </span>
                        <span>
                          {news.createdAt?.seconds 
                            ? new Date(news.createdAt.seconds * 1000).toLocaleDateString('tr-TR')
                            : 'Tarih yok'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {newsNotInManset.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {availableNews.length === 0 
                  ? 'Bu kategoride haber bulunamadı.' 
                  : 'Bu kategorideki tüm haberler zaten manşette.'
                }
              </div>
            )}
          </div>
        </div>
      )}

      {/* News List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Mevcut Manşet Haberleri</h2>
        </div>
        
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Haberler yükleniyor...</p>
            </div>
          ) : mansetNews.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Henüz manşet haberi bulunmuyor.</p>
              <p className="text-sm text-gray-500 mt-2">
                Yukarıdan haberleri yükleyip manuel olarak seçerek ekleyebilirsiniz.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {mansetNews.map((news, index) => (
                <div key={news.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                        {news.order}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{news.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">{news.content.substring(0, 100)}...</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="bg-gray-100 px-2 py-1 rounded">{news.category}</span>
                        <span>Kaynak: {news.source}</span>
                        <span className={`px-2 py-1 rounded ${news.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {news.isActive ? 'Aktif' : 'Pasif'}
                        </span>
                        {news.isFeatured && (
                          <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Öne Çıkan</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0">
                      <img
                        src={news.imageUrl}
                        alt={news.title}
                        className="w-16 h-16 object-cover rounded-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop'
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {mansetNews.length > 0 && (
        <div className="mt-6 text-center">
          <p className="text-green-600 font-semibold">
            ✅ Manşet sayfanızı kontrol edin: 
            <a 
              href="http://localhost:3000/admin/dashboard/manset" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline ml-2"
            >
              http://localhost:3000/admin/dashboard/manset
            </a>
          </p>
        </div>
      )}
    </div>
  )
}

export default MansetManagementPage