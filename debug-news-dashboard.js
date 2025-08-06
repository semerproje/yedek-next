// News Dashboard Debug Script
// Bu script news dashboard'ındaki Firebase bağlantısını debug eder

const fs = require('fs');

// Firebase config dosyasını kontrol et
function checkFirebaseConfig() {
  console.log('🔥 Firebase config kontrolü...\n');
  
  try {
    const firebaseContent = fs.readFileSync('lib/firebase.ts', 'utf8');
    
    // API Key kontrolü
    if (firebaseContent.includes('AIzaSyBKwVLWLTgLLfs8V0ptEvwywGoIwxm430A')) {
      console.log('✅ Firebase API Key doğru');
    } else {
      console.log('❌ Firebase API Key yanlış veya eksik');
    }
    
    // Project ID kontrolü
    if (firebaseContent.includes('haber-a62cf')) {
      console.log('✅ Firebase Project ID doğru');
    } else {
      console.log('❌ Firebase Project ID yanlış');
    }
    
    // Client-side initialization kontrolü
    if (firebaseContent.includes("typeof window !== 'undefined'")) {
      console.log('✅ Client-side initialization mevcut');
    } else {
      console.log('❌ Client-side initialization eksik');
    }
    
  } catch (error) {
    console.log('❌ Firebase config dosyası okunamadı:', error.message);
  }
}

// News page component'ini kontrol et
function checkNewsPageComponent() {
  console.log('\n📰 News page component kontrolü...\n');
  
  try {
    const newsPageContent = fs.readFileSync('src/app/admin/dashboard/news/page.tsx', 'utf8');
    
    // Firebase import kontrolü
    if (newsPageContent.includes("from 'firebase/firestore'")) {
      console.log('✅ Firestore import mevcut');
    } else {
      console.log('❌ Firestore import eksik');
    }
    
    // db import kontrolü
    if (newsPageContent.includes("from '@/lib/firebase'")) {
      console.log('✅ Firebase lib import mevcut');
    } else {
      console.log('❌ Firebase lib import eksik');
    }
    
    // Collection query kontrolü
    if (newsPageContent.includes("collection(db, 'news')")) {
      console.log('✅ News collection query mevcut');
    } else {
      console.log('❌ News collection query eksik');
    }
    
    // Error handling kontrolü
    if (newsPageContent.includes('loadStaticNews()')) {
      console.log('✅ Static fallback mevcut');
    } else {
      console.log('❌ Static fallback eksik');
    }
    
    // Console log kontrolü
    if (newsPageContent.includes("console.log('📰 Firebase'den")) {
      console.log('✅ Debug loglari mevcut');
    } else {
      console.log('❌ Debug loglari eksik');
    }
    
  } catch (error) {
    console.log('❌ News page dosyası okunamadı:', error.message);
  }
}

// Package.json'da Firebase dependency kontrolü
function checkFirebaseDependency() {
  console.log('\n📦 Firebase dependency kontrolü...\n');
  
  try {
    const packageContent = fs.readFileSync('package.json', 'utf8');
    const packageData = JSON.parse(packageContent);
    
    if (packageData.dependencies && packageData.dependencies.firebase) {
      console.log(`✅ Firebase dependency: ${packageData.dependencies.firebase}`);
    } else {
      console.log('❌ Firebase dependency eksik');
    }
    
  } catch (error) {
    console.log('❌ Package.json okunamadı:', error.message);
  }
}

// Ana debug fonksiyonu
async function debugNewsDashboard() {
  console.log('🔍 NEWS DASHBOARD DEBUG BAŞLIYOR...\n');
  console.log('='.repeat(50));
  
  checkFirebaseConfig();
  checkNewsPageComponent();
  checkFirebaseDependency();
  
  console.log('\n' + '='.repeat(50));
  console.log('💡 SORUN GİDERME ÖNERİLERİ:');
  console.log('='.repeat(50));
  
  console.log('1. Browser Console\'ı açın (F12)');
  console.log('2. http://localhost:3000/admin/dashboard/news sayfasına gidin');
  console.log('3. Console\'da Firebase hata mesajlarını kontrol edin');
  console.log('4. Network tab\'ında API çağrılarını kontrol edin');
  console.log('5. Aşağıdaki mesajları arayın:');
  console.log('   - "📰 Loading Firebase news data..."');
  console.log('   - "📰 Firebase\'den X haber yüklendi"');
  console.log('   - "Firebase news koleksiyonu boş"');
  console.log('   - Firebase error mesajları');
  
  console.log('\n🔧 Hızlı düzeltme önerileri:');
  console.log('- Firebase kurallarını kontrol edin (read permission)');
  console.log('- Index\'lerin oluşturulduğundan emin olun');
  console.log('- Network bağlantısını kontrol edin');
  console.log('- Browser cache\'ini temizleyin');
}

debugNewsDashboard();
