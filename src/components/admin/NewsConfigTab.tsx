'use client'

import { useState, useEffect } from 'react'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Settings, 
  Eye, 
  EyeOff, 
  Newspaper,
  Grid,
  List,
  PlayCircle,
  Image,
  Calendar,
  User,
  Tag,
  Save,
  X,
  Search,
  Filter,
  Clock,
  TrendingUp,
  Star
} from 'lucide-react'
import { NewsModuleService, CategoryService } from '@/lib/services/homepageService'
import { NewsModuleConfig, CategoryManagement } from '@/types/admin'

interface NewsConfigFormProps {
  config?: NewsModuleConfig
  categories: CategoryManagement[]
  modules: Array<{ key: string; name: string }>
  onSave: (config: Partial<NewsModuleConfig>) => void
  onCancel: () => void
}

const NewsConfigForm = ({ config, categories, modules, onSave, onCancel }: NewsConfigFormProps) => {
  const [formData, setFormData] = useState({
    moduleKey: config?.moduleKey || '',
    title: config?.title || '',
    categories: config?.categories || [],
    newsIds: config?.newsIds || [],
    manualSelection: config?.manualSelection ?? false,
    autoSelection: config?.autoSelection || {
      enabled: true,
      criteria: {
        category: [],
        tags: [],
        dateRange: 7,
        minViews: 0,
        featured: false
      }
    },
    displaySettings: config?.displaySettings || {
      count: 10,
      layout: 'grid' as const,
      showImage: true,
      showSummary: true,
      showCategory: true,
      showDate: true,
      showAuthor: false
    },
    active: config?.active ?? true,
    order: config?.order || 0
  })

  const [selectedNews, setSelectedNews] = useState<string[]>(formData.newsIds)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4">
          {config ? 'Haber Yapılandırması Düzenle' : 'Yeni Haber Yapılandırması'}
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Settings */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Temel Ayarlar</h4>
            
            <div>
              <label className="block text-sm font-medium mb-1">Modül</label>
              <select
                value={formData.moduleKey}
                onChange={(e) => setFormData(prev => ({ ...prev, moduleKey: e.target.value }))}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Modül seçin</option>
                {modules.map(module => (
                  <option key={module.key} value={module.key}>
                    {module.name} ({module.key})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Başlık</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full border rounded px-3 py-2"
                placeholder="Modül başlığı"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Kategoriler</label>
              <div className="max-h-32 overflow-y-auto border rounded p-2">
                {categories.map(category => (
                  <label key={category.id} className="flex items-center gap-2 py-1">
                    <input
                      type="checkbox"
                      checked={formData.categories.includes(category.slug)}
                      onChange={(e) => {
                        const updatedCategories = e.target.checked
                          ? [...formData.categories, category.slug]
                          : formData.categories.filter(c => c !== category.slug)
                        setFormData(prev => ({ ...prev, categories: updatedCategories }))
                      }}
                    />
                    <div 
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm">{category.name}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                className="mr-2"
              />
              <label className="text-sm font-medium">Aktif</label>
            </div>
          </div>

          {/* Selection Method */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Haber Seçim Yöntemi</h4>
            
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={!formData.manualSelection}
                  onChange={() => setFormData(prev => ({ 
                    ...prev, 
                    manualSelection: false,
                    autoSelection: { ...prev.autoSelection, enabled: true }
                  }))}
                />
                <span className="text-sm font-medium">Otomatik Seçim</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={formData.manualSelection}
                  onChange={() => setFormData(prev => ({ 
                    ...prev, 
                    manualSelection: true,
                    autoSelection: { ...prev.autoSelection, enabled: false }
                  }))}
                />
                <span className="text-sm font-medium">Manuel Seçim</span>
              </label>
            </div>

            {!formData.manualSelection && (
              <div className="space-y-3 bg-gray-50 p-3 rounded">
                <h5 className="text-sm font-medium">Otomatik Seçim Kriterleri</h5>
                
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Tarih Aralığı (gün)</label>
                  <input
                    type="number"
                    value={formData.autoSelection.criteria.dateRange}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      autoSelection: {
                        ...prev.autoSelection,
                        criteria: {
                          ...prev.autoSelection.criteria,
                          dateRange: parseInt(e.target.value) || 7
                        }
                      }
                    }))}
                    className="w-full border rounded px-2 py-1 text-sm"
                    min="1"
                    max="365"
                  />
                </div>
                
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Minimum Görüntülenme</label>
                  <input
                    type="number"
                    value={formData.autoSelection.criteria.minViews}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      autoSelection: {
                        ...prev.autoSelection,
                        criteria: {
                          ...prev.autoSelection.criteria,
                          minViews: parseInt(e.target.value) || 0
                        }
                      }
                    }))}
                    className="w-full border rounded px-2 py-1 text-sm"
                    min="0"
                  />
                </div>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.autoSelection.criteria.featured}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      autoSelection: {
                        ...prev.autoSelection,
                        criteria: {
                          ...prev.autoSelection.criteria,
                          featured: e.target.checked
                        }
                      }
                    }))}
                  />
                  <span className="text-xs">Sadece öne çıkan haberler</span>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Display Settings */}
        <div className="mt-6 space-y-4">
          <h4 className="font-semibold text-gray-900">Görünüm Ayarları</h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Haber Sayısı</label>
              <input
                type="number"
                value={formData.displaySettings.count}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  displaySettings: {
                    ...prev.displaySettings,
                    count: parseInt(e.target.value) || 1
                  }
                }))}
                className="w-full border rounded px-3 py-2"
                min="1"
                max="50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Düzen</label>
              <select
                value={formData.displaySettings.layout}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  displaySettings: {
                    ...prev.displaySettings,
                    layout: e.target.value as 'grid' | 'list' | 'slider'
                  }
                }))}
                className="w-full border rounded px-3 py-2"
              >
                <option value="grid">Grid</option>
                <option value="list">Liste</option>
                <option value="slider">Slider</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { key: 'showImage', label: 'Resim Göster', icon: Image },
              { key: 'showSummary', label: 'Özet Göster', icon: Newspaper },
              { key: 'showCategory', label: 'Kategori Göster', icon: Tag },
              { key: 'showDate', label: 'Tarih Göster', icon: Calendar },
              { key: 'showAuthor', label: 'Yazar Göster', icon: User }
            ].map(({ key, label, icon: Icon }) => (
              <label key={key} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.displaySettings[key as keyof typeof formData.displaySettings] as boolean}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    displaySettings: {
                      ...prev.displaySettings,
                      [key]: e.target.checked
                    }
                  }))}
                />
                <Icon className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{label}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 border rounded hover:bg-gray-50"
          >
            İptal
          </button>
          <button
            onClick={() => onSave({ ...formData, newsIds: selectedNews })}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Kaydet
          </button>
        </div>
      </div>
    </div>
  )
}

