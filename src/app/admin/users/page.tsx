'use client'

import { useEffect, useState } from 'react'
import { 
  collection, 
  query, 
  getDocs, 
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
  where
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { safeUpdateDoc } from '@/lib/safe-firebase-utils'
import { 
  Users, 
  Plus, 
  Edit3, 
  Trash2, 
  Shield, 
  ShieldCheck,
  UserX,
  Search,
  Filter,
  Mail,
  Calendar,
  MoreVertical
} from 'lucide-react'

interface User {
  id: string
  email: string
  displayName: string
  role: 'admin' | 'editor' | 'author' | 'subscriber'
  status: 'active' | 'suspended' | 'pending'
  createdAt: Timestamp
  lastLoginAt?: Timestamp
  newsCount: number
  permissions: string[]
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    loadUsers()
  }, [roleFilter, statusFilter])

  const loadUsers = async () => {
    if (!db) return

    try {
      let q = query(collection(db, 'users'), orderBy('createdAt', 'desc'))
      
      if (roleFilter !== 'all') {
        q = query(q, where('role', '==', roleFilter))
      }
      
      if (statusFilter !== 'all') {
        q = query(q, where('status', '==', statusFilter))
      }

      const snapshot = await getDocs(q)
      const usersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[]

      setUsers(usersData)
    } catch (error) {
      console.error('Kullanıcılar yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateUserRole = async (userId: string, newRole: string) => {
    if (!db) return

    try {
      const result = await safeUpdateDoc(doc(db, 'users', userId), {
        role: newRole,
        updatedAt: Timestamp.now()
      })
      
      if (result.success) {
        setUsers(prev => prev.map(user => 
          user.id === userId ? { ...user, role: newRole as any } : user
        ))
      } else {
        console.error('Failed to update user role:', result.error)
      }
    } catch (error) {
      console.error('Kullanıcı rolü güncellenirken hata:', error)
    }
  }

  const updateUserStatus = async (userId: string, newStatus: string) => {
    if (!db) return

    try {
      const result = await safeUpdateDoc(doc(db, 'users', userId), {
        status: newStatus,
        updatedAt: Timestamp.now()
      })
      
      if (result.success) {
        setUsers(prev => prev.map(user => 
          user.id === userId ? { ...user, status: newStatus as any } : user
        ))
      } else {
        console.error('Failed to update user status:', result.error)
      }
    } catch (error) {
      console.error('Kullanıcı durumu güncellenirken hata:', error)
    }
  }

  const deleteUser = async (userId: string) => {
    if (!db || !confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) return

    try {
      await deleteDoc(doc(db, 'users', userId))
      setUsers(prev => prev.filter(user => user.id !== userId))
    } catch (error) {
      console.error('Kullanıcı silinirken hata:', error)
    }
  }

  const getRoleBadge = (role: string) => {
    const badges = {
      admin: 'bg-red-100 text-red-700',
      editor: 'bg-blue-100 text-blue-700',
      author: 'bg-green-100 text-green-700',
      subscriber: 'bg-gray-100 text-gray-700'
    }
    
    const labels = {
      admin: 'Admin',
      editor: 'Editör',
      author: 'Yazar',
      subscriber: 'Abone'
    }

    const icons = {
      admin: ShieldCheck,
      editor: Shield,
      author: Edit3,
      subscriber: Users
    }

    const Icon = icons[role as keyof typeof icons]

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${badges[role as keyof typeof badges]}`}>
        <Icon className="h-3 w-3" />
        {labels[role as keyof typeof labels]}
      </span>
    )
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      active: 'bg-green-100 text-green-700',
      suspended: 'bg-red-100 text-red-700',
      pending: 'bg-yellow-100 text-yellow-700'
    }
    
    const labels = {
      active: 'Aktif',
      suspended: 'Askıya Alındı',
      pending: 'Bekliyor'
    }

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    )
  }

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const roles = [
    { value: 'all', label: 'Tüm Roller' },
    { value: 'admin', label: 'Admin' },
    { value: 'editor', label: 'Editör' },
    { value: 'author', label: 'Yazar' },
    { value: 'subscriber', label: 'Abone' }
  ]

  const statuses = [
    { value: 'all', label: 'Tüm Durumlar' },
    { value: 'active', label: 'Aktif' },
    { value: 'suspended', label: 'Askıya Alındı' },
    { value: 'pending', label: 'Bekliyor' }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="h-6 w-6" />
              Kullanıcı Yönetimi
            </h1>
            <p className="text-gray-600 mt-1">Kullanıcı rollerini ve izinlerini yönetin</p>
          </div>
          <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Yeni Kullanıcı
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 rounded-lg">
              <ShieldCheck className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.role === 'admin').length}
              </h3>
              <p className="text-sm text-gray-600">Admin</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.role === 'editor').length}
              </h3>
              <p className="text-sm text-gray-600">Editör</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Edit3 className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.role === 'author').length}
              </h3>
              <p className="text-sm text-gray-600">Yazar</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gray-100 rounded-lg">
              <Users className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.role === 'subscriber').length}
              </h3>
              <p className="text-sm text-gray-600">Abone</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Kullanıcı ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            {roles.map(role => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            {statuses.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>

          {/* Results Count */}
          <div className="flex items-center text-sm text-gray-600">
            <Filter className="h-4 w-4 mr-2" />
            {filteredUsers.length} kullanıcı bulundu
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kullanıcı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kayıt Tarihi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Haber Sayısı
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {user.displayName?.charAt(0) || user.email.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {user.displayName || 'İsimsiz Kullanıcı'}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(user.status)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {user.createdAt?.toDate?.()?.toLocaleDateString('tr-TR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {user.newsCount || 0} haber
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Role Change */}
                      <select
                        value={user.role}
                        onChange={(e) => updateUserRole(user.id, e.target.value)}
                        className="text-xs px-2 py-1 border border-gray-300 rounded"
                      >
                        <option value="subscriber">Abone</option>
                        <option value="author">Yazar</option>
                        <option value="editor">Editör</option>
                        <option value="admin">Admin</option>
                      </select>

                      {/* Status Toggle */}
                      {user.status === 'active' ? (
                        <button
                          onClick={() => updateUserStatus(user.id, 'suspended')}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Askıya Al"
                        >
                          <UserX className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => updateUserStatus(user.id, 'active')}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                          title="Aktif Yap"
                        >
                          <Users className="h-4 w-4" />
                        </button>
                      )}

                      {/* Delete */}
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Sil"
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
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Kullanıcı bulunamadı</h3>
          <p className="text-gray-600">
            {searchTerm || roleFilter !== 'all' || statusFilter !== 'all'
              ? 'Arama kriterlerinize uygun kullanıcı bulunamadı.'
              : 'Henüz hiç kullanıcı kayıtlı değil.'}
          </p>
        </div>
      )}
    </div>
  )
}
