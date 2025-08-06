'use client'

import { useState, useEffect } from 'react'
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  getDocs, 
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  where,
  Timestamp
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { 
  Settings,
  Globe,
  Mail,
  Shield,
  Palette,
  Database,
  Zap,
  Bell,
  Lock,
  Eye,
  Monitor,
  Smartphone,
  Search,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
  ExternalLink,
  Code,
  ImageIcon,
  FileText,
  User
} from 'lucide-react'

interface SiteSettings {
  general: {
    siteName: string
    siteDescription: string
    siteUrl: string
    logoUrl?: string
    faviconUrl?: string
    language: string
    timezone: string
    dateFormat: string
    enableComments: boolean
    enableRatings: boolean
    maintenanceMode: boolean
    [key: string]: any
  }
  seo: {
    metaTitle: string
    metaDescription: string
    metaKeywords: string[]
    googleAnalyticsId?: string
    googleSearchConsoleId?: string
    facebookPixelId?: string
    enableSitemap: boolean
    enableRobotsTxt: boolean
    enableOpenGraph: boolean
    enableTwitterCards: boolean
    [key: string]: any
  }
  social: {
    facebook?: string
    twitter?: string
    instagram?: string
    youtube?: string
    linkedin?: string
    tiktok?: string
    [key: string]: any
  }
  content: {
    articlesPerPage: number
    enableAutoSave: boolean
    enableRevisions: boolean
    maxRevisions: number
    allowedFileTypes: string[]
    maxFileSize: number
    enableImageOptimization: boolean
    imageQuality: number
    [key: string]: any
  }
  email: {
    fromName: string
    fromEmail: string
    smtpHost?: string
    smtpPort?: number
    smtpUser?: string
    smtpPassword?: string
    enableEmailVerification: boolean
    enableNewsletterSignup: boolean
    [key: string]: any
  }
  security: {
    enableTwoFactor: boolean
    sessionTimeout: number
    maxLoginAttempts: number
    enableCaptcha: boolean
    allowedDomains: string[]
    bannedIPs: string[]
    [key: string]: any
  }
  performance: {
    enableCaching: boolean
    cacheExpiration: number
    enableImageLazyLoading: boolean
    enableGzipCompression: boolean
    enableMinification: boolean
    cdnUrl?: string
    [key: string]: any
  }
  notifications: {
    enableEmailNotifications: boolean
    enablePushNotifications: boolean
    notifyOnNewComment: boolean
    notifyOnNewUser: boolean
    notifyOnSystemUpdate: boolean
    adminEmails: string[]
    [key: string]: any
  }
}

