#!/usr/bin/env node

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, query, orderBy, limit } from 'firebase/firestore'

// Firebase config - bu projenin config'ini kullan
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

async function checkLatestNews() {
  console.log('🔍 Firebase\'deki son haberleri kontrol ediyorum...\n')

  try {
    // AA News koleksiyonundan son 20 haberi getir
    console.log('📰 AA_NEWS koleksiyonundan son 20 haber:')
    console.log('=' .repeat(60))
    
    const aaNewsQuery = query(
      collection(db, 'aa_news'), 
      orderBy('createdAt', 'desc'), 
      limit(20)
    )
    const aaNewsSnapshot = await getDocs(aaNewsQuery)
    
    if (aaNewsSnapshot.empty) {
      console.log('❌ AA_NEWS koleksiyonunda haber bulunamadı')
    } else {
      aaNewsSnapshot.docs.forEach((doc, index) => {
        const data = doc.data()
        console.log(`${index + 1}. ID: ${doc.id}`)
        console.log(`   Başlık: ${data.title?.substring(0, 80)}...`)
        console.log(`   Kategori: ${data.enhancedCategory || data.categoryName || data.category}`)
        console.log(`   Durum: ${data.status || 'N/A'}`)
        console.log(`   Tarih: ${data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleString('tr-TR') : 'N/A'}`)
        console.log(`   AA ID: ${data.id || 'N/A'}`)
        console.log('')
      })
    }

    console.log('\n' + '=' .repeat(60))
    console.log('📰 NEWS koleksiyonundan son 20 haber:')
    console.log('=' .repeat(60))
    
    // News koleksiyonundan son 20 haberi getir
    const newsQuery = query(
      collection(db, 'news'), 
      orderBy('createdAt', 'desc'), 
      limit(20)
    )
    const newsSnapshot = await getDocs(newsQuery)
    
    if (newsSnapshot.empty) {
      console.log('❌ NEWS koleksiyonunda haber bulunamadı')
    } else {
      newsSnapshot.docs.forEach((doc, index) => {
        const data = doc.data()
        console.log(`${index + 1}. ID: ${doc.id}`)
        console.log(`   Başlık: ${data.title?.substring(0, 80)}...`)
        console.log(`   Kategori: ${data.category}`)
        console.log(`   Durum: ${data.status || 'N/A'}`)
        console.log(`   Tarih: ${data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleString('tr-TR') : 'N/A'}`)
        console.log(`   Slug: ${data.slug || 'N/A'}`)
        console.log('')
      })
    }

    // Manşet koleksiyonunu da kontrol edelim
    console.log('\n' + '=' .repeat(60))
    console.log('📰 MANSET koleksiyonundaki mevcut haberler:')
    console.log('=' .repeat(60))
    
    const mansetQuery = query(
      collection(db, 'manset'), 
      orderBy('order', 'asc')
    )
    const mansetSnapshot = await getDocs(mansetQuery)
    
    if (mansetSnapshot.empty) {
      console.log('❌ MANSET koleksiyonunda haber bulunamadı')
    } else {
      console.log(`✅ Toplam ${mansetSnapshot.docs.length} manşet haberi bulundu:`)
      mansetSnapshot.docs.forEach((doc, index) => {
        const data = doc.data()
        console.log(`${index + 1}. Order: ${data.order}`)
        console.log(`   Başlık: ${data.title?.substring(0, 80)}...`)
        console.log(`   Kategori: ${data.category}`)
        console.log(`   Kaynak: ${data.source || 'N/A'}`)
        console.log(`   Aktif: ${data.isActive ? 'Evet' : 'Hayır'}`)
        console.log('')
      })
    }

    // Özet
    console.log('\n' + '🎯 ÖZET:')
    console.log(`AA News: ${aaNewsSnapshot.docs.length} haber`)
    console.log(`News: ${newsSnapshot.docs.length} haber`) 
    console.log(`Manşet: ${mansetSnapshot.docs.length} haber`)
    console.log(`Hedef: 11 manşet haberi`)
    console.log(`Eksik: ${Math.max(0, 11 - mansetSnapshot.docs.length)} haber`)

  } catch (error) {
    console.error('❌ Hata:', error)
  }
}

// Scripti çalıştır
checkLatestNews()
