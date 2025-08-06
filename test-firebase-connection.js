// Firebase bağlantı testi - Next.js uyumlu
const { db } = require('./src/lib/firebase.ts');
const { collection, addDoc, getDocs } = require('firebase/firestore');

async function testFirebaseConnection() {
  console.log('🔥 Firebase bağlantısı test ediliyor...');
  
  try {
    // Test verisi ekleme
    console.log('📝 Test verisi ekleniyor...');
    const docRef = await addDoc(collection(db, 'test'), {
      message: 'Firebase bağlantı testi',
      timestamp: new Date(),
      status: 'success'
    });
    console.log('✅ Test verisi eklendi, ID:', docRef.id);
    
    // Test verisini okuma
    console.log('📖 Test verisi okunuyor...');
    const querySnapshot = await getDocs(collection(db, 'test'));
    console.log('✅ Toplam döküman sayısı:', querySnapshot.size);
    
    querySnapshot.forEach((doc) => {
      console.log('📄 Döküman:', doc.id, '=>', doc.data());
    });
    
    console.log('🎉 Firebase bağlantısı başarılı!');
    
  } catch (error) {
    console.error('❌ Firebase hatası:', error);
    console.error('Hata detayı:', error.message);
    
    if (error.code) {
      console.error('Hata kodu:', error.code);
    }
  }
}

// Test fonksiyonunu çalıştır
testFirebaseConnection();
