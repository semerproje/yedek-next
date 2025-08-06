'use client'

import { useState, useEffect } from 'react'
import { collection, query, orderBy, limit, where, onSnapshot, updateDoc, doc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useRouter } from 'next/navigation'

// Type definitions
interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  status: 'published' | 'draft' | 'archived';
  breaking: boolean;
  urgent: boolean;
  publishedAt: any;
  createdAt: any;
  updatedAt: any;
  images?: any[];
  videos?: any[];
  socialMediaScheduled?: boolean;
}

interface Stats {
  total: number;
  published: number;
  draft: number;
  breaking: number;
  urgent: number;
}

export default function ContentManagement() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([])
  const [categories] = useState(['gundem', 'ekonomi', 'spor', 'teknoloji', 'saglik', 'kultur', 'dunya', 'magazin', 'cevre', 'politika', 'egitim', 'din', 'aa'])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [aaLoading, setAALoading] = useState(false)
  const [editingNews, setEditingNews] = useState(null)
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [stats, setStats] = useState<Stats>({
    total: 0,
    published: 0,
    draft: 0,
    breaking: 0,
    urgent: 0
  })

  const router = useRouter()

  useEffect(() => {
    // Haberleri dinle
    const newsQuery = query(
      collection(db, 'news'),
      orderBy('createdAt', 'desc'),
      limit(100)
    )

    const unsubscribe = onSnapshot(newsQuery, (snapshot) => {
      const newsData: NewsItem[] = []
      snapshot.forEach(doc => {
        newsData.push({ id: doc.id, ...doc.data() } as NewsItem)
      })
      setNews(newsData)
      setFilteredNews(newsData)
      updateStats(newsData)
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    // Filtreleme
    let filtered = news

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }

    if (selectedStatus !== 'all') {
      if (selectedStatus === 'breaking') {
        filtered = filtered.filter(item => item.breaking)
      } else if (selectedStatus === 'urgent') {
        filtered = filtered.filter(item => item.urgent)
      } else {
        filtered = filtered.filter(item => item.status === selectedStatus)
      }
    }

    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredNews(filtered)
  }, [news, selectedCategory, selectedStatus, searchTerm])

  const updateStats = (newsData: NewsItem[]) => {
    const stats = {
      total: newsData.length,
      published: newsData.filter((item: NewsItem) => item.status === 'published').length,
      draft: newsData.filter((item: NewsItem) => item.status === 'draft').length,
      breaking: newsData.filter((item: NewsItem) => item.breaking).length,
      urgent: newsData.filter((item: NewsItem) => item.urgent).length
    }
    setStats(stats)
  }

  const handleStatusChange = async (newsId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'news', newsId), {
        status: newStatus,
        updatedAt: serverTimestamp(),
        ...(newStatus === 'published' && { publishedAt: serverTimestamp() })
      })
    } catch (error) {
      console.error('Status update error:', error)
      alert('Durum güncellenirken hata oluştu')
    }
  }

  const handlePriorityChange = async (newsId: string, priority: string) => {
    try {
      const updates: any = {
        priority,
        updatedAt: serverTimestamp()
      }

      // Önceki öncelikleri temizle
      if (priority === 'breaking') {
        updates.breaking = true
        updates.urgent = false
      } else if (priority === 'urgent') {
        updates.urgent = true
        updates.breaking = false
      } else {
        updates.breaking = false
        updates.urgent = false
      }

      await updateDoc(doc(db, 'news', newsId), updates)
    } catch (error) {
      console.error('Priority update error:', error)
      alert('Öncelik güncellenirken hata oluştu')
    }
  }

  const handleDelete = async (newsId: string) => {
    if (confirm('Bu haberi silmek istediğinizden emin misiniz?')) {
      try {
        await deleteDoc(doc(db, 'news', newsId))
      } catch (error) {
        console.error('Delete error:', error)
        alert('Haber silinirken hata oluştu')
      }
    }
  }

  const handleBulkAction = async (action: string) => {
    if (selectedItems.length === 0) return

    setLoading(true)
    try {
      const promises = selectedItems.map(newsId => {
        if (action === 'publish') {
          return updateDoc(doc(db, 'news', newsId), {
            status: 'published',
            publishedAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          })
        } else if (action === 'draft') {
          return updateDoc(doc(db, 'news', newsId), {
            status: 'draft',
            updatedAt: serverTimestamp()
          })
        } else if (action === 'delete') {
          return deleteDoc(doc(db, 'news', newsId))
        }
      })

      await Promise.all(promises)
      setSelectedItems([])
      setShowBulkActions(false)
      
    } catch (error) {
      console.error('Bulk action error:', error)
      alert('Toplu işlem sırasında hata oluştu')
    }
    setLoading(false)
  }

  const handleSelectAll = () => {
    if (selectedItems.length === filteredNews.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredNews.map((item: NewsItem) => item.id))
    }
  }

  const fetchAANews = async () => {
    setAALoading(true)
    try {
      // AA News API çağrısı (ultra-aa-crawler kullanılıyor)
      const response = await fetch('/api/ultra-aa-crawler', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'fetch-news',
          categories: ['gundem', 'ekonomi', 'spor', 'teknoloji', 'saglik', 'kultur', 'dunya', 'politika'],
          saveMode: 'bulk-save-overwrite'
        })
      })

      const result = await response.json()
      
      if (result.success) {
        alert(`✅ AA Haber Çekme Başarılı!\n\nToplam: ${result.totalFetched} haber\nKaydedilen: ${result.savedCount} haber\nÜzerine yazılan: ${result.overwrittenCount} haber\nAtlanan: ${result.skippedCount} haber`)
      } else {
        alert(`❌ Hata: ${result.error}`)
      }
    } catch (error) {
      console.error('AA News fetch error:', error)
      alert('❌ AA haber çekme sırasında hata oluştu')
    }
    setAALoading(false)
  }

  const formatDate = (date: any) => {
    if (!date) return '-'
    const d = date.toDate ? date.toDate() : new Date(date)
    return d.toLocaleString('tr-TR')
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      gundem: 'bg-red-100 text-red-800',
      ekonomi: 'bg-green-100 text-green-800',
      spor: 'bg-blue-100 text-blue-800',
      teknoloji: 'bg-purple-100 text-purple-800',
      saglik: 'bg-pink-100 text-pink-800',
      kultur: 'bg-yellow-100 text-yellow-800',
      dunya: 'bg-indigo-100 text-indigo-800',
      magazin: 'bg-orange-100 text-orange-800',
      cevre: 'bg-teal-100 text-teal-800',
      politika: 'bg-gray-100 text-gray-800',
      egitim: 'bg-cyan-100 text-cyan-800',
      din: 'bg-violet-100 text-violet-800',
      aa: 'bg-red-500 text-white'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  const getStatusColor = (status: string, breaking: boolean, urgent: boolean) => {
    if (breaking) return 'bg-red-100 text-red-800'
    if (urgent) return 'bg-orange-100 text-orange-800'
    
    const colors: { [key: string]: string } = {
      published: 'bg-green-100 text-green-800',
      draft: 'bg-gray-100 text-gray-800',
      archived: 'bg-yellow-100 text-yellow-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusText = (status: string, breaking: boolean, urgent: boolean) => {
    if (breaking) return '🚨 FLAŞ'
    if (urgent) return '⚡ ACİL'
    
    const texts: { [key: string]: string } = {
      published: '✅ Yayında',
      draft: '📝 Taslak',
      archived: '📦 Arşiv'
    }
    return texts[status] || status
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              📝 İçerik Yönetimi
            </h1>
            <p className="text-gray-600">
              Haber içeriklerini yönetin, düzenleyin ve yayınlayın
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchAANews}
              disabled={aaLoading}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {aaLoading ? '⏳ Çekiliyor...' : '📰 AA Haber Çek'}
            </button>
            <button
              onClick={() => router.push('/admin/dashboard/content/create')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              ➕ Yeni Haber Ekle
            </button>
          </div>
        </div>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Toplam Haber</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-2xl font-bold text-green-600">{stats.published}</div>
          <div className="text-sm text-gray-600">Yayında</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-2xl font-bold text-gray-600">{stats.draft}</div>
          <div className="text-sm text-gray-600">Taslak</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-2xl font-bold text-red-600">{stats.breaking}</div>
          <div className="text-sm text-gray-600">Flaş Haber</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-2xl font-bold text-orange-600">{stats.urgent}</div>
          <div className="text-sm text-gray-600">Acil Haber</div>
        </div>
      </div>

      {/* Filtreler */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategori
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tüm Kategoriler</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Durum
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="published">Yayında</option>
              <option value="draft">Taslak</option>
              <option value="archived">Arşiv</option>
              <option value="breaking">Flaş Haber</option>
              <option value="urgent">Acil Haber</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Arama
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Başlık, özet veya içerik ara..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() => setShowBulkActions(!showBulkActions)}
              disabled={selectedItems.length === 0}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
            >
              Toplu İşlemler ({selectedItems.length})
            </button>
          </div>
        </div>

        {/* Toplu İşlemler */}
        {showBulkActions && selectedItems.length > 0 && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">
                {selectedItems.length} öğe seçili:
              </span>
              <button
                onClick={() => handleBulkAction('publish')}
                disabled={loading}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
              >
                📤 Yayınla
              </button>
              <button
                onClick={() => handleBulkAction('draft')}
                disabled={loading}
                className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 disabled:opacity-50"
              >
                📝 Taslağa Çevir
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                disabled={loading}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50"
              >
                🗑️ Sil
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Haber Listesi */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === filteredNews.length && filteredNews.length > 0}
                    onChange={handleSelectAll}
                    className="rounded"
                  />
                </th>
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
                  Tarih
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredNews.map((item, index) => (
                <tr key={`news-${item.id}-${index}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedItems([...selectedItems, item.id])
                        } else {
                          setSelectedItems(selectedItems.filter(id => id !== item.id))
                        }
                      }}
                      className="rounded"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start space-x-3">
                      {item.images && item.images.length > 0 && (
                        <img
                          src={item.images[0].url || item.images[0]}
                          alt=""
                          className="w-16 h-12 object-cover rounded"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 line-clamp-2">
                          {item.title}
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-1 mt-1">
                          {item.summary}
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          {item.videos && item.videos.length > 0 && (
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                              📺 Video
                            </span>
                          )}
                          {item.images && item.images.length > 0 && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              🖼️ {item.images.length} Görsel
                            </span>
                          )}
                          {item.socialMediaScheduled && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              📱 SM Zamanlandı
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(item.category)}`}>
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status, item.breaking, item.urgent)}`}>
                      {getStatusText(item.status, item.breaking, item.urgent)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>{formatDate(item.publishedAt || item.createdAt)}</div>
                    <div className="text-xs text-gray-500">
                      Güncelleme: {formatDate(item.updatedAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => router.push(`/haber/${item.id}`)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Görüntüle"
                      >
                        👁️
                      </button>
                      <button
                        onClick={() => router.push(`/admin/dashboard/content/edit/${item.id}`)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Düzenle"
                      >
                        ✏️
                      </button>
                      
                      {/* Durum Değiştir */}
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                        className="text-xs border border-gray-300 rounded px-2 py-1"
                        title="Durum değiştir"
                      >
                        <option value="draft">Taslak</option>
                        <option value="published">Yayında</option>
                        <option value="archived">Arşiv</option>
                      </select>
                      
                      {/* Öncelik Değiştir */}
                      <select
                        value={item.breaking ? 'breaking' : item.urgent ? 'urgent' : 'normal'}
                        onChange={(e) => handlePriorityChange(item.id, e.target.value)}
                        className="text-xs border border-gray-300 rounded px-2 py-1"
                        title="Öncelik değiştir"
                      >
                        <option value="normal">Normal</option>
                        <option value="urgent">Acil</option>
                        <option value="breaking">Flaş</option>
                      </select>
                      
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Sil"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredNews.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">📰</div>
            <div className="text-gray-500">
              {searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all'
                ? 'Filtrelere uygun haber bulunamadı'
                : 'Henüz haber bulunmuyor'
              }
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
