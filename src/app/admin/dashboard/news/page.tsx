'use client'

import { useEffect, useState } from 'react'
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
import { db } from '@/lib/firebase'
import { safeUpdateDoc } from '@/lib/safe-firebase-utils'
import Link from 'next/link'
import { 
  Newspaper,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Clock,
  Calendar,
  User,
  Tag,
  Image as ImageIcon,
  Activity,
  CheckCircle,
  XCircle,
  Globe
} from 'lucide-react'

interface NewsItem {
  id: string
  title: string
  summary: string
  content: string
  category: string
  tags: string[]
  imageUrl?: string
  author: string
  status: 'draft' | 'published' | 'archived' | 'review'
  publishDate: Date
  createdAt: Date
  updatedAt: Date
  views: number
  featured: boolean
}

interface FilterOptions {
  category: string
  status: string
  author: string
  dateRange: string
}

export default function NewsManagement() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<FilterOptions>({
    category: '',
    status: '',
    author: '',
    dateRange: ''
  })
  const [selectedNews, setSelectedNews] = useState<string[]>([])

  const categories = [
    'gundem', 'spor', 'ekonomi', 'teknoloji', 'din', 'politika',
    'kultur', 'magazin', 'saglik', 'egitim', 'dunya', 'cevre'
  ]

  useEffect(() => {
    console.log('📰 Loading Firebase news data...')
    loadFirebaseNews()
  }, [filters])

  useEffect(() => {
    if (searchTerm || Object.values(filters).some(f => f)) {
      loadFirebaseNews()
    }
  }, [searchTerm])

  const loadFirebaseNews = async () => {
    if (!db) {
      console.warn('Firebase not initialized, loading static data')
      loadStaticNews()
      return
    }

    try {
      setLoading(true)
      
      // Use simple query to avoid composite index requirements
      const newsQuery = query(
        collection(db, 'news'),
        orderBy('createdAt', 'desc'),
        limit(100) // Get more items for client-side filtering
      )

      const snapshot = await getDocs(newsQuery)
      console.log(`📰 Firebase'den ${snapshot.size} haber yüklendi`)
      
      if (snapshot.empty) {
        console.warn('Firebase news koleksiyonu boş, demo veriler yükleniyor')
        loadStaticNews()
        return
      }

      const newsData = snapshot.docs.map(doc => {
        const data = doc.data()
        const newsItem = {
          id: doc.id,
          title: data.title || 'Başlık Yok',
          summary: data.summary || 'Özet Yok',
          content: data.content || 'İçerik Yok',
          category: data.category || 'genel',
          author: data.author || 'Bilinmeyen Yazar',
          status: data.status || 'draft',
          tags: data.tags || [],
          imageUrl: data.imageUrl || '',
          views: data.views || 0,
          featured: data.featured || false,
          // Date handling - multiple formats supported
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : 
                    data.createdAt instanceof Date ? data.createdAt : 
                    new Date(data.createdAt || Date.now()),
          publishDate: data.publishDate?.toDate ? data.publishDate.toDate() : 
                      data.publishDate instanceof Date ? data.publishDate : 
                      new Date(data.publishDate || Date.now()),
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : 
                    data.updatedAt instanceof Date ? data.updatedAt : 
                    new Date(data.updatedAt || Date.now())
        }
        console.log(`📝 Haber ID: ${newsItem.id}, Başlık: ${newsItem.title}`)
        return newsItem
      }) as NewsItem[]

      // Apply filters client-side to avoid composite index requirements
      let filteredNews = newsData

      // Apply category filter
      if (filters.category) {
        filteredNews = filteredNews.filter(item => item.category === filters.category)
      }

      // Apply status filter
      if (filters.status) {
        filteredNews = filteredNews.filter(item => item.status === filters.status)
      }

      // Apply search filter
      if (searchTerm) {
        filteredNews = filteredNews.filter(item =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.author.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }

      // Limit results after filtering
      const limitedNews = filteredNews.slice(0, 50)

      setNews(limitedNews)
    } catch (error) {
      console.error('Firebase news yüklenirken hata:', error)
      console.log('Hata nedeniyle static veriler yükleniyor')
      loadStaticNews()
    } finally {
      setLoading(false)
    }
  }

  const loadStaticNews = () => {
    // Demo veriler - Firebase çalışmazsa
    const demoNews: NewsItem[] = [
      {
        id: 'demo-tech-1',
        title: 'Teknoloji Sektöründe Yeni Gelişmeler',
        summary: 'Yapay zeka ve makine öğrenmesi alanında yaşanan son gelişmeler sektörü derinden etkiliyor.',
        content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit...',
        category: 'teknoloji',
        author: 'Ahmet Yılmaz',
        status: 'published',
        tags: ['ai', 'teknoloji', 'gelişim'],
        imageUrl: '/images/tech-news.jpg',
        createdAt: new Date(Date.now() - 86400000),
        publishDate: new Date(Date.now() - 86400000),
        updatedAt: new Date(Date.now() - 3600000),
        views: 1520,
        featured: true
      },
      {
        id: 'demo-sport-1',
        title: 'Spor Dünyasından Son Haberler',
        summary: 'Futbol liglerinde yaşanan transferler ve maç sonuçları.',
        content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit...',
        category: 'spor',
        author: 'Mehmet Demir',
        status: 'published',
        tags: ['futbol', 'transfer', 'lig'],
        imageUrl: '/images/sport-news.jpg',
        createdAt: new Date(Date.now() - 172800000),
        publishDate: new Date(Date.now() - 172800000),
        updatedAt: new Date(Date.now() - 7200000),
        views: 892,
        featured: false
      },
      {
        id: 'demo-politics-1',
        title: 'Gündem: Siyasi Gelişmeler',
        summary: 'Son siyasi gelişmelerin analizi ve değerlendirmesi.',
        content: 'Detaylı haber içeriği burada yer alacak...',
        category: 'politika',
        author: 'Ayşe Kara',
        status: 'draft',
        tags: ['siyaset', 'analiz'],
        imageUrl: '',
        createdAt: new Date(Date.now() - 259200000),
        publishDate: new Date(Date.now() - 259200000),
        updatedAt: new Date(Date.now() - 10800000),
        views: 234,
        featured: false
      }
    ]

    // Apply filters to demo data
    let filteredNews = demoNews
    
    if (filters.category) {
      filteredNews = filteredNews.filter(item => item.category === filters.category)
    }
    
    if (filters.status) {
      filteredNews = filteredNews.filter(item => item.status === filters.status)
    }
    
    if (searchTerm) {
      filteredNews = filteredNews.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.author.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    setNews(filteredNews)
    setLoading(false)
  }

  const formatDate = (timestamp: any) => {
    try {
      let date: Date
      
      if (timestamp && typeof timestamp.toDate === 'function') {
        date = timestamp.toDate()
      } else if (timestamp instanceof Date) {
        date = timestamp
      } else if (typeof timestamp === 'string') {
        date = new Date(timestamp)
      } else if (typeof timestamp === 'number') {
        date = new Date(timestamp)
      } else {
        console.warn('Invalid timestamp format:', timestamp)
        date = new Date()
      }
      
      return date.toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      console.error('Date formatting error:', error)
      return 'Geçersiz tarih'
    }
  }

  const updateNewsStatus = async (newsId: string, status: NewsItem['status']) => {
    if (!db) {
      console.warn('Firebase not available, updating local state')
      setNews(prev => prev.map(item => 
        item.id === newsId 
          ? { 
              ...item, 
              status, 
              updatedAt: new Date(),
              ...(status === 'published' && { publishDate: new Date() })
            }
          : item
      ))
      return
    }

    try {
      const result = await safeUpdateDoc(doc(db, 'news', newsId), {
        status,
        updatedAt: Timestamp.now(),
        ...(status === 'published' && { publishDate: Timestamp.now() })
      })
      
      if (result.success) {
        await loadFirebaseNews()
        console.log(`✅ News ${newsId} status updated to ${status}`)
      }
    } catch (error) {
      console.error('Firebase news status update failed:', error)
      setNews(prev => prev.map(item => 
        item.id === newsId 
          ? { 
              ...item, 
              status, 
              updatedAt: new Date(),
              ...(status === 'published' && { publishDate: new Date() })
            }
          : item
      ))
    }
  }

  const toggleFeatured = async (newsId: string, featured: boolean) => {
    if (!db) {
      console.warn('Firebase not available, updating local state')
      setNews(prev => prev.map(item => 
        item.id === newsId 
          ? { 
              ...item, 
              featured: !featured, 
              updatedAt: new Date()
            }
          : item
      ))
      return
    }

    try {
      const result = await safeUpdateDoc(doc(db, 'news', newsId), {
        featured: !featured,
        updatedAt: Timestamp.now()
      })
      
      if (result.success) {
        await loadFirebaseNews()
        console.log(`✅ News ${newsId} featured status toggled`)
      }
    } catch (error) {
      console.error('Firebase featured toggle failed:', error)
      setNews(prev => prev.map(item => 
        item.id === newsId 
          ? { 
              ...item, 
              featured: !featured, 
              updatedAt: new Date()
            }
          : item
      ))
    }
  }

  const deleteNews = async (newsId: string) => {
    if (!confirm('Bu haberi silmek istediğinizden emin misiniz?')) return
    
    if (!db) {
      console.warn('Firebase not available, removing from local state')
      setNews(prev => prev.filter(item => item.id !== newsId))
      return
    }

    try {
      await deleteDoc(doc(db, 'news', newsId))
      await loadFirebaseNews()
      console.log(`✅ News ${newsId} deleted from Firebase`)
    } catch (error) {
      console.error('Firebase news deletion failed:', error)
      setNews(prev => prev.filter(item => item.id !== newsId))
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800'
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'review':
        return 'bg-yellow-100 text-yellow-800'
      case 'archived':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Haberler yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <Newspaper className="h-6 w-6 mr-2 text-blue-600" />
              Haber Yönetimi
            </h1>
            <p className="text-gray-600">Haberleri görüntüleyin, düzenleyin ve yönetin</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/dashboard"
              className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Globe className="h-4 w-4" />
              <span>Dashboard'a Dön</span>
            </Link>
            
            <Link
              href={"/admin/dashboard/news/create" as any}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Yeni Haber</span>
            </Link>
            
            <button
              onClick={() => {
                if (confirm('Admin panelinden çıkmak istediğinizden emin misiniz?')) {
                  window.location.href = '/'
                }
              }}
              className="text-red-600 hover:text-red-800 px-3 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <XCircle className="h-4 w-4" />
              <span>Çıkış</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex flex-wrap items-center space-x-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Haberlerde ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tüm Kategoriler</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
          
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tüm Durumlar</option>
            <option value="published">Yayınlandı</option>
            <option value="draft">Taslak</option>
            <option value="review">İnceleme</option>
            <option value="archived">Arşiv</option>
          </select>
          
          <button
            onClick={loadFirebaseNews}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center space-x-2"
          >
            <Filter className="h-4 w-4" />
            <span>Yenile</span>
          </button>
        </div>
      </div>

      {/* News Table */}
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Haber
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Yazar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarih
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {news.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-start space-x-3">
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-16 h-12 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-1 mt-1">
                          {item.summary}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="flex items-center text-xs text-gray-500">
                            <Eye className="h-3 w-3 mr-1" />
                            {item.views}
                          </span>
                          {item.featured && (
                            <span className="text-xs text-yellow-600 font-medium">
                              ⭐ Öne Çıkan
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                      {item.status === 'published' ? 'Yayında' : 
                       item.status === 'draft' ? 'Taslak' : 
                       item.status === 'review' ? 'İncelemede' : 'Arşiv'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.author}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(item.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleFeatured(item.id, item.featured)}
                        className={`p-1 rounded ${item.featured ? 'text-yellow-600' : 'text-gray-400'} hover:text-yellow-700`}
                        title="Öne Çıkar"
                      >
                        ⭐
                      </button>
                      
                      <select
                        value={item.status}
                        onChange={(e) => updateNewsStatus(item.id, e.target.value as NewsItem['status'])}
                        className="text-xs border-none bg-transparent focus:ring-0"
                      >
                        <option value="draft">Taslak</option>
                        <option value="review">İnceleme</option>
                        <option value="published">Yayınla</option>
                        <option value="archived">Arşiv</option>
                      </select>
                      
                      <Link
                        href={`/admin/dashboard/news/edit/${item.id}` as any}
                        className="p-1 text-gray-400 hover:text-blue-600"
                        title="Düzenle"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      
                      <button
                        onClick={() => deleteNews(item.id)}
                        className="p-1 text-gray-400 hover:text-red-600"
                        title="Sil"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {news.length === 0 && (
          <div className="text-center py-12">
            <Newspaper className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz haber yok</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || Object.values(filters).some(f => f) 
                ? 'Arama kriterlerinize uygun haber bulunamadı'
                : 'Firebase koleksiyonunda haber bulunamadı'
              }
            </p>
            <Link
              href={"/admin/dashboard/news/create" as any}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              İlk Haberi Oluştur
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
