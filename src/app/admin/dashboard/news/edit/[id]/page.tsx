'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import Link from 'next/link'
import { 
  ArrowLeft,
  Save,
  Eye,
  Globe,
  XCircle,
  Image as ImageIcon,
  Tag,
  User,
  Calendar
} from 'lucide-react'

interface NewsItem {
  id: string
  title: string
  summary: string
  content: string
  category: string
  tags: string[]
  imageUrl?: string
  author: string
  status: 'draft' | 'published' | 'archived' | 'review'
  featured: boolean
}

export default function EditNews() {
  const params = useParams()
  const router = useRouter()
  const [news, setNews] = useState<NewsItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const categories = [
    'gundem', 'spor', 'ekonomi', 'teknoloji', 'din', 'politika',
    'kultur', 'magazin', 'saglik', 'egitim', 'dunya', 'cevre'
  ]

  useEffect(() => {
    if (params.id) {
      console.log(`🔧 Edit sayfası yükleniyor - Haber ID: ${params.id}`)
      loadNews(params.id as string)
    }
  }, [params.id])

  const loadNews = async (newsId: string) => {
    console.log(`📖 Haber yükleniyor: ${newsId}`)
    
    if (!db) {
      console.warn('Firebase mevcut değil, demo veri yükleniyor')
      // Demo data for when Firebase is not available
      setNews({
        id: newsId,
        title: 'Demo Haber Başlığı',
        summary: 'Bu bir demo haberin özeti.',
        content: 'Bu demo haberin içeriğidir. Firebase bağlantısı olmadığı için demo veriler gösteriliyor.',
        category: 'teknoloji',
        author: 'Demo Yazar',
        status: 'draft',
        tags: ['demo', 'test'],
        imageUrl: '',
        featured: false
      })
      setLoading(false)
      return
    }

    try {
      console.log(`🔍 Firebase'den haber aranıyor: ${newsId}`)
      const docRef = doc(db, 'news', newsId)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        console.log(`✅ Haber bulundu: ${newsId}`)
        const data = docSnap.data()
        setNews({
          id: docSnap.id,
          title: data.title || '',
          summary: data.summary || '',
          content: data.content || '',
          category: data.category || 'genel',
          author: data.author || '',
          status: data.status || 'draft',
          tags: data.tags || [],
          imageUrl: data.imageUrl || '',
          featured: data.featured || false
        })
      } else {
        console.warn(`⚠️ Haber bulunamadı (ID: ${newsId}), demo veriler yükleniyor`)
        // Firebase'de haber yoksa demo veri kullan
        setNews({
          id: newsId,
          title: `Demo Haber - ${newsId}`,
          summary: 'Bu bir demo haberin özeti.',
          content: `Bu demo haberin içeriğidir.\n\nHaber ID: ${newsId}\n\nFirebase'de bu ID ile haber bulunamadığı için demo veriler gösteriliyor. Değişiklikleri kaydetmek için geçerli bir haber ID'si kullanın veya yeni haber oluşturun.`,
          category: 'teknoloji',
          author: 'Demo Yazar',
          status: 'draft',
          tags: ['demo', 'not-found'],
          imageUrl: '',
          featured: false
        })
      }
    } catch (error) {
      console.warn('Firebase haber yüklenirken hata:', error)
      // Hata durumunda demo veri kullan
      setNews({
        id: newsId,
        title: 'Demo Haber Başlığı (Firebase Hatası)',
        summary: 'Firebase bağlantı hatası nedeniyle demo veri gösteriliyor.',
        content: `Bu demo haberin içeriğidir. Haber ID: ${newsId}\n\nFirebase bağlantısında hata oluştuğu için demo veriler gösteriliyor. Değişiklikleri kaydetmek için Firebase bağlantısını kontrol edin.`,
        category: 'teknoloji',
        author: 'Demo Yazar',
        status: 'draft',
        tags: ['demo', 'firebase-error'],
        imageUrl: '',
        featured: false
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!news || !params.id) return

    setSaving(true)
    
    if (!db) {
      console.warn('Firebase not available, simulating save')
      setTimeout(() => {
        setSaving(false)
        alert('Demo modunda - değişiklikler kaydedildi (yerel)')
      }, 1000)
      return
    }

    try {
      const docRef = doc(db, 'news', params.id as string)
      await updateDoc(docRef, {
        ...news,
        updatedAt: Timestamp.now()
      })
      
      console.log('✅ Haber başarıyla güncellendi')
      alert('Haber başarıyla güncellendi!')
      router.push('/admin/dashboard/news')
    } catch (error) {
      console.error('Haber güncellenirken hata:', error)
      alert('Hata: Haber güncellenemedi')
    } finally {
      setSaving(false)
    }
  }

  const handleTagsChange = (tagsString: string) => {
    const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag)
    setNews(prev => prev ? { ...prev, tags } : null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Haber yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (!news) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Haber Bulunamadı</h2>
          <p className="text-gray-600 mb-4">Aradığınız haber mevcut değil.</p>
          <Link
            href={"/admin/dashboard/news" as any}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Haber Listesine Dön
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href={"/admin/dashboard/news" as any}
              className="text-gray-600 hover:text-gray-800 flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Haberlere Dön</span>
            </Link>
            
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Haber Düzenle</h1>
              <p className="text-gray-600">Haber bilgilerini düzenleyin ve kaydedin</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/dashboard"
              className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Globe className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Kaydediliyor...' : 'Kaydet'}</span>
            </button>
            
            <button
              onClick={() => {
                if (confirm('Admin panelinden çıkmak istediğinizden emin misiniz?')) {
                  window.location.href = '/'
                }
              }}
              className="text-red-600 hover:text-red-800 px-3 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <XCircle className="h-4 w-4" />
              <span>Çıkış</span>
            </button>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6">
            
            {/* Başlık */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Haber Başlığı
              </label>
              <input
                type="text"
                value={news.title}
                onChange={(e) => setNews({ ...news, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Haber başlığını giriniz..."
              />
            </div>

            {/* Özet */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Haber Özeti
              </label>
              <textarea
                value={news.summary}
                onChange={(e) => setNews({ ...news, summary: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Haber özetini giriniz..."
              />
            </div>

            {/* İçerik */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Haber İçeriği
              </label>
              <textarea
                value={news.content}
                onChange={(e) => setNews({ ...news, content: e.target.value })}
                rows={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Haber içeriğini giriniz..."
              />
            </div>

            {/* Meta Bilgiler */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              
              {/* Kategori */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori
                </label>
                <select
                  value={news.category}
                  onChange={(e) => setNews({ ...news, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Durum */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durum
                </label>
                <select
                  value={news.status}
                  onChange={(e) => setNews({ ...news, status: e.target.value as NewsItem['status'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="draft">Taslak</option>
                  <option value="review">İnceleme</option>
                  <option value="published">Yayınla</option>
                  <option value="archived">Arşiv</option>
                </select>
              </div>

              {/* Yazar */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yazar
                </label>
                <input
                  type="text"
                  value={news.author}
                  onChange={(e) => setNews({ ...news, author: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Yazar adı..."
                />
              </div>

              {/* Görsel URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Görsel URL
                </label>
                <input
                  type="url"
                  value={news.imageUrl || ''}
                  onChange={(e) => setNews({ ...news, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

            </div>

            {/* Etiketler */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Etiketler (virgülle ayırın)
              </label>
              <input
                type="text"
                value={news.tags.join(', ')}
                onChange={(e) => handleTagsChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="teknoloji, yapay zeka, gelişim"
              />
            </div>

            {/* Öne Çıkan */}
            <div className="mb-6">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={news.featured}
                  onChange={(e) => setNews({ ...news, featured: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Öne Çıkan Haber</span>
              </label>
            </div>

            {/* Kaydet Butonları */}
            <div className="flex justify-end space-x-4">
              <Link
                href={"/admin/dashboard/news" as any}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                İptal
              </Link>
              
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
