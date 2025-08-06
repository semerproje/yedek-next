'use client'

import { useState, useEffect } from 'react'
import { collection, query, orderBy, limit, where, onSnapshot, updateDoc, doc, deleteDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import SocialMediaManager from '@/lib/services/socialMediaManager'

interface NewsItem {
  id: string
  title: string
  summary?: string
  content?: string
  category: string
  tags?: string[]
  images?: any[]
  videos?: any[]
  breaking?: boolean
  urgent?: boolean
  publishedAt?: any
  socialMediaScheduled?: boolean
  score?: number
}

interface SocialPost {
  id: string
  platform: string
  content: string
  hashtags?: string[]
  scheduledFor: any
  status: string
  newsId?: string
}

interface Stats {
  totalPosts: number
  scheduledPosts: number
  successfulPosts: number
  failedPosts: number
}

interface PlatformConfig {
  name: string
  icon: string
  maxLength: number
  supportsImages: boolean
  supportsVideos: boolean
  hashtagSupport: boolean
  requiresImage?: boolean
  requiresVideo?: boolean
}

export default function SocialMediaDashboard() {
  const [scheduledPosts, setScheduledPosts] = useState<SocialPost[]>([])
  const [recentNews, setRecentNews] = useState<NewsItem[]>([])
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<NewsItem[]>([])
  const [autoScheduleEnabled, setAutoScheduleEnabled] = useState(false)
  const [autoScheduleSettings, setAutoScheduleSettings] = useState({
    platforms: ['facebook', 'twitter', 'instagram'],
    timeSlots: ['09:00', '12:00', '15:00', '18:00', '21:00'],
    maxPostsPerDay: 10,
    minTimeBetweenPosts: 30, // dakika
    onlyBreakingNews: false,
    categories: ['gundem', 'spor', 'ekonomi'],
    intervalMinutes: 60, // otomatik kontrol sıklığı
    smartScheduling: true // AI ile optimal zamanlama
  })
  const [nextAutoRun, setNextAutoRun] = useState<Date | null>(null)
  const [autoRunning, setAutoRunning] = useState(false)
  const [stats, setStats] = useState<Stats>({
    totalPosts: 0,
    scheduledPosts: 0,
    successfulPosts: 0,
    failedPosts: 0
  })

  const socialManager = new SocialMediaManager()

  useEffect(() => {
    // Zamanlanmış gönderileri dinle
    const postsQuery = query(
      collection(db, 'social_media_posts'),
      orderBy('scheduledFor', 'desc'),
      limit(50)
    )

    const unsubscribePosts = onSnapshot(postsQuery, (snapshot) => {
      const posts: SocialPost[] = []
      snapshot.forEach(doc => {
        posts.push({ id: doc.id, ...doc.data() } as SocialPost)
      })
      setScheduledPosts(posts)
      
      // İstatistikleri güncelle
      updateStats(posts)
    })

    // Son haberleri getir
    const newsQuery = query(
      collection(db, 'news'),
      orderBy('publishedAt', 'desc'),
      limit(20)
    )

    const unsubscribeNews = onSnapshot(newsQuery, (snapshot) => {
      const news: NewsItem[] = []
      snapshot.forEach(doc => {
        news.push({ id: doc.id, ...doc.data() } as NewsItem)
      })
      setRecentNews(news)
    })

    // Günlük önerileri getir
    loadDailySuggestions()

    return () => {
      unsubscribePosts()
      unsubscribeNews()
    }
  }, [])

  // Otomatik zamanlama interval'ı
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null
    
    if (autoScheduleEnabled) {
      const runAutoSchedule = async () => {
        if (autoRunning) return // Zaten çalışıyorsa skip
        
        setAutoRunning(true)
        try {
          await handleAutoSchedule()
          console.log('✅ Otomatik zamanlama tamamlandı')
        } catch (error) {
          console.error('❌ Otomatik zamanlama hatası:', error)
        } finally {
          setAutoRunning(false)
          // Bir sonraki çalışma zamanını hesapla
          const nextRun = new Date()
          nextRun.setMinutes(nextRun.getMinutes() + autoScheduleSettings.intervalMinutes)
          setNextAutoRun(nextRun)
        }
      }
      
      // İlk çalıştırma
      runAutoSchedule()
      
      // Periyodik çalıştırma
      intervalId = setInterval(runAutoSchedule, autoScheduleSettings.intervalMinutes * 60 * 1000)
      
      // İlk sonraki çalışma zamanını ayarla
      const nextRun = new Date()
      nextRun.setMinutes(nextRun.getMinutes() + autoScheduleSettings.intervalMinutes)
      setNextAutoRun(nextRun)
    } else {
      setNextAutoRun(null)
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [autoScheduleEnabled, autoScheduleSettings.intervalMinutes])

  const updateStats = (posts: SocialPost[]) => {
    const stats = {
      totalPosts: posts.length,
      scheduledPosts: posts.filter((p: SocialPost) => p.status === 'scheduled').length,
      successfulPosts: posts.filter((p: SocialPost) => p.status === 'posted').length,
      failedPosts: posts.filter((p: SocialPost) => p.status === 'failed').length
    }
    setStats(stats)
  }

  const loadDailySuggestions = async () => {
    try {
      const suggestions = await socialManager.suggestDailyPosts(10)
      setSuggestions(suggestions)
    } catch (error) {
      console.error('Suggestions load error:', error)
    }
  }

  const handleScheduleNews = async (news: NewsItem, platforms: string[]) => {
    setLoading(true)
    try {
      const results = await socialManager.scheduleNewsToAllPlatforms(news, platforms)
      
      const successCount = results.filter(r => r.success).length
      if (successCount > 0) {
        alert(`✅ ${successCount} platform için başarıyla zamanlandı!`)
      } else {
        alert('❌ Hiçbir platform için zamanlanamadı')
      }
      
    } catch (error: any) {
      console.error('Schedule error:', error)
      alert('❌ Zamanlama hatası: ' + error.message)
    }
    setLoading(false)
  }

  const handleUpdatePostStatus = async (postId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'social_media_posts', postId), {
        status: newStatus,
        updatedAt: new Date()
      })
    } catch (error) {
      console.error('Update error:', error)
    }
  }

  const handleDeletePost = async (postId: string) => {
    if (confirm('Bu gönderiyi silmek istediğinizden emin misiniz?')) {
      try {
        await deleteDoc(doc(db, 'social_media_posts', postId))
      } catch (error) {
        console.error('Delete error:', error)
      }
    }
  }

  const handleAutoSchedule = async () => {
    setLoading(true)
    try {
      // Son haberleri filtrele
      const eligibleNews = recentNews.filter(news => {
        // Kategori kontrolü
        if (!autoScheduleSettings.categories.includes(news.category)) return false
        
        // Breaking news kontrolü
        if (autoScheduleSettings.onlyBreakingNews && !news.breaking) return false
        
        // Zaten zamanlanmış mı kontrol et
        if (news.socialMediaScheduled) return false
        
        return true
      }).slice(0, autoScheduleSettings.maxPostsPerDay)

      let scheduledCount = 0
      const results = []

      for (const news of eligibleNews) {
        const result = await socialManager.scheduleNewsToAllPlatforms(
          news, 
          autoScheduleSettings.platforms,
          {
            timeSlots: autoScheduleSettings.timeSlots,
            minTimeBetweenPosts: autoScheduleSettings.minTimeBetweenPosts
          }
        )
        results.push(result)
        scheduledCount += result.filter((r: any) => r.success).length
      }

      alert(`✅ ${scheduledCount} gönderi otomatik olarak zamanlandı!`)
      
    } catch (error: any) {
      console.error('Auto schedule error:', error)
      alert('❌ Otomatik zamanlama hatası: ' + error.message)
    }
    setLoading(false)
  }

  const handleBulkSchedule = async () => {
    setLoading(true)
    try {
      // Günlük önerilerin tamamını zamanla
      const results = []
      
      for (const news of suggestions.slice(0, 5)) {
        const result = await socialManager.scheduleNewsToAllPlatforms(
          news, 
          ['facebook', 'twitter', 'instagram']
        )
        results.push(result)
      }
      
      const totalScheduled = results.flat().filter(r => r.success).length
      alert(`✅ ${totalScheduled} gönderi toplu olarak zamanlandı!`)
      
    } catch (error: any) {
      console.error('Bulk schedule error:', error)
      alert('❌ Toplu zamanlama hatası: ' + error.message)
    }
    setLoading(false)
  }

  const formatDate = (date: any) => {
    if (!date) return '-'
    const d = date.toDate ? date.toDate() : new Date(date)
    return d.toLocaleString('tr-TR')
  }

  const getPlatformIcon = (platform: string) => {
    const icons: Record<string, string> = {
      facebook: '📘',
      instagram: '📸',
      twitter: '🐦',
      linkedin: '💼',
      youtube: '📺'
    }
    return icons[platform] || '📱'
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      scheduled: 'bg-blue-100 text-blue-800',
      posted: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      scheduled: 'Zamanlandı',
      posted: 'Paylaşıldı',
      failed: 'Başarısız'
    }
    return texts[status] || status
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          📱 Sosyal Medya Yönetimi
        </h1>
        <p className="text-gray-600">
          Haberleri sosyal medya platformlarında zamanlayın ve yönetin
        </p>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <span className="text-2xl">📊</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Toplam Gönderi</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPosts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <span className="text-2xl">⏰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Zamanlanmış</p>
              <p className="text-2xl font-bold text-gray-900">{stats.scheduledPosts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Başarılı</p>
              <p className="text-2xl font-bold text-gray-900">{stats.successfulPosts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-full">
              <span className="text-2xl">❌</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Başarısız</p>
              <p className="text-2xl font-bold text-gray-900">{stats.failedPosts}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Otomatik Zamanlama Ayarları */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              🤖 Otomatik Zamanlama
            </h2>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={autoScheduleEnabled}
                onChange={(e) => setAutoScheduleEnabled(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm font-medium">Aktif</span>
            </label>
          </div>

          <div className="space-y-4">
            {/* Otomatik Çalışma Durumu */}
            {autoScheduleEnabled && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center text-green-800">
                  <span className="animate-pulse text-xl mr-2">🟢</span>
                  <div>
                    <div className="font-medium">Otomatik Sistem Aktif</div>
                    <div className="text-sm">
                      {autoRunning ? (
                        <span className="text-orange-600">⏳ Şu anda çalışıyor...</span>
                      ) : nextAutoRun ? (
                        <span>⏰ Sonraki çalışma: {nextAutoRun.toLocaleTimeString('tr-TR')}</span>
                      ) : (
                        <span>🚀 Hazır</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Platformlar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Otomatik Platformlar
              </label>
              <div className="space-y-2">
                {Object.entries(socialManager.platforms).map(([key, platform]) => (
                  <label key={key} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={autoScheduleSettings.platforms.includes(key)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setAutoScheduleSettings(prev => ({
                            ...prev,
                            platforms: [...prev.platforms, key]
                          }))
                        } else {
                          setAutoScheduleSettings(prev => ({
                            ...prev,
                            platforms: prev.platforms.filter(p => p !== key)
                          }))
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="text-xl mr-2">{platform.icon}</span>
                    <span className="text-sm">{platform.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Kategoriler */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Otomatik Kategoriler
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['gundem', 'spor', 'ekonomi', 'teknoloji', 'saglik', 'politika'].map(category => (
                  <label key={category} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={autoScheduleSettings.categories.includes(category)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setAutoScheduleSettings(prev => ({
                            ...prev,
                            categories: [...prev.categories, category]
                          }))
                        } else {
                          setAutoScheduleSettings(prev => ({
                            ...prev,
                            categories: prev.categories.filter(c => c !== category)
                          }))
                        }
                      }}
                      className="mr-1"
                    />
                    <span className="text-xs capitalize">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Zaman Dilimleri */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paylaşım Saatleri
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['06:00', '09:00', '12:00', '15:00', '18:00', '21:00'].map(time => (
                  <label key={time} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={autoScheduleSettings.timeSlots.includes(time)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setAutoScheduleSettings(prev => ({
                            ...prev,
                            timeSlots: [...prev.timeSlots, time]
                          }))
                        } else {
                          setAutoScheduleSettings(prev => ({
                            ...prev,
                            timeSlots: prev.timeSlots.filter(t => t !== time)
                          }))
                        }
                      }}
                      className="mr-1"
                    />
                    <span className="text-xs">{time}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Ayarlar */}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Günlük Max Gönderi: {autoScheduleSettings.maxPostsPerDay}
                </label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={autoScheduleSettings.maxPostsPerDay}
                  onChange={(e) => setAutoScheduleSettings(prev => ({
                    ...prev,
                    maxPostsPerDay: parseInt(e.target.value)
                  }))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gönderiler Arası Süre: {autoScheduleSettings.minTimeBetweenPosts} dk
                </label>
                <input
                  type="range"
                  min="15"
                  max="120"
                  step="15"
                  value={autoScheduleSettings.minTimeBetweenPosts}
                  onChange={(e) => setAutoScheduleSettings(prev => ({
                    ...prev,
                    minTimeBetweenPosts: parseInt(e.target.value)
                  }))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Otomatik Kontrol Sıklığı: {autoScheduleSettings.intervalMinutes} dk
                </label>
                <input
                  type="range"
                  min="30"
                  max="360"
                  step="30"
                  value={autoScheduleSettings.intervalMinutes}
                  onChange={(e) => setAutoScheduleSettings(prev => ({
                    ...prev,
                    intervalMinutes: parseInt(e.target.value)
                  }))}
                  className="w-full"
                />
              </div>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={autoScheduleSettings.onlyBreakingNews}
                  onChange={(e) => setAutoScheduleSettings(prev => ({
                    ...prev,
                    onlyBreakingNews: e.target.checked
                  }))}
                  className="mr-2"
                />
                <span className="text-sm">Sadece Flaş Haberler</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={autoScheduleSettings.smartScheduling}
                  onChange={(e) => setAutoScheduleSettings(prev => ({
                    ...prev,
                    smartScheduling: e.target.checked
                  }))}
                  className="mr-2"
                />
                <span className="text-sm">Akıllı Zamanlama (AI)</span>
              </label>
            </div>

            {/* Kontrol Butonları */}
            <div className="space-y-2 pt-4 border-t">
              <button
                onClick={handleAutoSchedule}
                disabled={loading || autoRunning}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {loading || autoRunning ? '⏳ Çalışıyor...' : '🚀 Şimdi Zamanla'}
              </button>
              
              <button
                onClick={handleBulkSchedule}
                disabled={loading || autoRunning}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                📅 Önerileri Toplu Zamanla
              </button>
            </div>
          </div>
        </div>

        {/* Günlük Öneriler */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              🎯 Günlük Öneriler
            </h2>
            <button
              onClick={loadDailySuggestions}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              🔄 Yenile
            </button>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {suggestions.map((news) => (
              <div
                key={news.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedNews(news)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {news.breaking && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
                          🚨 FLAŞ
                        </span>
                      )}
                      {news.urgent && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded">
                          ⚡ ACİL
                        </span>
                      )}
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded">
                        {news.category}
                      </span>
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1">
                      {news.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {news.summary}
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
                      <span>Viral Skor: {news.score || 0}</span>
                      <span className="mx-2">•</span>
                      <span>{formatDate(news.publishedAt)}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedNews(news)
                    }}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                  >
                    Zamanla
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Son Haberler */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            📰 Son Haberler
          </h2>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {recentNews.map((news) => (
              <div
                key={news.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedNews(news)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded">
                        {news.category}
                      </span>
                      {news.socialMediaScheduled && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                          ✅ Zamanlandı
                        </span>
                      )}
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1">
                      {news.title}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {formatDate(news.publishedAt)}
                    </p>
                  </div>
                  {!news.socialMediaScheduled && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedNews(news)
                      }}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                    >
                      Zamanla
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Zamanlanmış Gönderiler */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          ⏰ Zamanlanmış Gönderiler
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Platform
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İçerik
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Zamanlama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {scheduledPosts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-2xl mr-2">
                        {getPlatformIcon(post.platform)}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {(socialManager.platforms as any)[post.platform]?.name || post.platform}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {post.content}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {post.hashtags?.slice(0, 3).map(tag => `#${tag}`).join(' ')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(post.scheduledFor)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(post.status)}`}>
                      {getStatusText(post.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {post.status === 'scheduled' && (
                        <button
                          onClick={() => handleUpdatePostStatus(post.id, 'posted')}
                          className="text-green-600 hover:text-green-900"
                          title="Paylaşıldı olarak işaretle"
                        >
                          ✅
                        </button>
                      )}
                      <button
                        onClick={() => handleDeletePost(post.id)}
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
      </div>

      {/* Platform Seçim Modal */}
      {selectedNews && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                📱 Platform Seçimi
              </h3>
              <button
                onClick={() => setSelectedNews(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Haber Önizleme */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                {selectedNews.breaking && (
                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
                    🚨 FLAŞ
                  </span>
                )}
                <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded">
                  {selectedNews.category}
                </span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">
                {selectedNews.title}
              </h4>
              <p className="text-sm text-gray-600">
                {selectedNews.summary}
              </p>
            </div>

            {/* Platform Seçenekleri */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Platformları Seçin:</h4>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(socialManager.platforms).map(([key, platform]) => {
                  const platformConfig = platform as any
                  const isDisabled = 
                    (platformConfig.requiresImage && (!selectedNews.images || selectedNews.images.length === 0)) ||
                    (platformConfig.requiresVideo && (!selectedNews.videos || selectedNews.videos.length === 0))
                  
                  return (
                    <label
                      key={key}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                        isDisabled ? 'bg-gray-100 opacity-50' : 'hover:bg-gray-50'
                      } ${
                        selectedPlatforms.includes(key) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedPlatforms.includes(key)}
                        disabled={isDisabled}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPlatforms([...selectedPlatforms, key])
                          } else {
                            setSelectedPlatforms(selectedPlatforms.filter(p => p !== key))
                          }
                        }}
                        className="mr-3"
                      />
                      <span className="text-xl mr-2">{platform.icon}</span>
                      <div>
                        <div className="font-medium">{platform.name}</div>
                        <div className="text-xs text-gray-500">
                          Max {platform.maxLength} karakter
                        </div>
                        {isDisabled && (
                          <div className="text-xs text-red-500">
                            {platformConfig.requiresImage && 'Görsel gerekli'}
                            {platformConfig.requiresVideo && 'Video gerekli'}
                          </div>
                        )}
                      </div>
                    </label>
                  )
                })}
              </div>
            </div>

            {/* İşlem Butonları */}
            <div className="flex space-x-3">
              <button
                onClick={() => setSelectedNews(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={() => {
                  if (selectedPlatforms.length > 0) {
                    handleScheduleNews(selectedNews, selectedPlatforms)
                    setSelectedNews(null)
                    setSelectedPlatforms([])
                  }
                }}
                disabled={selectedPlatforms.length === 0 || loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? '⏳ Zamanlanıyor...' : `📅 Zamanla (${selectedPlatforms.length})`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
