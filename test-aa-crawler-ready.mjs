// Firebase Bağlantı ve AA Crawler Test

import { db } from './lib/firebase.js'
import { collection, getDocs, addDoc, query, where, limit } from 'firebase/firestore'

// Test Firebase bağlantısı
async function testFirebaseConnection() {
  try {
    console.log('🔄 Firebase bağlantısı test ediliyor...')
    
    if (!db) {
      throw new Error('Firebase DB henüz başlatılmadı')
    }

    // News koleksiyonundaki kayıt sayısını kontrol et
    const newsCollection = collection(db, 'news')
    const snapshot = await getDocs(query(newsCollection, limit(1)))
    
    console.log('✅ Firebase bağlantısı başarılı!')
    console.log(`📊 News koleksiyonundan ${snapshot.size} kayıt bulundu`)
    
    return true
  } catch (error) {
    console.error('❌ Firebase bağlantı hatası:', error)
    return false
  }
}

// Test AA API proxy
async function testAAProxy() {
  try {
    console.log('🔄 AA Proxy API test ediliyor...')
    
    const response = await fetch('/api/aa-proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'subscription'
      })
    })

    const data = await response.json()
    
    if (data.success) {
      console.log('✅ AA Proxy API çalışıyor!')
      console.log('📡 Subscription verileri:', data.data)
      return true
    } else {
      console.error('❌ AA Proxy API hatası:', data.error)
      return false
    }
  } catch (error) {
    console.error('❌ AA Proxy bağlantı hatası:', error)
    return false
  }
}

// Comprehensive test
async function runFullTest() {
  console.log('🚀 AA Crawler Test Başlatılıyor...\n')
  
  // 1. Firebase test
  const firebaseOk = await testFirebaseConnection()
  console.log('')
  
  // 2. AA Proxy test
  const aaProxyOk = await testAAProxy()
  console.log('')
  
  // Sonuç
  console.log('📋 Test Sonuçları:')
  console.log(`Firebase: ${firebaseOk ? '✅' : '❌'}`)
  console.log(`AA Proxy: ${aaProxyOk ? '✅' : '❌'}`)
  
  if (firebaseOk && aaProxyOk) {
    console.log('\n🎉 Tüm servisler çalışıyor! AA Crawler kullanıma hazır.')
    
    // Mini AA news search test
    console.log('\n🔍 Mini haber arama testi...')
    const searchResponse = await fetch('/api/aa-proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'search',
        params: {
          start_date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          end_date: 'NOW',
          filter_category: '1,2,3',
          filter_type: '2,3',
          filter_language: '1',
          limit: 5
        }
      })
    })
    
    const searchData = await searchResponse.json()
    if (searchData.success && searchData.data?.documents) {
      console.log(`📰 Son 2 saatte ${searchData.data.documents.length} haber bulundu`)
      console.log('Örnek haber başlıkları:')
      searchData.data.documents.slice(0, 3).forEach((doc, i) => {
        console.log(`  ${i + 1}. ${doc.title}`)
      })
    }
  } else {
    console.log('\n⚠️ Bazı servisler çalışmıyor. Lütfen kontrol edin.')
  }
}

// Browser console'da çalıştırmak için
if (typeof window !== 'undefined') {
  window.testAACrawler = runFullTest
  console.log('🎯 AA Crawler testi başlatmak için: testAACrawler()')
}

export { testFirebaseConnection, testAAProxy, runFullTest }
