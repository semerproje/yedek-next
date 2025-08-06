'use client'

import { useEffect, useState } from 'react'
import { 
  collection, 
  query, 
  getDocs, 
  orderBy, 
  limit,
  where,
  Timestamp,
  doc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import Link from 'next/link'
import { 
  Users, 
  FileText, 
  Eye, 
  TrendingUp, 
  Clock, 
  Globe,
  BarChart3,
  Activity,
  Calendar,
  ArrowUp,
  ArrowDown,
  Layout,
  Grid3X3,
  Newspaper,
  Settings,
  Edit,
  Trash2,
  Plus,
  ImageIcon,
  Tags
} from 'lucide-react'

interface DashboardStats {
  totalNews: number
  totalViews: number
  totalUsers: number
  dailyViews: number
  weeklyNews: number
  pendingNews: number
  publishedToday: number
  totalCategories: number
}

interface RecentNews {
  id: string
  title: string
  category: string
  publishDate: Timestamp
  views: number
  status: string
  imageUrl?: string
  summary?: string
}

interface QuickAction {
  title: string
  description: string
  href: string
  icon: any
  color: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalNews: 0,
    totalViews: 0,
    totalUsers: 0,
    dailyViews: 0,
    weeklyNews: 0,
    pendingNews: 0,
    publishedToday: 0,
    totalCategories: 12
  })
  const [recentNews, setRecentNews] = useState<RecentNews[]>([])
  const [loading, setLoading] = useState(true)

  const quickActions: QuickAction[] = [
    {
      title: 'Yeni Haber Ekle',
      description: 'Hızlıca yeni bir haber oluşturun',
      href: '/admin/dashboard/news/create',
      icon: Plus,
      color: 'bg-blue-500'
    },
    {
      title: 'Anasayfa Düzenle',
      description: 'Homepage bileşenlerini düzenleyin',
      href: '/admin/dashboard/homepage',
      icon: Layout,
      color: 'bg-green-500'
    },
    {
      title: 'Kategori Yönetimi',
      description: 'Kategori sayfalarını yönetin',
      href: '/admin/dashboard/categories',
      icon: Grid3X3,
      color: 'bg-purple-500'
    },
    {
      title: 'Site Ayarları',
      description: 'Genel site ayarlarını düzenleyin',
      href: '/admin/dashboard/settings',
      icon: Settings,
      color: 'bg-orange-500'
    }
  ]

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    if (!db) return

    try {
      setLoading(true)

      // Toplam haber sayısı
      const newsQuery = query(collection(db, 'news'))
      const newsSnapshot = await getDocs(newsQuery)
      const totalNews = newsSnapshot.size

      // Bekleyen haberler
      const pendingQuery = query(
        collection(db, 'news'),
        where('status', '==', 'draft')
      )
      const pendingSnapshot = await getDocs(pendingQuery)
      const pendingNews = pendingSnapshot.size

      // Son haberler
      const recentQuery = query(
        collection(db, 'news'),
        orderBy('createdAt', 'desc'),
        limit(10)
      )
      const recentSnapshot = await getDocs(recentQuery)
      const recentNewsData = recentSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as RecentNews[]

      // Bugün yayınlanan haberler
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const todayQuery = query(
        collection(db, 'news'),
        where('publishDate', '>=', Timestamp.fromDate(today)),
        where('status', '==', 'published')
      )
      const todaySnapshot = await getDocs(todayQuery)
      const publishedToday = todaySnapshot.size

      // Bu hafta yayınlanan haberler
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      const weekQuery = query(
        collection(db, 'news'),
        where('publishDate', '>=', Timestamp.fromDate(weekAgo)),
        where('status', '==', 'published')
      )
      const weekSnapshot = await getDocs(weekQuery)
      const weeklyNews = weekSnapshot.size

      setStats({
        totalNews,
        totalViews: 125780, // Bu gerçek analytics verisi olmalı
        totalUsers: 8940,   // Bu gerçek user verisi olmalı
        dailyViews: 2150,   // Bu gerçek analytics verisi olmalı
        weeklyNews,
        pendingNews,
        publishedToday,
        totalCategories: 12 // Sabit kategori sayısı
      })

      setRecentNews(recentNewsData)
    } catch (error) {
      console.error('Dashboard verileri yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (timestamp: Timestamp) => {
    return timestamp.toDate().toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const deleteNews = async (newsId: string) => {
    if (!db || !confirm('Bu haberi silmek istediğinizden emin misiniz?')) return

    try {
      await deleteDoc(doc(db, 'news', newsId))
      await loadDashboardData()
    } catch (error) {
      console.error('Haber silinirken hata:', error)
    }
  }

  const toggleNewsStatus = async (newsId: string, currentStatus: string) => {
    if (!db) return

    try {
      const newStatus = currentStatus === 'published' ? 'draft' : 'published'
      await updateDoc(doc(db, 'news', newsId), {
        status: newStatus,
        updatedAt: Timestamp.now()
      })
      await loadDashboardData()
    } catch (error) {
      console.error('Haber durumu güncellenirken hata:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900">Yönetim Paneli</h1>
        <p className="text-gray-600 mt-2">Net Haberler içerik yönetim merkezi</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action) => (
          <Link
            key={action.href}
            href={action.href as any}
            className="group relative bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
          >
            <div className="flex items-center gap-4">
              <div className={`${action.color} p-3 rounded-xl text-white group-hover:scale-110 transition-transform`}>
                <action.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{action.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total News */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Toplam Haber</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalNews}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-4">
            <ArrowUp className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-600 font-medium">+{stats.weeklyNews}</span>
            <span className="text-sm text-gray-500">bu hafta</span>
          </div>
        </div>

        {/* Total Views */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Toplam Görüntüleme</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalViews.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-xl">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-4">
            <ArrowUp className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-600 font-medium">+{stats.dailyViews}</span>
            <span className="text-sm text-gray-500">bugün</span>
          </div>
        </div>

        {/* Published Today */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Bugün Yayınlanan</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.publishedToday}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-4">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">Son 24 saat</span>
          </div>
        </div>

        {/* Pending News */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Bekleyen Haberler</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pendingNews}</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-xl">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-4">
            <Activity className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">İnceleme bekliyor</span>
          </div>
        </div>
      </div>

      {/* Recent News */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Son Haberler</h2>
            <Link
              href="/admin/dashboard/news"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Tümünü Görüntüle
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
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
                  Tarih
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentNews.map((news) => (
                <tr key={news.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {news.imageUrl && (
                        <img
                          src={news.imageUrl}
                          alt=""
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      )}
                      <div className="max-w-xs">
                        <p className="font-medium text-gray-900 truncate">{news.title}</p>
                        {news.summary && (
                          <p className="text-sm text-gray-500 truncate mt-1">{news.summary}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {news.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      news.status === 'published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {news.status === 'published' ? 'Yayınlandı' : 'Taslak'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {news.publishDate && formatDate(news.publishDate)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <Link
                        href={`/admin/dashboard/news/edit/${news.id}` as any}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => toggleNewsStatus(news.id, news.status)}
                        className={`p-2 transition-colors ${
                          news.status === 'published' 
                            ? 'text-gray-400 hover:text-yellow-600' 
                            : 'text-gray-400 hover:text-green-600'
                        }`}
                        title={news.status === 'published' ? 'Taslağa Çevir' : 'Yayınla'}
                      >
                        <Activity className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteNews(news.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
