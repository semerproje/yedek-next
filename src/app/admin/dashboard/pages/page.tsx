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
  Plus,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Filter,
  Download,
  Upload,
  Settings,
  Save,
  X,
  Calendar,
  Clock,
  User,
  Globe,
  Image as ImageIcon,
  Link as LinkIcon,
  Hash,
  Type,
  Palette
} from 'lucide-react'
import Image from 'next/image'

interface Page {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  featuredImage?: string
  status: 'draft' | 'published' | 'archived'
  isHomepage?: boolean
  template: 'default' | 'landing' | 'about' | 'contact' | 'custom'
  seo: {
    metaTitle?: string
    metaDescription?: string
    keywords?: string[]
    ogImage?: string
  }
  author: {
    id: string
    name: string
  }
  publishDate?: Date
  createdAt: Date
  updatedAt: Date
  views: number
  isPublic: boolean
}

const templates = [
  { value: 'default', label: 'Varsayılan Sayfa', description: 'Standart sayfa şablonu' },
  { value: 'landing', label: 'Landing Page', description: 'Pazarlama odaklı landing sayfası' },
  { value: 'about', label: 'Hakkımızda', description: 'Kurumsal hakkımızda sayfası' },
  { value: 'contact', label: 'İletişim', description: 'İletişim formu ile sayfa' },
  { value: 'custom', label: 'Özel Şablon', description: 'Tamamen özelleştirilebilir' }
]

