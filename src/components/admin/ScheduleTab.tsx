'use client'

import { useState, useEffect } from 'react'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Clock, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  PlayCircle, 
  PauseCircle,
  Eye,
  Search,
  Filter,
  ArrowUpDown,
  Star,
  User,
  AlertCircle
} from 'lucide-react'
import { PublishingService, CategoryService } from '@/lib/services/homepageService'
import { PublishingSchedule, CategoryManagement } from '@/types/admin'

interface ScheduleFormProps {
  schedule?: PublishingSchedule
  categories: CategoryManagement[]
  modules: Array<{ key: string; name: string }>
  onSave: (schedule: Partial<PublishingSchedule>) => void
  onCancel: () => void
}

const ScheduleForm = ({ schedule, categories, modules, onSave, onCancel }: ScheduleFormProps) => {
  const [formData, setFormData] = useState({
    moduleKey: schedule?.moduleKey || '',
    newsId: schedule?.newsId || '',
    publishAt: schedule?.publishAt ? schedule.publishAt.toISOString().slice(0, 16) : '',
    unpublishAt: schedule?.unpublishAt ? schedule.unpublishAt.toISOString().slice(0, 16) : '',
    priority: schedule?.priority || 1,
    createdBy: schedule?.createdBy || 'current-user' // In real app, get from auth
  })

  const [selectedNews, setSelectedNews] = useState<any>(null)
  const [newsSearchTerm, setNewsSearchTerm] = useState('')
  const [availableNews, setAvailableNews] = useState<any[]>([])

  // Mock news data - in real app, fetch from Firebase
  useEffect(() => {
    // Mock data for demo
    setAvailableNews([
      {
        id: '1',
        title: 'Türkiye Ekonomisinde Yeni Gelişmeler',
        category: 'ekonomi',
        author: 'Ahmet Yılmaz',
        publishedAt: new Date(),
        featured: true
      },
      {
        id: '2', 
        title: 'Teknoloji Sektöründe Büyük Yatırım',
        category: 'teknoloji',
        author: 'Mehmet Kaya',
        publishedAt: new Date(),
        featured: false
      }
    ])
  }, [])

  const filteredNews = availableNews.filter(news =>
    news.title.toLowerCase().includes(newsSearchTerm.toLowerCase())
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4">
          {schedule ? 'Yayın Programı Düzenle' : 'Yeni Yayın Programla'}
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Basic Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Temel Bilgiler</h4>
            
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
                    {module.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Öncelik</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) }))}
                className="w-full border rounded px-3 py-2"
              >
                <option value={1}>Düşük</option>
                <option value={2}>Normal</option>
                <option value={3}>Yüksek</option>
                <option value={4}>Kritik</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Yayın Tarihi</label>
              <input
                type="datetime-local"
                value={formData.publishAt}
                onChange={(e) => setFormData(prev => ({ ...prev, publishAt: e.target.value }))}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Kaldırma Tarihi (Opsiyonel)</label>
              <input
                type="datetime-local"
                value={formData.unpublishAt}
                onChange={(e) => setFormData(prev => ({ ...prev, unpublishAt: e.target.value }))}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          {/* Right Column - News Selection */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Haber Seçimi</h4>
            
            <div>
              <label className="block text-sm font-medium mb-1">Haber Ara</label>
              <input
                type="text"
                value={newsSearchTerm}
                onChange={(e) => setNewsSearchTerm(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="Haber başlığı ile ara..."
              />
            </div>
            
            <div className="max-h-64 overflow-y-auto border rounded">
              {filteredNews.map(news => (
                <div
                  key={news.id}
                  onClick={() => {
                    setSelectedNews(news)
                    setFormData(prev => ({ ...prev, newsId: news.id }))
                  }}
                  className={`p-3 cursor-pointer border-b hover:bg-gray-50 ${
                    formData.newsId === news.id ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <div className="font-medium text-sm">{news.title}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                    <span>{news.category}</span>
                    <span>•</span>
                    <span>{news.author}</span>
                    {news.featured && (
                      <>
                        <span>•</span>
                        <Star className="w-3 h-3 text-yellow-500" />
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {selectedNews && (
              <div className="bg-green-50 border border-green-200 rounded p-3">
                <div className="font-medium text-sm text-green-900">Seçili Haber:</div>
                <div className="text-sm text-green-800">{selectedNews.title}</div>
              </div>
            )}
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
            onClick={() => onSave({
              ...formData,
              publishAt: new Date(formData.publishAt),
              unpublishAt: formData.unpublishAt ? new Date(formData.unpublishAt) : undefined
            })}
            disabled={!formData.moduleKey || !formData.newsId || !formData.publishAt}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Kaydet
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ScheduleTab() {
  const [schedules, setSchedules] = useState<PublishingSchedule[]>([])
  const [categories, setCategories] = useState<CategoryManagement[]>([])
  const [loading, setLoading] = useState(true)
  const [editingSchedule, setEditingSchedule] = useState<PublishingSchedule | null>(null)
  const [showScheduleForm, setShowScheduleForm] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Available modules for scheduling
  const availableModules = [
    { key: 'breaking-news', name: 'Son Dakika' },
    { key: 'headlines', name: 'Manşet' },
    { key: 'editor-picks', name: 'Editörün Seçimi' },
    { key: 'popular-news', name: 'Popüler' },
    { key: 'main-headline', name: 'Ana Manşet' }
  ]

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [schedulesData, categoriesData] = await Promise.all([
        PublishingService.getScheduledContent(),
        CategoryService.getCategories()
      ])
      
      setSchedules(schedulesData)
      setCategories(categoriesData)
    } catch (error) {
      console.error('Error loading data:', error)
    }
    setLoading(false)
  }

  const handleUpdateStatus = async (scheduleId: string, status: 'scheduled' | 'published' | 'expired') => {
    try {
      await PublishingService.updateSchedule(scheduleId, { status })
      setSchedules(prev => prev.map(s => 
        s.id === scheduleId ? { ...s, status } : s
      ))
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const handleDeleteSchedule = async (scheduleId: string) => {
    if (!confirm('Bu programı silmek istediğinizden emin misiniz?')) return
    
    try {
      // Note: Need to add delete method to service
      setSchedules(prev => prev.filter(s => s.id !== scheduleId))
    } catch (error) {
      console.error('Error deleting schedule:', error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return Clock
      case 'published': return CheckCircle
      case 'expired': return XCircle
      default: return AlertCircle
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'text-blue-600 bg-blue-100'
      case 'published': return 'text-green-600 bg-green-100'
      case 'expired': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 4: return 'text-red-600 bg-red-100'
      case 3: return 'text-orange-600 bg-orange-100'
      case 2: return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 4: return 'Kritik'
      case 3: return 'Yüksek'
      case 2: return 'Normal'
      default: return 'Düşük'
    }
  }

  const getModuleName = (moduleKey: string) => {
    const module = availableModules.find(m => m.key === moduleKey)
    return module ? module.name : moduleKey
  }

  const filteredSchedules = schedules.filter(schedule => {
    const matchesStatus = filterStatus === 'all' || schedule.status === filterStatus
    const matchesSearch = 
      getModuleName(schedule.moduleKey).toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.newsId.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesStatus && matchesSearch
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Yayın programı yükleniyor...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Yayın Programı</h2>
          <p className="text-gray-600 mt-1">
            Haberlerin yayınlanma zamanlarını planlayın ve yönetin
          </p>
        </div>
        <button
          onClick={() => setShowScheduleForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Yeni Program
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="max-w-xs">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Program ara..."
            className="w-full border rounded px-3 py-2"
          />
        </div>
        
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="all">Tüm Durumlar</option>
          <option value="scheduled">Programlı</option>
          <option value="published">Yayınlandı</option>
          <option value="expired">Süresi Doldu</option>
        </select>
      </div>

      {/* Schedule Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Modül</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Haber</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Yayın Tarihi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Öncelik</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Oluşturan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSchedules.map((schedule) => {
                const StatusIcon = getStatusIcon(schedule.status)
                
                return (
                  <tr key={schedule.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {getModuleName(schedule.moduleKey)}
                      </div>
                      <div className="text-sm text-gray-500">{schedule.moduleKey}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">Haber ID: {schedule.newsId}</div>
                      <div className="text-sm text-gray-500">
                        {/* In real app, fetch news title */}
                        Haber başlığı burada olacak
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {schedule.publishAt.toLocaleDateString('tr-TR')}
                      </div>
                      <div className="text-sm text-gray-500">
                        {schedule.publishAt.toLocaleTimeString('tr-TR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                      {schedule.unpublishAt && (
                        <div className="text-xs text-red-600 mt-1">
                          Bitiş: {schedule.unpublishAt.toLocaleDateString('tr-TR')}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(schedule.priority)}`}>
                        {getPriorityLabel(schedule.priority)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const newStatus = schedule.status === 'scheduled' ? 'published' : 'scheduled'
                            handleUpdateStatus(schedule.id, newStatus)
                          }}
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(schedule.status)}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {schedule.status === 'scheduled' && 'Programlı'}
                          {schedule.status === 'published' && 'Yayında'}
                          {schedule.status === 'expired' && 'Süresi Doldu'}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{schedule.createdBy}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {schedule.createdAt.toLocaleDateString('tr-TR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingSchedule(schedule)}
                          className="p-2 hover:bg-gray-100 rounded"
                          title="Düzenle"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSchedule(schedule.id)}
                          className="p-2 hover:bg-red-100 rounded text-red-600"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredSchedules.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Programlanmış içerik yok
          </h3>
          <p className="text-gray-600 mb-4">
            İlk yayın programınızı oluşturun
          </p>
          <button
            onClick={() => setShowScheduleForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Program Ekle
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <div>
              <div className="text-sm text-gray-600">Programlı</div>
              <div className="text-xl font-bold">
                {schedules.filter(s => s.status === 'scheduled').length}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <div className="text-sm text-gray-600">Yayında</div>
              <div className="text-xl font-bold">
                {schedules.filter(s => s.status === 'published').length}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-600" />
            <div>
              <div className="text-sm text-gray-600">Süresi Doldu</div>
              <div className="text-xl font-bold">
                {schedules.filter(s => s.status === 'expired').length}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-600" />
            <div>
              <div className="text-sm text-gray-600">Yüksek Öncelik</div>
              <div className="text-xl font-bold">
                {schedules.filter(s => s.priority >= 3).length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Form Modal */}
      {(showScheduleForm || editingSchedule) && (
        <ScheduleForm
          schedule={editingSchedule || undefined}
          categories={categories}
          modules={availableModules}
          onSave={async (scheduleData) => {
            try {
              if (editingSchedule) {
                await PublishingService.updateSchedule(editingSchedule.id, scheduleData)
                setSchedules(prev => prev.map(s => 
                  s.id === editingSchedule.id 
                    ? { ...s, ...scheduleData }
                    : s
                ))
              } else {
                const newSchedule = {
                  ...scheduleData,
                  status: 'scheduled' as const
                } as Omit<PublishingSchedule, 'id' | 'createdAt'>
                
                const id = await PublishingService.scheduleContent(newSchedule)
                const createdSchedule: PublishingSchedule = {
                  id,
                  ...newSchedule,
                  createdAt: new Date()
                }
                setSchedules(prev => [...prev, createdSchedule])
              }
              
              setShowScheduleForm(false)
              setEditingSchedule(null)
            } catch (error) {
              console.error('Error saving schedule:', error)
            }
          }}
          onCancel={() => {
            setShowScheduleForm(false)
            setEditingSchedule(null)
          }}
        />
      )}
    </div>
  )
}
