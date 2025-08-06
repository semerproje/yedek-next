#!/usr/bin/env node

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, query, orderBy, limit, addDoc, where, Timestamp } from 'firebase/firestore'

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBKwVLWLTgLLfs8V0ptEvwywGoIwxm430A",
  authDomain: "haber-a62cf.firebaseapp.com",
  projectId: "haber-a62cf",
  storageBucket: "haber-a62cf.firebasestorage.app",
  messagingSenderId: "651640696907",
  appId: "1:651640696907:web:d7c012c1280a08e0c69dce"
}

// Firebase'i başlat
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function createMansetNews() {
  console.log('🏗️ Manşet haberleri oluşturuluyor...\n')

  try {
    // Farklı kategorilerden farklı haberler alalım
    console.log('📰 AA News dan farklı kategorili haberleri alıyorum...')
    
    // AA News'dan farklı kategorilerden çeşitli haberler alalım
    const aaNewsQuery = query(
      collection(db, 'aa_news'), 
      orderBy('createdAt', 'desc'), 
      limit(50)
    )
    const aaNewsSnapshot = await getDocs(aaNewsQuery)
    
    // News koleksiyonundan da haberler alalım
    const newsQuery = query(
      collection(db, 'news'), 
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc'), 
      limit(10)
    )
    const newsSnapshot = await getDocs(newsQuery)

    const aaNewsData = aaNewsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), source: 'aa_news' }))
    const newsData = newsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), source: 'news' }))

    // Kategorilere göre grupla
    const categoryGroups = {}
    const allNews = [...aaNewsData, ...newsData]

    allNews.forEach(news => {
      const category = news.enhancedCategory || news.category || 'Gündem'
      if (!categoryGroups[category]) {
        categoryGroups[category] = []
      }
      categoryGroups[category].push(news)
    })

    console.log('📊 Kategori dağılımı:')
    Object.keys(categoryGroups).forEach(cat => {
      console.log(`   ${cat}: ${categoryGroups[cat].length} haber`)
    })

    // Her kategoriden en fazla 2-3 haber alarak 11 manşet haberi oluşturalım
    const selectedNews = []
    const maxPerCategory = 3
    
    // Öncelikli kategoriler
    const priorityCategories = ['Gündem', 'Politika', 'Ekonomi', 'Spor', 'Teknoloji', 'Kültür']
    
    // Öncelikli kategorilerden seç
    priorityCategories.forEach(category => {
      if (categoryGroups[category] && selectedNews.length < 11) {
        const categoryNews = categoryGroups[category].slice(0, maxPerCategory)
        const needed = Math.min(categoryNews.length, 11 - selectedNews.length)
        selectedNews.push(...categoryNews.slice(0, needed))
      }
    })

    // Hala eksik varsa diğer kategorilerden tamamla
    if (selectedNews.length < 11) {
      const otherCategories = Object.keys(categoryGroups).filter(cat => !priorityCategories.includes(cat))
      otherCategories.forEach(category => {
        if (selectedNews.length < 11) {
          const categoryNews = categoryGroups[category].slice(0, 2)
          const needed = Math.min(categoryNews.length, 11 - selectedNews.length)
          selectedNews.push(...categoryNews.slice(0, needed))
        }
      })
    }

    console.log(`\n✅ ${selectedNews.length} haber seçildi, manşete ekleniyor...\n`)

    // Manşet koleksiyonuna ekle
    const mansetPromises = selectedNews.slice(0, 11).map(async (news, index) => {
      const mansetData = {
        order: index + 1,
        title: news.title,
        content: news.content || news.summary || '',
        category: news.enhancedCategory || news.category || 'Gündem',
        imageUrl: news.fallbackImageUrl || news.imageUrl || `https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop`,
        url: news.url || `/haber/${news.slug || news.id}`,
        source: news.source,
        sourceId: news.id,
        originalId: news.originalId || news.id,
        isActive: true,
        isFeatured: index < 3, // İlk 3 haberi öne çıkar
        priority: index < 3 ? 'high' : index < 6 ? 'medium' : 'normal',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        publishedAt: Timestamp.now()
      }

      console.log(`${index + 1}. ${mansetData.title.substring(0, 60)}... (${mansetData.category})`)
      
      return addDoc(collection(db, 'manset'), mansetData)
    })

    await Promise.all(mansetPromises)

    console.log('\n🎉 Başarıyla 11 manşet haberi oluşturuldu!')
    console.log('\n📍 Manşet dağılımı:')
    
    // Kategori dağılımını göster
    const mansetCategories = {}
    selectedNews.slice(0, 11).forEach(news => {
      const cat = news.enhancedCategory || news.category || 'Gündem'
      mansetCategories[cat] = (mansetCategories[cat] || 0) + 1
    })
    
    Object.keys(mansetCategories).forEach(cat => {
      console.log(`   ${cat}: ${mansetCategories[cat]} haber`)
    })

    console.log('\n🌐 Manşet sayfasını kontrol edin: http://localhost:3000/admin/dashboard/manset')

  } catch (error) {
    console.error('❌ Hata:', error)
  }
}

// Scripti çalıştır
createMansetNews()
