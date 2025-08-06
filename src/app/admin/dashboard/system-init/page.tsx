'use client'

import { useState } from 'react'
import { 
  Play, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Database,
  Settings,
  Trash2
} from 'lucide-react'
import { initializeHomepageSystem, resetHomepageSystem } from '@/lib/init/homepageInit'

export default function SystemInitPage() {
  const [loading, setLoading] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (log: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${log}`])
  }

  const handleInitialize = async () => {
    setLoading(true)
    setStatus('idle')
    setMessage('')
    setLogs([])
    
    try {
      addLog('Homepage sistemi başlatılıyor...')
      
      // Override console.log to capture logs
      const originalLog = console.log
      const originalWarn = console.warn
      
      console.log = (...args) => {
        addLog(args.join(' '))
        originalLog(...args)
      }
      
      console.warn = (...args) => {
        addLog(`⚠️ ${args.join(' ')}`)
        originalWarn(...args)
      }
      
      await initializeHomepageSystem()
      
      // Restore console
      console.log = originalLog
      console.warn = originalWarn
      
      setStatus('success')
      setMessage('Homepage sistemi başarıyla başlatıldı!')
      addLog('✅ İşlem tamamlandı')
    } catch (error) {
      console.error('Init error:', error)
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu')
      addLog(`❌ Hata: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async () => {
    if (!confirm('⚠️ Bu işlem mevcut tüm homepage verilerini silecek ve varsayılan verileri yeniden oluşturacak. Devam etmek istediğinizden emin misiniz?')) {
      return
    }
    
    setResetLoading(true)
    setStatus('idle')
    setMessage('')
    setLogs([])
    
    try {
      addLog('Homepage sistemi sıfırlanıyor...')
      
      // Override console.log to capture logs
      const originalLog = console.log
      const originalWarn = console.warn
      
      console.log = (...args) => {
        addLog(args.join(' '))
        originalLog(...args)
      }
      
      console.warn = (...args) => {
        addLog(`⚠️ ${args.join(' ')}`)
        originalWarn(...args)
      }
      
      await resetHomepageSystem()
      
      // Restore console
      console.log = originalLog
      console.warn = originalWarn
      
      setStatus('success')
      setMessage('Homepage sistemi başarıyla sıfırlandı ve yeniden başlatıldı!')
      addLog('✅ Sıfırlama işlemi tamamlandı')
    } catch (error) {
      console.error('Reset error:', error)
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu')
      addLog(`❌ Hata: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`)
    } finally {
      setResetLoading(false)
    }
  }

  const clearLogs = () => {
    setLogs([])
    setStatus('idle')
    setMessage('')
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Sistem Başlatma</h1>
        <p className="text-gray-600 mt-2">
          Homepage yönetim sistemini başlatın ve varsayılan verileri oluşturun
        </p>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Initialize Card */}
        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Database className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Sistem Başlat</h3>
              <p className="text-sm text-gray-600">Varsayılan modüller ve kategoriler oluştur</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <p className="text-sm text-gray-700">
              Bu işlem aşağıdaki varsayılan verileri oluşturacak:
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 10 Homepage modülü</li>
              <li>• 10 Haber kategorisi</li>
              <li>• 5 Haber yapılandırması</li>
            </ul>
            
            <button
              onClick={handleInitialize}
              disabled={loading || resetLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              {loading ? 'Başlatılıyor...' : 'Sistemi Başlat'}
            </button>
          </div>
        </div>

        {/* Reset Card */}
        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Sistem Sıfırla</h3>
              <p className="text-sm text-gray-600">Mevcut verileri sil ve yeniden oluştur</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <p className="text-sm text-yellow-800">
                Bu işlem geri alınamaz!
              </p>
            </div>
            
            <button
              onClick={handleReset}
              disabled={loading || resetLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
            >
              {resetLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              {resetLoading ? 'Sıfırlanıyor...' : 'Sistemi Sıfırla'}
            </button>
          </div>
        </div>
      </div>

      {/* Status */}
      {status !== 'idle' && (
        <div className={`p-4 rounded-lg mb-6 ${
          status === 'success' 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center gap-2">
            {status === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600" />
            )}
            <p className={`font-medium ${
              status === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              {message}
            </p>
          </div>
        </div>
      )}

      {/* Logs */}
      {logs.length > 0 && (
        <div className="bg-white rounded-lg shadow border">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold">İşlem Geçmişi</h3>
            <button
              onClick={clearLogs}
              className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
            >
              <Trash2 className="w-3 h-3" />
              Temizle
            </button>
          </div>
          <div className="p-4">
            <div className="bg-gray-900 rounded p-4 text-green-400 font-mono text-sm max-h-64 overflow-y-auto">
              {logs.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <Settings className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Bilgi</h4>
            <p className="text-sm text-blue-800 mt-1">
              Bu işlemler Firebase Firestore'da homepage_modules, categories ve news_module_configs 
              koleksiyonlarını oluşturacak. İşlem tamamlandıktan sonra homepage yönetim panelinden 
              modülleri düzenleyebilir ve yeni yapılandırmalar ekleyebilirsiniz.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
