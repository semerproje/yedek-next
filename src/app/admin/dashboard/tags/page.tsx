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
  Tag,
  Search,
  Plus,
  Edit3,
  Trash2,
  TrendingUp,
  Hash,
  Eye,
  FileText,
  Users,
  Calendar,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Folder
} from 'lucide-react'

interface TagItem {
  id: string
  name: string
  slug: string
  description?: string
  color: string
  category: 'genel' | 'spor' | 'teknoloji' | 'ekonomi' | 'siyaset' | 'kültür' | 'sağlık' | 'eğitim'
  usageCount: number
  articleCount: number
  viewCount: number
  trending: boolean
  author: {
    id: string
    name: string
  }
  createdAt: Date
  updatedAt: Date
  seoTitle?: string
  seoDescription?: string
  metaKeywords?: string[]
}

interface CategoryStats {
  category: string
  tagCount: number
  articleCount: number
  viewCount: number
  growthRate: number
}

const tagCategories = [
  { id: 'genel', name: 'Genel', color: 'bg-gray-500' },
  { id: 'spor', name: 'Spor', color: 'bg-blue-500' },
  { id: 'teknoloji', name: 'Teknoloji', color: 'bg-purple-500' },
  { id: 'ekonomi', name: 'Ekonomi', color: 'bg-green-500' },
  { id: 'siyaset', name: 'Siyaset', color: 'bg-red-500' },
  { id: 'kültür', name: 'Kültür', color: 'bg-yellow-500' },
  { id: 'sağlık', name: 'Sağlık', color: 'bg-pink-500' },
  { id: 'eğitim', name: 'Eğitim', color: 'bg-indigo-500' }
]

const popularColors = [
  '#EF4444', '#F97316', '#F59E0B', '#EAB308', 
  '#84CC16', '#22C55E', '#10B981', '#14B8A6',
  '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1',
  '#8B5CF6', '#A855F7', '#D946EF', '#EC4899'
]

