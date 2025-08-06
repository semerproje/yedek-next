"use client";
import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Category, CategoryNews } from '@/types/category';
import { News } from '@/types/homepage';

interface CategoryWithId extends Category {
  id: string;
}

export default function CategoryManagement() {
  const [categories, setCategories] = useState<CategoryWithId[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryWithId | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [newCategory, setNewCategory] = useState<Partial<Category>>({
    name: '',
    slug: '',
    description: '',
    active: true,
    order: 0,
    icon: '',
    color: '#3B82F6'
  });

  // Demo kategoriler
  const demoCategories: CategoryWithId[] = [
    {
      id: 'demo-1',
      name: 'Gündem',
      slug: 'gundem',
      description: 'Son dakika gündem haberleri ve gelişmeler',
      active: true,
      order: 1,
      icon: '📰',
      color: '#EF4444',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'demo-2',
      name: 'Teknoloji',
      slug: 'teknoloji',
      description: 'Teknoloji, bilim ve yenilik haberleri',
      active: true,
      order: 2,
      icon: '💻',
      color: '#3B82F6',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'demo-3',
      name: 'Spor',
      slug: 'spor',
      description: 'Futbol, basketbol ve diğer spor dalları haberleri',
      active: true,
      order: 3,
      icon: '⚽',
      color: '#10B981',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Firebase bağlantısını test et
      if (!db) {
        throw new Error('Firebase not initialized');
      }
      
      // Kategorileri yükle
      const categoriesQuery = query(collection(db, 'categories'), orderBy('order', 'asc'));
      const categoriesSnapshot = await getDocs(categoriesQuery);
      const categoriesData = categoriesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CategoryWithId[];
      
      // Haberleri yükle
      const newsQuery = query(
        collection(db, 'news'),
        where('status', '==', 'published'),
        orderBy('publishedAt', 'desc')
      );
      const newsSnapshot = await getDocs(newsQuery);
      const newsData = newsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as News[];
      
      setCategories(categoriesData);
      setNews(newsData);
      
      console.log(`✅ Loaded ${categoriesData.length} categories and ${newsData.length} news`);
      
    } catch (error: any) {
      console.error('Veri yükleme hatası:', error);
      
      // Firebase hatası durumunda demo data kullan
      console.log('🔄 Using demo data instead of Firebase');
      setCategories(demoCategories);
      setNews([]);
      
      // Kullanıcıya bilgi ver
      console.warn(`Firebase bağlantı hatası: ${error.message} - Demo kategoriler yükleniyor...`);
      
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingCategory) {
        // Kategoriyi güncelle
        await updateDoc(doc(db, 'categories', editingCategory.id), newCategory);
      } else {
        // Yeni kategori ekle
        await addDoc(collection(db, 'categories'), {
          ...newCategory,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      
      setNewCategory({
        name: '',
        slug: '',
        description: '',
        active: true,
        order: 0,
        icon: '',
        color: '#3B82F6'
      });
      setIsAddingCategory(false);
      setEditingCategory(null);
      await loadData();
      
    } catch (error) {
      console.error('Kategori kaydetme hatası:', error);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) {
      try {
        await deleteDoc(doc(db, 'categories', categoryId));
        await loadData();
      } catch (error) {
        console.error('Kategori silme hatası:', error);
      }
    }
  };

  const handleEditCategory = (category: CategoryWithId) => {
    setEditingCategory(category);
    setNewCategory({
      name: category.name,
      slug: category.slug,
      description: category.description,
      active: category.active,
      order: category.order,
      icon: category.icon,
      color: category.color
    });
    setIsAddingCategory(true);
  };

  const handleAssignNewsToCategory = async (newsId: string, categorySlug: string) => {
    try {
      await updateDoc(doc(db, 'news', newsId), {
        category: categorySlug,
        updatedAt: new Date()
      });
      await loadData();
    } catch (error) {
      console.error('Haber kategori atama hatası:', error);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const categoryColors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16'
  ];

  const categoryIcons = [
    '📰', '🌍', '💼', '⚽', '💻', '🎬', '🏛️', '📚', '💰', '🌱', '🏥', '🙏'
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Yükleniyor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Kategori Yönetimi</h1>
          <p className="text-gray-600">Kategorileri yönetin ve haberlerle eşleştirin</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Kategori Listesi */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Kategoriler</h2>
                <button
                  onClick={() => setIsAddingCategory(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  + Yeni Kategori
                </button>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200">
              {categories.map((category) => (
                <div key={category.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{category.icon}</span>
                      <div>
                        <h3 className="font-medium text-gray-900">{category.name}</h3>
                        <p className="text-sm text-gray-500">/{category.slug}</p>
                        <p className="text-xs text-gray-400">{category.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className="w-4 h-4 rounded-full border border-gray-200"
                        style={{ backgroundColor: category.color }}
                      ></span>
                      <span className={`px-2 py-1 text-xs rounded-full ${category.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {category.active ? 'Aktif' : 'Pasif'}
                      </span>
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    {news.filter(n => n.category === category.slug).length} haber
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Kategori Ekleme/Düzenleme Formu */}
          {isAddingCategory && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}
                </h2>
              </div>
              
              <form onSubmit={handleSubmitCategory} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kategori Adı
                  </label>
                  <input
                    type="text"
                    value={newCategory.name || ''}
                    onChange={(e) => {
                      const name = e.target.value;
                      setNewCategory(prev => ({
                        ...prev,
                        name,
                        slug: generateSlug(name)
                      }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={newCategory.slug || ''}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, slug: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Açıklama
                  </label>
                  <textarea
                    value={newCategory.description || ''}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      İkon
                    </label>
                    <div className="grid grid-cols-6 gap-2">
                      {categoryIcons.map((icon) => (
                        <button
                          key={icon}
                          type="button"
                          onClick={() => setNewCategory(prev => ({ ...prev, icon }))}
                          className={`p-2 text-xl border rounded-lg hover:bg-gray-50 ${(newCategory.icon || '') === icon ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Renk
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {categoryColors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setNewCategory(prev => ({ ...prev, color }))}
                          className={`w-8 h-8 rounded-lg border-2 ${(newCategory.color || '#3B82F6') === color ? 'border-gray-900' : 'border-gray-300'}`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sıra
                    </label>
                    <input
                      type="number"
                      value={newCategory.order || 0}
                      onChange={(e) => setNewCategory(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newCategory.active || false}
                        onChange={(e) => setNewCategory(prev => ({ ...prev, active: e.target.checked }))}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">Aktif</span>
                    </label>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingCategory ? 'Güncelle' : 'Kaydet'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingCategory(false);
                      setEditingCategory(null);
                      setNewCategory({
                        name: '',
                        slug: '',
                        description: '',
                        active: true,
                        order: 0,
                        icon: '',
                        color: '#3B82F6'
                      });
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Haber-Kategori Eşleştirme */}
          {!isAddingCategory && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Haber Kategori Ataması</h2>
                <div className="mt-4">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Tüm Kategoriler</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.slug}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {news
                  .filter(newsItem => !selectedCategory || newsItem.category === selectedCategory)
                  .slice(0, 20)
                  .map((newsItem) => (
                    <div key={newsItem.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 text-sm line-clamp-2">
                            {newsItem.title}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            Mevcut: {newsItem.category || 'Kategorisiz'}
                          </p>
                        </div>
                        <div className="ml-4">
                          <select
                            value={newsItem.category || ''}
                            onChange={(e) => handleAssignNewsToCategory(newsItem.id, e.target.value)}
                            className="text-xs px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="">Kategorisiz</option>
                            {categories.map((category) => (
                              <option key={category.id} value={category.slug}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
