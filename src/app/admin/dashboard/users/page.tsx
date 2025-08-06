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
  Users,
  Search,
  Filter,
  UserPlus,
  Mail,
  Phone,
  Calendar,
  Shield,
  Edit3,
  Trash2,
  Ban,
  CheckCircle,
  AlertCircle,
  Crown,
  Eye,
  MessageSquare,
  Activity,
  TrendingUp,
  Award,
  Clock,
  MapPin,
  FileText
} from 'lucide-react'
import Image from 'next/image'

interface User {
  id: string
  email: string
  displayName: string
  firstName?: string
  lastName?: string
  avatar?: string
  role: 'admin' | 'editor' | 'author' | 'subscriber'
  status: 'active' | 'inactive' | 'suspended' | 'pending'
  emailVerified: boolean
  phone?: string
  bio?: string
  location?: string
  website?: string
  socialMedia: {
    twitter: string
    linkedin: string
    facebook: string
    instagram: string
  }
  stats: {
    articlesCount: number
    commentsCount: number
    likesReceived: number
    viewsReceived: number
    lastLoginAt: Date
    totalLoginCount: number
  }
  permissions: string[]
  createdAt: Date
  updatedAt: Date
  lastActivityAt: Date
}

interface UserStats {
  total: number
  active: number
  inactive: number
  suspended: number
  newThisMonth: number
  growthRate: number
}

const userRoles = [
  { id: 'admin', name: 'Yönetici', color: 'bg-red-500', permissions: ['all'] },
  { id: 'editor', name: 'Editör', color: 'bg-blue-500', permissions: ['create', 'edit', 'publish', 'moderate'] },
  { id: 'author', name: 'Yazar', color: 'bg-green-500', permissions: ['create', 'edit'] },
  { id: 'subscriber', name: 'Abone', color: 'bg-gray-500', permissions: ['read', 'comment'] }
]

