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
  Globe
} from 'lucide-react'
import Image from 'next/image'

interface Author {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'admin' | 'editor' | 'writer'
  isActive: boolean
  bio?: string
  socialLinks?: {
    twitter?: string
    linkedin?: string
    website?: string
  }
  stats: {
    totalArticles: number
    totalViews: number
    averageRating: number
  }
  createdAt: Date
  lastLogin?: Date
}

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState<string>('all')
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newAuthor, setNewAuthor] = useState({
    name: '',
    email: '',
    role: 'writer' as const,
    bio: '',
    socialLinks: {
      twitter: '',
      linkedin: '',
      website: ''
    }
  })

  useEffect(() => {
    loadAuthors()
  }, [])

  const loadAuthors = async () => {
    try {
      setLoading(true)
      
      // Mock data - gerçek uygulamada Firebase'den gelir
      const mockAuthors: Author[] = [
        {
          id: '1',
          name: 'Ahmet Kaya',
          email: 'ahmet@nethaberler.com',
          avatar: '/api/placeholder/32/32',
          role: 'admin',
          isActive: true,
          bio: 'Teknoloji ve gündem editörü. 10 yıllık deneyim.',
          socialLinks: {
            twitter: '@ahmetkaya',
            linkedin: 'ahmet-kaya',
            website: 'https://ahmetkaya.com'
          },
          stats: {
            totalArticles: 245,
            totalViews: 1234567,
            averageRating: 4.8
          },
          createdAt: new Date('2023-01-15'),
          lastLogin: new Date()
        },
        {
          id: '2',
          name: 'Zeynep Demir',
          email: 'zeynep@nethaberler.com',
          avatar: '/api/placeholder/32/32',
          role: 'editor',
          isActive: true,
          bio: 'Spor ve sağlık editörü.',
          socialLinks: {
            twitter: '@zeynepdemir',
            linkedin: 'zeynep-demir'
          },
          stats: {
            totalArticles: 189,
            totalViews: 892345,
            averageRating: 4.6
          },
          createdAt: new Date('2023-03-20'),
          lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000)
        },
        {
          id: '3',
          name: 'Can Özkan',
          email: 'can@nethaberler.com',
          role: 'writer',
          isActive: true,
          bio: 'Ekonomi ve finans yazarı.',
          stats: {
            totalArticles: 156,
            totalViews: 567890,
            averageRating: 4.4
          },
          createdAt: new Date('2023-06-10'),
          lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      ]

      setAuthors(mockAuthors)
    } catch (error) {
      console.error('Yazarlar yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddAuthor = async () => {
    if (!newAuthor.name || !newAuthor.email) return

    try {
      const authorData: Omit<Author, 'id'> = {
        ...newAuthor,
        isActive: true,
        stats: {
          totalArticles: 0,
          totalViews: 0,
          averageRating: 0
        },
        createdAt: new Date()
      }

      // Firebase'e ekle (gerçek uygulamada)
      // const docRef = await addDoc(collection(db!, 'authors'), authorData)
      
      // Mock - ID oluştur
      const newId = Date.now().toString()
      setAuthors(prev => [...prev, { ...authorData, id: newId }])
      
      setNewAuthor({
        name: '',
        email: '',
        role: 'writer',
        bio: '',
        socialLinks: { twitter: '', linkedin: '', website: '' }
      })
      setShowAddForm(false)
    } catch (error) {
      console.error('Yazar eklenirken hata:', error)
    }
  }

  const handleUpdateAuthor = async (authorId: string, updates: Partial<Author>) => {
    try {
      // Firebase'de güncelle (gerçek uygulamada)
      // await updateDoc(doc(db!, 'authors', authorId), updates)
      
      setAuthors(prev => prev.map(author => 
        author.id === authorId ? { ...author, ...updates } : author
      ))
      setEditingAuthor(null)
    } catch (error) {
      console.error('Yazar güncellenirken hata:', error)
    }
  }

  const handleDeleteAuthor = async (authorId: string) => {
    if (!confirm('Bu yazarı silmek istediğinizden emin misiniz?')) return

    try {
      // Firebase'den sil (gerçek uygulamada)
      // await deleteDoc(doc(db!, 'authors', authorId))
      
      setAuthors(prev => prev.filter(author => author.id !== authorId))
    } catch (error) {
      console.error('Yazar silinirken hata:', error)
    }
  }

  const toggleAuthorStatus = async (authorId: string, isActive: boolean) => {
    await handleUpdateAuthor(authorId, { isActive })
  }

  const filteredAuthors = authors.filter(author => {
    const matchesSearch = author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         author.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === 'all' || author.role === selectedRole
    return matchesSearch && matchesRole
  })

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800'
      case 'editor': return 'bg-blue-100 text-blue-800'
      case 'writer': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Yönetici'
      case 'editor': return 'Editör'
      case 'writer': return 'Yazar'
      default: return role
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Yazar Yönetimi</h1>
          <p className="text-gray-600 mt-2">Yazarları, editörleri ve yöneticileri yönetin</p>
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
            Yeni Yazar
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
              placeholder="Yazar ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="all">Tüm Roller</option>
            <option value="admin">Yönetici</option>
            <option value="editor">Editör</option>
            <option value="writer">Yazar</option>
          </select>
        </div>
      </div>

      {/* Authors List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-900">Yazar</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-900">Rol</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-900">İstatistikler</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-900">Son Giriş</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-900">Durum</th>
                <th className="text-right py-3 px-6 text-sm font-medium text-gray-900">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAuthors.map((author) => (
                <tr key={author.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        {author.avatar ? (
                          <Image
                            src={author.avatar}
                            alt={author.name}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        ) : (
                          <User className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{author.name}</p>
                        <p className="text-sm text-gray-600">{author.email}</p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(author.role)}`}>
                      {getRoleLabel(author.role)}
                    </span>
                  </td>
                  
                  <td className="py-4 px-6">
                    <div className="text-sm">
                      <p className="text-gray-900">{author.stats.totalArticles} makale</p>
                      <p className="text-gray-600">{author.stats.totalViews.toLocaleString()} görüntüleme</p>
                      <p className="text-gray-600">⭐ {author.stats.averageRating.toFixed(1)}</p>
                    </div>
                  </td>
                  
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-600">
                      {author.lastLogin ? (
                        <>
                          <p>{author.lastLogin.toLocaleDateString('tr-TR')}</p>
                          <p>{author.lastLogin.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</p>
                        </>
                      ) : (
                        <p>Hiç giriş yapmamış</p>
                      )}
                    </div>
                  </td>
                  
                  <td className="py-4 px-6">
                    <button
                      onClick={() => toggleAuthorStatus(author.id, !author.isActive)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        author.isActive 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {author.isActive ? (
                        <>
                          <Eye className="h-3 w-3" />
                          Aktif
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3 w-3" />
                          Pasif
                        </>
                      )}
                    </button>
                  </td>
                  
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingAuthor(author)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteAuthor(author.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredAuthors.length === 0 && (
          <div className="text-center py-12">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Hiç yazar bulunamadı.</p>
          </div>
        )}
      </div>

      {/* Add Author Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Yeni Yazar Ekle</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ad Soyad</label>
                  <input
                    type="text"
                    value={newAuthor.name}
                    onChange={(e) => setNewAuthor(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Yazar adı"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
                  <input
                    type="email"
                    value={newAuthor.email}
                    onChange={(e) => setNewAuthor(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="email@domain.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
                <select
                  value={newAuthor.role}
                  onChange={(e) => setNewAuthor(prev => ({ ...prev, role: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="writer">Yazar</option>
                  <option value="editor">Editör</option>
                  <option value="admin">Yönetici</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Biyografi</label>
                <textarea
                  value={newAuthor.bio}
                  onChange={(e) => setNewAuthor(prev => ({ ...prev, bio: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Yazar hakkında kısa bilgi..."
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
                  <input
                    type="text"
                    value={newAuthor.socialLinks.twitter}
                    onChange={(e) => setNewAuthor(prev => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks, twitter: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="@kullaniciadi"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                  <input
                    type="text"
                    value={newAuthor.socialLinks.linkedin}
                    onChange={(e) => setNewAuthor(prev => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks, linkedin: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="profil-adi"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                  <input
                    type="url"
                    value={newAuthor.socialLinks.website}
                    onChange={(e) => setNewAuthor(prev => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks, website: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="https://website.com"
                  />
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
                onClick={handleAddAuthor}
                disabled={!newAuthor.name || !newAuthor.email}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Yazar Ekle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
