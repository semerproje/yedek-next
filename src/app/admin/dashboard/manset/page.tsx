'use client'

import { useState, useEffect } from 'react'
import { 
  Newspaper, 
  Search, 
  Filter, 
  Crown, 
  Eye, 
  EyeOff, 
  Plus, 
  Trash2, 
  Star, 
  ImageIcon,
  ArrowUp,
  ArrowDown,
  Pin,
  PinOff
} from 'lucide-react'
import { db } from '@/lib/firebase'
import { debugFirestore } from '@/lib/debug-firestore'
import { safeUpdateDoc } from '@/lib/safe-firebase-utils'
import { 
  collection, 
  query, 
  getDocs, 
  getDoc,
  doc, 
  updateDoc, 
  addDoc, 
  deleteDoc, 
  orderBy, 
  where, 
  limit, 
  Timestamp 
} from 'firebase/firestore'

interface NewsItem {
  id: string
  title: string
  summary: string
  content: string
  imageUrl?: string
  category: string
  author: string
  createdAt: Date
  updatedAt?: Date
  status: string
  publishedAt?: Date
  views: number
  tags: string[]
  source?: string
  collection?: string
}

interface MansetNews {
  id: string
  newsId: string
  title: string
  summary: string
  imageUrl: string
  category: string
  author: string
  isMainHeadline: boolean
  isPinned?: boolean
  autoAdded?: boolean
  sourceCollection?: string
  order: number
  active: boolean
  createdAt: Date
  publishedAt?: Date
}

// Kategoriler
const categories = [
  'Gündem',
  'Politika', 
  'Ekonomi',
  'Spor',
  'Teknoloji',
  'Sağlık',
  'Eğitim',
  'Kültür',
  'Dünya',
  'Yerel'
]

