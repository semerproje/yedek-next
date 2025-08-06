'use client'

import React from 'react'
import { ExternalLink, ArrowRight, Zap, Bot, Clock, Database } from 'lucide-react'
import Link from 'next/link'

export default function AACrawlerRedirect() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 mb-6">
          <div className="text-center">
            <div className="p-4 bg-blue-500 text-white rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Bot className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">AA Haber Crawler</h1>
            <p className="text-slate-600 text-lg">Bu sayfa Ultra Premium AA Manager'a taşınmıştır</p>
          </div>
        </div>

        {/* Upgrade Notice */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white mb-6">
          <div className="flex items-center mb-4">
            <Zap className="w-8 h-8 mr-3" />
            <h2 className="text-2xl font-bold">Ultra Premium AA Manager</h2>
          </div>
          <p className="text-blue-100 mb-6 text-lg">
            Yeni ve gelişmiş haber çekme sistemi ile daha güçlü özellikler:
          </p>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Database className="w-5 h-5 mr-2" />
                <span className="font-semibold">Firestore Entegrasyonu</span>
              </div>
              <p className="text-blue-100 text-sm">Real-time veritabanı ve gelişmiş kayıt sistemi</p>
            </div>
            
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Bot className="w-5 h-5 mr-2" />
                <span className="font-semibold">AI Geliştirme</span>
              </div>
              <p className="text-blue-100 text-sm">Gemini AI ile haber içeriği optimizasyonu</p>
            </div>
            
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Clock className="w-5 h-5 mr-2" />
                <span className="font-semibold">Otomatik Çekim</span>
              </div>
              <p className="text-blue-100 text-sm">Zamanlanmış otomatik haber toplama</p>
            </div>
            
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <ExternalLink className="w-5 h-5 mr-2" />
                <span className="font-semibold">Gelişmiş Analitik</span>
              </div>
              <p className="text-blue-100 text-sm">Detaylı raporlama ve performans takibi</p>
            </div>
          </div>

          <Link 
            href="/admin/dashboard/ultra-aa-manager"
            className="inline-flex items-center bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Ultra Premium AA Manager'a Git
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>

        {/* Features */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Neler Değişti?</h3>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
              <div>
                <span className="font-semibold text-slate-800">Modern Arayüz:</span>
                <span className="text-slate-600 ml-2">Daha kullanıcı dostu ve modern tasarım</span>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
              <div>
                <span className="font-semibold text-slate-808">Gelişmiş Performans:</span>
                <span className="text-slate-600 ml-2">Daha hızlı haber çekme ve işleme</span>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
              <div>
                <span className="font-semibold text-slate-800">Real-time Güncellemeler:</span>
                <span className="text-slate-600 ml-2">Canlı istatistikler ve anlık bildirimler</span>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
              <div>
                <span className="font-semibold text-slate-800">TypeScript Desteği:</span>
                <span className="text-slate-600 ml-2">Daha güvenli ve hatasız kod yapısı</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-slate-500">
            Eski crawler sistemi devre dışı bırakılmıştır. Lütfen yeni sistemi kullanın.
          </p>
        </div>
      </div>
    </div>
  )
}
