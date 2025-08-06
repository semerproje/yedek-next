'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { 
  Activity,
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  Heart,
  Share2,
  MessageSquare,
  Clock,
  Target,
  Zap,
  ChevronLeft,
  RefreshCw,
  Download,
  Settings,
  Filter,
  Calendar,
  Globe,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react'

interface SystemMetrics {
  totalNews: number
  publishedToday: number
  totalUsers: number
  activeUsers: number
  totalViews: number
  avgEngagement: number
  systemUptime: string
  responseTime: number
}

interface ContentMetrics {
  topPerformingNews: Array<{
    id: string
    title: string
    views: number
    likes: number
    shares: number
    comments: number
    publishDate: string
    category: string
  }>
  categoryPerformance: Array<{
    name: string
    newsCount: number
    totalViews: number
    avgEngagement: number
    trend: number
  }>
}

export default function SystemManagementDashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null)
  const [contentMetrics, setContentMetrics] = useState<ContentMetrics | null>(null)
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h')
  const router = useRouter()

  useEffect(() => {
    if (!auth) return
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
        loadSystemData()
      } else {
        router.push('/admin')
      }
    })

    return () => unsubscribe()
  }, [router])

  const loadSystemData = async () => {
    try {
      setLoading(true)
      
      // Mock system metrics
      const mockSystemMetrics: SystemMetrics = {
        totalNews: 15420,
        publishedToday: 87,
        totalUsers: 8934,
        activeUsers: 1247,
        totalViews: 2456789,
        avgEngagement: 4.2,
        systemUptime: '99.97%',
        responseTime: 125
      }

      const mockContentMetrics: ContentMetrics = {
        topPerformingNews: [
          {
            id: '1',
            title: 'AI Teknolojisinde Çığır Açan Gelişme',
            views: 25430,
            likes: 1240,
            shares: 567,
            comments: 89,
            publishDate: '2024-01-15',
            category: 'Teknoloji'
          },
          {
            id: '2',
            title: 'Ekonomide Beklenen Reform Paketi',
            views: 18920,
            likes: 890,
            shares: 445,
            comments: 67,
            publishDate: '2024-01-14',
            category: 'Ekonomi'
          },
          {
            id: '3',
            title: 'Spor Dünyasından Flaş Transfer',
            views: 15670,
            likes: 780,
            shares: 234,
            comments: 123,
            publishDate: '2024-01-13',
            category: 'Spor'
          }
        ],
        categoryPerformance: [
          { name: 'Gündem', newsCount: 1245, totalViews: 456789, avgEngagement: 4.8, trend: 12.5 },
          { name: 'Spor', newsCount: 987, totalViews: 345678, avgEngagement: 4.2, trend: 8.7 },
          { name: 'Teknoloji', newsCount: 654, totalViews: 234567, avgEngagement: 5.1, trend: 15.3 },
          { name: 'Ekonomi', newsCount: 543, totalViews: 189234, avgEngagement: 3.9, trend: -2.1 },
          { name: 'Sağlık', newsCount: 432, totalViews: 123456, avgEngagement: 4.6, trend: 6.8 }
        ]
      }

      setSystemMetrics(mockSystemMetrics)
      setContentMetrics(mockContentMetrics)
    } catch (error) {
      console.error('Sistem verileri yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin text-white mx-auto mb-4" />
          <p className="text-white text-lg">Sistem Yönetimi Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (!systemMetrics || !contentMetrics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600">Sistem verileri yüklenemedi.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Ultra Premium Header */}
      <header className="bg-white shadow-lg border-b border-slate-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
                <span className="text-sm font-medium">Dashboard'a Dön</span>
              </button>
              <div className="w-px h-6 bg-slate-300"></div>
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-green-600 to-blue-600 p-2 rounded-lg">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-800">Sistem Yönetimi</h1>
                  <p className="text-sm text-slate-500">Ultra Premium Sistem İzleme ve Yönetim Merkezi</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="1h">Son 1 Saat</option>
                <option value="24h">Son 24 Saat</option>
                <option value="7d">Son 7 Gün</option>
                <option value="30d">Son 30 Gün</option>
              </select>
              
              <button className="flex items-center space-x-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors">
                <Download className="h-4 w-4" />
                <span>Rapor İndir</span>
              </button>
              
              <button className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all">
                <Settings className="h-4 w-4" />
                <span>Sistem Ayarları</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* System Status Banner */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl text-white p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Sistem Durumu</h2>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm opacity-90">Tüm Sistemler Operasyonel</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold">{systemMetrics.systemUptime}</div>
              <div className="text-sm opacity-90">Sistem Uptime</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold">{systemMetrics.responseTime}ms</div>
              <div className="text-sm opacity-90">Ortalama Yanıt Süresi</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold">{formatNumber(systemMetrics.activeUsers)}</div>
              <div className="text-sm opacity-90">Aktif Kullanıcı</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold">{systemMetrics.publishedToday}</div>
              <div className="text-sm opacity-90">Bugün Yayınlanan</div>
            </div>
          </div>
        </div>

        {/* Key Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-slate-600">Toplam Haber</p>
                <p className="text-2xl font-bold text-slate-900">
                  {formatNumber(systemMetrics.totalNews)}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
            <div className="text-sm text-green-600">
              +{systemMetrics.publishedToday} bugün eklendi
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-slate-600">Toplam Görüntüleme</p>
                <p className="text-2xl font-bold text-slate-900">
                  {formatNumber(systemMetrics.totalViews)}
                </p>
              </div>
              <Eye className="h-8 w-8 text-green-600" />
            </div>
            <div className="text-sm text-green-600">
              +12.5% son hafta
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-slate-600">Toplam Kullanıcı</p>
                <p className="text-2xl font-bold text-slate-900">
                  {formatNumber(systemMetrics.totalUsers)}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <div className="text-sm text-green-600">
              +8.3% bu ay
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-slate-600">Ortalama Etkileşim</p>
                <p className="text-2xl font-bold text-slate-900">
                  {systemMetrics.avgEngagement}
                </p>
              </div>
              <Heart className="h-8 w-8 text-red-600" />
            </div>
            <div className="text-sm text-green-600">
              +0.3 son hafta
            </div>
          </div>
        </div>

        {/* Content Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Performing Content */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-800">En İyi Performans Gösteren İçerikler</h3>
              <TrendingUp className="h-5 w-5 text-slate-400" />
            </div>
            
            <div className="space-y-4">
              {contentMetrics.topPerformingNews.map((news, index) => (
                <div key={news.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-900 text-sm">{news.title}</h4>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-slate-500">
                        <span>{news.category}</span>
                        <span>{formatNumber(news.views)} görüntülenme</span>
                        <span>{news.publishDate}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="flex items-center space-x-1 text-slate-600">
                      <Eye className="h-3 w-3" />
                      <span>{formatNumber(news.views)}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-slate-600">
                      <Heart className="h-3 w-3" />
                      <span>{formatNumber(news.likes)}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-slate-600">
                      <Share2 className="h-3 w-3" />
                      <span>{formatNumber(news.shares)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Performance */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-800">Kategori Performansı</h3>
              <Target className="h-5 w-5 text-slate-400" />
            </div>
            
            <div className="space-y-4">
              {contentMetrics.categoryPerformance.map((category, index) => (
                <div key={category.name} className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-slate-900">{category.name}</h4>
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                      category.trend > 0 
                        ? 'bg-green-100 text-green-700' 
                        : category.trend < 0 
                        ? 'bg-red-100 text-red-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      <TrendingUp className={`w-3 h-3 ${category.trend < 0 ? 'rotate-180' : ''}`} />
                      <span>{Math.abs(category.trend)}%</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-lg font-bold text-slate-900">
                        {formatNumber(category.newsCount)}
                      </div>
                      <div className="text-slate-600">Haber Sayısı</div>
                    </div>
                    
                    <div>
                      <div className="text-lg font-bold text-slate-900">
                        {formatNumber(category.totalViews)}
                      </div>
                      <div className="text-slate-600">Toplam Görüntüleme</div>
                    </div>
                    
                    <div>
                      <div className="text-lg font-bold text-slate-900">
                        {category.avgEngagement}
                      </div>
                      <div className="text-slate-600">Ortalama Etkileşim</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Operations Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-800">Sistem İşlemleri</h3>
            <Zap className="h-5 w-5 text-slate-400" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="flex flex-col items-center space-y-2 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <RefreshCw className="h-6 w-6 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Cache Temizle</span>
            </button>
            
            <button className="flex flex-col items-center space-y-2 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <Download className="h-6 w-6 text-green-600" />
              <span className="text-sm font-medium text-green-700">Yedek Al</span>
            </button>
            
            <button className="flex flex-col items-center space-y-2 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <Settings className="h-6 w-6 text-purple-600" />
              <span className="text-sm font-medium text-purple-700">Ayarları Güncelle</span>
            </button>
            
            <button className="flex flex-col items-center space-y-2 p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
              <Activity className="h-6 w-6 text-orange-600" />
              <span className="text-sm font-medium text-orange-700">Sistem Taraması</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