export default function MansetManager() {
  const [mounted, setMounted] = useState(false)
  const [mansetNews, setMansetNews] = useState<MansetNews[]>([])
  const [availableNews, setAvailableNews] = useState<NewsItem[]>([])
  const [newsByCategory, setNewsByCategory] = useState<Record<string, NewsItem[]>>({})
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('Gündem')

  useEffect(() => {
    setMounted(true)
    const initializeData = async () => {
      await loadMansetNews()
      await loadNewsByCategory()
      
      // Otomatik manşet yükleme - sayfa yüklendiğinde kontrol et
      await autoLoadManset()
    }
    
    initializeData()
    
    // Debug Firestore
    debugFirestore().then(result => {
      console.log('🔍 Firestore debug result:', result)
    })
  }, [])

  const loadNewsByCategory = async () => {
    if (!db) {
      setNewsByCategory({})
      return
    }

    try {
      setLoading(true)
      const categorizedNews: Record<string, NewsItem[]> = {}

      console.log(`🔍 Loading news by categories from both news and aa_news collections...`)

      // 1. AA News collection'dan haberleri çek
      const allAANewsQuery = query(
        collection(db, 'aa_news'),
        orderBy('createdAt', 'desc'),
        limit(100)
      )
      const allAASnapshot = await getDocs(allAANewsQuery)
      console.log(`📰 Total AA news found: ${allAASnapshot.docs.length}`)

      // 2. News collection'dan haberleri çek  
      const allNewsQuery = query(
        collection(db, 'news'),
        orderBy('createdAt', 'desc'),
        limit(100)
      )
      const allNewsSnapshot = await getDocs(allNewsQuery)
      console.log(`📰 Total regular news found: ${allNewsSnapshot.docs.length}`)

      // AA News'leri map'le
      const aaNews = allAASnapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          title: data.title || '',
          summary: data.summary || data.excerpt || '',
          content: data.content || data.description || '',
          imageUrl: data.imageUrl || data.image || '',
          category: data.category || 'Gündem',
          author: data.author || data.source || 'AA',
          status: data.status || 'published',
          views: data.views || 0,
          tags: data.tags || [],
          source: 'AA',
          collection: 'aa_news',
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : undefined,
          publishedAt: data.publishedAt?.toDate ? data.publishedAt.toDate() : undefined
        }
      }) as NewsItem[]

      // Regular News'leri map'le
      const regularNews = allNewsSnapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          title: data.title || '',
          summary: data.summary || data.excerpt || '',
          content: data.content || data.description || '',
          imageUrl: data.imageUrl || data.image || '',
          category: data.category || 'Gündem',
          author: data.author || 'Editor',
          status: data.status || 'published',
          views: data.views || 0,
          tags: data.tags || [],
          source: 'News',
          collection: 'news',
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : undefined,
          publishedAt: data.publishedAt?.toDate ? data.publishedAt.toDate() : undefined
        }
      }) as NewsItem[]

      // Tüm haberleri birleştir ve tarihe göre sırala
      const allNews = [...aaNews, ...regularNews].sort((a, b) => 
        b.createdAt.getTime() - a.createdAt.getTime()
      )

      console.log(`📊 Total combined news: ${allNews.length}`)
      
      // Tüm kategorileri logla
      const allCategories = [...new Set(allNews.map(news => news.category))].sort()
      console.log(`🏷️ All categories found:`, allCategories)
      
      // Log sample categories
      const sampleCategories = allNews.slice(0, 10).map(news => `${news.category}(${news.title?.substring(0, 30)}...)`)
      console.log(`📝 Sample news with categories:`, sampleCategories)

      // Her kategoriye göre grupla - her kategoriden en son 20 haberi al
      for (const category of categories) {
        const categoryNews = allNews
          .filter(news => {
            // Debug için kategori eşleştirmesini logla
            const newsCategory = news.category
            const matches = newsCategory === category
            if (allNews.indexOf(news) < 5) { // İlk 5 haber için debug
              console.log(`🔍 Category check: "${newsCategory}" === "${category}" = ${matches}`)
            }
            return matches
          })
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
          .slice(0, 20)
        
        categorizedNews[category] = categoryNews
        console.log(`✅ ${category}: ${categoryNews.length} news`)
        
        // Her kategorinin ilk 3 haberini logla
        if (categoryNews.length > 0) {
          console.log(`📰 ${category} sample:`, categoryNews.slice(0, 3).map(n => n.title.substring(0, 50)))
        }
      }

      setNewsByCategory(categorizedNews)
      
      const totalFoundNews = Object.values(categorizedNews).reduce((sum, arr) => sum + arr.length, 0)
      console.log(`� Final categorized news total: ${totalFoundNews}`)
      console.log(`📊 Categories with news:`, Object.entries(categorizedNews).filter(([, news]) => news.length > 0).map(([cat, news]) => `${cat}: ${news.length}`))
      
    } catch (error) {
      console.error('Error loading categorized news:', error)
      setNewsByCategory({})
    } finally {
      setLoading(false)
    }
  }

  const loadMansetNews = async () => {
    if (!db) {
      setMansetNews([])
      return
    }

    try {
      // Manşet haberlerini yükle - fallback stratejisi ile
      try {
        const mansetQuery = query(
          collection(db, 'featuredNews'),
          orderBy('order', 'asc'),
          limit(11)
        )
        const snapshot = await getDocs(mansetQuery)
        
        const mansetData = snapshot.docs.map(docSnapshot => {
          const data = docSnapshot.data()
          return {
            id: docSnapshot.id,
            ...data,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
            publishedAt: data.publishedAt?.toDate ? data.publishedAt.toDate() : undefined
          }
        }) as MansetNews[]
        
        setMansetNews(mansetData)
      } catch (indexError) {
        console.warn('Index not ready, using fallback query:', indexError)
        
        // Fallback - sadece limit
        const fallbackQuery = query(
          collection(db, 'featuredNews'),
          limit(11)
        )
        const fallbackSnapshot = await getDocs(fallbackQuery)
        
        const fallbackData = fallbackSnapshot.docs.map(docSnapshot => {
          const data = docSnapshot.data()
          return {
            id: docSnapshot.id,
            ...data,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
            publishedAt: data.publishedAt?.toDate ? data.publishedAt.toDate() : undefined
          }
        }) as MansetNews[]
        
        // Manuel sıralama
        fallbackData.sort((a, b) => (a.order || 0) - (b.order || 0))
        setMansetNews(fallbackData)
      }
    } catch (error) {
      console.error('Manset news loading error:', error)
      setMansetNews([])
    }
  }

  // Otomatik manşet yükleme fonksiyonu
  const autoLoadManset = async () => {
    if (!db) return

    try {
      console.log('🤖 Otomatik manşet yükleme başlatılıyor...')
      
      // Mevcut manşet sayısını kontrol et
      const currentMansetQuery = query(
        collection(db, 'featuredNews'),
        where('active', '==', true)
      )
      const currentMansetSnapshot = await getDocs(currentMansetQuery)
      const currentCount = currentMansetSnapshot.docs.length
      
      console.log(`📊 Mevcut aktif manşet sayısı: ${currentCount}`)
      
      // Eğer 11'den az manşet varsa, eksik olanları otomatik doldur
      if (currentCount < 11) {
        const needCount = 11 - currentCount
        console.log(`🔄 ${needCount} adet haber otomatik olarak manşete eklenecek`)
        
        // Mevcut manşette olmayan ve sabit olmayan haberlerin newsId'lerini al
        const existingNewsIds = currentMansetSnapshot.docs.map(doc => doc.data().newsId)
        
        // Sabit haberleri say
        const pinnedCount = currentMansetSnapshot.docs.filter(doc => doc.data().isPinned).length
        console.log(`📌 Sabit haber sayısı: ${pinnedCount}`)
        
        // Her koleksiyondan en yeni haberleri al
        const latestAANews = await getDocs(query(
          collection(db, 'aa_news'),
          orderBy('createdAt', 'desc'),
          limit(50)
        ))
        
        const latestNews = await getDocs(query(
          collection(db, 'news'),
          orderBy('createdAt', 'desc'),
          limit(50)
        ))
        
        // Tüm haberleri birleştir ve filtrele
        const allLatestNews = [
          ...latestAANews.docs.map(doc => ({ ...doc.data(), id: doc.id, collection: 'aa_news' } as any)),
          ...latestNews.docs.map(doc => ({ ...doc.data(), id: doc.id, collection: 'news' } as any))
        ]
        .filter((news: any) => !existingNewsIds.includes(news.id))
        .sort((a: any, b: any) => {
          const aDate = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0)
          const bDate = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0)
          return bDate.getTime() - aDate.getTime()
        })
        .slice(0, needCount)
        
        console.log(`📰 Otomatik eklenecek haberler: ${allLatestNews.length}`)
        
        // Maksimum order değerini bul
        const maxOrder = currentMansetSnapshot.docs.length > 0 
          ? Math.max(...currentMansetSnapshot.docs.map(doc => doc.data().order || 0))
          : 0
        
        // Yeni haberleri manşete ekle
        for (let i = 0; i < allLatestNews.length; i++) {
          const news: any = allLatestNews[i]
          try {
            await addDoc(collection(db, 'featuredNews'), {
              newsId: news.id,
              title: news.title || 'Başlık mevcut değil',
              summary: news.summary || news.excerpt || '',
              imageUrl: news.imageUrl || news.image || '',
              category: news.category || 'Gündem',
              author: news.author || news.source || 'Editor',
              isMainHeadline: false,
              order: maxOrder + i + 1,
              active: true,
              createdAt: Timestamp.now(),
              publishedAt: news.publishedAt ? Timestamp.fromDate(news.publishedAt) : Timestamp.now(),
              autoAdded: true, // Otomatik eklendiğini belirten flag
              sourceCollection: news.collection
            })
            console.log(`✅ Otomatik eklendi: ${news.title}`)
          } catch (error) {
            console.error(`❌ Otomatik ekleme hatası (${news.title}):`, error)
          }
        }
        
        console.log(`🎉 Otomatik manşet yükleme tamamlandı: ${allLatestNews.length} haber eklendi`)
        
        // Manşet listesini yenile
        await loadMansetNews()
      } else {
        console.log(`✅ Manşet dolu (${currentCount}/11), otomatik yükleme gerekmiyor`)
      }
    } catch (error) {
      console.error('❌ Otomatik manşet yükleme hatası:', error)
    }
  }

  const addToManset = async (newsItem: NewsItem) => {
    if (!db) return

    try {
      const maxOrder = Math.max(...mansetNews.map(m => m.order), 0)
      
      // Manşete ekle
      await addDoc(collection(db, 'featuredNews'), {
        newsId: newsItem.id,
        title: newsItem.title,
        summary: newsItem.summary || '',
        imageUrl: newsItem.imageUrl || '',
        category: newsItem.category,
        author: newsItem.author || 'Editor',
        isMainHeadline: false,
        isPinned: false,
        autoAdded: false,
        sourceCollection: newsItem.collection || 'news',
        order: maxOrder + 1,
        active: true,
        createdAt: Timestamp.now(),
        publishedAt: newsItem.publishedAt ? Timestamp.fromDate(newsItem.publishedAt) : Timestamp.now()
      })

      // Habere manşet kategorisi ekle
      const newsCollection = newsItem.collection || 'news'
      const newsDocRef = doc(db, newsCollection, newsItem.id)
      
      try {
        // Güvenli update kullan
        const result = await safeUpdateDoc(newsDocRef, {
          categories: [...(newsItem.tags || []), 'manşet'], // Mevcut kategorilere manşet ekle
          isManset: true,
          mansetAddedAt: Timestamp.now()
        })
        
        if (result.success) {
          console.log(`✅ Habere manşet kategorisi eklendi: ${newsItem.title}`)
        }
      } catch (updateError) {
        console.warn('Haber güncelleme hatası (devam ediliyor):', updateError)
      }
      
      await loadMansetNews()
      setShowAddModal(false)
    } catch (error) {
      console.error('Add to manset error:', error)
    }
  }

  const removeFromManset = async (mansetId: string) => {
    if (!db) return

    try {
      // Önce haberin sabit olup olmadığını kontrol et
      const mansetDoc = mansetNews.find(m => m.id === mansetId)
      if (mansetDoc?.isPinned) {
        console.log('⚠️ Sabit haber silinemez')
        return
      }

      // Haberin bilgilerini al
      const newsId = mansetDoc?.newsId
      const sourceCollection = mansetDoc?.sourceCollection || 'news'

      // Manşetten çıkar
      await deleteDoc(doc(db, 'featuredNews', mansetId))

      // Haberin manşet kategorisini kaldır
      if (newsId) {
        try {
          const newsDocRef = doc(db, sourceCollection, newsId)
          
          // Güvenli update kullan
          const result = await safeUpdateDoc(newsDocRef, {
            isManset: false,
            mansetRemovedAt: Timestamp.now()
          })
          
          if (result.success) {
            console.log(`✅ Haberden manşet kategorisi kaldırıldı: ${mansetDoc?.title}`)
          }
        } catch (updateError) {
          console.warn('Haber güncelleme hatası (devam ediliyor):', updateError)
        }
      }
      
      await loadMansetNews()
      
      // Silme sonrası otomatik doldur
      setTimeout(() => {
        autoLoadManset()
      }, 1000)
    } catch (error) {
      console.error('Remove from manset error:', error)
    }
  }

  const setMainHeadline = async (mansetId: string) => {
    if (!db) return

    try {
      // Önce tüm ana manşetleri kaldır
      const mansetQuery = query(collection(db, 'featuredNews'))
      const snapshot = await getDocs(mansetQuery)
      
      for (const docSnapshot of snapshot.docs) {
        const result = await safeUpdateDoc(doc(db, 'featuredNews', docSnapshot.id), {
          isMainHeadline: false
        })
        if (!result.success) {
          console.error('Failed to remove main headline:', result.error)
        }
      }
      
      // Seçilen haberi ana manşet yap
      const result = await safeUpdateDoc(doc(db, 'featuredNews', mansetId), {
        isMainHeadline: true,
        lastModified: Timestamp.now()
      })
      
      if (!result.success) {
        console.error('Failed to set main headline:', result.error)
        return
      }
      
      await loadMansetNews()
    } catch (error) {
      console.error('Set main headline error:', error)
    }
  }

  const toggleMansetActive = async (mansetId: string, active: boolean) => {
    if (!db) return

    try {
      const result = await safeUpdateDoc(doc(db, 'featuredNews', mansetId), {
        active: !active,
        lastModified: Timestamp.now()
      })
      
      if (result.success) {
        await loadMansetNews()
      } else {
        console.error('Failed to toggle manset active status:', result.error)
      }
    } catch (error) {
      console.error('Toggle manset active error:', error)
    }
  }

  // Sabit haber ayarlama fonksiyonu
  const toggleMansetPinned = async (mansetId: string, isPinned: boolean) => {
    if (!db) return

    try {
      const result = await safeUpdateDoc(doc(db, 'featuredNews', mansetId), {
        isPinned: !isPinned,
        lastModified: Timestamp.now()
      })
      
      if (result.success) {
        await loadMansetNews()
        console.log(`📌 Haber ${!isPinned ? 'sabitlendi' : 'sabitlik kaldırıldı'}`)
      } else {
        console.error('Failed to toggle manset pinned status:', result.error)
      }
    } catch (error) {
      console.error('Toggle manset pinned error:', error)
    }
  }

  const updateMansetOrder = async (mansetId: string, newOrder: number) => {
    if (!db) return

    try {
      const result = await safeUpdateDoc(doc(db, 'featuredNews', mansetId), {
        order: newOrder,
        lastModified: Timestamp.now()
      })
      
      if (result.success) {
        await loadMansetNews()
      } else {
        console.error('Failed to update manset order:', result.error)
      }
    } catch (error) {
      console.error('Update manset order error:', error)
    }
  }

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  // Kategoriye göre filtrelenmiş haberler - artık kullanılmıyor, yeni kategorili yapı kullanılıyor
  const getCategoryNews = (category: string) => {
    const categoryNews = newsByCategory[category] || []
    
    return categoryNews.filter(news => {
      const matchesSearch = !searchTerm || 
        news.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        news.summary?.toLowerCase().includes(searchTerm.toLowerCase())
      
      // Zaten manşette olan haberleri hariç tut
      const notInManset = !mansetNews.some(m => m.newsId === news.id)
      
      return matchesSearch && notInManset
    })
  }

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Manşet yönetimi yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-md border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Newspaper className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Manşet Yönetimi</h1>
                <p className="text-gray-600">News ve AA News koleksiyonlarından manşet haberleri yönetin (Maksimum 11)</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                <span className="font-medium">{mansetNews.length}/11</span> manşet haber
              </div>
              <button
                onClick={autoLoadManset}
                disabled={loading}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
                <span>Otomatik Doldur</span>
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                disabled={mansetNews.length >= 11}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="h-4 w-4" />
                <span>Haber Ekle</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Mevcut Manşet Haberleri */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Manşet Haberleri</h2>
          
          {mansetNews.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Newspaper className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-xl mb-2">Henüz manşet haber eklenmemiş</p>
              <p>Haber eklemek için yukarıdaki "Haber Ekle" butonunu kullanın</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mansetNews.map((manset) => (
                <div key={manset.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start space-x-4">
                    {manset.imageUrl && (
                      <img 
                        src={manset.imageUrl} 
                        alt={manset.title}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-medium text-gray-900 truncate">{manset.title}</h3>
                        <div className="flex items-center space-x-1">
                          {manset.isMainHeadline && (
                            <Crown className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                          )}
                          {manset.isPinned && (
                            <Pin className="h-4 w-4 text-red-500 flex-shrink-0" />
                          )}
                          {manset.autoAdded && (
                            <span title="Otomatik eklendi">
                              <Star className="h-4 w-4 text-green-500 flex-shrink-0" />
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{manset.summary}</p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {manset.category}
                        </span>
                        <span>{manset.author}</span>
                        <span>Sıra: {manset.order}</span>
                        {manset.sourceCollection && (
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                            {manset.sourceCollection}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateMansetOrder(manset.id, manset.order - 1)}
                        disabled={manset.order === 1}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => updateMansetOrder(manset.id, manset.order + 1)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setMainHeadline(manset.id)}
                        disabled={manset.isMainHeadline}
                        className={`p-2 rounded-md ${
                          manset.isMainHeadline 
                            ? 'bg-yellow-100 text-yellow-600' 
                            : 'bg-gray-100 text-gray-600 hover:bg-yellow-100 hover:text-yellow-600'
                        }`}
                        title={manset.isMainHeadline ? 'Ana manşet' : 'Ana manşet yap'}
                      >
                        <Crown className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => toggleMansetPinned(manset.id, manset.isPinned || false)}
                        className={`p-2 rounded-md ${
                          manset.isPinned 
                            ? 'bg-red-100 text-red-600' 
                            : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
                        }`}
                        title={manset.isPinned ? 'Sabiti kaldır' : 'Sabit haber yap'}
                      >
                        {manset.isPinned ? <Pin className="h-4 w-4" /> : <PinOff className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => toggleMansetPinned(manset.id, manset.isPinned || false)}
                        className={`p-2 rounded-md ${
                          manset.isPinned 
                            ? 'bg-red-100 text-red-600' 
                            : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
                        }`}
                        title={manset.isPinned ? 'Sabiti kaldır' : 'Sabit haber yap'}
                      >
                        {manset.isPinned ? <Pin className="h-4 w-4" /> : <PinOff className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => toggleMansetActive(manset.id, manset.active)}
                        className={`p-2 rounded-md ${
                          manset.active ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}
                        title={manset.active ? 'Aktif' : 'Pasif'}
                      >
                        {manset.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => removeFromManset(manset.id)}
                        disabled={manset.isPinned}
                        className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        title={manset.isPinned ? 'Sabit haberler silinemez' : 'Manşetten kaldır'}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Kategori Bazlı Haber İstatistikleri */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Kategori Bazlı Haber İstatistikleri</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category) => {
              const categoryCount = (newsByCategory[category] || []).length
              return (
                <div key={category} className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div className="text-2xl font-bold text-blue-600">{categoryCount}</div>
                  <div className="text-sm text-gray-700 font-medium">{category}</div>
                  <div className="text-xs text-gray-500 mt-1">Son 20 haber</div>
                </div>
              )
            })}
          </div>
          <div className="mt-4 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
            <strong>Bilgi:</strong> Her kategoriden son 20 haber gösterilmektedir. AA haberlerinden çekilen veriler kategorilerine göre sınıflandırılmıştır.
          </div>
        </div>
      </div>

      {/* Haber Ekleme Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Manşete Haber Ekle</h3>
              <p className="text-gray-600">Manşette görünmesini istediğiniz haberi seçin</p>
            </div>
            
            <div className="p-6">
              {/* Kategori Seçici */}
              <div className="space-y-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Haber başlığı veya özet ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Filter className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Kategori Seçin:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-3 py-2 rounded-lg text-sm transition ${
                          selectedCategory === category
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {category} ({(newsByCategory[category] || []).length})
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Seçili Kategori Haberleri */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {getCategoryNews(selectedCategory).length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>{selectedCategory} kategorisinde {searchTerm ? 'arama kriterine uygun' : 'manşete eklenebilecek'} haber bulunamadı</p>
                  </div>
                ) : (
                  <>
                    <div className="text-sm text-gray-600 mb-4 p-3 bg-blue-50 rounded-lg">
                      <strong>{selectedCategory}</strong> kategorisinde <strong>{getCategoryNews(selectedCategory).length}</strong> haber bulundu
                    </div>
                    {getCategoryNews(selectedCategory).map((news) => (
                      <div key={news.id} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div className="flex space-x-4 flex-1">
                            {news.imageUrl ? (
                              <img 
                                src={news.imageUrl} 
                                alt={news.title || 'Haber resmi'}
                                className="w-20 h-20 object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                                <ImageIcon className="h-8 w-8 text-gray-400" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 mb-1">{news.title || 'Başlık yok'}</h4>
                              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{news.summary || 'Özet yok'}</p>
                              <div className="flex items-center space-x-3 text-xs text-gray-500">
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                  {news.category || 'Kategori yok'}
                                </span>
                                <span>{news.author || 'Yazar bilgisi yok'}</span>
                                <span>{news.views || 0} görüntülenme</span>
                                <span>{new Date(news.createdAt).toLocaleDateString('tr-TR')}</span>
                              </div>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => addToManset(news)}
                            className="ml-4 p-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
            
            <div className="p-6 border-t bg-gray-50">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition"
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  )
}