export default function NewsConfigTab() {
  const [configs, setConfigs] = useState<NewsModuleConfig[]>([])
  const [categories, setCategories] = useState<CategoryManagement[]>([])
  const [loading, setLoading] = useState(true)
  const [editingConfig, setEditingConfig] = useState<NewsModuleConfig | null>(null)
  const [showConfigForm, setShowConfigForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Available homepage modules
  const availableModules = [
    { key: 'breaking-news', name: 'Son Dakika Haberleri' },
    { key: 'headlines', name: 'Manşet Haberleri' },
    { key: 'editor-picks', name: 'Editörün Seçimi' },
    { key: 'popular-news', name: 'Popüler Haberler' },
    { key: 'weekend-reads', name: 'Hafta Sonu Okumaları' },
    { key: 'video-highlights', name: 'Video Öne Çıkanlar' },
    { key: 'ai-recommendations', name: 'AI Önerileri' },
    { key: 'main-headline', name: 'Ana Manşet' }
  ]

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [configsData, categoriesData] = await Promise.all([
        NewsModuleService.getModuleConfigs(),
        CategoryService.getCategories()
      ])
      
      setConfigs(configsData)
      setCategories(categoriesData.filter(c => c.active))
    } catch (error) {
      console.error('Error loading data:', error)
    }
    setLoading(false)
  }

  const handleToggleActive = async (configId: string, active: boolean) => {
    try {
      await NewsModuleService.updateModuleConfig(configId, { active })
      setConfigs(prev => prev.map(c => 
        c.id === configId ? { ...c, active } : c
      ))
    } catch (error) {
      console.error('Error toggling config:', error)
    }
  }

  const handleDeleteConfig = async (configId: string) => {
    if (!confirm('Bu yapılandırmayı silmek istediğinizden emin misiniz?')) return
    
    try {
      // Note: We need to add deleteModuleConfig method to the service
      // await NewsModuleService.deleteModuleConfig(configId)
      setConfigs(prev => prev.filter(c => c.id !== configId))
    } catch (error) {
      console.error('Error deleting config:', error)
    }
  }

  const getModuleName = (moduleKey: string) => {
    const module = availableModules.find(m => m.key === moduleKey)
    return module ? module.name : moduleKey
  }

  const getLayoutIcon = (layout: string) => {
    switch (layout) {
      case 'grid': return Grid
      case 'list': return List
      case 'slider': return PlayCircle
      default: return Grid
    }
  }

  const filteredConfigs = configs.filter(config =>
    config.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    config.moduleKey.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Yapılandırmalar yükleniyor...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Haber Modülü Yapılandırması</h2>
          <p className="text-gray-600 mt-1">
            Homepage modüllerinin haber seçim ve görünüm ayarlarını yönetin
          </p>
        </div>
        <button
          onClick={() => setShowConfigForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Yeni Yapılandırma
        </button>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Yapılandırma ara..."
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Configs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredConfigs.map((config) => {
          const LayoutIcon = getLayoutIcon(config.displaySettings.layout)
          
          return (
            <div key={config.id} className="bg-white rounded-lg shadow border hover:shadow-md transition">
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{config.title}</h3>
                    <p className="text-sm text-gray-600">{getModuleName(config.moduleKey)}</p>
                  </div>
                  <button
                    onClick={() => handleToggleActive(config.id, !config.active)}
                    className={`p-1 rounded ${
                      config.active ? 'text-green-600' : 'text-gray-400'
                    }`}
                  >
                    {config.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <LayoutIcon className="w-4 h-4 text-gray-500" />
                    <span>
                      {config.displaySettings.layout} - {config.displaySettings.count} haber
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {config.manualSelection ? (
                      <>
                        <User className="w-4 h-4 text-blue-500" />
                        <span>Manuel seçim ({config.newsIds.length} haber)</span>
                      </>
                    ) : (
                      <>
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span>Otomatik seçim</span>
                      </>
                    )}
                  </div>
                  
                  {config.categories.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-purple-500" />
                      <span>{config.categories.length} kategori</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{config.lastModified.toLocaleDateString('tr-TR')}</span>
                  </div>
                </div>
                
                {/* Display Options */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {config.displaySettings.showImage && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                      <Image className="w-3 h-3" />
                      Resim
                    </span>
                  )}
                  {config.displaySettings.showCategory && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                      <Tag className="w-3 h-3" />
                      Kategori
                    </span>
                  )}
                  {config.displaySettings.showDate && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                      <Calendar className="w-3 h-3" />
                      Tarih
                    </span>
                  )}
                </div>
              </div>
              
              <div className="px-4 py-3 bg-gray-50 border-t flex justify-end gap-2">
                <button
                  onClick={() => setEditingConfig(config)}
                  className="flex items-center gap-1 px-3 py-1 text-sm hover:bg-gray-100 rounded"
                >
                  <Edit className="w-3 h-3" />
                  Düzenle
                </button>
                <button
                  onClick={() => handleDeleteConfig(config.id)}
                  className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-3 h-3" />
                  Sil
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredConfigs.length === 0 && (
        <div className="text-center py-12">
          <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Henüz yapılandırma yok
          </h3>
          <p className="text-gray-600 mb-4">
            İlk haber modülü yapılandırmanızı oluşturun
          </p>
          <button
            onClick={() => setShowConfigForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Yapılandırma Ekle
          </button>
        </div>
      )}

      {/* Config Form Modal */}
      {(showConfigForm || editingConfig) && (
        <NewsConfigForm
          config={editingConfig || undefined}
          categories={categories}
          modules={availableModules}
          onSave={async (configData) => {
            try {
              if (editingConfig) {
                await NewsModuleService.updateModuleConfig(editingConfig.id, configData)
                setConfigs(prev => prev.map(c => 
                  c.id === editingConfig.id 
                    ? { ...c, ...configData, lastModified: new Date() }
                    : c
                ))
              } else {
                const newConfig = {
                  ...configData,
                  order: configs.length
                } as Omit<NewsModuleConfig, 'id' | 'lastModified'>
                
                const id = await NewsModuleService.createModuleConfig(newConfig)
                const createdConfig: NewsModuleConfig = {
                  id,
                  ...newConfig,
                  lastModified: new Date()
                }
                setConfigs(prev => [...prev, createdConfig])
              }
              
              setShowConfigForm(false)
              setEditingConfig(null)
            } catch (error) {
              console.error('Error saving config:', error)
            }
          }}
          onCancel={() => {
            setShowConfigForm(false)
            setEditingConfig(null)
          }}
        />
      )}
    </div>
  )
}