export default function TagsPage() {
  const [tags, setTags] = useState<TagItem[]>([])
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showTrendingOnly, setShowTrendingOnly] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTag, setEditingTag] = useState<TagItem | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    color: popularColors[0],
    category: 'genel' as 'genel' | 'spor' | 'teknoloji' | 'ekonomi' | 'siyaset' | 'kültür' | 'sağlık' | 'eğitim',
    seoTitle: '',
    seoDescription: '',
    metaKeywords: [] as string[]
  })

  useEffect(() => {
    loadTags()
    loadCategoryStats()
  }, [])

  const loadTags = async () => {
    try {
      setLoading(true)
      
      // Mock data - gerçek uygulamada Firestore'dan gelir
      const mockTags: TagItem[] = [
        {
          id: '1',
          name: 'Yapay Zeka',
          slug: 'yapay-zeka',
          description: 'Yapay zeka teknolojileri ve gelişmeleri',
          color: '#8B5CF6',
          category: 'teknoloji',
          usageCount: 45,
          articleCount: 23,
          viewCount: 15420,
          trending: true,
          author: { id: '1', name: 'Admin' },
          createdAt: new Date('2024-06-01'),
          updatedAt: new Date('2024-07-25'),
          seoTitle: 'Yapay Zeka Haberleri ve Gelişmeleri',
          seoDescription: 'En güncel yapay zeka haberleri, teknolojik gelişmeler ve AI trendleri',
          metaKeywords: ['yapay zeka', 'AI', 'makine öğrenmesi', 'teknoloji']
        },
        {
          id: '2',
          name: 'Futbol',
          slug: 'futbol',
          description: 'Futbol haberleri ve maç sonuçları',
          color: '#22C55E',
          category: 'spor',
          usageCount: 89,
          articleCount: 67,
          viewCount: 42380,
          trending: true,
          author: { id: '2', name: 'Zeynep Demir' },
          createdAt: new Date('2024-05-15'),
          updatedAt: new Date('2024-07-26'),
          seoTitle: 'Futbol Haberleri ve Maç Sonuçları',
          seoDescription: 'Türk ve dünya futbolundan en güncel haberler, maç sonuçları ve transfer gelişmeleri',
          metaKeywords: ['futbol', 'maç', 'transfer', 'spor']
        },
        {
          id: '3',
          name: 'Kripto Para',
          slug: 'kripto-para',
          description: 'Cryptocurrency ve blockchain haberleri',
          color: '#F59E0B',
          category: 'ekonomi',
          usageCount: 32,
          articleCount: 18,
          viewCount: 9870,
          trending: false,
          author: { id: '3', name: 'Can Özkan' },
          createdAt: new Date('2024-06-10'),
          updatedAt: new Date('2024-07-20'),
          seoTitle: 'Kripto Para Haberleri ve Bitcoin Analizi',
          seoDescription: 'Bitcoin, Ethereum ve diğer kripto paralar hakkında güncel haberler ve piyasa analizleri',
          metaKeywords: ['kripto', 'bitcoin', 'ethereum', 'blockchain']
        },
        {
          id: '4',
          name: 'Seçim 2024',
          slug: 'secim-2024',
          description: '2024 seçim haberleri ve analizleri',
          color: '#EF4444',
          category: 'siyaset',
          usageCount: 67,
          articleCount: 41,
          viewCount: 28560,
          trending: true,
          author: { id: '4', name: 'Ayşe Kara' },
          createdAt: new Date('2024-04-01'),
          updatedAt: new Date('2024-07-28'),
          seoTitle: '2024 Seçim Haberleri ve Siyasi Analizler',
          seoDescription: '2024 seçimleri hakkında güncel haberler, anketler ve siyasi değerlendirmeler',
          metaKeywords: ['seçim', '2024', 'siyaset', 'anket']
        },
        {
          id: '5',
          name: 'Sağlık',
          slug: 'saglik',
          description: 'Sağlık haberleri ve tıbbi gelişmeler',
          color: '#EC4899',
          category: 'sağlık',
          usageCount: 28,
          articleCount: 19,
          viewCount: 12340,
          trending: false,
          author: { id: '5', name: 'Dr. Mehmet Yılmaz' },
          createdAt: new Date('2024-05-20'),
          updatedAt: new Date('2024-07-22'),
          seoTitle: 'Sağlık Haberleri ve Tıbbi Gelişmeler',
          seoDescription: 'Güncel sağlık haberleri, tıbbi araştırmalar ve sağlıklı yaşam önerileri',
          metaKeywords: ['sağlık', 'tıp', 'hastalık', 'tedavi']
        }
      ]

      setTags(mockTags)
    } catch (error) {
      console.error('Etiketler yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadCategoryStats = async () => {
    try {
      // Mock data - gerçek uygulamada analytics'ten gelir
      const mockStats: CategoryStats[] = [
        { category: 'spor', tagCount: 15, articleCount: 120, viewCount: 85420, growthRate: 12.5 },
        { category: 'teknoloji', tagCount: 22, articleCount: 89, viewCount: 67890, growthRate: 18.3 },
        { category: 'siyaset', tagCount: 8, articleCount: 67, viewCount: 45670, growthRate: -3.2 },
        { category: 'ekonomi', tagCount: 12, articleCount: 45, viewCount: 32140, growthRate: 8.7 },
        { category: 'sağlık', tagCount: 9, articleCount: 34, viewCount: 23450, growthRate: 15.2 },
        { category: 'kültür', tagCount: 11, articleCount: 28, viewCount: 18920, growthRate: 6.8 },
        { category: 'eğitim', tagCount: 7, articleCount: 21, viewCount: 14560, growthRate: 22.1 },
        { category: 'genel', tagCount: 16, articleCount: 156, viewCount: 98760, growthRate: 9.4 }
      ]
      
      setCategoryStats(mockStats)
    } catch (error) {
      console.error('Kategori istatistikleri yüklenirken hata:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingTag) {
        // Güncelle
        const updatedTag: TagItem = {
          ...editingTag,
          ...formData,
          slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
          updatedAt: new Date()
        }
        
        setTags(prev => prev.map(tag => tag.id === editingTag.id ? updatedTag : tag))
      } else {
        // Yeni ekle
        const newTag: TagItem = {
          id: Date.now().toString(),
          ...formData,
          slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
          usageCount: 0,
          articleCount: 0,
          viewCount: 0,
          trending: false,
          author: { id: '1', name: 'Admin' },
          createdAt: new Date(),
          updatedAt: new Date()
        }
        
        setTags(prev => [newTag, ...prev])
      }
      
      // Form'u temizle ve modal'ı kapat
      setFormData({
        name: '',
        slug: '',
        description: '',
        color: popularColors[0],
        category: 'genel',
        seoTitle: '',
        seoDescription: '',
        metaKeywords: []
      })
      setEditingTag(null)
      setModalOpen(false)
      
    } catch (error) {
      console.error('Etiket kaydedilirken hata:', error)
    }
  }

  const handleEdit = (tag: TagItem) => {
    setEditingTag(tag)
    setFormData({
      name: tag.name,
      slug: tag.slug,
      description: tag.description || '',
      color: tag.color,
      category: tag.category,
      seoTitle: tag.seoTitle || '',
      seoDescription: tag.seoDescription || '',
      metaKeywords: tag.metaKeywords || []
    })
    setModalOpen(true)
  }

  const handleDelete = async (tagId: string) => {
    if (!confirm('Bu etiketi silmek istediğinizden emin misiniz?')) return
    
    try {
      setTags(prev => prev.filter(tag => tag.id !== tagId))
    } catch (error) {
      console.error('Etiket silinirken hata:', error)
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  const getCategoryColor = (category: string) => {
    return tagCategories.find(cat => cat.id === category)?.color || 'bg-gray-500'
  }

  const filteredTags = tags.filter(tag => {
    const matchesSearch = tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tag.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || tag.category === selectedCategory
    const matchesTrending = !showTrendingOnly || tag.trending
    return matchesSearch && matchesCategory && matchesTrending
  })

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
          <h1 className="text-3xl font-bold text-gray-900">Etiket Yönetimi</h1>
          <p className="text-gray-600 mt-2">İçerik etiketlerini ve kategorilerini yönetin</p>
        </div>
        
        <button
          onClick={() => {
            setEditingTag(null)
            setFormData({
              name: '',
              slug: '',
              description: '',
              color: popularColors[0],
              category: 'genel',
              seoTitle: '',
              seoDescription: '',
              metaKeywords: []
            })
            setModalOpen(true)
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Yeni Etiket
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Tag className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Toplam Etiket</p>
              <p className="text-2xl font-bold text-gray-900">{tags.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Toplam Makale</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(tags.reduce((sum, tag) => sum + tag.articleCount, 0))}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Eye className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Toplam Görüntüleme</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(tags.reduce((sum, tag) => sum + tag.viewCount, 0))}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Trend Etiketler</p>
              <p className="text-2xl font-bold text-gray-900">
                {tags.filter(tag => tag.trending).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Analytics */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Kategori Analizi</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categoryStats.map((stat) => {
            const category = tagCategories.find(cat => cat.id === stat.category)
            return (
              <div key={stat.category} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-3 h-3 rounded-full ${category?.color || 'bg-gray-500'}`}></div>
                  <span className="font-medium text-gray-900">{category?.name || stat.category}</span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Etiket:</span>
                    <span className="font-medium">{stat.tagCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Makale:</span>
                    <span className="font-medium">{stat.articleCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Görüntüleme:</span>
                    <span className="font-medium">{formatNumber(stat.viewCount)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Büyüme:</span>
                    <div className="flex items-center gap-1">
                      {stat.growthRate > 0 ? (
                        <ArrowUpRight className="h-3 w-3 text-green-600" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 text-red-600" />
                      )}
                      <span className={`font-medium ${stat.growthRate > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {Math.abs(stat.growthRate)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex-1 relative min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Etiket ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="all">Tüm Kategoriler</option>
            {tagCategories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showTrendingOnly}
              onChange={(e) => setShowTrendingOnly(e.target.checked)}
              className="rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Sadece Trend Olanlar</span>
          </label>
        </div>
      </div>

      {/* Tags Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTags.map((tag) => (
          <div key={tag.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: tag.color }}
                ></div>
                <div>
                  <h3 className="font-semibold text-gray-900">{tag.name}</h3>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white ${getCategoryColor(tag.category)}`}>
                    {tagCategories.find(cat => cat.id === tag.category)?.name || tag.category}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                {tag.trending && (
                  <TrendingUp className="h-4 w-4 text-red-600" />
                )}
                <button
                  onClick={() => handleEdit(tag)}
                  className="p-1 text-gray-400 hover:text-blue-600"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(tag.id)}
                  className="p-1 text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {tag.description && (
              <p className="text-sm text-gray-600 mb-4">{tag.description}</p>
            )}
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">{tag.usageCount}</p>
                <p className="text-xs text-gray-600">Kullanım</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">{tag.articleCount}</p>
                <p className="text-xs text-gray-600">Makale</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">{formatNumber(tag.viewCount)}</p>
                <p className="text-xs text-gray-600">Görüntüleme</p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>@{tag.author.name}</span>
                <span>{tag.createdAt.toLocaleDateString('tr-TR')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTags.length === 0 && (
        <div className="text-center py-12">
          <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Hiç etiket bulunamadı.</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingTag ? 'Etiket Düzenle' : 'Yeni Etiket'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Etiket Adı *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="Otomatik oluşturulur"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Açıklama
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategori *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  >
                    {tagCategories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Renk
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                      className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <div className="flex gap-1 flex-wrap flex-1">
                      {popularColors.map(color => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, color }))}
                          className={`w-6 h-6 rounded border-2 ${formData.color === color ? 'border-gray-800' : 'border-gray-300'}`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* SEO Section */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-sm font-medium text-gray-900 mb-4">SEO Ayarları</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SEO Başlık
                    </label>
                    <input
                      type="text"
                      value={formData.seoTitle}
                      onChange={(e) => setFormData(prev => ({ ...prev, seoTitle: e.target.value }))}
                      placeholder="Meta title"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SEO Açıklama
                    </label>
                    <textarea
                      value={formData.seoDescription}
                      onChange={(e) => setFormData(prev => ({ ...prev, seoDescription: e.target.value }))}
                      placeholder="Meta description"
                      rows={2}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Anahtar Kelimeler
                    </label>
                    <input
                      type="text"
                      placeholder="Virgülle ayırın"
                      onChange={(e) => {
                        const keywords = e.target.value.split(',').map(k => k.trim()).filter(Boolean)
                        setFormData(prev => ({ ...prev, metaKeywords: keywords }))
                      }}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 pt-6">
                <button
                  type="submit"
                  className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  {editingTag ? 'Güncelle' : 'Oluştur'}
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
