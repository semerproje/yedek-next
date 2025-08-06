#!/usr/bin/env node

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, query, orderBy, limit, addDoc, Timestamp } from 'firebase/firestore'

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

// Manuel haber verileri - farklı kategorilerden
const manualNews = [
  {
    title: "Türkiye'de Ekonomik İstikrar Sürüyor",
    content: "Ekonomi alanında yeni gelişmeler yaşanırken, uzmanlar istikrarın devam edeceğini belirtiyor.",
    category: "Ekonomi",
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop"
  },
  {
    title: "Teknoloji Devlerinden Yeni İşbirliği",
    content: "Büyük teknoloji şirketleri arasında yapay zeka alanında önemli işbirliği anlaşmaları imzalandı.",
    category: "Teknoloji",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop"
  },
  {
    title: "Spor Dünyasından Sürpriz Transfer",
    content: "Futbol dünyasını şaşırtan transfer haberi sosyal medyada gündem oldu.",
    category: "Spor",
    imageUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop"
  },
  {
    title: "Sağlık Sektöründe Dijital Dönüşüm",
    content: "Hastaneler dijital teknolojilerle daha hızlı ve kaliteli hizmet vermeye başladı.",
    category: "Gündem",
    imageUrl: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop"
  }
]

async function completeMansetNews() {
  console.log('🔧 Manşet haberlerini 11\'e tamamlıyorum...\n')

  try {
    // Mevcut manşet sayısını kontrol et
    const mansetQuery = query(collection(db, 'manset'), orderBy('order', 'asc'))
    const mansetSnapshot = await getDocs(mansetQuery)
    const currentCount = mansetSnapshot.docs.length
    
    console.log(`📊 Mevcut manşet sayısı: ${currentCount}`)
    console.log(`🎯 Hedef: 11 haber`)
    console.log(`➕ Eklenecek: ${11 - currentCount} haber\n`)

    if (currentCount >= 11) {
      console.log('✅ Manşet zaten tamamlanmış!')
      return
    }

    const needed = 11 - currentCount
    const startOrder = currentCount + 1

    // Manuel haberleri ekle
    const mansetPromises = manualNews.slice(0, needed).map(async (news, index) => {
      const mansetData = {
        order: startOrder + index,
        title: news.title,
        content: news.content,
        category: news.category,
        imageUrl: news.imageUrl,
        url: `/haber/manuel-${Date.now()}-${index}`,
        source: 'manual',
        sourceId: `manual-${Date.now()}-${index}`,
        originalId: `manual-${index}`,
        isActive: true,
        isFeatured: false,
        priority: 'normal',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        publishedAt: Timestamp.now()
      }

      console.log(`${startOrder + index}. ${mansetData.title} (${mansetData.category})`)
      
      return addDoc(collection(db, 'manset'), mansetData)
    })

    await Promise.all(mansetPromises)

    console.log(`\n🎉 ${needed} haber daha eklendi! Toplam: ${currentCount + needed} manşet haberi`)
    console.log('\n🌐 Manşet sayfasını kontrol edin: http://localhost:3000/admin/dashboard/manset')

    // Final kontrol
    const finalMansetSnapshot = await getDocs(mansetQuery)
    console.log(`\n✅ Final durum: ${finalMansetSnapshot.docs.length} manşet haberi`)

  } catch (error) {
    console.error('❌ Hata:', error)
  }
}

// Scripti çalıştır
completeMansetNews()
