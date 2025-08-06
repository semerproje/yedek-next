'use client'

import { useEffect, useState } from 'react'
import { 
  collection, 
  query, 
  getDocs, 
  orderBy,
  where,
  Timestamp
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { 
  BarChart3, 
  TrendingUp, 
  Eye, 
  Users, 
  Clock,
  Globe,
  Smartphone,
  Monitor,
  ArrowUp,
  ArrowDown,
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react'

interface AnalyticsData {
  pageViews: {
    total: number
    today: number
    yesterday: number
    change: number
  }
  uniqueVisitors: {
    total: number
    today: number
    yesterday: number
    change: number
  }
  popularContent: Array<{
    title: string
    views: number
    category: string
    url: string
  }>
  deviceStats: {
    mobile: number
    desktop: number
    tablet: number
  }
  trafficSources: {
    direct: number
    search: number
    social: number
    referral: number
  }
  topCategories: Array<{
    name: string
    views: number
    percentage: number
  }>
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    pageViews: { total: 0, today: 0, yesterday: 0, change: 0 },
    uniqueVisitors: { total: 0, today: 0, yesterday: 0, change: 0 },
    popularContent: [],
    deviceStats: { mobile: 0, desktop: 0, tablet: 0 },
    trafficSources: { direct: 0, search: 0, social: 0, referral: 0 },
    topCategories: []
  })
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('7d')

  useEffect(() => {
    loadAnalytics()
  }, [timeRange])

  const loadAnalytics = async () => {
    if (!db) return

    try {
      // Bu veriler normalde bir analytics servisinden gelir
      // Şimdilik örnek veriler
      const mockData: AnalyticsData = {
        pageViews: {
          total: 125780,
          today: 2150,
          yesterday: 1980,
          change: 8.6
        },
        uniqueVisitors: {
          total: 45230,
          today: 890,
          yesterday: 920,
          change: -3.3
        },
        popularContent: [
          {
            title: "Türkiye'de Ekonomik Gelişmeler",
            views: 15420,
            category: "Ekonomi",
            url: "/haber/turkiye-ekonomik-gelismeler"
          },
          {
            title: "Spor Dünyasından Son Haberler",
            views: 12350,
            category: "Spor",
            url: "/haber/spor-dunyasi-son-haberler"
          },
          {
            title: "Teknoloji Sektöründe Yenilikler",
            views: 10890,
            category: "Teknoloji",
            url: "/haber/teknoloji-yenilikler"
          },
          {
            title: "Sağlık Alanında Önemli Gelişmeler",
            views: 9560,
            category: "Sağlık",
            url: "/haber/saglik-gelismeler"
          },
          {
            title: "Eğitim Reformları Üzerine",
            views: 8740,
            category: "Eğitim",
            url: "/haber/egitim-reformlari"
          }
        ],
        deviceStats: {
          mobile: 68,
          desktop: 28,
          tablet: 4
        },
        trafficSources: {
          direct: 42,
          search: 35,
          social: 15,
          referral: 8
        },
        topCategories: [
          { name: "Gündem", views: 35420, percentage: 28 },
          { name: "Spor", views: 28350, percentage: 23 },
          { name: "Ekonomi", views: 22100, percentage: 18 },
          { name: "Teknoloji", views: 18750, percentage: 15 },
          { name: "Sağlık", views: 12850, percentage: 10 },
          { name: "Eğitim", views: 7530, percentage: 6 }
        ]
      }

      setAnalytics(mockData)
    } catch (error) {
      console.error('Analytics verileri yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  const timeRanges = [
    { value: '1d', label: 'Son 24 Saat' },
    { value: '7d', label: 'Son 7 Gün' },
    { value: '30d', label: 'Son 30 Gün' },
    { value: '90d', label: 'Son 3 Ay' }
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
              <BarChart3 className="h-6 w-6" />
              Analitik & Raporlar
            </h1>
            <p className="text-gray-600 mt-1">Site performansı ve ziyaretçi analizi</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              {timeRanges.map(range => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
            <button
              onClick={loadAnalytics}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              title="Yenile"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
            <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2">
              <Download className="h-4 w-4" />
              Rapor İndir
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Eye className="h-6 w-6 text-blue-600" />
            </div>
            <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
              analytics.pageViews.change >= 0 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {analytics.pageViews.change >= 0 ? (
                <ArrowUp className="h-3 w-3" />
              ) : (
                <ArrowDown className="h-3 w-3" />
              )}
              {Math.abs(analytics.pageViews.change)}%
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-gray-900">
              {analytics.pageViews.total.toLocaleString()}
            </h3>
            <p className="text-sm text-gray-600 mt-1">Toplam Sayfa Görüntüleme</p>
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
              <span>Bugün: {analytics.pageViews.today.toLocaleString()}</span>
              <span>•</span>
              <span>Dün: {analytics.pageViews.yesterday.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
              analytics.uniqueVisitors.change >= 0 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {analytics.uniqueVisitors.change >= 0 ? (
                <ArrowUp className="h-3 w-3" />
              ) : (
                <ArrowDown className="h-3 w-3" />
              )}
              {Math.abs(analytics.uniqueVisitors.change)}%
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-gray-900">
              {analytics.uniqueVisitors.total.toLocaleString()}
            </h3>
            <p className="text-sm text-gray-600 mt-1">Tekil Ziyaretçi</p>
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
              <span>Bugün: {analytics.uniqueVisitors.today.toLocaleString()}</span>
              <span>•</span>
              <span>Dün: {analytics.uniqueVisitors.yesterday.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
              +12%
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-gray-900">3:42</h3>
            <p className="text-sm text-gray-600 mt-1">Ortalama Oturum Süresi</p>
            <div className="text-xs text-gray-500 mt-2">
              Sayfa başına: 2:15
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-orange-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
              +5.2%
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-gray-900">65.8%</h3>
            <p className="text-sm text-gray-600 mt-1">Tekrar Ziyaret Oranı</p>
            <div className="text-xs text-gray-500 mt-2">
              Yeni ziyaretçi: 34.2%
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Stats */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Cihaz Dağılımı
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-medium">Mobil</span>
                </div>
                <span className="text-sm font-bold">{analytics.deviceStats.mobile}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${analytics.deviceStats.mobile}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Monitor className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">Masaüstü</span>
                </div>
                <span className="text-sm font-bold">{analytics.deviceStats.desktop}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${analytics.deviceStats.desktop}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-purple-500" />
                  <span className="text-sm font-medium">Tablet</span>
                </div>
                <span className="text-sm font-bold">{analytics.deviceStats.tablet}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full" 
                  style={{ width: `${analytics.deviceStats.tablet}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Trafik Kaynakları</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Doğrudan</span>
                <span className="text-sm font-bold">{analytics.trafficSources.direct}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${analytics.trafficSources.direct}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Arama Motorları</span>
                <span className="text-sm font-bold">{analytics.trafficSources.search}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${analytics.trafficSources.search}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Sosyal Medya</span>
                <span className="text-sm font-bold">{analytics.trafficSources.social}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full" 
                  style={{ width: `${analytics.trafficSources.social}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Referans</span>
                <span className="text-sm font-bold">{analytics.trafficSources.referral}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full" 
                  style={{ width: `${analytics.trafficSources.referral}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">En Popüler İçerikler</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {analytics.popularContent.map((content, index) => (
                <div key={index} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg">
                  <div className="text-sm font-bold text-gray-400 w-6">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                      {content.title}
                    </h4>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span className="px-2 py-1 bg-gray-100 rounded">{content.category}</span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {content.views.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Kategori Performansı</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {analytics.topCategories.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{category.name}</span>
                      <span className="text-sm font-bold text-gray-600">
                        {category.views.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full" 
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Stats */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Gerçek Zamanlı İstatistikler</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">127</div>
              <div className="text-sm text-gray-600">Şu an aktif kullanıcı</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">1,245</div>
              <div className="text-sm text-gray-600">Son saatteki görüntülenme</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">89</div>
              <div className="text-sm text-gray-600">Yeni ziyaretçi (son saat)</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">12</div>
              <div className="text-sm text-gray-600">Aktif yazar</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
