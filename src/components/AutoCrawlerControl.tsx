'use client';

import React, { useState, useEffect } from 'react';

interface AutoCrawlStatus {
  enabled: boolean;
  intervalMinutes: number;
  isCrawling: boolean;
  lastRun: string | null;
  totalNews: number;
  errors: string[];
  nextRun: string | null;
}

export default function AutoCrawlerControl() {
  const [status, setStatus] = useState<AutoCrawlStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [intervalInput, setIntervalInput] = useState(30);
  const [message, setMessage] = useState('');

  // Durum bilgisini çek
  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/auto-news-crawler');
      const data = await response.json();
      
      if (data.success) {
        setStatus(data.status);
        setIntervalInput(data.status.intervalMinutes);
      }
    } catch (error: any) {
      console.error('Error fetching status:', error);
      setMessage('Durum bilgisi alınamadı: ' + (error?.message || 'Bilinmeyen hata'));
    }
  };

  // Otomatik çekimi başlat
  const startAutoCrawl = async () => {
    if (intervalInput < 1) {
      setMessage('Interval en az 1 dakika olmalı');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/auto-news-crawler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'start',
          intervalMinutes: intervalInput
        })
      });

      const data = await response.json();
      setMessage(data.message);
      
      if (data.success) {
        await fetchStatus();
      }
    } catch (error: any) {
      setMessage('Başlatma hatası: ' + (error?.message || 'Bilinmeyen hata'));
    } finally {
      setLoading(false);
    }
  };

  // Otomatik çekimi durdur
  const stopAutoCrawl = async () => {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/auto-news-crawler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'stop' })
      });

      const data = await response.json();
      setMessage(data.message);
      
      if (data.success) {
        await fetchStatus();
      }
    } catch (error: any) {
      setMessage('Durdurma hatası: ' + (error?.message || 'Bilinmeyen hata'));
    } finally {
      setLoading(false);
    }
  };

  // Manuel çekim
  const manualCrawl = async () => {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/auto-news-crawler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'manual' })
      });

      const data = await response.json();
      setMessage(data.message);
      
      if (data.success) {
        setTimeout(fetchStatus, 2000); // 2 saniye sonra durumu güncelle
      }
    } catch (error: any) {
      setMessage('Manuel çekim hatası: ' + (error?.message || 'Bilinmeyen hata'));
    } finally {
      setLoading(false);
    }
  };

  // Interval güncelle
  const updateInterval = async () => {
    if (intervalInput < 1) {
      setMessage('Interval en az 1 dakika olmalı');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/auto-news-crawler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update-interval',
          intervalMinutes: intervalInput
        })
      });

      const data = await response.json();
      setMessage(data.message);
      
      if (data.success) {
        await fetchStatus();
      }
    } catch (error: any) {
      setMessage('Güncelleme hatası: ' + (error?.message || 'Bilinmeyen hata'));
    } finally {
      setLoading(false);
    }
  };

  // Sayfa yüklendiğinde durumu çek
  useEffect(() => {
    fetchStatus();
    
    // Her 10 saniyede durumu güncelle
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Henüz çalışmadı';
    return new Date(dateString).toLocaleString('tr-TR');
  };

  const getStatusColor = () => {
    if (!status) return 'bg-gray-500';
    if (status.isCrawling) return 'bg-yellow-500';
    if (status.enabled) return 'bg-green-500';
    return 'bg-red-500';
  };

  const getStatusText = () => {
    if (!status) return 'Yükleniyor...';
    if (status.isCrawling) return 'Çekiliyor...';
    if (status.enabled) return 'Aktif';
    return 'Durduruldu';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <div className={`w-3 h-3 rounded-full mr-3 ${getStatusColor()}`}></div>
          Otomatik Haber Çekimi
        </h2>
        <span className="text-sm font-medium text-gray-600">
          {getStatusText()}
        </span>
      </div>

      {/* Durum Bilgileri */}
      {status && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-blue-600 font-medium">Son Çekim</div>
            <div className="text-lg text-blue-800">{formatDate(status.lastRun)}</div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-green-600 font-medium">Toplam Haber</div>
            <div className="text-lg text-green-800">{status.totalNews.toLocaleString()}</div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-sm text-purple-600 font-medium">Sonraki Çekim</div>
            <div className="text-lg text-purple-800">{formatDate(status.nextRun)}</div>
          </div>
        </div>
      )}

      {/* Interval Ayarı */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Çekim Aralığı (dakika)
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            min="1"
            max="1440"
            value={intervalInput}
            onChange={(e) => setIntervalInput(parseInt(e.target.value) || 30)}
            className="border border-gray-300 rounded-md px-3 py-2 w-24"
            disabled={loading}
          />
          <button
            onClick={updateInterval}
            disabled={loading || !status}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Güncelle
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          1-1440 dakika arası (1 dakika - 24 saat)
        </p>
      </div>

      {/* Kontrol Butonları */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={startAutoCrawl}
          disabled={loading || (status?.enabled)}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Yükleniyor...' : 'Başlat'}
        </button>
        
        <button
          onClick={stopAutoCrawl}
          disabled={loading || (!status?.enabled)}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? 'Yükleniyor...' : 'Durdur'}
        </button>
        
        <button
          onClick={manualCrawl}
          disabled={loading || status?.isCrawling}
          className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50"
        >
          {loading ? 'Yükleniyor...' : 'Manuel Çek'}
        </button>
        
        <button
          onClick={fetchStatus}
          disabled={loading}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
        >
          Yenile
        </button>
      </div>

      {/* Mesaj */}
      {message && (
        <div className={`p-3 rounded-md mb-4 ${
          message.includes('hatası') || message.includes('Error') 
            ? 'bg-red-100 text-red-700' 
            : 'bg-green-100 text-green-700'
        }`}>
          {message}
        </div>
      )}

      {/* Hatalar */}
      {status?.errors && status.errors.length > 0 && (
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-red-800 mb-2">Son Hatalar:</h3>
          <ul className="text-xs text-red-700 space-y-1">
            {status.errors.map((error, index) => (
              <li key={index} className="font-mono">{error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
