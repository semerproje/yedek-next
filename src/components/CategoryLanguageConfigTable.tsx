'use client'

import React, { useEffect, useState } from "react";

const API_CONFIG = "/api/news/crawl-config";

interface CrawlPair {
  category: string;
  language: string;
  categoryName: string;
  languageName: string;
  enabled: boolean;
}

/**
 * Kategori & Dil çekim yönetim tablosu (Ultra Premium Version)
 */
export default function CategoryLanguageConfigTable() {
  const [pairs, setPairs] = useState<CrawlPair[]>([]);
  const [loading, setLoading] = useState(false);
  const [rowLoading, setRowLoading] = useState(""); // Sadece güncellenen satır için loading
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");

  // Tabloyu güncelle
  const fetchPairs = async () => {
    setLoading(true);
    setErr("");
    try {
      // Mock data for demonstration - replace with actual API call
      const mockData: CrawlPair[] = [
        { category: 'gundem', language: 'tr', categoryName: 'Gündem', languageName: 'Türkçe', enabled: true },
        { category: 'gundem', language: 'en', categoryName: 'Gündem', languageName: 'English', enabled: false },
        { category: 'spor', language: 'tr', categoryName: 'Spor', languageName: 'Türkçe', enabled: true },
        { category: 'spor', language: 'en', categoryName: 'Spor', languageName: 'English', enabled: true },
        { category: 'ekonomi', language: 'tr', categoryName: 'Ekonomi', languageName: 'Türkçe', enabled: true },
        { category: 'ekonomi', language: 'en', categoryName: 'Ekonomi', languageName: 'English', enabled: false },
        { category: 'teknoloji', language: 'tr', categoryName: 'Teknoloji', languageName: 'Türkçe', enabled: true },
        { category: 'teknoloji', language: 'en', categoryName: 'Teknoloji', languageName: 'English', enabled: true },
        { category: 'saglik', language: 'tr', categoryName: 'Sağlık', languageName: 'Türkçe', enabled: true },
        { category: 'saglik', language: 'en', categoryName: 'Sağlık', languageName: 'English', enabled: false },
        { category: 'politika', language: 'tr', categoryName: 'Politika', languageName: 'Türkçe', enabled: true },
        { category: 'politika', language: 'en', categoryName: 'Politika', languageName: 'English', enabled: false },
      ];
      
      setPairs(mockData);
    } catch (error) {
      setErr("Yapılandırma çekilemedi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchPairs(); 
  }, []);

  // Durum değiştir
  const handleToggle = async (category: string, language: string, enabled: boolean) => {
    setRowLoading(`${category}_${language}`);
    setErr("");
    setInfo("");
    try {
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local state
      setPairs(prev => prev.map(pair => 
        pair.category === category && pair.language === language
          ? { ...pair, enabled }
          : pair
      ));
      
      setInfo("Başarıyla güncellendi.");
    } catch (e) {
      setErr("Kaydetme hatası.");
    } finally {
      setRowLoading("");
      setTimeout(() => setInfo(""), 2000);
    }
  };

  // Hangi satırlar aç/kapa yapılabilir? (gelişmiş filtre)
  const canEdit = (category: string, language: string) => {
    return true; // Gelişmiş filtre gerekirse burada
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-slate-600">Kategori dil yapılandırması yükleniyor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Kategori & Dil Yapılandırması</h3>
          <p className="text-sm text-slate-600 mt-1">Her kategori için hangi dillerde içerik çekileceğini yönetin</p>
        </div>
        <button 
          onClick={fetchPairs}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Yenile</span>
        </button>
      </div>

      {err && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {err}
        </div>
      )}
      
      {info && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
          {info}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-4 font-medium text-slate-700">Kategori</th>
              <th className="text-left py-3 px-4 font-medium text-slate-700">Dil</th>
              <th className="text-left py-3 px-4 font-medium text-slate-700">Durum</th>
              <th className="text-left py-3 px-4 font-medium text-slate-700">Aktiflik</th>
            </tr>
          </thead>
          <tbody>
            {pairs.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-slate-400">
                  Henüz kategori-dil yapılandırması bulunmuyor.
                </td>
              </tr>
            ) : (
              pairs.map(pair => (
                <tr key={`${pair.category}_${pair.language}`} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="font-medium text-slate-900">{pair.categoryName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm bg-slate-100 px-2 py-1 rounded text-slate-700">
                        {pair.language.toUpperCase()}
                      </span>
                      <span className="text-slate-600">{pair.languageName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                      pair.enabled 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        pair.enabled ? 'bg-green-500' : 'bg-slate-400'
                      }`}></div>
                      <span>{pair.enabled ? 'Aktif' : 'Pasif'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                        pair.enabled 
                          ? "bg-green-100 text-green-700 hover:bg-green-200" 
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      } ${
                        !canEdit(pair.category, pair.language) || rowLoading === `${pair.category}_${pair.language}`
                          ? "opacity-50 cursor-not-allowed" 
                          : ""
                      }`}
                      disabled={!canEdit(pair.category, pair.language) || !!rowLoading}
                      onClick={() => handleToggle(pair.category, pair.language, !pair.enabled)}
                    >
                      {rowLoading === `${pair.category}_${pair.language}` 
                        ? (
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                            <span>Güncelleniyor...</span>
                          </div>
                        ) 
                        : pair.enabled ? "Devre Dışı Bırak" : "Etkinleştir"
                      }
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6 p-4 bg-slate-50 rounded-lg">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-0.5">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-sm text-slate-600">
            <p className="font-medium text-slate-700 mb-1">Kullanım Bilgileri:</p>
            <ul className="space-y-1 text-xs">
              <li>• Her kategori için hangi dillerde içerik çekileceğini belirleyebilirsiniz</li>
              <li>• Aktif kategoriler otomatik olarak içerik çekme işlemlerine dahil edilir</li>
              <li>• Dil ayarları anlık olarak güncellenir ve kaydetme gerektirmez</li>
              <li>• Sistem performansı için gerekli olmayan dilleri devre dışı bırakmanız önerilir</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