const userStatuses = [
  { id: 'active', name: 'Aktif', color: 'text-green-600 bg-green-100' },
  { id: 'inactive', name: 'Pasif', color: 'text-gray-600 bg-gray-100' },
  { id: 'suspended', name: 'Askıya Alındı', color: 'text-red-600 bg-red-100' },
  { id: 'pending', name: 'Beklemede', color: 'text-yellow-600 bg-yellow-100' }
]

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  const [formData, setFormData] = useState({
    email: '',
    displayName: '',
    firstName: '',
    lastName: '',
    role: 'subscriber' as 'admin' | 'editor' | 'author' | 'subscriber',
    status: 'active' as 'active' | 'inactive' | 'suspended' | 'pending',
    phone: '',
    bio: '',
    location: '',
    website: '',
    socialMedia: {
      twitter: '',
      linkedin: '',
      facebook: '',
      instagram: ''
    }
  })

  useEffect(() => {
    loadUsers()
    loadUserStats()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      
      // Mock data - gerçek uygulamada Firebase Auth ve Firestore'dan gelir
      const mockUsers: User[] = [
        {
          id: '1',
          email: 'admin@netnext.com',
          displayName: 'Sistem Yöneticisi',
          firstName: 'Admin',
          lastName: 'User',
          avatar: '/api/placeholder/100/100',
          role: 'admin',
          status: 'active',
          emailVerified: true,
          phone: '+90 555 123 4567',
          bio: 'Platform yöneticisi ve kurucu',
          location: 'İstanbul, Türkiye',
          website: 'https://netnext.com',
          socialMedia: {
            twitter: '@netnext',
            linkedin: 'netnext-admin',
            facebook: '',
            instagram: ''
          },
          stats: {
            articlesCount: 45,
            commentsCount: 128,
            likesReceived: 892,
            viewsReceived: 25640,
            lastLoginAt: new Date('2024-07-29T08:30:00'),
            totalLoginCount: 1247
          },
          permissions: ['all'],
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-07-29'),
          lastActivityAt: new Date('2024-07-29T10:15:00')
        },
        {
          id: '2',
          email: 'zeynep.demir@netnext.com',
          displayName: 'Zeynep Demir',
          firstName: 'Zeynep',
          lastName: 'Demir',
          avatar: '/api/placeholder/100/100',
          role: 'editor',
          status: 'active',
          emailVerified: true,
          phone: '+90 555 234 5678',
          bio: 'Spor editörü ve muhabiri',
          location: 'Ankara, Türkiye',
          socialMedia: {
            twitter: '@zeynepdemir',
            linkedin: '',
            facebook: '',
            instagram: 'zeynepdemirspor'
          },
          stats: {
            articlesCount: 127,
            commentsCount: 89,
            likesReceived: 1456,
            viewsReceived: 47820,
            lastLoginAt: new Date('2024-07-28T16:45:00'),
            totalLoginCount: 567
          },
          permissions: ['create', 'edit', 'publish', 'moderate'],
          createdAt: new Date('2024-02-15'),
          updatedAt: new Date('2024-07-28'),
          lastActivityAt: new Date('2024-07-28T18:20:00')
        },
        {
          id: '3',
          email: 'can.ozkan@netnext.com',
          displayName: 'Can Özkan',
          firstName: 'Can',
          lastName: 'Özkan',
          avatar: '/api/placeholder/100/100',
          role: 'author',
          status: 'active',
          emailVerified: true,
          bio: 'Ekonomi ve finans yazarı',
          location: 'İzmir, Türkiye',
          socialMedia: {
            twitter: '',
            linkedin: '',
            facebook: '',
            instagram: ''
          },
          stats: {
            articlesCount: 78,
            commentsCount: 45,
            likesReceived: 923,
            viewsReceived: 32450,
            lastLoginAt: new Date('2024-07-27T14:20:00'),
            totalLoginCount: 234
          },
          permissions: ['create', 'edit'],
          createdAt: new Date('2024-03-01'),
          updatedAt: new Date('2024-07-27'),
          lastActivityAt: new Date('2024-07-27T15:30:00')
        },
        {
          id: '4',
          email: 'ayse.kara@gmail.com',
          displayName: 'Ayşe Kara',
          firstName: 'Ayşe',
          lastName: 'Kara',
          role: 'subscriber',
          status: 'active',
          emailVerified: true,
          bio: 'Aktif okuyucu ve yorum yazarı',
          socialMedia: {
            twitter: '',
            linkedin: '',
            facebook: '',
            instagram: ''
          },
          stats: {
            articlesCount: 0,
            commentsCount: 234,
            likesReceived: 0,
            viewsReceived: 0,
            lastLoginAt: new Date('2024-07-29T09:15:00'),
            totalLoginCount: 89
          },
          permissions: ['read', 'comment'],
          createdAt: new Date('2024-06-15'),
          updatedAt: new Date('2024-07-29'),
          lastActivityAt: new Date('2024-07-29T09:45:00')
        },
        {
          id: '5',
          email: 'mehmet.yilmaz@suspended.com',
          displayName: 'Mehmet Yılmaz',
          firstName: 'Mehmet',
          lastName: 'Yılmaz',
          role: 'subscriber',
          status: 'suspended',
          emailVerified: false,
          bio: 'Askıya alınmış kullanıcı',
          socialMedia: {
            twitter: '',
            linkedin: '',
            facebook: '',
            instagram: ''
          },
          stats: {
            articlesCount: 0,
            commentsCount: 15,
            likesReceived: 0,
            viewsReceived: 0,
            lastLoginAt: new Date('2024-07-20T12:30:00'),
            totalLoginCount: 23
          },
          permissions: [],
          createdAt: new Date('2024-07-01'),
          updatedAt: new Date('2024-07-20'),
          lastActivityAt: new Date('2024-07-20T12:30:00')
        }
      ]

      setUsers(mockUsers)
    } catch (error) {
      console.error('Kullanıcılar yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadUserStats = async () => {
    try {
      // Mock data - gerçek uygulamada analytics'ten gelir
      const stats: UserStats = {
        total: 1247,
        active: 892,
        inactive: 234,
        suspended: 15,
        newThisMonth: 156,
        growthRate: 12.3
      }
      
      setUserStats(stats)
    } catch (error) {
      console.error('Kullanıcı istatistikleri yüklenirken hata:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingUser) {
        // Güncelle
        const updatedUser: User = {
          ...editingUser,
          ...formData,
          updatedAt: new Date()
        }
        
        setUsers(prev => prev.map(user => user.id === editingUser.id ? updatedUser : user))
      } else {
        // Yeni ekle
        const newUser: User = {
          id: Date.now().toString(),
          ...formData,
          avatar: '/api/placeholder/100/100',
          emailVerified: false,
          stats: {
            articlesCount: 0,
            commentsCount: 0,
            likesReceived: 0,
            viewsReceived: 0,
            lastLoginAt: new Date(),
            totalLoginCount: 0
          },
          permissions: userRoles.find(role => role.id === formData.role)?.permissions || ['read'],
          createdAt: new Date(),
          updatedAt: new Date(),
          lastActivityAt: new Date()
        }
        
        setUsers(prev => [newUser, ...prev])
      }
      
      // Form'u temizle ve modal'ı kapat
      setFormData({
        email: '',
        displayName: '',
        firstName: '',
        lastName: '',
        role: 'subscriber',
        status: 'active',
        phone: '',
        bio: '',
        location: '',
        website: '',
        socialMedia: {
          twitter: '',
          linkedin: '',
          facebook: '',
          instagram: ''
        }
      })
      setEditingUser(null)
      setModalOpen(false)
      
    } catch (error) {
      console.error('Kullanıcı kaydedilirken hata:', error)
    }
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      email: user.email,
      displayName: user.displayName,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      role: user.role,
      status: user.status,
      phone: user.phone || '',
      bio: user.bio || '',
      location: user.location || '',
      website: user.website || '',
      socialMedia: user.socialMedia || {
        twitter: '',
        linkedin: '',
        facebook: '',
        instagram: ''
      }
    })
    setModalOpen(true)
  }

  const handleDelete = async (userIds: string[]) => {
    if (!confirm(`${userIds.length} kullanıcıyı silmek istediğinizden emin misiniz?`)) return
    
    try {
      setUsers(prev => prev.filter(user => !userIds.includes(user.id)))
      setSelectedUsers([])
    } catch (error) {
      console.error('Kullanıcı silinirken hata:', error)
    }
  }

  const handleStatusChange = async (userIds: string[], newStatus: User['status']) => {
    try {
      setUsers(prev => prev.map(user => 
        userIds.includes(user.id) 
          ? { ...user, status: newStatus, updatedAt: new Date() }
          : user
      ))
      setSelectedUsers([])
    } catch (error) {
      console.error('Kullanıcı durumu güncellenirken hata:', error)
    }
  }

  const getRoleInfo = (role: string) => {
    return userRoles.find(r => r.id === role) || userRoles[3]
  }

  const getStatusInfo = (status: string) => {
    return userStatuses.find(s => s.id === status) || userStatuses[1]
  }

  const formatLastActivity = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor(diff / (1000 * 60))
    
    if (days > 0) return `${days} gün önce`
    if (hours > 0) return `${hours} saat önce`
    if (minutes > 0) return `${minutes} dakika önce`
    return 'Az önce'
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === 'all' || user.role === selectedRole
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus
    return matchesSearch && matchesRole && matchesStatus
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
          <h1 className="text-3xl font-bold text-gray-900">Kullanıcı Yönetimi</h1>
          <p className="text-gray-600 mt-2">Platform kullanıcılarını ve yetkilendirmelerini yönetin</p>
        </div>
        
        <div className="flex items-center gap-3">
          {selectedUsers.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleStatusChange(selectedUsers, 'active')}
                className="inline-flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <CheckCircle className="h-4 w-4" />
                Aktifleştir
              </button>
              <button
                onClick={() => handleStatusChange(selectedUsers, 'suspended')}
                className="inline-flex items-center gap-2 px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
              >
                <Ban className="h-4 w-4" />
                Askıya Al
              </button>
              <button
                onClick={() => handleDelete(selectedUsers)}
                className="inline-flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                <Trash2 className="h-4 w-4" />
                Sil ({selectedUsers.length})
              </button>
            </div>
          )}
          <button
            onClick={() => {
              setEditingUser(null)
              setFormData({
                email: '',
                displayName: '',
                firstName: '',
                lastName: '',
                role: 'subscriber',
                status: 'active',
                phone: '',
                bio: '',
                location: '',
                website: '',
                socialMedia: {
                  twitter: '',
                  linkedin: '',
                  facebook: '',
                  instagram: ''
                }
              })
              setModalOpen(true)
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <UserPlus className="h-4 w-4" />
            Yeni Kullanıcı
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {userStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Toplam Kullanıcı</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.total.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Aktif</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.active.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gray-100 rounded-lg">
                <Clock className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pasif</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.inactive.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 rounded-lg">
                <Ban className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Askıda</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.suspended}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Bu Ay Yeni</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.newThisMonth}</p>
                <p className="text-xs text-green-600">+{userStats.growthRate}%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex-1 relative min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Kullanıcı ara..."
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
            {userRoles.map(role => (
              <option key={role.id} value={role.id}>{role.name}</option>
            ))}
          </select>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="all">Tüm Durumlar</option>
            {userStatuses.map(status => (
              <option key={status.id} value={status.id}>{status.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-900">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers(filteredUsers.map(user => user.id))
                      } else {
                        setSelectedUsers([])
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-900">Kullanıcı</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-900">Rol</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-900">Durum</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-900">İstatistikler</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-900">Son Aktivite</th>
                <th className="text-right py-3 px-6 text-sm font-medium text-gray-900">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => {
                const isSelected = selectedUsers.includes(user.id)
                const roleInfo = getRoleInfo(user.role)
                const statusInfo = getStatusInfo(user.status)
                
                return (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers(prev => [...prev, user.id])
                          } else {
                            setSelectedUsers(prev => prev.filter(id => id !== user.id))
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full overflow-hidden">
                          {user.avatar ? (
                            <Image
                              src={user.avatar}
                              alt={user.displayName}
                              width={40}
                              height={40}
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <Users className="h-5 w-5" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900">{user.displayName}</p>
                            {user.role === 'admin' && <Crown className="h-4 w-4 text-yellow-500" />}
                            {!user.emailVerified && <AlertCircle className="h-4 w-4 text-orange-500" />}
                          </div>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          {user.location && (
                            <div className="flex items-center gap-1 mt-1">
                              <MapPin className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-500">{user.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${roleInfo.color}`}>
                        {roleInfo.name}
                      </span>
                    </td>
                    
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        {statusInfo.name}
                      </span>
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-1">
                          <FileText className="h-3 w-3 text-gray-400" />
                          <span>{user.stats.articlesCount} makale</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3 text-gray-400" />
                          <span>{user.stats.commentsCount} yorum</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Award className="h-3 w-3 text-gray-400" />
                          <span>{user.stats.likesReceived} beğeni</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3 text-gray-400" />
                          <span>{user.stats.viewsReceived > 1000 ? `${(user.stats.viewsReceived/1000).toFixed(1)}K` : user.stats.viewsReceived} görüntüleme</span>
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-4 px-6 text-sm text-gray-600">
                      <div>
                        <p>{formatLastActivity(user.lastActivityAt)}</p>
                        <p className="text-xs text-gray-400">{user.stats.totalLoginCount} giriş</p>
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        {user.status === 'active' ? (
                          <button
                            onClick={() => handleStatusChange([user.id], 'suspended')}
                            className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          >
                            <Ban className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStatusChange([user.id], 'active')}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete([user.id])}
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
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Hiç kullanıcı bulunamadı.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingUser ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-4">Temel Bilgiler</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-posta *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Görünen İsim *
                    </label>
                    <input
                      type="text"
                      value={formData.displayName}
                      onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ad
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Soyad
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rol *
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as any }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    >
                      {userRoles.map(role => (
                        <option key={role.id} value={role.id}>{role.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Durum *
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    >
                      {userStatuses.map(status => (
                        <option key={status.id} value={status.id}>{status.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-4">İletişim Bilgileri</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Konum
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Biyografi
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {/* Social Media */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-4">Sosyal Medya</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Twitter
                    </label>
                    <input
                      type="text"
                      value={formData.socialMedia.twitter}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        socialMedia: { ...prev.socialMedia, twitter: e.target.value }
                      }))}
                      placeholder="@kullaniciadi"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn
                    </label>
                    <input
                      type="text"
                      value={formData.socialMedia.linkedin}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        socialMedia: { ...prev.socialMedia, linkedin: e.target.value }
                      }))}
                      placeholder="kullaniciadi"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Facebook
                    </label>
                    <input
                      type="text"
                      value={formData.socialMedia.facebook}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        socialMedia: { ...prev.socialMedia, facebook: e.target.value }
                      }))}
                      placeholder="kullaniciadi"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instagram
                    </label>
                    <input
                      type="text"
                      value={formData.socialMedia.instagram}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        socialMedia: { ...prev.socialMedia, instagram: e.target.value }
                      }))}
                      placeholder="@kullaniciadi"
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
                  {editingUser ? 'Güncelle' : 'Oluştur'}
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
