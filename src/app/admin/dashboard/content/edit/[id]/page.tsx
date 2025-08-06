'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface NewsItem {
  id: string;
  title: string;
  brief: string;
  content: string;
  category: string;
  priority: number;
  type: number;
  language: string;
  publishDate: string;
  url: string;
  images: string[];
  location: string;
  tags: string[];
  source: string;
  endpoint?: string;
  createdAt?: any;
  updatedAt?: any;
}

export default function EditNewsPage() {
  const params = useParams();
  const router = useRouter();
  const newsId = params.id as string;
  
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Kategori seçenekleri
  const categories = {
    '1': 'Genel',
    '2': 'Spor', 
    '3': 'Ekonomi',
    '4': 'Sağlık',
    '5': 'Bilim, Teknoloji',
    '6': 'Politika',
    '7': 'Kültür, Sanat, Yaşam'
  };

  // Öncelik seçenekleri
  const priorities = {
    1: '1 - Flaş',
    2: '2 - Acil',
    3: '3 - Önemli',
    4: '4 - Rutin',
    5: '5 - Düşük',
    6: '6 - Arşiv'
  };

  // Tip seçenekleri
  const types = {
    1: 'Metin',
    2: 'Resim',
    3: 'Video'
  };

  useEffect(() => {
    loadNews();
  }, [newsId]);

  const loadNews = async () => {
    try {
      setLoading(true);
      setError('');

      // Firestore'dan haberi getir
      const newsRef = doc(db, 'news', newsId);
      const newsSnap = await getDoc(newsRef);

      if (newsSnap.exists()) {
        const newsData = newsSnap.data();
        setNews({
          id: newsSnap.id,
          ...newsData,
          createdAt: newsData.createdAt?.toDate?.()?.toISOString(),
          updatedAt: newsData.updatedAt?.toDate?.()?.toISOString()
        } as NewsItem);
      } else {
        setError('Haber bulunamadı');
      }
    } catch (err: any) {
      setError('Haber yüklenirken hata: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!news) return;

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      // Firestore'da güncelle
      const newsRef = doc(db, 'news', newsId);
      await updateDoc(newsRef, {
        title: news.title,
        brief: news.brief,
        content: news.content,
        category: news.category,
        priority: news.priority,
        type: news.type,
        language: news.language,
        url: news.url,
        location: news.location,
        tags: news.tags,
        updatedAt: new Date()
      });

      setSuccess('Haber başarıyla güncellendi!');
      
      // 2 saniye sonra ana sayfaya yönlendir
      setTimeout(() => {
        router.push('/admin/dashboard/content');
      }, 2000);

    } catch (err: any) {
      setError('Kayıt hatası: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof NewsItem, value: any) => {
    if (!news) return;
    
    setNews({
      ...news,
      [field]: value
    });
  };

  const handleTagsChange = (value: string) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag);
    handleInputChange('tags', tags);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Haber yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error && !news) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">❌</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Hata</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => router.push('/admin/dashboard/content')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Geri Dön
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!news) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Haber Düzenle</h1>
              <p className="text-gray-600">ID: {newsId}</p>
            </div>
            <button
              onClick={() => router.push('/admin/dashboard/content')}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              ← Geri Dön
            </button>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            ✅ {success}
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            ❌ {error}
          </div>
        )}

        {/* Edit Form */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sol Kolon */}
            <div className="space-y-4">
              {/* Başlık */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Başlık *
                </label>
                <input
                  type="text"
                  value={news.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Haber başlığı"
                />
              </div>

              {/* Özet */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Özet
                </label>
                <textarea
                  value={news.brief}
                  onChange={(e) => handleInputChange('brief', e.target.value)}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Haber özeti"
                />
              </div>

              {/* Kategori */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori *
                </label>
                <select
                  value={news.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.entries(categories).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </select>
              </div>

              {/* Öncelik */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Öncelik
                </label>
                <select
                  value={news.priority}
                  onChange={(e) => handleInputChange('priority', parseInt(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.entries(priorities).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </select>
              </div>

              {/* Tip */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tip
                </label>
                <select
                  value={news.type}
                  onChange={(e) => handleInputChange('type', parseInt(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.entries(types).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sağ Kolon */}
            <div className="space-y-4">
              {/* URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL
                </label>
                <input
                  type="url"
                  value={news.url}
                  onChange={(e) => handleInputChange('url', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://..."
                />
              </div>

              {/* Konum */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Konum
                </label>
                <input
                  type="text"
                  value={news.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Şehir, Ülke"
                />
              </div>

              {/* Etiketler */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Etiketler
                </label>
                <input
                  type="text"
                  value={news.tags.join(', ')}
                  onChange={(e) => handleTagsChange(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="etiket1, etiket2, etiket3"
                />
                <p className="text-sm text-gray-500 mt-1">Virgülle ayırın</p>
              </div>

              {/* Yayın Tarihi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yayın Tarihi
                </label>
                <input
                  type="datetime-local"
                  value={news.publishDate ? new Date(news.publishDate).toISOString().slice(0, 16) : ''}
                  onChange={(e) => handleInputChange('publishDate', e.target.value ? new Date(e.target.value).toISOString() : '')}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Kaynak Bilgisi */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-2">Kaynak Bilgisi</h3>
                <p className="text-sm text-gray-600">Kaynak: {news.source}</p>
                {news.endpoint && (
                  <p className="text-sm text-gray-600">Endpoint: {news.endpoint}</p>
                )}
                {news.createdAt && (
                  <p className="text-sm text-gray-600">Oluşturulma: {new Date(news.createdAt).toLocaleString('tr-TR')}</p>
                )}
                {news.updatedAt && (
                  <p className="text-sm text-gray-600">Güncelleme: {new Date(news.updatedAt).toLocaleString('tr-TR')}</p>
                )}
              </div>
            </div>
          </div>

          {/* İçerik */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              İçerik
            </label>
            <textarea
              value={news.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              rows={10}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Haber içeriği"
            />
          </div>

          {/* Kaydet Butonu */}
          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={() => router.push('/admin/dashboard/content')}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              İptal
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                  Kaydediliyor...
                </>
              ) : (
                '💾 Kaydet'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