export default function PagesPage() {
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [editingPage, setEditingPage] = useState<Page | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newPage, setNewPage] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    template: 'default' as const,
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: [] as string[],
    },
    isPublic: true
  })

  useEffect(() => {
    loadPages()
  }, [])

  const loadPages = async () => {
    try {
      setLoading(true)
      
      // Mock data - gerçek uygulamada Firebase'den gelir
      const mockPages: Page[] = [
        {
          id: '1',
          title: 'Ana Sayfa',
          slug: 'ana-sayfa',
          content: '<h1>NetNext Haber Portalına Hoş Geldiniz</h1><p>En güncel haberler burada!</p>',
          excerpt: 'Ana sayfa içeriği ve featured haberler',
          featuredImage: '/api/placeholder/400/200',
          status: 'published',
          isHomepage: true,
          template: 'landing',
          seo: {
            metaTitle: 'NetNext - Güncel Haberler',
            metaDescription: 'En güncel haberler, son dakika gelişmeleri ve objektif analitik habercilik',
            keywords: ['haber', 'güncel', 'son dakika', 'analiz'],
            ogImage: '/api/placeholder/1200/630'
          },
          author: {
            id: '1',
            name: 'Admin'
          },
          publishDate: new Date('2024-01-01'),
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date(),
          views: 125467,
          isPublic: true
        },
        {
          id: '2',
          title: 'Hakkımızda',
          slug: 'hakkimizda',
          content: '<h1>NetNext Hakkında</h1><p>Güvenilir habercilik anlayışıyla...</p>',
          excerpt: 'NetNext\'in misyonu ve vizyonu',
          status: 'published',
          template: 'about',
          seo: {
            metaTitle: 'Hakkımızda - NetNext',
            metaDescription: 'NetNext haber portalının misyonu, vizyonu ve değerleri',
            keywords: ['hakkımızda', 'misyon', 'vizyon', 'değerler']
          },
          author: {
            id: '1',
            name: 'Admin'
          },
          publishDate: new Date('2024-01-15'),
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          views: 8932,
          isPublic: true
        },
        {
          id: '3',
          title: 'Gizlilik Politikası',
          slug: 'gizlilik-politikasi',
          content: '<h1>Gizlilik Politikası</h1><p>Kişisel verilerinizi koruyoruz...</p>',
          excerpt: 'Kullanıcı gizliliği ve veri koruma politikaları',
          status: 'draft',
          template: 'default',
          seo: {
            metaTitle: 'Gizlilik Politikası - NetNext',
            metaDescription: 'NetNext gizlilik politikası ve kişisel veri koruma uygulamaları'
          },
          author: {
            id: '2',
            name: 'Zeynep Demir'
          },
          createdAt: new Date('2024-07-20'),
          updatedAt: new Date('2024-07-25'),
          views: 1245,
          isPublic: true
        }
      ]

      setPages(mockPages)
    } catch (error) {
      console.error('Sayfalar yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleAddPage = async () => {
    if (!newPage.title) return

    try {
      const slug = newPage.slug || generateSlug(newPage.title)
      
      const pageData: Omit<Page, 'id'> = {
        ...newPage,
        slug,
        status: 'draft',
        author: {
          id: '1',
          name: 'Current User'
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        views: 0
      }

      // Firebase'e ekle (gerçek uygulamada)
      // const docRef = await addDoc(collection(db!, 'pages'), pageData)
      
      // Mock - ID oluştur
      const newId = Date.now().toString()
      setPages(prev => [...prev, { ...pageData, id: newId }])
      
      setNewPage({
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        template: 'default',
        seo: {
          metaTitle: '',
          metaDescription: '',
          keywords: [],
        },
        isPublic: true
      })
      setShowAddForm(false)
    } catch (error) {
      console.error('Sayfa eklenirken hata:', error)
    }
  }

  const handleUpdatePage = async (pageId: string, updates: Partial<Page>) => {
    try {
      // Firebase'de güncelle (gerçek uygulamada)
      // await updateDoc(doc(db!, 'pages', pageId), { ...updates, updatedAt: Timestamp.now() })
      
      setPages(prev => prev.map(page => 
        page.id === pageId ? { ...page, ...updates, updatedAt: new Date() } : page
      ))
      setEditingPage(null)
    } catch (error) {
      console.error('Sayfa güncellenirken hata:', error)
    }
  }

  const handleDeletePage = async (pageId: string) => {
    const page = pages.find(p => p.id === pageId)
    if (page?.isHomepage) {
      alert('Ana sayfa silinemez!')
      return
    }
    
    if (!confirm('Bu sayfayı silmek istediğinizden emin misiniz?')) return

    try {
      // Firebase'den sil (gerçek uygulamada)
      // await deleteDoc(doc(db!, 'pages', pageId))
      
      setPages(prev => prev.filter(page => page.id !== pageId))
    } catch (error) {
      console.error('Sayfa silinirken hata:', error)
    }
  }

  const togglePageStatus = async (pageId: string, status: Page['status']) => {
    await handleUpdatePage(pageId, { 
      status,
      publishDate: status === 'published' ? new Date() : undefined
    })
  }

  const filteredPages = pages.filter(page => {
    const matchesSearch = page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         page.slug.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || page.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      case 'archived': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'published': return 'Yayında'
      case 'draft': return 'Taslak'
      case 'archived': return 'Arşivlendi'
      default: return status
    }
  }

  const getTemplateLabel = (template: string) => {
    const t = templates.find(t => t.value === template)
    return t?.label || template
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
          <h1 className="text-3xl font-bold text-gray-900">Sayfa Yönetimi</h1>
          <p className="text-gray-600 mt-2">Website sayfalarını ve içeriklerini yönetin</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => {/* Export functionality */}}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="h-4 w-4" />
            Dışa Aktar
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Yeni Sayfa
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Sayfa ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="published">Yayında</option>
            <option value="draft">Taslak</option>
            <option value="archived">Arşivlendi</option>
          </select>
        </div>
      </div>

      {/* Pages Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPages.map((page) => (
          <div key={page.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            {/* Featured Image */}
            {page.featuredImage && (
              <div className="aspect-video relative">
                <Image
                  src={page.featuredImage}
                  alt={page.title}
                  fill
                  className="object-cover"
                />
                {page.isHomepage && (
                  <div className="absolute top-2 left-2">
                    <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                      Ana Sayfa
                    </span>
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(page.status)}`}>
                    {getStatusLabel(page.status)}
                  </span>
                </div>
              </div>
            )}
            
            <div className="p-6">
              {/* Title and Meta */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {page.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {page.excerpt || 'Açıklama eklenmemiş'}
                </p>
              </div>
              
              {/* Meta Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-xs text-gray-500">
                  <LinkIcon className="h-3 w-3 mr-1" />
                  /{page.slug}
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <Type className="h-3 w-3 mr-1" />
                  {getTemplateLabel(page.template)}
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <Eye className="h-3 w-3 mr-1" />
                  {page.views.toLocaleString()} görüntüleme
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="h-3 w-3 mr-1" />
                  {page.updatedAt.toLocaleDateString('tr-TR')}
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  {page.status === 'published' ? (
                    <button
                      onClick={() => togglePageStatus(page.id, 'draft')}
                      className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded hover:bg-yellow-200 transition-colors"
                    >
                      Taslağa Al
                    </button>
                  ) : (
                    <button
                      onClick={() => togglePageStatus(page.id, 'published')}
                      className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-200 transition-colors"
                    >
                      Yayınla
                    </button>
                  )}
                </div>
                
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingPage(page)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  {!page.isHomepage && (
                    <button
                      onClick={() => handleDeletePage(page.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredPages.length === 0 && (
        <div className="text-center py-12">
          <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Hiç sayfa bulunamadı.</p>
        </div>
      )}

      {/* Add Page Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Yeni Sayfa Oluştur</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sayfa Başlığı</label>
                  <input
                    type="text"
                    value={newPage.title}
                    onChange={(e) => {
                      const title = e.target.value
                      setNewPage(prev => ({ 
                        ...prev, 
                        title,
                        slug: generateSlug(title),
                        seo: {
                          ...prev.seo,
                          metaTitle: title
                        }
                      }))
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Sayfa başlığı"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">URL Slug</label>
                  <input
                    type="text"
                    value={newPage.slug}
                    onChange={(e) => setNewPage(prev => ({ ...prev, slug: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="sayfa-url-slug"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kısa Açıklama</label>
                <textarea
                  value={newPage.excerpt}
                  onChange={(e) => {
                    const excerpt = e.target.value
                    setNewPage(prev => ({ 
                      ...prev, 
                      excerpt,
                      seo: {
                        ...prev.seo,
                        metaDescription: excerpt
                      }
                    }))
                  }}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Sayfa hakkında kısa açıklama..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Şablon</label>
                <select
                  value={newPage.template}
                  onChange={(e) => setNewPage(prev => ({ ...prev, template: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  {templates.map(template => (
                    <option key={template.value} value={template.value}>
                      {template.label} - {template.description}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sayfa İçeriği</label>
                <textarea
                  value={newPage.content}
                  onChange={(e) => setNewPage(prev => ({ ...prev, content: e.target.value }))}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="HTML içerik yazabilirsiniz..."
                />
              </div>
              
              {/* SEO Settings */}
              <div className="border-t pt-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">SEO Ayarları</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Meta Başlık</label>
                    <input
                      type="text"
                      value={newPage.seo.metaTitle}
                      onChange={(e) => setNewPage(prev => ({
                        ...prev,
                        seo: { ...prev.seo, metaTitle: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="SEO başlığı"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Meta Açıklama</label>
                    <textarea
                      value={newPage.seo.metaDescription}
                      onChange={(e) => setNewPage(prev => ({
                        ...prev,
                        seo: { ...prev.seo, metaDescription: e.target.value }
                      }))}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="SEO açıklaması"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleAddPage}
                disabled={!newPage.title}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Sayfa Oluştur
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
