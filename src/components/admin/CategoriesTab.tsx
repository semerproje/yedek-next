'use client'

import { useState, useEffect } from 'react'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Tag, 
  ArrowUp, 
  ArrowDown, 
  Save, 
  X,
  Palette,
  Hash
} from 'lucide-react'
import { CategoryService } from '@/lib/services/homepageService'
import { CategoryManagement } from '@/types/admin'

interface CategoryFormProps {
  category?: CategoryManagement
  onSave: (category: Partial<CategoryManagement>) => void
  onCancel: () => void
}

const CategoryForm = ({ category, onSave, onCancel }: CategoryFormProps) => {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    description: category?.description || '',
    color: category?.color || '#3B82F6',
    icon: category?.icon || '',
    active: category?.active ?? true,
    parentId: category?.parentId || ''
  })

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: prev.slug || generateSlug(name)
    }))
  }

  const colorPresets = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4">
          {category ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Kategori Adı</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Spor, Ekonomi, Teknoloji..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">URL Kısaltması (Slug)</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              className="w-full border rounded px-3 py-2"
              placeholder="spor, ekonomi, teknoloji..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Açıklama</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full border rounded px-3 py-2 h-20"
              placeholder="Kategori açıklaması (opsiyonel)"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Renk</label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                className="w-12 h-8 rounded border"
              />
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                className="flex-1 border rounded px-3 py-2"
                placeholder="#3B82F6"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {colorPresets.map(color => (
                <button
                  key={color}
                  onClick={() => setFormData(prev => ({ ...prev, color }))}
                  className="w-8 h-8 rounded border-2 hover:scale-110 transition"
                  style={{ 
                    backgroundColor: color,
                    borderColor: formData.color === color ? '#000' : '#e5e7eb'
                  }}
                />
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">İkon (Lucide Icon Adı)</label>
            <input
              type="text"
              value={formData.icon}
              onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
              className="w-full border rounded px-3 py-2"
              placeholder="Newspaper, TrendingUp, Globe..."
            />
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
        
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 border rounded hover:bg-gray-50"
          >
            İptal
          </button>
          <button
            onClick={() => onSave(formData)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Kaydet
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CategoriesTab() {
  const [categories, setCategories] = useState<CategoryManagement[]>([])
  const [loading, setLoading] = useState(true)
  const [editingCategory, setEditingCategory] = useState<CategoryManagement | null>(null)
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    setLoading(true)
    try {
      const data = await CategoryService.getCategories()
      setCategories(data)
    } catch (error) {
      console.error('Error loading categories:', error)
    }
    setLoading(false)
  }

  const handleToggleActive = async (categoryId: string, active: boolean) => {
    try {
      await CategoryService.updateCategory(categoryId, { active })
      setCategories(prev => prev.map(c => 
        c.id === categoryId ? { ...c, active } : c
      ))
    } catch (error) {
      console.error('Error toggling category:', error)
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) return
    
    try {
      await CategoryService.deleteCategory(categoryId)
      setCategories(prev => prev.filter(c => c.id !== categoryId))
    } catch (error) {
      console.error('Error deleting category:', error)
    }
  }

  const handleReorder = async (categoryId: string, direction: 'up' | 'down') => {
    const sortedCategories = [...categories].sort((a, b) => a.order - b.order)
    const currentIndex = sortedCategories.findIndex(c => c.id === categoryId)
    
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === sortedCategories.length - 1)
    ) {
      return
    }
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    const reorderedCategories = [...sortedCategories]
    
    // Swap positions
    ;[reorderedCategories[currentIndex], reorderedCategories[newIndex]] = 
    [reorderedCategories[newIndex], reorderedCategories[currentIndex]]
    
    // Update order values
    reorderedCategories.forEach((category, index) => {
      category.order = index
    })
    
    try {
      // Update each category's order in Firebase
      await Promise.all(
        reorderedCategories.map(category => 
          CategoryService.updateCategory(category.id, { order: category.order })
        )
      )
      setCategories(reorderedCategories)
    } catch (error) {
      console.error('Error reordering categories:', error)
    }
  }

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.slug.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Kategoriler yükleniyor...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Kategori Yönetimi</h2>
          <p className="text-gray-600 mt-1">
            Haber kategorilerini düzenleyin ve yönetin
          </p>
        </div>
        <button
          onClick={() => setShowCategoryForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Yeni Kategori
        </button>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Kategori ara..."
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sıra</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Haber Sayısı</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Son Güncelleme</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCategories.sort((a, b) => a.order - b.order).map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium">{category.order + 1}</span>
                      <div className="flex flex-col gap-1 ml-2">
                        <button
                          onClick={() => handleReorder(category.id, 'up')}
                          className="p-1 hover:bg-gray-200 rounded"
                          disabled={category.order === 0}
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleReorder(category.id, 'down')}
                          className="p-1 hover:bg-gray-200 rounded"
                          disabled={category.order === categories.length - 1}
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: category.color }}
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {category.name}
                        </div>
                        {category.description && (
                          <div className="text-sm text-gray-500">
                            {category.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 font-mono">
                      {category.slug}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Hash className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {category.newsCount || 0}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleActive(category.id, !category.active)}
                      className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                        category.active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {category.active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {category.active ? 'Aktif' : 'Pasif'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {category.lastModified?.toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingCategory(category)}
                        className="p-2 hover:bg-gray-100 rounded"
                        title="Düzenle"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="p-2 hover:bg-red-100 rounded text-red-600"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-blue-600" />
            <div>
              <div className="text-sm text-gray-600">Toplam Kategori</div>
              <div className="text-xl font-bold">{categories.length}</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-green-600" />
            <div>
              <div className="text-sm text-gray-600">Aktif Kategori</div>
              <div className="text-xl font-bold">
                {categories.filter(c => c.active).length}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-2">
            <Hash className="w-5 h-5 text-purple-600" />
            <div>
              <div className="text-sm text-gray-600">Toplam Haber</div>
              <div className="text-xl font-bold">
                {categories.reduce((sum, c) => sum + (c.newsCount || 0), 0)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Form Modal */}
      {(showCategoryForm || editingCategory) && (
        <CategoryForm
          category={editingCategory || undefined}
          onSave={async (categoryData) => {
            try {
              if (editingCategory) {
                await CategoryService.updateCategory(editingCategory.id, categoryData)
                setCategories(prev => prev.map(c => 
                  c.id === editingCategory.id 
                    ? { ...c, ...categoryData, lastModified: new Date() }
                    : c
                ))
              } else {
                const newCategory = {
                  ...categoryData,
                  order: categories.length
                } as Omit<CategoryManagement, 'id' | 'createdAt' | 'lastModified' | 'newsCount'>
                
                const id = await CategoryService.createCategory(newCategory)
                const createdCategory: CategoryManagement = {
                  id,
                  ...newCategory,
                  newsCount: 0,
                  createdAt: new Date(),
                  lastModified: new Date()
                }
                setCategories(prev => [...prev, createdCategory])
              }
              
              setShowCategoryForm(false)
              setEditingCategory(null)
            } catch (error) {
              console.error('Error saving category:', error)
            }
          }}
          onCancel={() => {
            setShowCategoryForm(false)
            setEditingCategory(null)
          }}
        />
      )}
    </div>
  )
}
