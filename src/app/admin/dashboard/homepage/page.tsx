'use client'

import { useState, useEffect } from 'react'
import { 
  Monitor, 
  Settings, 
  Eye, 
  EyeOff, 
  ArrowUp, 
  ArrowDown, 
  Star,
  Plus,
  Trash2,
  Search,
  Crown,
  Layout
} from 'lucide-react'
import { db } from '@/lib/firebase'
import { 
  collection, 
  query, 
  getDocs, 
  doc, 
  updateDoc, 
  addDoc, 
  deleteDoc, 
  orderBy, 
  where, 
  limit, 
  Timestamp 
} from 'firebase/firestore'

interface ComponentData {
  id: string
  key: string
  name: string
  description: string
  active: boolean
  order: number
  settings: Record<string, unknown>
  lastModified?: Date
}

interface FeaturedNews {
  id: string
  newsId: string
  title: string
  summary: string
  imageUrl: string
  category: string
  author: string
  isMainHeadline: boolean
  order: number
  active: boolean
  createdAt: Date
}

interface NewsItem {
  id: string
  title: string
  summary: string
  imageUrl?: string
  category: string
  author: string
  createdAt: Date
  status: string
}

export default function HomepageManager() {
  const [mounted, setMounted] = useState(false)
  const [sections, setSections] = useState<ComponentData[]>([])
  const [featuredNews, setFeaturedNews] = useState<FeaturedNews[]>([])
  const [availableNews, setAvailableNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'sections' | 'featured'>('sections')
  const [searchTerm, setSearchTerm] = useState('')

  // Varsayılan anasayfa bölümleri
  const defaultSections = [
    {
      key: 'BreakingNewsBar',
      name: 'Son Dakika Haberleri',
      description: 'Üst kısımda kayan son dakika haberleri',
      active: true,
      order: 1,
      settings: {}
    },
    {
      key: 'MoneyMarketsTicker',
      name: 'Piyasa Takipçisi',
      description: 'Borsa ve döviz kuru bilgileri',
      active: true,
      order: 2,
      settings: {}
    },
    {
      key: 'MainVisualHeadline',
      name: 'Ana Manşet',
      description: 'Büyük görsel ile ana haber',
      active: true,
      order: 3,
      settings: {}
    },
    {
      key: 'HeadlineNewsGrid',
      name: 'Manşet Haberleri',
      description: 'Grid formatında önemli haberler',
      active: true,
      order: 4,
      settings: {}
    },
    {
      key: 'EditorPicks',
      name: 'Editör Seçkileri',
      description: 'Editörün seçtiği öne çıkan haberler',
      active: true,
      order: 5,
      settings: {}
    },
    {
      key: 'WeekendReadsSection',
      name: 'Hafta Sonu Okumaları',
      description: 'Hafta sonu için özel içerikler',
      active: false,
      order: 6,
      settings: {}
    },
    {
      key: 'VideoHighlights',
      name: 'Video Öne Çıkanlar',
      description: 'Video içeriklerin sergilendiği bölüm',
      active: false,
      order: 7,
      settings: {}
    },
    {
      key: 'PopularNewsSidebar',
      name: 'Popüler Haberler',
      description: 'En çok okunan haberler yan bölümü',
      active: true,
      order: 8,
      settings: {}
    }
  ]

  useEffect(() => {
    setMounted(true)
    loadHomepageSections()
    loadFeaturedNews()
    loadAvailableNews()
  }, [])

  const loadHomepageSections = async () => {
    if (!db) {
      setSections(defaultSections.map((s, i) => ({ 
        ...s, 
        id: `default-${i}`,
        lastModified: new Date()
      })))
      return
    }

    try {
      const sectionsQuery = query(
        collection(db, 'homepageSections'),
        orderBy('order', 'asc')
      )
      const snapshot = await getDocs(sectionsQuery)
      
      if (snapshot.empty) {
        // İlk kurulum - varsayılan bölümleri oluştur
        await createDefaultSections()
        setSections(defaultSections.map((s, i) => ({ 
          ...s, 
          id: `default-${i}`,
          lastModified: new Date()
        })))
      } else {
        const sectionsData = snapshot.docs.map(docSnapshot => {
          const data = docSnapshot.data()
          return {
            id: docSnapshot.id,
            ...data,
            lastModified: data.lastModified?.toDate ? data.lastModified.toDate() : new Date()
          }
        }) as ComponentData[]
        setSections(sectionsData)
      }
    } catch (error) {
      console.error('Homepage sections loading error:', error)
      setSections(defaultSections.map((s, i) => ({ 
        ...s, 
        id: `default-${i}`,
        lastModified: new Date()
      })))
    }
  }

  const createDefaultSections = async () => {
    if (!db) return

    try {
      for (const section of defaultSections) {
        await addDoc(collection(db, 'homepageSections'), {
          ...section,
          createdAt: Timestamp.now(),
          lastModified: Timestamp.now()
        })
      }
      console.log('✅ Default homepage sections created')
    } catch (error) {
      console.error('Error creating default sections:', error)
    }
  }

  const loadFeaturedNews = async () => {
    if (!db) {
      setFeaturedNews([])
      return
    }

    try {
      const featuredQuery = query(
        collection(db, 'featuredNews'),
        orderBy('order', 'asc')
      )
      const snapshot = await getDocs(featuredQuery)
      
      const featuredData = snapshot.docs.map(docSnapshot => {
        const data = docSnapshot.data()
        return {
          id: docSnapshot.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date()
        }
      }) as FeaturedNews[]
      
      setFeaturedNews(featuredData)
    } catch (error) {
      console.error('Featured news loading error:', error)
      setFeaturedNews([])
    }
  }

  const loadAvailableNews = async () => {
    if (!db) {
      setAvailableNews([])
      return
    }

    try {
      // Önce composite index gerektirmeyen basit sorgu deneyelim
      let newsQuery
      try {
        // İdeal sorgu - composite index gerektirir
        newsQuery = query(
          collection(db, 'news'),
          where('status', '==', 'published'),
          orderBy('createdAt', 'desc'),
          limit(50)
        )
        const snapshot = await getDocs(newsQuery)
        
        const newsData = snapshot.docs.map(docSnapshot => {
          const data = docSnapshot.data()
          return {
            id: docSnapshot.id,
            ...data,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date()
          }
        }) as NewsItem[]
        
        setAvailableNews(newsData)
      } catch (indexError) {
        console.warn('Composite index not ready, using fallback query:', indexError)
        
        // Fallback - sadece status filtreleme, sıralama olmadan
        const fallbackQuery = query(
          collection(db, 'news'),
          where('status', '==', 'published'),
          limit(50)
        )
        const fallbackSnapshot = await getDocs(fallbackQuery)
        
        const fallbackNewsData = fallbackSnapshot.docs.map(docSnapshot => {
          const data = docSnapshot.data()
          return {
            id: docSnapshot.id,
            ...data,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date()
          }
        }) as NewsItem[]
        
        // Manuel olarak tarih sıralaması
        fallbackNewsData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        
        setAvailableNews(fallbackNewsData)
      }
    } catch (error) {
      console.error('Available news loading error:', error)
      
      // Son çare - tüm haberleri getir ve filtrele
      try {
        const allNewsQuery = query(collection(db, 'news'), limit(100))
        const allSnapshot = await getDocs(allNewsQuery)
        
        const allNewsData = allSnapshot.docs.map(docSnapshot => {
          const data = docSnapshot.data()
          return {
            id: docSnapshot.id,
            ...data,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date()
          }
        }) as NewsItem[]
        
        // Client-side filtreleme ve sıralama
        const publishedNews = allNewsData
          .filter(news => news.status === 'published')
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
          .slice(0, 50)
        
        setAvailableNews(publishedNews)
        console.log('✅ Used fallback query with client-side filtering')
      } catch (fallbackError) {
        console.error('Fallback query also failed:', fallbackError)
        setAvailableNews([])
      }
    } finally {
      setLoading(false)
    }
  }

  const toggleSectionActive = async (sectionId: string, active: boolean) => {
    if (!db) {
      setSections(prev => prev.map(s => 
        s.id === sectionId ? { ...s, active: !active } : s
      ))
      return
    }

    try {
      await updateDoc(doc(db, 'homepageSections', sectionId), {
        active: !active,
        lastModified: Timestamp.now()
      })
      await loadHomepageSections()
    } catch (error) {
      console.error('Section toggle error:', error)
    }
  }

  const updateSectionOrder = async (sectionId: string, newOrder: number) => {
    if (!db) return

    try {
      await updateDoc(doc(db, 'homepageSections', sectionId), {
        order: newOrder,
        lastModified: Timestamp.now()
      })
      await loadHomepageSections()
    } catch (error) {
      console.error('Section order update error:', error)
    }
  }

  const addToFeatured = async (newsItem: NewsItem) => {
    if (!db) return

    try {
      const maxOrder = Math.max(...featuredNews.map(f => f.order), 0)
      
      await addDoc(collection(db, 'featuredNews'), {
        newsId: newsItem.id,
        title: newsItem.title,
        summary: newsItem.summary,
        imageUrl: newsItem.imageUrl || '',
        category: newsItem.category,
        author: newsItem.author,
        isMainHeadline: false,
        order: maxOrder + 1,
        active: true,
        createdAt: Timestamp.now()
      })
      
      await loadFeaturedNews()
    } catch (error) {
      console.error('Add to featured error:', error)
    }
  }

  const removeFromFeatured = async (featuredId: string) => {
    if (!db) return

    try {
      await deleteDoc(doc(db, 'featuredNews', featuredId))
      await loadFeaturedNews()
    } catch (error) {
      console.error('Remove from featured error:', error)
    }
  }

  const setMainHeadline = async (featuredId: string) => {
    if (!db) return

    try {
      // Önce tüm ana manşetleri kaldır
      const featuredQuery = query(collection(db, 'featuredNews'))
      const snapshot = await getDocs(featuredQuery)
      
      for (const docSnapshot of snapshot.docs) {
        await updateDoc(doc(db, 'featuredNews', docSnapshot.id), {
          isMainHeadline: false
        })
      }
      
      // Seçilen haberi ana manşet yap
      await updateDoc(doc(db, 'featuredNews', featuredId), {
        isMainHeadline: true,
        lastModified: Timestamp.now()
      })
      
      await loadFeaturedNews()
    } catch (error) {
      console.error('Set main headline error:', error)
    }
  }

  const filteredNews = availableNews.filter(news =>
    news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    news.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Anasayfa ayarları yükleniyor...</p>
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
              <Layout className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Anasayfa Yönetimi</h1>
                <p className="text-gray-600">Anasayfa bölümlerini ve öne çıkan haberleri yönetin</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('sections')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'sections'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Monitor className="h-4 w-4 inline-block mr-2" />
                  Bölümler
                </button>
                <button
                  onClick={() => setActiveTab('featured')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'featured'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Star className="h-4 w-4 inline-block mr-2" />
                  Öne Çıkanlar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'sections' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Anasayfa Bölümleri</h2>
              
              <div className="space-y-4">
                {sections.map((section) => (
                  <div key={section.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-4 h-4 rounded-full ${section.active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <div>
                          <h3 className="font-medium text-gray-900">{section.name}</h3>
                          <p className="text-sm text-gray-600">{section.description}</p>
                          <p className="text-xs text-gray-500">Sıra: {section.order}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateSectionOrder(section.id, section.order - 1)}
                          disabled={section.order === 1}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => updateSectionOrder(section.id, section.order + 1)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => toggleSectionActive(section.id, section.active)}
                          className={`p-2 rounded-md ${
                            section.active ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                          }`}
                        >
                          {section.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'featured' && (
          <div className="space-y-6">
            {/* Mevcut Öne Çıkan Haberler */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Öne Çıkan Haberler</h2>
              
              {featuredNews.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Henüz öne çıkan haber seçilmemiş</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {featuredNews.map((news) => (
                    <div key={news.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex space-x-4">
                          {news.imageUrl && (
                            <img 
                              src={news.imageUrl} 
                              alt={news.title}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-medium text-gray-900">{news.title}</h3>
                              {news.isMainHeadline && (
                                <Crown className="h-4 w-4 text-yellow-500" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{news.summary}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                {news.category}
                              </span>
                              <span>{news.author}</span>
                              <span>Sıra: {news.order}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setMainHeadline(news.id)}
                            disabled={news.isMainHeadline}
                            className={`p-2 rounded-md ${
                              news.isMainHeadline 
                                ? 'bg-yellow-100 text-yellow-600' 
                                : 'bg-gray-100 text-gray-600 hover:bg-yellow-100 hover:text-yellow-600'
                            }`}
                            title={news.isMainHeadline ? 'Ana manşet' : 'Ana manşet yap'}
                          >
                            <Crown className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => removeFromFeatured(news.id)}
                            className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
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

            {/* Haber Arama ve Ekleme */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Haber Ekle</h2>
              
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Haber ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredNews.map((news) => (
                  <div key={news.id} className="border rounded-lg p-3 bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex space-x-3">
                        {news.imageUrl && (
                          <img 
                            src={news.imageUrl} 
                            alt={news.title}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm">{news.title}</h4>
                          <p className="text-xs text-gray-600 mt-1">{news.summary}</p>
                          <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              {news.category}
                            </span>
                            <span>{news.author}</span>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => addToFeatured(news)}
                        disabled={featuredNews.some(f => f.newsId === news.id)}
                        className="p-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
                
                {filteredNews.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Arama kriterine uygun haber bulunamadı</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
