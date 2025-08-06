'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { HomepageModule } from '@/types/homepage';
import HomepageModuleRenderer from '@/components/homepage/HomepageModuleRenderer';

export default function HomepagePreview() {
  const [modules, setModules] = useState<HomepageModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadActiveModules();
  }, []);

  const loadActiveModules = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!db) {
        throw new Error('Firebase bağlantısı kurulamadı');
      }

      const modulesQuery = query(
        collection(db, 'homepageModules'),
        where('active', '==', true),
        orderBy('order', 'asc')
      );

      const snapshot = await getDocs(modulesQuery);
      const moduleData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as HomepageModule[];

      setModules(moduleData);
      console.log('✅ Aktif homepage modülleri yüklendi:', moduleData.length);
    } catch (error) {
      console.error('❌ Homepage modülleri yüklenirken hata:', error);
      setError(error instanceof Error ? error.message : 'Bilinmeyen hata');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Homepage modülleri yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong className="font-bold">Hata!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
          <button
            onClick={loadActiveModules}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  if (modules.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            <p className="font-bold">Henüz aktif modül yok</p>
            <p className="text-sm mt-2">
              Homepage modüllerini yönetim panelinden ekleyebilirsiniz.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Anasayfa Önizleme
            </h1>
            <div className="text-sm text-gray-500">
              {modules.length} aktif modül
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {modules.map((module, index) => (
            <div key={module.id} className="relative">
              {/* Module Info Overlay (Sadece preview için) */}
              <div className="absolute top-2 right-2 z-50 bg-black/80 text-white px-3 py-1 rounded text-xs">
                #{module.order} - {module.title} ({module.moduleType})
              </div>
              
              {/* Module Content */}
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <HomepageModuleRenderer module={module} />
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Debug Info */}
      <div className="bg-gray-800 text-white p-4 text-xs">
        <div className="max-w-7xl mx-auto">
          <h3 className="font-bold mb-2">Debug Bilgileri:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((module) => (
              <div key={module.id} className="bg-gray-700 p-2 rounded">
                <div><strong>Başlık:</strong> {module.title}</div>
                <div><strong>Tip:</strong> {module.moduleType}</div>
                <div><strong>Component:</strong> {module.componentName}</div>
                <div><strong>Sıra:</strong> {module.order}</div>
                <div><strong>Haber Sayısı:</strong> {module.newsCount}</div>
                <div><strong>Manuel Haberler:</strong> {module.manualNewsIds.length}</div>
                <div><strong>Otomatik:</strong> {module.autoFetch ? 'Evet' : 'Hayır'}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
