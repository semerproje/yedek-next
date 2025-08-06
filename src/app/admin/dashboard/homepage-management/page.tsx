'use client'

import { useState, useEffect } from 'react'
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDoc,
  setDoc,
  query, 
  orderBy, 
  limit, 
  where,
  serverTimestamp
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { News, HomepageModule } from '@/types/homepage'

export default function HomepageManagement() {
  const [modules, setModules] = useState<HomepageModule[]>([])
  const [allNews, setAllNews] = useState<News[]>([])
  const [moduleNews, setModuleNews] = useState<Record<string, News[]>>({})
  const [selectedModule, setSelectedModule] = useState<string | null>(null)
  const [showModuleForm, setShowModuleForm] = useState(false)
  const [editingModule, setEditingModule] = useState<HomepageModule | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'modules' | 'content'>('modules')

  const categories = [
    'gundem', 'ekonomi', 'spor', 'teknoloji', 'saglik', 
    'kultur', 'dunya', 'magazin', 'cevre', 'politika', 'egitim', 'din'
  ]

  useEffect(() => {
    loadModules()
    loadAllNews()
  }, [])

  const loadModules = async () => {
    try {
      const q = query(collection(db, 'homepageModules'), orderBy('order'))
      const snapshot = await getDocs(q)
      const modulesList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as HomepageModule[]
      setModules(modulesList)
      
      // Her modül için haberleri yükle
      for (const moduleItem of modulesList) {
        await loadModuleNews(moduleItem)
      }
    } catch (error) {
      console.error('Modüller yüklenemedi:', error)
    }
  }

  const loadAllNews = async () => {
    try {
      const q = query(
        collection(db, 'news'), 
        where('status', '==', 'published'),
        orderBy('publishedAt', 'desc'),
        limit(100)
      )
      const snapshot = await getDocs(q)
      const newsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as News[]
      setAllNews(newsList)
      setLoading(false)
    } catch (error) {
      console.error('Haberler yüklenemedi:', error)
      setLoading(false)
    }
  }

  const loadModuleNews = async (module: HomepageModule) => {
    if (module.manualNewsIds?.length > 0 && !module.autoFetch) {
      // Manuel seçilmiş haberler
      const manualNews = allNews.filter(news => 
        module.manualNewsIds.includes(news.id)
      ).slice(0, module.newsCount)
      
      setModuleNews(prev => ({
        ...prev,
        [module.id]: manualNews
      }))
      return
    }

    // Otomatik haber seçimi - En basit query (index gerektirmez)
    try {
      // Hep aynı basit query kullan
      const q = query(
        collection(db, 'news'),
        where('status', '==', 'published'),
        orderBy('publishedAt', 'desc'),
        limit(30) // Daha fazla haber al, sonra client-side filtrele
      )

      const snapshot = await getDocs(q)
      let newsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as News[]

      // Client-side filtreleme ve sıralama
      if (module.moduleType === 'breaking-bar') {
        newsList = newsList
          .filter(news => news.breaking)
          .slice(0, module.newsCount || 3)
      } else if (module.moduleType === 'popular-sidebar') {
        newsList = newsList
          .sort((a, b) => (b.views || 0) - (a.views || 0))
          .slice(0, module.newsCount || 8)
      } else if (module.moduleType === 'editor-picks') {
        newsList = newsList
          .filter(news => news.featured)
          .slice(0, module.newsCount || 4)
      } else if (module.category) {
        newsList = newsList
          .filter(news => news.category === module.category)
          .slice(0, module.newsCount || 6)
      } else if (module.moduleType === 'main-visual') {
        // Main visual için views'a göre sırala
        newsList = newsList
          .sort((a, b) => (b.views || 0) - (a.views || 0))
          .slice(0, module.newsCount || 10)
      } else {
        // Diğer modüller için sadece en son haberleri al
        newsList = newsList.slice(0, module.newsCount || 5)
      }

      setModuleNews(prev => ({
        ...prev,
        [module.id]: newsList
      }))
    } catch (error) {
      console.error(`Modül haberleri yüklenemedi (${module.id}):`, error)
      // Hata durumunda boş array set et
      setModuleNews(prev => ({
        ...prev,
        [module.id]: []
      }))
    }
  }

  const createModule = async (moduleData: Omit<HomepageModule, 'id' | 'lastUpdated'>) => {
    try {
      const docRef = await addDoc(collection(db, 'homepageModules'), {
        ...moduleData,
        lastUpdated: serverTimestamp()
      })
      
      const newModule = {
        id: docRef.id,
        ...moduleData,
        lastUpdated: new Date()
      } as HomepageModule
      
      setModules(prev => [...prev, newModule].sort((a, b) => a.order - b.order))
      await loadModuleNews(newModule)
      
      setShowModuleForm(false)
      setEditingModule(null)
    } catch (error) {
      console.error('Modül oluşturulamadı:', error)
      alert('Modül oluşturulamadı!')
    }
  }

  const updateModule = async (moduleId: string, updates: Partial<HomepageModule>) => {
    try {
      // Check if document exists first
      const moduleRef = doc(db, 'homepageModules', moduleId)
      const moduleSnap = await getDoc(moduleRef)
      
      if (!moduleSnap.exists()) {
        // Create the module if it doesn't exist
        const moduleToCreate = modules.find(m => m.id === moduleId)
        if (moduleToCreate) {
          await setDoc(moduleRef, {
            ...moduleToCreate,
            ...updates,
            createdAt: serverTimestamp(),
            lastUpdated: serverTimestamp()
          })
        }
      } else {
        // Update existing document
        await updateDoc(moduleRef, {
          ...updates,
          lastUpdated: serverTimestamp()
        })
      }
      
      setModules(prev => prev.map(module => 
        module.id === moduleId 
          ? { ...module, ...updates, lastUpdated: new Date() }
          : module
      ))
      
      // Güncellenen modül için haberleri yeniden yükle
      const updatedModule = modules.find(m => m.id === moduleId)
      if (updatedModule) {
        await loadModuleNews({ ...updatedModule, ...updates } as HomepageModule)
      }
    } catch (error) {
      console.error('Modül güncellenemedi:', error)
      alert('Modül güncellenemedi!')
    }
  }

  const deleteModule = async (moduleId: string) => {
    if (!confirm('Bu modülü silmek istediğinizden emin misiniz?')) return
    
    try {
      await deleteDoc(doc(db, 'homepageModules', moduleId))
      setModules(prev => prev.filter(m => m.id !== moduleId))
      setModuleNews(prev => {
        const newState = { ...prev }
        delete newState[moduleId]
        return newState
      })
    } catch (error) {
      console.error('Modül silinemedi:', error)
      alert('Modül silinemedi!')
    }
  }

  const toggleModuleActive = async (moduleId: string, active: boolean) => {
    await updateModule(moduleId, { active })
  }

  const refreshModuleNews = async (moduleId: string) => {
    const moduleItem = modules.find(m => m.id === moduleId)
    if (moduleItem) {
      await loadModuleNews(moduleItem)
    }
  }

  const ModuleForm = () => {
    const [formData, setFormData] = useState({
      title: editingModule?.title || '',
      moduleType: editingModule?.moduleType || 'headline-grid' as const,
      componentName: editingModule?.componentName || '',
      category: editingModule?.category || '',
      autoFetch: editingModule?.autoFetch ?? true,
      newsCount: editingModule?.newsCount || 6,
      displayType: editingModule?.displayType || 'grid' as const,
      active: editingModule?.active ?? true,
      order: editingModule?.order || modules.length,
      settings: {
        leftSideCount: editingModule?.settings?.leftSideCount || 5,
        rightSideCount: editingModule?.settings?.rightSideCount || 5,
        autoRefreshMinutes: editingModule?.settings?.autoRefreshMinutes || 30,
        showWeather: editingModule?.settings?.showWeather ?? true,
        showCurrency: editingModule?.settings?.showCurrency ?? true,
        breakingNewsSpeed: editingModule?.settings?.breakingNewsSpeed || 3000
      }
    })

    const moduleTypes = [
      { value: 'main-visual', label: 'Ana Görsel Manşet', component: 'MainVisualHeadline' },
      { value: 'breaking-bar', label: 'Son Dakika Barı', component: 'BreakingNewsBar' },
      { value: 'headline-grid', label: 'Manşet Grid', component: 'HeadlineNewsGrid' },
      { value: 'editor-picks', label: 'Editör Seçimleri', component: 'EditorPicks' },
      { value: 'popular-sidebar', label: 'Popüler Haberler', component: 'PopularNewsSidebar' },
      { value: 'video-highlights', label: 'Video Öne Çıkanlar', component: 'VideoHighlights' },
      { value: 'weekend-reads', label: 'Hafta Sonu Okumaları', component: 'WeekendReadsSection' },
      { value: 'ai-recommendations', label: 'AI Önerileri', component: 'AiRecommendationPanel' },
      { value: 'news-programs', label: 'Haber Programları', component: 'NewsProgramsGrid' },
      { value: 'sticky-banner', label: 'Sabit Banner', component: 'StickyBanner' }
    ]

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <h3 className="text-xl font-bold mb-4">
            {editingModule ? 'Modül Düzenle' : 'Yeni Modül Ekle'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Modül Başlığı</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full border rounded px-3 py-2"
                placeholder="Ana Manşet Haberleri"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Modül Tipi</label>
              <select
                value={formData.moduleType}
                onChange={(e) => {
                  const selectedType = moduleTypes.find(t => t.value === e.target.value)
                  setFormData(prev => ({ 
                    ...prev, 
                    moduleType: e.target.value as any,
                    componentName: selectedType?.component || '',
                    newsCount: e.target.value === 'main-visual' ? 10 : prev.newsCount
                  }))
                }}
                className="w-full border rounded px-3 py-2"
              >
                {moduleTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Component Adı</label>
              <input
                type="text"
                value={formData.componentName}
                onChange={(e) => setFormData(prev => ({ ...prev, componentName: e.target.value }))}
                className="w-full border rounded px-3 py-2"
                placeholder="MainVisualHeadline"
                readOnly
              />
            </div>

            {(formData.moduleType === 'headline-grid' || formData.moduleType === 'editor-picks') && (
              <div>
                <label className="block text-sm font-medium mb-1">Kategori</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Tüm Kategoriler</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium mb-1">Haber Sayısı</label>
              <input
                type="number"
                min="1"
                max="20"
                value={formData.newsCount}
                onChange={(e) => setFormData(prev => ({ ...prev, newsCount: parseInt(e.target.value) }))}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Görünüm Tipi</label>
              <select
                value={formData.displayType}
                onChange={(e) => setFormData(prev => ({ ...prev, displayType: e.target.value as any }))}
                className="w-full border rounded px-3 py-2"
              >
                <option value="grid">Izgara</option>
                <option value="list">Liste</option>
                <option value="slider">Slider</option>
                <option value="banner">Banner</option>
                <option value="sidebar">Kenar Çubuğu</option>
                <option value="visual">Görsel</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Sıra</label>
              <input
                type="number"
                min="0"
                value={formData.order}
                onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) }))}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {formData.moduleType === 'main-visual' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Sol Taraf Haber Sayısı</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.settings.leftSideCount}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      settings: { ...prev.settings, leftSideCount: parseInt(e.target.value) }
                    }))}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Sağ Taraf Haber Sayısı</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.settings.rightSideCount}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      settings: { ...prev.settings, rightSideCount: parseInt(e.target.value) }
                    }))}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </>
            )}

            {formData.moduleType === 'breaking-bar' && (
              <div>
                <label className="block text-sm font-medium mb-1">Kaydırma Hızı (ms)</label>
                <input
                  type="number"
                  min="1000"
                  max="10000"
                  step="500"
                  value={formData.settings.breakingNewsSpeed}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    settings: { ...prev.settings, breakingNewsSpeed: parseInt(e.target.value) }
                  }))}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Otomatik Yenileme (dakika)</label>
              <input
                type="number"
                min="5"
                max="120"
                value={formData.settings.autoRefreshMinutes}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  settings: { ...prev.settings, autoRefreshMinutes: parseInt(e.target.value) }
                }))}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4 mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.autoFetch}
                onChange={(e) => setFormData(prev => ({ ...prev, autoFetch: e.target.checked }))}
                className="mr-2"
              />
              <span className="text-sm">Otomatik haber çekimi</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                className="mr-2"
              />
              <span className="text-sm">Aktif</span>
            </label>

            {formData.moduleType === 'main-visual' && (
              <>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.settings.showWeather}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      settings: { ...prev.settings, showWeather: e.target.checked }
                    }))}
                    className="mr-2"
                  />
                  <span className="text-sm">Hava durumu göster</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.settings.showCurrency}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      settings: { ...prev.settings, showCurrency: e.target.checked }
                    }))}
                    className="mr-2"
                  />
                  <span className="text-sm">Döviz kurları göster</span>
                </label>
              </>
            )}
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={() => {
                setShowModuleForm(false)
                setEditingModule(null)
              }}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              İptal
            </button>
            <button
              onClick={() => {
                if (editingModule) {
                  updateModule(editingModule.id, formData)
                  setEditingModule(null)
                } else {
                  createModule({ 
                    ...formData, 
                    manualNewsIds: [] 
                  })
                }
                setShowModuleForm(false)
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Kaydet
            </button>
          </div>
        </div>
      </div>
    )
  }

  const NewsSelector = ({ moduleId }: { moduleId: string }) => {
    const moduleItem = modules.find(m => m.id === moduleId)
    const [selectedNewsIds, setSelectedNewsIds] = useState<string[]>(moduleItem?.manualNewsIds || [])
    const [searchTerm, setSearchTerm] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('')

    const filteredNews = allNews.filter(news => {
      const matchesSearch = news.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = !categoryFilter || news.category === categoryFilter
      return matchesSearch && matchesCategory
    }).slice(0, 50)

    const saveManualSelection = async () => {
      if (moduleItem) {
        await updateModule(moduleId, { 
          manualNewsIds: selectedNewsIds,
          autoFetch: false 
        })
        setSelectedModule(null)
      }
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Haber Seçimi - {moduleItem?.title}</h3>
            <button
              onClick={() => setSelectedModule(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Haber ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 border rounded px-3 py-2"
            />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="">Tüm Kategoriler</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4 text-sm text-gray-600">
            Seçili: {selectedNewsIds.length} / {moduleItem?.newsCount || 6} haber
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredNews.map(news => (
              <div 
                key={news.id} 
                className={`flex items-start gap-3 p-3 border rounded cursor-pointer hover:bg-gray-50 ${
                  selectedNewsIds.includes(news.id) ? 'bg-blue-50 border-blue-300' : ''
                }`}
                onClick={() => {
                  if (selectedNewsIds.includes(news.id)) {
                    setSelectedNewsIds(prev => prev.filter(id => id !== news.id))
                  } else if (selectedNewsIds.length < (moduleItem?.newsCount || 6)) {
                    setSelectedNewsIds(prev => [...prev, news.id])
                  }
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedNewsIds.includes(news.id)}
                  onChange={() => {}}
                  className="mt-1"
                />
                
                {news.images?.[0] && (
                  <img
                    src={news.images[0].url}
                    alt={news.title}
                    className="w-16 h-12 object-cover rounded"
                  />
                )}
                
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{news.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">{news.summary}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      {news.category}
                    </span>
                    <span>{news.author}</span>
                    <span>{new Date(
                      typeof news.publishedAt === 'object' && news.publishedAt !== null && 'seconds' in news.publishedAt 
                        ? (news.publishedAt as any).seconds * 1000 
                        : news.publishedAt
                    ).toLocaleDateString('tr-TR')}</span>
                    <span>👁️ {news.views || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={() => setSelectedModule(null)}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              İptal
            </button>
            <button
              onClick={saveManualSelection}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Seçimleri Kaydet
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Yükleniyor...</span>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">📰 Anasayfa Modül Yönetimi</h1>
        <p className="text-gray-600 mt-2">
          Anasayfa modüllerini oluşturun ve içeriklerini yönetin
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('modules')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'modules'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            🔧 Modül Yönetimi
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'content'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            📋 İçerik Önizleme
          </button>
        </nav>
      </div>

      {activeTab === 'modules' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Anasayfa Modülleri</h2>
            <button
              onClick={() => setShowModuleForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              ➕ Yeni Modül
            </button>
          </div>

          <div className="grid gap-6">
            {modules.map((module) => (
              <div key={module.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{module.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {module.moduleType}
                      </span>
                      <span className="text-sm bg-purple-100 px-2 py-1 rounded">
                        {module.componentName}
                      </span>
                      {module.category && (
                        <span className="text-sm bg-blue-100 px-2 py-1 rounded">
                          {module.category}
                        </span>
                      )}
                      <span className="text-sm text-gray-500">
                        {module.newsCount} haber
                      </span>
                      <span className="text-sm text-gray-500">
                        {module.displayType}
                      </span>
                      {module.settings?.leftSideCount && (
                        <span className="text-sm bg-green-100 px-2 py-1 rounded">
                          Sol: {module.settings.leftSideCount} | Sağ: {module.settings.rightSideCount}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleModuleActive(module.id, !module.active)}
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        module.active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {module.active ? '✅ Aktif' : '❌ Pasif'}
                    </button>
                    
                    <button
                      onClick={() => {
                        setEditingModule(module)
                        setShowModuleForm(true)
                      }}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    >
                      ✏️ Düzenle
                    </button>
                    
                    <button
                      onClick={() => setSelectedModule(module.id)}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      📝 Haber Seç
                    </button>
                    
                    <button
                      onClick={() => refreshModuleNews(module.id)}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                    >
                      🔄 Yenile
                    </button>
                    
                    <button
                      onClick={() => deleteModule(module.id)}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                    >
                      🗑️ Sil
                    </button>
                  </div>
                </div>

                {/* Modül İçeriği Önizleme */}
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-3">
                    İçerik Önizlemesi ({moduleNews[module.id]?.length || 0} haber)
                  </h4>
                  
                  {moduleNews[module.id]?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {moduleNews[module.id].slice(0, 3).map((news) => (
                        <div key={`preview-${module.id}-${news.id}`} className="border rounded-lg p-3">
                          {news.images?.[0] && (
                            <img
                              src={news.images[0].url}
                              alt={news.title}
                              className="w-full h-24 object-cover rounded mb-2"
                            />
                          )}
                          <h5 className="font-medium text-sm text-gray-900 line-clamp-2">
                            {news.title}
                          </h5>
                          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                            <span className="bg-gray-100 px-2 py-1 rounded">
                              {news.category}
                            </span>
                            <span>👁️ {news.views || 0}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Bu modül için henüz haber yüklenmedi
                    </div>
                  )}
                </div>

                <div className="mt-4 text-xs text-gray-500">
                  Son güncelleme: {module.lastUpdated ? new Date(
                    typeof module.lastUpdated === 'object' && module.lastUpdated !== null && 'seconds' in module.lastUpdated 
                      ? (module.lastUpdated as any).seconds * 1000 
                      : module.lastUpdated
                  ).toLocaleString('tr-TR') : 'Bilinmiyor'}
                </div>
              </div>
            ))}
          </div>

          {modules.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Henüz modül oluşturulmamış. İlk modülünüzü oluşturun!
            </div>
          )}
        </div>
      )}

      {activeTab === 'content' && (
        <div className="space-y-8">
          <h2 className="text-2xl font-bold">Anasayfa İçerik Önizlemesi</h2>
          
          {modules.filter(m => m.active).sort((a, b) => a.order - b.order).map((module) => (
            <div key={module.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">{module.title}</h3>
                <span className="text-sm text-gray-500">
                  Sıra: {module.order} | {moduleNews[module.id]?.length || 0} haber
                </span>
              </div>
              
              {moduleNews[module.id]?.length > 0 ? (
                <div className={`grid gap-4 ${
                  module.displayType === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
                  module.displayType === 'list' ? 'grid-cols-1' :
                  module.displayType === 'slider' ? 'grid-cols-1 md:grid-cols-4' :
                  'grid-cols-1'
                }`}>
                  {moduleNews[module.id].map((news) => (
                    <div key={`content-${module.id}-${news.id}`} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      {news.images?.[0] && (
                        <img
                          src={news.images[0].url}
                          alt={news.title}
                          className="w-full h-40 object-cover rounded mb-3"
                        />
                      )}
                      <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">
                        {news.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {news.summary}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                          <span className="bg-gray-100 px-2 py-1 rounded">
                            {news.category}
                          </span>
                          {news.breaking && (
                            <span className="bg-red-100 text-red-800 px-2 py-1 rounded">
                              🚨 FLAŞ
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span>👁️ {news.views || 0}</span>
                          <span>{new Date(
                            typeof news.publishedAt === 'object' && news.publishedAt !== null && 'seconds' in news.publishedAt 
                              ? (news.publishedAt as any).seconds * 1000 
                              : news.publishedAt
                          ).toLocaleDateString('tr-TR')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Bu modül için henüz haber yüklenmedi
                </div>
              )}
            </div>
          ))}
          
          {modules.filter(m => m.active).length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Aktif modül bulunmuyor
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {showModuleForm && <ModuleForm />}
      {selectedModule && <NewsSelector moduleId={selectedModule} />}
    </div>
  )
}