const defaultSettings: SiteSettings = {
  general: {
    siteName: 'Net Haberler',
    siteDescription: 'Güncel haberler ve son dakika gelişmeleri',
    siteUrl: 'https://nethaberler.com',
    language: 'tr',
    timezone: 'Europe/Istanbul',
    dateFormat: 'DD/MM/YYYY',
    enableComments: true,
    enableRatings: true,
    maintenanceMode: false
  },
  seo: {
    metaTitle: 'Net Haberler - Güncel Haberler ve Son Dakika',
    metaDescription: 'Türkiye ve dünyadan güncel haberler, son dakika gelişmeleri, spor, ekonomi, teknoloji haberleri.',
    metaKeywords: ['haberler', 'güncel', 'son dakika', 'türkiye', 'dünya'],
    enableSitemap: true,
    enableRobotsTxt: true,
    enableOpenGraph: true,
    enableTwitterCards: true
  },
  social: {},
  content: {
    articlesPerPage: 12,
    enableAutoSave: true,
    enableRevisions: true,
    maxRevisions: 10,
    allowedFileTypes: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'pdf', 'doc', 'docx'],
    maxFileSize: 50,
    enableImageOptimization: true,
    imageQuality: 85
  },
  email: {
    fromName: 'Net Haberler',
    fromEmail: 'noreply@nethaberler.com',
    enableEmailVerification: true,
    enableNewsletterSignup: true
  },
  security: {
    enableTwoFactor: false,
    sessionTimeout: 7200,
    maxLoginAttempts: 5,
    enableCaptcha: true,
    allowedDomains: [],
    bannedIPs: []
  },
  performance: {
    enableCaching: true,
    cacheExpiration: 3600,
    enableImageLazyLoading: true,
    enableGzipCompression: true,
    enableMinification: true
  },
  notifications: {
    enableEmailNotifications: true,
    enablePushNotifications: false,
    notifyOnNewComment: true,
    notifyOnNewUser: true,
    notifyOnSystemUpdate: true,
    adminEmails: ['admin@nethaberler.com']
  }
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  const [saveMessage, setSaveMessage] = useState<{type: 'success' | 'error', message: string} | null>(null)

  const tabs = [
    { id: 'general', name: 'Genel', icon: Settings },
    { id: 'seo', name: 'SEO', icon: Search },
    { id: 'social', name: 'Sosyal Medya', icon: Globe },
    { id: 'content', name: 'İçerik', icon: FileText },
    { id: 'email', name: 'E-posta', icon: Mail },
    { id: 'security', name: 'Güvenlik', icon: Shield },
    { id: 'performance', name: 'Performans', icon: Zap },
    { id: 'notifications', name: 'Bildirimler', icon: Bell }
  ]

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      // Gerçek uygulamada Firestore'dan ayarları yükle
      // const settingsDoc = await getDoc(doc(db, 'settings', 'site'))
      // if (settingsDoc.exists()) {
      //   setSettings(settingsDoc.data() as SiteSettings)
      // }
      setSettings(defaultSettings)
    } catch (error) {
      console.error('Ayarlar yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      
      // Gerçek uygulamada Firestore'a kaydet
      // await setDoc(doc(db, 'settings', 'site'), settings)
      
      setSaveMessage({ type: 'success', message: 'Ayarlar başarıyla kaydedildi!' })
      setTimeout(() => setSaveMessage(null), 3000)
    } catch (error) {
      console.error('Ayarlar kaydedilirken hata:', error)
      setSaveMessage({ type: 'error', message: 'Ayarlar kaydedilirken hata oluştu!' })
      setTimeout(() => setSaveMessage(null), 3000)
    } finally {
      setSaving(false)
    }
  }

  const updateSetting = (section: keyof SiteSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }))
  }

  const addToArray = (section: keyof SiteSettings, key: string, value: string) => {
    if (!value.trim()) return
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [key]: [...((prev[section] as any)[key] as string[]), value.trim()]
      }
    }))
  }

  const removeFromArray = (section: keyof SiteSettings, key: string, index: number) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [key]: ((prev[section] as any)[key] as string[]).filter((_, i) => i !== index)
      }
    }))
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Site Ayarları</h1>
          <p className="text-gray-600 mt-2">Website yapılandırmasını ve ayarlarını yönetin</p>
        </div>
        
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
        </button>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div className={`flex items-center gap-3 p-4 rounded-lg ${
          saveMessage.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {saveMessage.type === 'success' ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertTriangle className="h-5 w-5" />
          )}
          <span>{saveMessage.message}</span>
        </div>
      )}

      <div className="flex gap-8">
        {/* Tabs */}
        <div className="w-64 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span className="font-medium">{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Genel Ayarlar</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Site Adı
                      </label>
                      <input
                        type="text"
                        value={settings.general.siteName}
                        onChange={(e) => updateSetting('general', 'siteName', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Site URL
                      </label>
                      <input
                        type="url"
                        value={settings.general.siteUrl}
                        onChange={(e) => updateSetting('general', 'siteUrl', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Site Açıklaması
                      </label>
                      <textarea
                        value={settings.general.siteDescription}
                        onChange={(e) => updateSetting('general', 'siteDescription', e.target.value)}
                        rows={3}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dil
                      </label>
                      <select
                        value={settings.general.language}
                        onChange={(e) => updateSetting('general', 'language', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="tr">Türkçe</option>
                        <option value="en">English</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Saat Dilimi
                      </label>
                      <select
                        value={settings.general.timezone}
                        onChange={(e) => updateSetting('general', 'timezone', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="Europe/Istanbul">İstanbul</option>
                        <option value="UTC">UTC</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-4">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={settings.general.enableComments}
                        onChange={(e) => updateSetting('general', 'enableComments', e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">Yorumları etkinleştir</span>
                    </label>
                    
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={settings.general.enableRatings}
                        onChange={(e) => updateSetting('general', 'enableRatings', e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">Puanlama sistemini etkinleştir</span>
                    </label>
                    
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={settings.general.maintenanceMode}
                        onChange={(e) => updateSetting('general', 'maintenanceMode', e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">Bakım modu</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* SEO Settings */}
            {activeTab === 'seo' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Ayarları</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meta Başlık
                      </label>
                      <input
                        type="text"
                        value={settings.seo.metaTitle}
                        onChange={(e) => updateSetting('seo', 'metaTitle', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meta Açıklama
                      </label>
                      <textarea
                        value={settings.seo.metaDescription}
                        onChange={(e) => updateSetting('seo', 'metaDescription', e.target.value)}
                        rows={3}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Anahtar Kelimeler
                      </label>
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                          {settings.seo.metaKeywords.map((keyword, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                            >
                              {keyword}
                              <button
                                onClick={() => removeFromArray('seo', 'metaKeywords', index)}
                                className="text-red-600 hover:text-red-800"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                        <input
                          type="text"
                          placeholder="Anahtar kelime ekle ve Enter'a bas"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              addToArray('seo', 'metaKeywords', e.currentTarget.value)
                              e.currentTarget.value = ''
                            }
                          }}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Google Analytics ID
                        </label>
                        <input
                          type="text"
                          value={settings.seo.googleAnalyticsId || ''}
                          onChange={(e) => updateSetting('seo', 'googleAnalyticsId', e.target.value)}
                          placeholder="GA4-XXXXXXXXXX"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Facebook Pixel ID
                        </label>
                        <input
                          type="text"
                          value={settings.seo.facebookPixelId || ''}
                          onChange={(e) => updateSetting('seo', 'facebookPixelId', e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={settings.seo.enableSitemap}
                          onChange={(e) => updateSetting('seo', 'enableSitemap', e.target.checked)}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm text-gray-700">XML Sitemap oluştur</span>
                      </label>
                      
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={settings.seo.enableRobotsTxt}
                          onChange={(e) => updateSetting('seo', 'enableRobotsTxt', e.target.checked)}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm text-gray-700">Robots.txt oluştur</span>
                      </label>
                      
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={settings.seo.enableOpenGraph}
                          onChange={(e) => updateSetting('seo', 'enableOpenGraph', e.target.checked)}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm text-gray-700">Open Graph etiketlerini etkinleştir</span>
                      </label>
                      
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={settings.seo.enableTwitterCards}
                          onChange={(e) => updateSetting('seo', 'enableTwitterCards', e.target.checked)}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm text-gray-700">Twitter Cards etkinleştir</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Social Media Settings */}
            {activeTab === 'social' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Sosyal Medya Hesapları</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Facebook
                      </label>
                      <input
                        type="url"
                        value={settings.social.facebook || ''}
                        onChange={(e) => updateSetting('social', 'facebook', e.target.value)}
                        placeholder="https://facebook.com/yourpage"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Twitter
                      </label>
                      <input
                        type="url"
                        value={settings.social.twitter || ''}
                        onChange={(e) => updateSetting('social', 'twitter', e.target.value)}
                        placeholder="https://twitter.com/youraccount"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Instagram
                      </label>
                      <input
                        type="url"
                        value={settings.social.instagram || ''}
                        onChange={(e) => updateSetting('social', 'instagram', e.target.value)}
                        placeholder="https://instagram.com/youraccount"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        YouTube
                      </label>
                      <input
                        type="url"
                        value={settings.social.youtube || ''}
                        onChange={(e) => updateSetting('social', 'youtube', e.target.value)}
                        placeholder="https://youtube.com/yourchannel"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        LinkedIn
                      </label>
                      <input
                        type="url"
                        value={settings.social.linkedin || ''}
                        onChange={(e) => updateSetting('social', 'linkedin', e.target.value)}
                        placeholder="https://linkedin.com/company/yourcompany"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        TikTok
                      </label>
                      <input
                        type="url"
                        value={settings.social.tiktok || ''}
                        onChange={(e) => updateSetting('social', 'tiktok', e.target.value)}
                        placeholder="https://tiktok.com/@youraccount"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Content Settings */}
            {activeTab === 'content' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">İçerik Ayarları</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sayfa Başına Makale Sayısı
                      </label>
                      <input
                        type="number"
                        value={settings.content.articlesPerPage}
                        onChange={(e) => updateSetting('content', 'articlesPerPage', parseInt(e.target.value))}
                        min="1"
                        max="50"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Maksimum Revizyon Sayısı
                      </label>
                      <input
                        type="number"
                        value={settings.content.maxRevisions}
                        onChange={(e) => updateSetting('content', 'maxRevisions', parseInt(e.target.value))}
                        min="1"
                        max="100"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Maksimum Dosya Boyutu (MB)
                      </label>
                      <input
                        type="number"
                        value={settings.content.maxFileSize}
                        onChange={(e) => updateSetting('content', 'maxFileSize', parseInt(e.target.value))}
                        min="1"
                        max="500"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Görsel Kalitesi (%)
                      </label>
                      <input
                        type="number"
                        value={settings.content.imageQuality}
                        onChange={(e) => updateSetting('content', 'imageQuality', parseInt(e.target.value))}
                        min="10"
                        max="100"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4 mt-6">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={settings.content.enableAutoSave}
                        onChange={(e) => updateSetting('content', 'enableAutoSave', e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">Otomatik kaydet</span>
                    </label>
                    
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={settings.content.enableRevisions}
                        onChange={(e) => updateSetting('content', 'enableRevisions', e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">Revizyon geçmişi</span>
                    </label>
                    
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={settings.content.enableImageOptimization}
                        onChange={(e) => updateSetting('content', 'enableImageOptimization', e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">Görsel optimizasyonu</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Bildirim Ayarları</h3>
                  
                  <div className="space-y-4">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={settings.notifications.enableEmailNotifications}
                        onChange={(e) => updateSetting('notifications', 'enableEmailNotifications', e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">E-posta bildirimlerini etkinleştir</span>
                    </label>
                    
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={settings.notifications.notifyOnNewComment}
                        onChange={(e) => updateSetting('notifications', 'notifyOnNewComment', e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">Yeni yorum bildirimi</span>
                    </label>
                    
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={settings.notifications.notifyOnNewUser}
                        onChange={(e) => updateSetting('notifications', 'notifyOnNewUser', e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">Yeni kullanıcı bildirimi</span>
                    </label>
                  </div>
                  
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Admin E-posta Adresleri
                    </label>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {settings.notifications.adminEmails.map((email, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                          >
                            {email}
                            <button
                              onClick={() => removeFromArray('notifications', 'adminEmails', index)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      <input
                        type="email"
                        placeholder="E-posta adresi ekle ve Enter'a bas"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addToArray('notifications', 'adminEmails', e.currentTarget.value)
                            e.currentTarget.value = ''
                          }
                        }}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
