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
  Plus
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
    totalCategories: 0
  })
  const [recentNews, setRecentNews] = useState<RecentNews[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    if (!db) return

    try {
      // Toplam haber sayısı
      const newsQuery = query(collection(db, 'news'))
      const newsSnapshot = await getDocs(newsQuery)
      const totalNews = newsSnapshot.size

      // Bekleyen haberler
      const pendingQuery = query(
        collection(db, 'news'),
        where('status', '==', 'pending')
      )
      const pendingSnapshot = await getDocs(pendingQuery)
      const pendingNews = pendingSnapshot.size

      // Son haberler
      const recentQuery = query(
        collection(db, 'news'),
        orderBy('publishDate', 'desc'),
        limit(10)
      )
      const recentSnapshot = await getDocs(recentQuery)
      const recentNewsData = recentSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as RecentNews[]

      // Bu verileri normalde analytics koleksiyonundan alırdık
      // Şimdilik örnek veriler
      setStats({
        totalNews,
        totalViews: 125780,
        totalUsers: 8940,
        dailyViews: 2150,
        weeklyNews: 24,
        pendingNews,
        publishedToday: 5,
        totalCategories: 12
      })

      setRecentNews(recentNewsData)
    } catch (error) {
      console.error('Dashboard verileri yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Toplam Haber',
      value: stats.totalNews,
      icon: FileText,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      change: '+12',
      changeType: 'increase'
    },
    {
      title: 'Toplam Görüntülenme',
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      change: '+8.5%',
      changeType: 'increase'
    },
    {
      title: 'Aktif Kullanıcı',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      change: '+5.2%',
      changeType: 'increase'
    },
    {
      title: 'Günlük Görüntülenme',
      value: stats.dailyViews.toLocaleString(),
      icon: TrendingUp,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
      change: '-2.1%',
      changeType: 'decrease'
    },
    {
      title: 'Haftalık Yeni Haber',
      value: stats.weeklyNews,
      icon: Calendar,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-700',
      change: '+15',
      changeType: 'increase'
    },
    {
      title: 'Bekleyen Onay',
      value: stats.pendingNews,
      icon: Clock,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      change: '+3',
      changeType: 'increase'
    }
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
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Net Haberler yönetim paneline hoş geldiniz</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Globe className="h-4 w-4" />
            Son güncelleme: {new Date().toLocaleString('tr-TR')}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-6 w-6 ${card.textColor}`} />
              </div>
              <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                card.changeType === 'increase' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {card.changeType === 'increase' ? (
                  <ArrowUp className="h-3 w-3" />
                ) : (
                  <ArrowDown className="h-3 w-3" />
                )}
                {card.change}
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-gray-900">{card.value}</h3>
              <p className="text-sm text-gray-600 mt-1">{card.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent News & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent News */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Son Haberler
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentNews.slice(0, 5).map((news) => (
                <div key={news.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                      {news.title}
                    </h4>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span className="px-2 py-1 bg-gray-100 rounded">{news.category}</span>
                      <span>{news.publishDate?.toDate?.()?.toLocaleDateString('tr-TR')}</span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {news.views || 0}
                      </span>
                    </div>
                  </div>
                  <div className={`px-2 py-1 text-xs rounded-full ${
                    news.status === 'published' 
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {news.status === 'published' ? 'Yayında' : 'Bekliyor'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Hızlı İşlemler
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <FileText className="h-6 w-6 text-blue-500 mb-2" />
                <div className="text-sm font-medium text-gray-900">Yeni Haber</div>
                <div className="text-xs text-gray-500">Haber ekle</div>
              </button>
              
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <Clock className="h-6 w-6 text-orange-500 mb-2" />
                <div className="text-sm font-medium text-gray-900">Onay Bekleyen</div>
                <div className="text-xs text-gray-500">{stats.pendingNews} haber</div>
              </button>
              
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <BarChart3 className="h-6 w-6 text-green-500 mb-2" />
                <div className="text-sm font-medium text-gray-900">Raporlar</div>
                <div className="text-xs text-gray-500">Analitik görüntüle</div>
              </button>
              
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <Users className="h-6 w-6 text-purple-500 mb-2" />
                <div className="text-sm font-medium text-gray-900">Kullanıcılar</div>
                <div className="text-xs text-gray-500">Kullanıcı yönet</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Sistem Durumu</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="text-sm font-medium text-gray-900">Sunucu</div>
            <div className="text-xs text-green-600">Çevrimiçi</div>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="text-sm font-medium text-gray-900">Veritabanı</div>
            <div className="text-xs text-green-600">Aktif</div>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            </div>
            <div className="text-sm font-medium text-gray-900">Cache</div>
            <div className="text-xs text-yellow-600">Yavaş</div>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="text-sm font-medium text-gray-900">CDN</div>
            <div className="text-xs text-green-600">Optimal</div>
          </div>
        </div>
      </div>
    </div>
  )
}
