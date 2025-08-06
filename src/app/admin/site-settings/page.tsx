'use client'

import { useState } from 'react'
import { Globe, Save, Image, FileText, Link, Mail, Phone, MapPin } from 'lucide-react'

interface SiteSettings {
  basic: {
    siteName: string
    tagline: string
    description: string
    logo: string
    favicon: string
    language: string
    timezone: string
  }
  contact: {
    email: string
    phone: string
    address: string
    socialMedia: {
      facebook: string
      twitter: string
      instagram: string
      youtube: string
      linkedin: string
    }
  }
  display: {
    newsPerPage: number
    showBreadcrumbs: boolean
    showPublishDate: boolean
    showAuthor: boolean
    showViews: boolean
    enableComments: boolean
    enableSharing: boolean
  }
  homepage: {
    heroSectionEnabled: boolean
    featuredNewsCount: number
    categorySections: string[]
    showPopularNews: boolean
    showLatestNews: boolean
  }
  footer: {
    copyrightText: string
    showSocialLinks: boolean
    additionalLinks: Array<{
      title: string
      url: string
    }>
  }
}

export default function SiteSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>({
    basic: {
      siteName: 'Net Haberler',
      tagline: 'Güvenilir Haber Kaynağınız',
      description: 'Türkiye\'nin en güncel ve güvenilir haber platformu',
      logo: '/assets/logo.png',
      favicon: '/favicon.ico',
      language: 'tr',
      timezone: 'Europe/Istanbul'
    },
    contact: {
      email: 'info@nethaberler.com',
      phone: '+90 (212) 555 0123',
      address: 'İstanbul, Türkiye',
      socialMedia: {
        facebook: 'https://facebook.com/nethaberler',
        twitter: 'https://twitter.com/nethaberler',
        instagram: 'https://instagram.com/nethaberler',
        youtube: 'https://youtube.com/nethaberler',
        linkedin: 'https://linkedin.com/company/nethaberler'
      }
    },
    display: {
      newsPerPage: 12,
      showBreadcrumbs: true,
      showPublishDate: true,
      showAuthor: true,
      showViews: true,
      enableComments: true,
      enableSharing: true
    },
    homepage: {
      heroSectionEnabled: true,
      featuredNewsCount: 5,
      categorySections: ['gundem', 'spor', 'ekonomi', 'teknoloji'],
      showPopularNews: true,
      showLatestNews: true
    },
    footer: {
      copyrightText: '© 2025 Net Haberler. Tüm hakları saklıdır.',
      showSocialLinks: true,
      additionalLinks: [
        { title: 'Hakkımızda', url: '/hakkimizda' },
        { title: 'İletişim', url: '/iletisim' },
        { title: 'Gizlilik Politikası', url: '/gizlilik' },
        { title: 'Kullanım Şartları', url: '/kullanim-sartlari' }
      ]
    }
  })

  const [activeTab, setActiveTab] = useState('basic')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      // Site ayarlarını kaydet
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Site settings saved:', settings)
    } catch (error) {
      console.error('Site settings save error:', error)
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

  const updateNestedSetting = (section: keyof SiteSettings, nested: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [nested]: {
          ...(prev[section] as any)[nested],
          [key]: value
        }
      }
    }))
  }

  const tabs = [
    { id: 'basic', label: 'Temel Bilgiler', icon: Globe },
    { id: 'contact', label: 'İletişim', icon: Mail },
    { id: 'display', label: 'Görünüm', icon: Image },
    { id: 'homepage', label: 'Anasayfa', icon: FileText },
    { id: 'footer', label: 'Footer', icon: Link }
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Globe className="h-6 w-6" />
              Site Ayarları
            </h1>
            <p className="text-gray-600 mt-1">Web sitesi yapılandırması ve görünüm ayarları</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tabs Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <nav className="p-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              {/* Basic Settings */}
              {activeTab === 'basic' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-900">Temel Site Bilgileri</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Site Adı
                      </label>
                      <input
                        type="text"
                        value={settings.basic.siteName}
                        onChange={(e) => updateSetting('basic', 'siteName', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Slogan
                      </label>
                      <input
                        type="text"
                        value={settings.basic.tagline}
                        onChange={(e) => updateSetting('basic', 'tagline', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Site Açıklaması
                      </label>
                      <textarea
                        value={settings.basic.description}
                        onChange={(e) => updateSetting('basic', 'description', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Logo URL
                      </label>
                      <input
                        type="text"
                        value={settings.basic.logo}
                        onChange={(e) => updateSetting('basic', 'logo', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dil
                      </label>
                      <select
                        value={settings.basic.language}
                        onChange={(e) => updateSetting('basic', 'language', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="tr">Türkçe</option>
                        <option value="en">English</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Settings */}
              {activeTab === 'contact' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-900">İletişim Bilgileri</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail className="inline h-4 w-4 mr-1" />
                        E-posta
                      </label>
                      <input
                        type="email"
                        value={settings.contact.email}
                        onChange={(e) => updateSetting('contact', 'email', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Phone className="inline h-4 w-4 mr-1" />
                        Telefon
                      </label>
                      <input
                        type="tel"
                        value={settings.contact.phone}
                        onChange={(e) => updateSetting('contact', 'phone', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MapPin className="inline h-4 w-4 mr-1" />
                        Adres
                      </label>
                      <textarea
                        value={settings.contact.address}
                        onChange={(e) => updateSetting('contact', 'address', e.target.value)}
                        rows={2}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-md font-medium text-gray-900 mb-4">Sosyal Medya Hesapları</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(settings.contact.socialMedia).map(([platform, url]) => (
                        <div key={platform}>
                          <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                            {platform}
                          </label>
                          <input
                            type="url"
                            value={url}
                            onChange={(e) => updateNestedSetting('contact', 'socialMedia', platform, e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            placeholder={`https://${platform}.com/...`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Display Settings */}
              {activeTab === 'display' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-900">Görünüm Ayarları</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sayfa Başına Haber Sayısı
                      </label>
                      <input
                        type="number"
                        value={settings.display.newsPerPage}
                        onChange={(e) => updateSetting('display', 'newsPerPage', parseInt(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {Object.entries(settings.display).filter(([key]) => 
                      typeof settings.display[key as keyof typeof settings.display] === 'boolean'
                    ).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">
                            {key === 'showBreadcrumbs' && 'Breadcrumb Göster'}
                            {key === 'showPublishDate' && 'Yayın Tarihini Göster'}
                            {key === 'showAuthor' && 'Yazarı Göster'}
                            {key === 'showViews' && 'Görüntülenme Sayısını Göster'}
                            {key === 'enableComments' && 'Yorumları Etkinleştir'}
                            {key === 'enableSharing' && 'Paylaşımı Etkinleştir'}
                          </h3>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value as boolean}
                            onChange={(e) => updateSetting('display', key, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Homepage Settings */}
              {activeTab === 'homepage' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-900">Anasayfa Ayarları</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Hero Bölümünü Etkinleştir</h3>
                        <p className="text-sm text-gray-600">Anasayfada öne çıkan haber bölümü</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.homepage.heroSectionEnabled}
                          onChange={(e) => updateSetting('homepage', 'heroSectionEnabled', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Öne Çıkan Haber Sayısı
                      </label>
                      <input
                        type="number"
                        value={settings.homepage.featuredNewsCount}
                        onChange={(e) => updateSetting('homepage', 'featuredNewsCount', parseInt(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        max="10"
                        min="1"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Footer Settings */}
              {activeTab === 'footer' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-900">Footer Ayarları</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telif Hakkı Metni
                    </label>
                    <input
                      type="text"
                      value={settings.footer.copyrightText}
                      onChange={(e) => updateSetting('footer', 'copyrightText', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Sosyal Medya Linklerini Göster</h3>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.footer.showSocialLinks}
                        onChange={(e) => updateSetting('footer', 'showSocialLinks', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
