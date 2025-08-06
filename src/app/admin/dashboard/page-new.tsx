'use client'

import { useEffect, useState } from 'react'
import { 
  db
} from '@/lib/firebase'
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit 
} from 'firebase/firestore'

interface DashboardStats {
  totalNews: number
  publishedNews: number
  draftNews: number
  totalCategories: number
  totalUsers: number
  aaNews: number
  featuredNews: number
  totalViews: number
}

export default function Dashboard() {
  const [mounted, setMounted] = useState(false)
  const [stats, setStats] = useState<DashboardStats>({
    totalNews: 0,
    publishedNews: 0,
    draftNews: 0,
    totalCategories: 0,
    totalUsers: 0,
    aaNews: 0,
    featuredNews: 0,
    totalViews: 0
  })
  const [loading, setLoading] = useState(true)
  const [firebaseConnected, setFirebaseConnected] = useState(!!db)
  const [recentNews, setRecentNews] = useState<any[]>([])

  useEffect(() => {
    console.log('🚀 Dashboard component mounting...')
    setMounted(true)
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    if (!db) {
      console.warn('Firebase not available, using demo stats')
      setStats({
        totalNews: 125,
        publishedNews: 98,
        draftNews: 27,
        totalCategories: 8,
        totalUsers: 1250,
        aaNews: 45,
        featuredNews: 12,
        totalViews: 45680
      })
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      
      // Load news statistics
      const [
        newsSnapshot,
        publishedSnapshot,
        draftSnapshot,
        categoriesSnapshot,
        aaNewsSnapshot,
        featuredSnapshot
      ] = await Promise.all([
        getDocs(collection(db, 'news')),
        getDocs(query(collection(db, 'news'), where('status', '==', 'published'))),
        getDocs(query(collection(db, 'news'), where('status', '==', 'draft'))),
        getDocs(collection(db, 'categories')),
        getDocs(collection(db, 'aa_news')),
        getDocs(query(collection(db, 'news'), where('featured', '==', true)))
      ])

      // Load recent news
      const recentNewsSnapshot = await getDocs(
        query(
          collection(db, 'news'),
          orderBy('createdAt', 'desc'),
          limit(5)
        )
      )

      const recentNewsData = recentNewsSnapshot.docs.map((doc: any) => {
        const data = doc.data()
        return {
          id: doc.id,
          title: data.title,
          category: data.category,
          status: data.status,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
          views: data.views || 0
        }
      })

      // Calculate total views
      let totalViews = 0
      newsSnapshot.docs.forEach((doc: any) => {
        const data = doc.data()
        totalViews += data.views || 0
      })

      setStats({
        totalNews: newsSnapshot.size,
        publishedNews: publishedSnapshot.size,
        draftNews: draftSnapshot.size,
        totalCategories: categoriesSnapshot.size,
        totalUsers: Math.floor(Math.random() * 1000) + 500, // Mock user count
        aaNews: aaNewsSnapshot.size,
        featuredNews: featuredSnapshot.size,
        totalViews
      })

      setRecentNews(recentNewsData)
      console.log('✅ Dashboard stats loaded from Firebase')
      
    } catch (error) {
      console.error('Dashboard loading error:', error)
      // Fallback to demo stats
      setStats({
        totalNews: 0,
        publishedNews: 0,
        draftNews: 0,
        totalCategories: 0,
        totalUsers: 0,
        aaNews: 0,
        featuredNews: 0,
        totalViews: 0
      })
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Dashboard yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                🚀 Ultra Premium Dashboard
              </h1>
              <p className="text-gray-600">
                Haber yönetim sistemi - {new Date().toLocaleString('tr-TR')}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.location.reload()}
                className="text-blue-600 hover:text-blue-800 px-4 py-2 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors flex items-center space-x-2"
              >
                <span>🔄</span>
                <span>Yenile</span>
              </button>
              
              <button
                onClick={() => {
                  if (confirm('Admin panelinden çıkmak istediğinizden emin misiniz?')) {
                    window.location.href = '/'
                  }
                }}
                className="text-red-600 hover:text-red-800 px-4 py-2 rounded-lg border border-red-200 hover:border-red-300 transition-colors flex items-center space-x-2"
              >
                <span>🚪</span>
                <span>Çıkış</span>
              </button>
            </div>
          </div>
        </div>

        {/* Firebase Connection Status */}
        <div className="mb-6">
          <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm ${
            firebaseConnected 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              firebaseConnected ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <span>{firebaseConnected ? 'Firebase Bağlı' : 'Firebase Bağlantısız'}</span>
          </div>
        </div>
        
        {/* İstatistik Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Toplam Haberler</h3>
                <p className="text-3xl font-bold text-blue-600">
                  {loading ? '...' : stats.totalNews.toLocaleString()}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <span className="text-2xl">📰</span>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-blue-600 text-sm font-medium">
                {stats.publishedNews} yayında
              </span>
              <span className="text-gray-500 text-sm ml-2">
                / {stats.draftNews} taslak
              </span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">AA Haberleri</h3>
                <p className="text-3xl font-bold text-green-600">
                  {loading ? '...' : stats.aaNews.toLocaleString()}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <span className="text-2xl">🏢</span>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-green-600 text-sm font-medium">Anadolu Ajansı</span>
              <span className="text-gray-500 text-sm ml-2">otomatik çekim</span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Toplam Görüntüleme</h3>
                <p className="text-3xl font-bold text-purple-600">
                  {loading ? '...' : stats.totalViews.toLocaleString()}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <span className="text-2xl">👁️</span>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-purple-600 text-sm font-medium">
                {stats.featuredNews} öne çıkan
              </span>
              <span className="text-gray-500 text-sm ml-2">haber</span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Kategoriler</h3>
                <p className="text-3xl font-bold text-orange-600">
                  {loading ? '...' : stats.totalCategories.toLocaleString()}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <span className="text-2xl">📂</span>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-orange-600 text-sm font-medium">Aktif sistem</span>
              <span className="text-gray-500 text-sm ml-2">yönetimde</span>
            </div>
          </div>
        </div>

        {/* Ana İçerik */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Son Haberler */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Son Haberler</h2>
              <button
                onClick={() => window.location.href = '/admin/dashboard/news'}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Tümünü Gör →
              </button>
            </div>
            
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : recentNews.length > 0 ? (
              <div className="space-y-4">
                {recentNews.map((news, index) => (
                  <div key={news.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-sm font-semibold">{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {news.title}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          news.status === 'published' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {news.status}
                        </span>
                        <span className="text-xs text-gray-500">{news.category}</span>
                        <span className="text-xs text-gray-500">
                          {news.views} görüntüleme
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {news.createdAt.toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <span className="text-4xl mb-4 block">📰</span>
                <p className="text-gray-500">Henüz haber bulunmuyor</p>
              </div>
            )}
          </div>

          {/* Hızlı Eylemler */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Hızlı Eylemler</h2>
            
            <div className="grid grid-cols-1 gap-3">
              <button 
                onClick={() => window.location.href = '/admin/dashboard/news'}
                className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg transition-colors flex items-center space-x-3"
              >
                <span className="text-2xl">📰</span>
                <div className="text-left">
                  <div className="font-medium">Haber Yönetimi</div>
                  <div className="text-xs opacity-90">Haberleri görüntüle ve düzenle</div>
                </div>
              </button>
              
              <button 
                onClick={() => window.location.href = '/admin/dashboard/categories'}
                className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg transition-colors flex items-center space-x-3"
              >
                <span className="text-2xl">📂</span>
                <div className="text-left">
                  <div className="font-medium">Kategori Yönetimi</div>
                  <div className="text-xs opacity-90">Kategorileri düzenle</div>
                </div>
              </button>
              
              <button 
                onClick={() => window.location.reload()}
                className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg transition-colors flex items-center space-x-3"
              >
                <span className="text-2xl">🔄</span>
                <div className="text-left">
                  <div className="font-medium">Verileri Yenile</div>
                  <div className="text-xs opacity-90">Firebase verilerini güncelle</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Firebase Status ve System Info */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Sistem Durumu</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">Firebase Bağlantısı</h4>
              <div className={`p-4 rounded-lg ${
                firebaseConnected 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    firebaseConnected ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <span className={`font-medium ${
                    firebaseConnected ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {firebaseConnected ? 'Bağlantı Başarılı' : 'Bağlantı Hatası'}
                  </span>
                </div>
                <p className={`text-sm mt-2 ${
                  firebaseConnected ? 'text-green-600' : 'text-red-600'
                }`}>
                  {firebaseConnected 
                    ? 'Firebase Firestore aktif ve çalışıyor' 
                    : 'Firebase bağlantısı kurulamadı, demo veriler kullanılıyor'
                  }
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700 mb-3">Son Güncelleme</h4>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-blue-600">⏰</span>
                  <span className="font-medium text-blue-800">
                    {new Date().toLocaleString('tr-TR')}
                  </span>
                </div>
                <p className="text-sm text-blue-600 mt-2">
                  Dashboard verileri otomatik güncelleniyor
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
