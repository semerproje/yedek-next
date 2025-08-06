'use client'

import { useState } from 'react'
import { Shield, MessageCircle, Flag, Eye, X, Check, AlertTriangle } from 'lucide-react'

interface ModerationItem {
  id: string
  type: 'comment' | 'report' | 'user'
  content: string
  author: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: Date
  reportReason?: string
  newsTitle?: string
}

export default function ModerationPage() {
  const [items, setItems] = useState<ModerationItem[]>([
    {
      id: '1',
      type: 'comment',
      content: 'Bu haberde bazı yanlış bilgiler var gibi görünüyor.',
      author: 'ahmet_123',
      status: 'pending',
      createdAt: new Date(),
      newsTitle: 'Ekonomide Son Gelişmeler'
    },
    {
      id: '2',
      type: 'report',
      content: 'Bu kullanıcı sürekli spam yorum yapıyor.',
      author: 'reporter_user',
      status: 'pending',
      createdAt: new Date(),
      reportReason: 'Spam'
    }
  ])

  const [activeTab, setActiveTab] = useState<'all' | 'comments' | 'reports' | 'users'>('all')

  const handleApprove = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, status: 'approved' as const } : item
    ))
  }

  const handleReject = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, status: 'rejected' as const } : item
    ))
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700'
    }
    
    const labels = {
      pending: 'Bekliyor',
      approved: 'Onaylandı',
      rejected: 'Reddedildi'
    }

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    )
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'comment':
        return <MessageCircle className="h-5 w-5 text-blue-500" />
      case 'report':
        return <Flag className="h-5 w-5 text-red-500" />
      case 'user':
        return <Shield className="h-5 w-5 text-purple-500" />
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />
    }
  }

  const filteredItems = items.filter(item => {
    if (activeTab === 'all') return true
    if (activeTab === 'comments') return item.type === 'comment'
    if (activeTab === 'reports') return item.type === 'report'
    if (activeTab === 'users') return item.type === 'user'
    return true
  })

  const tabs = [
    { id: 'all', label: 'Tümü', count: items.length },
    { id: 'comments', label: 'Yorumlar', count: items.filter(i => i.type === 'comment').length },
    { id: 'reports', label: 'Şikayetler', count: items.filter(i => i.type === 'report').length },
    { id: 'users', label: 'Kullanıcılar', count: items.filter(i => i.type === 'user').length }
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Shield className="h-6 w-6" />
              İçerik Moderasyonu
            </h1>
            <p className="text-gray-600 mt-1">Yorumları ve şikayetleri inceleyin ve yönetin</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {items.filter(i => i.status === 'pending').length}
              </h3>
              <p className="text-sm text-gray-600">Bekleyen</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {items.filter(i => i.status === 'approved').length}
              </h3>
              <p className="text-sm text-gray-600">Onaylandı</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 rounded-lg">
              <X className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {items.filter(i => i.status === 'rejected').length}
              </h3>
              <p className="text-sm text-gray-600">Reddedildi</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Eye className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {items.length}
              </h3>
              <p className="text-sm text-gray-600">Toplam</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>

        {/* Content List */}
        <div className="divide-y divide-gray-200">
          {filteredItems.map((item) => (
            <div key={item.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {getTypeIcon(item.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-sm font-medium text-gray-900">
                      {item.author}
                    </h3>
                    {getStatusBadge(item.status)}
                    <span className="text-xs text-gray-500">
                      {item.createdAt.toLocaleString('tr-TR')}
                    </span>
                  </div>
                  
                  {item.newsTitle && (
                    <p className="text-xs text-blue-600 mb-2">
                      Haber: {item.newsTitle}
                    </p>
                  )}
                  
                  {item.reportReason && (
                    <p className="text-xs text-red-600 mb-2">
                      Şikayet Nedeni: {item.reportReason}
                    </p>
                  )}
                  
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {item.content}
                  </p>
                </div>
                
                {item.status === 'pending' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApprove(item.id)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                      title="Onayla"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleReject(item.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Reddet"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="p-12 text-center">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Moderasyon öğesi bulunamadı</h3>
            <p className="text-gray-600">
              {activeTab === 'all' 
                ? 'Henüz moderasyon bekleyen içerik bulunmuyor.'
                : `${tabs.find(t => t.id === activeTab)?.label} kategorisinde öğe bulunmuyor.`}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
