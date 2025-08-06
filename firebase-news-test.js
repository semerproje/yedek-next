// Firebase News Test
// Bu script Firestore news koleksiyonunu kontrol eder

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, orderBy, limit } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyBKwVLWLTgLLfs8V0ptEvwywGoIwxm430A",
  authDomain: "haber-a62cf.firebaseapp.com",
  projectId: "haber-a62cf",
  storageBucket: "haber-a62cf.firebasestorage.app",
  messagingSenderId: "651640696907",
  appId: "1:651640696907:web:d7c012c1280a08e0c69dce",
};

async function testFirestoreNews() {
  console.log('🔥 Firebase News Koleksiyonu Test Başlıyor...\n');

  try {
    // Firebase'i başlat
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    console.log('✅ Firebase bağlantısı başarılı');

    // News koleksiyonunu kontrol et
    console.log('\n📰 News koleksiyonu kontrol ediliyor...');
    
    const newsRef = collection(db, 'news');
    const newsQuery = query(newsRef, orderBy('createdAt', 'desc'), limit(10));
    
    const snapshot = await getDocs(newsQuery);
    
    console.log(`📊 Toplam haber sayısı: ${snapshot.size}`);
    
    if (snapshot.empty) {
      console.log('⚠️ News koleksiyonu boş!');
      
      // Alternatif koleksiyon isimlerini kontrol et
      const alternativeCollections = ['articles', 'haberleri', 'posts', 'content'];
      
      for (const collName of alternativeCollections) {
        console.log(`🔍 ${collName} koleksiyonu kontrol ediliyor...`);
        try {
          const altRef = collection(db, collName);
          const altSnapshot = await getDocs(query(altRef, limit(5)));
          if (!altSnapshot.empty) {
            console.log(`✅ ${collName} koleksiyonunda ${altSnapshot.size} döküman bulundu`);
          }
        } catch (error) {
          console.log(`❌ ${collName} koleksiyonu bulunamadı`);
        }
      }
      
    } else {
      console.log('\n📝 İlk 5 haber:');
      console.log('=' .repeat(50));
      
      snapshot.docs.slice(0, 5).forEach((doc, index) => {
        const data = doc.data();
        console.log(`${index + 1}. ID: ${doc.id}`);
        console.log(`   Başlık: ${data.title || 'Başlık yok'}`);
        console.log(`   Kategori: ${data.category || 'Kategori yok'}`);
        console.log(`   Yazar: ${data.author || 'Yazar yok'}`);
        console.log(`   Durum: ${data.status || 'Durum yok'}`);
        
        // Tarih kontrolü
        if (data.createdAt) {
          const date = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
          console.log(`   Tarih: ${date.toLocaleDateString('tr-TR')}`);
        }
        
        console.log('   ---');
      });
    }

    // En son eklenen haberleri kontrol et
    console.log('\n🕒 En son haberler (son 24 saat):');
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    try {
      const recentQuery = query(
        collection(db, 'news'),
        orderBy('createdAt', 'desc'),
        limit(20)
      );
      
      const recentSnapshot = await getDocs(recentQuery);
      let recentCount = 0;
      
      recentSnapshot.docs.forEach(doc => {
        const data = doc.data();
        const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
        
        if (createdAt > yesterday) {
          recentCount++;
          console.log(`📅 ${doc.id}: ${data.title} (${createdAt.toLocaleString('tr-TR')})`);
        }
      });
      
      if (recentCount === 0) {
        console.log('⚠️ Son 24 saatte eklenen haber bulunamadı');
      } else {
        console.log(`✅ Son 24 saatte ${recentCount} haber eklendi`);
      }
      
    } catch (error) {
      console.log('❌ Son haberler sorgusu başarısız:', error.message);
    }

  } catch (error) {
    console.error('💥 Firebase test hatası:', error);
    
    if (error.code === 'failed-precondition') {
      console.log('\n💡 Index eksik olabilir. Firebase Console\'dan index oluşturun:');
      console.log('   - Collection: news');
      console.log('   - Field: createdAt (Descending)');
    }
  }
}

testFirestoreNews();
