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
  Upload,
  Search,
  Filter,
  Download,
  Trash2,
  Edit3,
  Copy,
  ExternalLink,
  Image as ImageIcon,
  Video,
  FileText,
  Folder,
  Plus,
  Grid,
  List,
  Eye,
  Calendar,
  User
} from 'lucide-react'
import Image from 'next/image'

interface MediaItem {
  id: string
  name: string
  url: string
  type: 'image' | 'video' | 'document'
  size: number
  mimeType: string
  dimensions?: {
    width: number
    height: number
  }
  alt?: string
  caption?: string
  folder?: string
  author: {
    id: string
    name: string
  }
  createdAt: Date
  updatedAt: Date
  usageCount: number
  tags: string[]
}

const mediaFolders = [
  'Haberler',
  'Kategoriler', 
  'Yazarlar',
  'Genel',
  'Arşiv'
]

export default function MediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFolder, setSelectedFolder] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState<MediaItem[]>([])

  useEffect(() => {
    loadMedia()
  }, [])

  const loadMedia = async () => {
    try {
      setLoading(true)
      
      // Mock data - gerçek uygulamada Firebase Storage'dan gelir
      const mockMedia: MediaItem[] = [
        {
          id: '1',
          name: 'ana-sayfa-banner.jpg',
          url: '/api/placeholder/800/400',
          type: 'image',
          size: 245760,
          mimeType: 'image/jpeg',
          dimensions: { width: 800, height: 400 },
          alt: 'Ana sayfa banner görüntüsü',
          caption: 'Güncel haberler banner',
          folder: 'Genel',
          author: { id: '1', name: 'Admin' },
          createdAt: new Date('2024-07-01'),
          updatedAt: new Date('2024-07-01'),
          usageCount: 15,
          tags: ['banner', 'ana-sayfa', 'featured']
        },
        {
          id: '2',
          name: 'spor-haberi-video.mp4',
          url: '/api/placeholder/video/640/360',
          type: 'video',
          size: 15728640,
          mimeType: 'video/mp4',
          dimensions: { width: 640, height: 360 },
          caption: 'Maç özetleri',
          folder: 'Haberler',
          author: { id: '2', name: 'Zeynep Demir' },
          createdAt: new Date('2024-07-15'),
          updatedAt: new Date('2024-07-15'),
          usageCount: 8,
          tags: ['spor', 'video', 'maç']
        },
        {
          id: '3',
          name: 'ekonomi-raporu.pdf',
          url: '/api/placeholder/document',
          type: 'document',
          size: 1048576,
          mimeType: 'application/pdf',
          caption: 'Aylık ekonomi raporu',
          folder: 'Arşiv',
          author: { id: '3', name: 'Can Özkan' },
          createdAt: new Date('2024-07-20'),
          updatedAt: new Date('2024-07-20'),
          usageCount: 3,
          tags: ['ekonomi', 'rapor', 'pdf']
        },
        {
          id: '4',
          name: 'teknoloji-kategori.jpg',
          url: '/api/placeholder/600/300',
          type: 'image',
          size: 189440,
          mimeType: 'image/jpeg',
          dimensions: { width: 600, height: 300 },
          alt: 'Teknoloji kategorisi görseli',
          folder: 'Kategoriler',
          author: { id: '1', name: 'Admin' },
          createdAt: new Date('2024-07-25'),
          updatedAt: new Date('2024-07-25'),
          usageCount: 12,
          tags: ['teknoloji', 'kategori', 'icon']
        }
      ]

      setMedia(mockMedia)
    } catch (error) {
      console.error('Medya yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (files: FileList) => {
    // Gerçek uygulamada Firebase Storage'a upload
    console.log('Uploading files:', files)
    setUploadModalOpen(false)
  }

  const handleDelete = async (mediaIds: string[]) => {
    if (!confirm(`${mediaIds.length} medya dosyasını silmek istediğinizden emin misiniz?`)) return

    try {
      // Firebase'den sil (gerçek uygulamada)
      setMedia(prev => prev.filter(item => !mediaIds.includes(item.id)))
      setSelectedMedia([])
    } catch (error) {
      console.error('Medya silinirken hata:', error)
    }
  }

  const copyUrlToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    // Toast bildirim göster
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return ImageIcon
      case 'video': return Video
      case 'document': return FileText
      default: return FileText
    }
  }

  const filteredMedia = media.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesFolder = selectedFolder === 'all' || item.folder === selectedFolder
    const matchesType = selectedType === 'all' || item.type === selectedType
    return matchesSearch && matchesFolder && matchesType
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
          <h1 className="text-3xl font-bold text-gray-900">Medya Yönetimi</h1>
          <p className="text-gray-600 mt-2">Görselleri, videoları ve belgeleri yönetin</p>
        </div>
        
        <div className="flex items-center gap-3">
          {selectedMedia.length > 0 && (
            <button
              onClick={() => handleDelete(selectedMedia.map(m => m.id))}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Seçilenleri Sil ({selectedMedia.length})
            </button>
          )}
          <button
            onClick={() => setUploadModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Upload className="h-4 w-4" />
            Dosya Yükle
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex-1 relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Medya ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">Tüm Klasörler</option>
              {mediaFolders.map(folder => (
                <option key={folder} value={folder}>{folder}</option>
              ))}
            </select>
            
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">Tüm Tipler</option>
              <option value="image">Görseller</option>
              <option value="video">Videolar</option>
              <option value="document">Belgeler</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Media Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMedia.map((item) => {
            const isSelected = selectedMedia.some(m => m.id === item.id)
            const TypeIcon = getTypeIcon(item.type)
            
            return (
              <div 
                key={item.id} 
                className={`bg-white rounded-xl border-2 overflow-hidden cursor-pointer transition-all ${
                  isSelected ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => {
                  if (isSelected) {
                    setSelectedMedia(prev => prev.filter(m => m.id !== item.id))
                  } else {
                    setSelectedMedia(prev => [...prev, item])
                  }
                }}
              >
                {/* Preview */}
                <div className="aspect-video relative bg-gray-100 flex items-center justify-center">
                  {item.type === 'image' ? (
                    <Image
                      src={item.url}
                      alt={item.alt || item.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <TypeIcon className="h-12 w-12 text-gray-400" />
                  )}
                  
                  {isSelected && (
                    <div className="absolute inset-0 bg-red-600 bg-opacity-20 flex items-center justify-center">
                      <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center">
                        ✓
                      </div>
                    </div>
                  )}
                  
                  <div className="absolute top-2 left-2">
                    <span className="bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                      {item.type.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="absolute top-2 right-2">
                    <span className="bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                      {formatFileSize(item.size)}
                    </span>
                  </div>
                </div>
                
                {/* Info */}
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                  <p className="text-sm text-gray-600 truncate">{item.caption || 'Açıklama eklenmemiş'}</p>
                  
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                    <span className="text-xs text-gray-500">
                      {item.usageCount} kullanım
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          copyUrlToClipboard(item.url)
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          window.open(item.url, '_blank')
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-900">
                    <input
                      type="checkbox"
                      checked={selectedMedia.length === filteredMedia.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedMedia(filteredMedia)
                        } else {
                          setSelectedMedia([])
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-900">Dosya</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-900">Tip</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-900">Boyut</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-900">Klasör</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-900">Yazar</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-900">Tarih</th>
                  <th className="text-right py-3 px-6 text-sm font-medium text-gray-900">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredMedia.map((item) => {
                  const isSelected = selectedMedia.some(m => m.id === item.id)
                  const TypeIcon = getTypeIcon(item.type)
                  
                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedMedia(prev => [...prev, item])
                            } else {
                              setSelectedMedia(prev => prev.filter(m => m.id !== item.id))
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                      </td>
                      
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                            {item.type === 'image' ? (
                              <Image
                                src={item.url}
                                alt={item.alt || item.name}
                                width={48}
                                height={48}
                                className="object-cover"
                              />
                            ) : (
                              <TypeIcon className="h-6 w-6 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-600">{item.caption}</p>
                          </div>
                        </div>
                      </td>
                      
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {item.type}
                        </span>
                      </td>
                      
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {formatFileSize(item.size)}
                      </td>
                      
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {item.folder}
                      </td>
                      
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {item.author.name}
                      </td>
                      
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {item.createdAt.toLocaleDateString('tr-TR')}
                      </td>
                      
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => copyUrlToClipboard(item.url)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => window.open(item.url, '_blank')}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete([item.id])}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          
          {filteredMedia.length === 0 && (
            <div className="text-center py-12">
              <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Hiç medya dosyası bulunamadı.</p>
            </div>
          )}
        </div>
      )}

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Dosya Yükle</h3>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                ✕
              </button>
            </div>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">Dosyaları buraya sürükleyin</p>
              <p className="text-gray-600 mb-4">veya dosya seçmek için tıklayın</p>
              <input
                type="file"
                multiple
                accept="image/*,video/*,.pdf,.doc,.docx"
                onChange={(e) => e.target.files && handleUpload(e.target.files)}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer transition-colors"
              >
                <Plus className="h-4 w-4" />
                Dosya Seç
              </label>
            </div>
            
            <div className="mt-6">
              <p className="text-sm text-gray-600">
                Desteklenen formatlar: JPG, PNG, GIF, MP4, PDF, DOC, DOCX
              </p>
              <p className="text-sm text-gray-600">
                Maksimum dosya boyutu: 50MB
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
