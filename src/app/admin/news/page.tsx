'use client'

import { useEffect, useState } from 'react'
import { 
  collection, 
  query, 
  getDocs, 
  orderBy, 
  limit,
  where,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
  startAfter,
  DocumentSnapshot
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { safeUpdateDoc } from '@/lib/safe-firebase-utils'
import { 
  FileText, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Clock, 
  Check, 
  X,
  Search,
  Filter,
  Calendar,
  User,
  Tag
} from 'lucide-react'
import Link from 'next/link'

interface NewsItem {
  id: string
  title: string
  content: string
  category: string
  author: string
  publishDate: Timestamp
  status: 'draft' | 'pending' | 'published' | 'rejected'
  views: number
  featured: boolean
  tags: string[]
  image?: string
}

export default function NewsManagement() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null)
  const [hasMore, setHasMore] = useState(true)

  const ITEMS_PER_PAGE = 10

  useEffect(() => {
    loadNews()
  }, [statusFilter, categoryFilter])

  const loadNews = async (loadMore = false) => {
    if (!db) return

    try {
      let q = query(collection(db, 'news'), orderBy('publishDate', 'desc'))
      
      if (statusFilter !== 'all') {
        q = query(q, where('status', '==', statusFilter))
      }
      
      if (categoryFilter !== 'all') {
        q = query(q, where('category', '==', categoryFilter))
      }

      if (loadMore && lastDoc) {
        q = query(q, startAfter(lastDoc), limit(ITEMS_PER_PAGE))
      } else {
        q = query(q, limit(ITEMS_PER_PAGE))
      }

      const snapshot = await getDocs(q)
      const newsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as NewsItem[]

      if (loadMore) {
        setNews(prev => [...prev, ...newsData])
      } else {
        setNews(newsData)
      }

      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null)
      setHasMore(snapshot.docs.length === ITEMS_PER_PAGE)
    } catch (error) {
      console.error('Haberler yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateNewsStatus = async (newsId: string, newStatus: string) => {
    if (!db) return

    try {
      const result = await safeUpdateDoc(doc(db, 'news', newsId), {
        status: newStatus,
        updatedAt: Timestamp.now()
      })
      
      if (result.success) {
        setNews(prev => prev.map(item => 
          item.id === newsId ? { ...item, status: newStatus as any } : item
        ))
      } else {
        console.error('Failed to update news status:', result.error)
      }
    } catch (error) {
      console.error('Haber durumu güncellenirken hata:', error)
    }
  }

  const deleteNews = async (newsId: string) => {
    if (!db || !confirm('Bu haberi silmek istediğinizden emin misiniz?')) return

    try {
      await deleteDoc(doc(db, 'news', newsId))
      setNews(prev => prev.filter(item => item.id !== newsId))
    } catch (error) {
      console.error('Haber silinirken hata:', error)
    }
  }

  const toggleFeatured = async (newsId: string, currentFeatured: boolean) => {
    if (!db) return

    try {
      const result = await safeUpdateDoc(doc(db, 'news', newsId), {
        featured: !currentFeatured,
        updatedAt: Timestamp.now()
      })
      
      if (result.success) {
        setNews(prev => prev.map(item => 
          item.id === newsId ? { ...item, featured: !currentFeatured } : item
        ))
      } else {
        console.error('Failed to toggle featured status:', result.error)
      }
    } catch (error) {
      console.error('Öne çıkarılma durumu güncellenirken hata:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      draft: 'bg-gray-100 text-gray-700',
      pending: 'bg-yellow-100 text-yellow-700',
      published: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700'
    }
    
    const labels = {
      draft: 'Taslak',
      pending: 'Bekliyor',
      published: 'Yayında',
      rejected: 'Reddedildi'
    }

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    )
  }

  const filteredNews = news.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const categories = [
    'all', 'gundem', 'spor', 'ekonomi', 'teknoloji', 'saglik', 
    'egitim', 'kultur', 'politika', 'dunya', 'magazin', 'din', 'cevre'
  ]

  const statuses = [
    { value: 'all', label: 'Tümü' },
    { value: 'draft', label: 'Taslak' },
    { value: 'pending', label: 'Bekliyor' },
    { value: 'published', label: 'Yayında' },
    { value: 'rejected', label: 'Reddedildi' }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="h-6 w-6" />
              Haber Yönetimi
            </h1>
            <p className="text-gray-600 mt-1">Tüm haberleri görüntüleyin, düzenleyin ve yönetin</p>
          </div>
          <Link
            href={"/admin/news/new" as any}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Yeni Haber
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Haber ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            {statuses.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'Tüm Kategoriler' : category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>

          {/* Results Count */}
          <div className="flex items-center text-sm text-gray-600">
            <Filter className="h-4 w-4 mr-2" />
            {filteredNews.length} haber bulundu
          </div>
        </div>
      </div>

      {/* News List */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
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
                  Yayın Tarihi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Görüntülenme
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredNews.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      {item.image && (
                        <img
                          src={item.image}
                          alt=""
                          className="w-16 h-12 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          {item.featured && (
                            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                              Öne Çıkan
                            </span>
                          )}
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {item.author}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                      <Tag className="h-3 w-3" />
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(item.status)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {item.publishDate?.toDate?.()?.toLocaleDateString('tr-TR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {item.views?.toLocaleString() || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Featured Toggle */}
                      <button
                        onClick={() => toggleFeatured(item.id, item.featured)}
                        className={`p-1 rounded hover:bg-gray-100 ${
                          item.featured ? 'text-yellow-600' : 'text-gray-400'
                        }`}
                        title={item.featured ? 'Öne çıkarmayı kaldır' : 'Öne çıkar'}
                      >
                        ⭐
                      </button>

                      {/* Status Actions */}
                      {item.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateNewsStatus(item.id, 'published')}
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                            title="Onayla"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => updateNewsStatus(item.id, 'rejected')}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Reddet"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      )}

                      {/* Edit */}
                      <Link
                        href={`/admin/news/edit/${item.id}` as any}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="Düzenle"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Link>

                      {/* Delete */}
                      <button
                        onClick={() => deleteNews(item.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
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

        {/* Load More */}
        {hasMore && (
          <div className="p-6 border-t border-gray-200 text-center">
            <button
              onClick={() => loadNews(true)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Daha Fazla Yükle
            </button>
          </div>
        )}
      </div>

      {/* Empty State */}
      {filteredNews.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Haber bulunamadı</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
              ? 'Arama kriterlerinize uygun haber bulunamadı.'
              : 'Henüz hiç haber eklenmemiş.'}
          </p>
          <Link
            href={"/admin/news/new" as any}
            className="inline-flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            <Plus className="h-4 w-4" />
            İlk Haberi Ekle
          </Link>
        </div>
      )}
    </div>
  )
}
