// Firebase'daki en son haberleri kontrol et - content vs summary

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD8nJFGGhKz3VEOFGMSFBdhx9eDrGQxJfY",
  authDomain: "aa-news-app.firebaseapp.com",
  projectId: "aa-news-app",
  storageBucket: "aa-news-app.firebasestorage.app",
  messagingSenderId: "45941801892",
  appId: "1:45941801892:web:a5244a51d6f8b3fa415b1e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkContentSummaryInFirebase() {
  try {
    console.log('🔍 Firebase\'daki en son 3 haberi kontrol ediyorum...\n');
    
    const q = query(
      collection(db, 'aa_news'), 
      orderBy('createdAt', 'desc'), 
      limit(3)
    );
    
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      console.log('❌ Firebase\'da haber bulunamadı');
      return;
    }
    
    let testNumber = 1;
    snapshot.forEach((doc) => {
      const data = doc.data();
      
      console.log(`📰 TEST ${testNumber}:`);
      console.log(`ID: ${doc.id}`);
      console.log(`Başlık: ${data.title?.substring(0, 60)}...`);
      console.log(`Kategori: ${data.category}`);
      console.log(`📝 Content uzunluğu: ${data.content?.length || 0} karakter`);
      console.log(`📋 Summary uzunluğu: ${data.summary?.length || 0} karakter`);
      
      // Content preview
      if (data.content) {
        console.log(`📝 Content preview: ${data.content.substring(0, 100)}...`);
      }
      
      // Summary preview  
      if (data.summary) {
        console.log(`📋 Summary preview: ${data.summary.substring(0, 100)}...`);
      }
      
      // Durum analizi
      if (data.content && data.summary) {
        if (data.content === data.summary) {
          console.log('❌ PROBLEM: Content ve Summary aynı!');
        } else if (data.summary.length < data.content.length) {
          console.log('✅ BAŞARILI: Summary daha kısa!');
        } else {
          console.log('⚠️  UYARI: Summary daha uzun!');
        }
      }
      
      console.log('─'.repeat(60));
      testNumber++;
    });
    
  } catch (error) {
    console.error('❌ Firebase kontrol hatası:', error.message);
  }
}

checkContentSummaryInFirebase();
