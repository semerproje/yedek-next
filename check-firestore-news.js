const admin = require('firebase-admin');

// Firebase Admin SDK yapılandırması
const serviceAccount = {
  "type": "service_account",
  "project_id": "haber-a62cf",
  "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
  "private_key": process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  "client_email": process.env.FIREBASE_CLIENT_EMAIL,
  "client_id": process.env.FIREBASE_CLIENT_ID,
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`
};

// Firebase Admin initialize et
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://haber-a62cf-default-rtdb.firebaseio.com/"
  });
}

const db = admin.firestore();

async function getRecentNews() {
  try {
    console.log('🔍 Firestore\'dan son haberler getiriliyor...');
    
    // Son eklenen 5 haberi al
    const newsSnapshot = await db.collection('news')
      .orderBy('created_at', 'desc')
      .limit(5)
      .get();
    
    if (newsSnapshot.empty) {
      console.log('❌ Hiç haber bulunamadı!');
      return;
    }
    
    console.log(`✅ ${newsSnapshot.size} haber bulundu:`);
    console.log('='.repeat(80));
    
    newsSnapshot.forEach((doc, index) => {
      const data = doc.data();
      console.log(`\n📰 HABER ${index + 1} (ID: ${doc.id}):`);
      console.log(`📝 Başlık: ${data.title || 'Başlık yok'}`);
      console.log(`📂 Kategori: ${data.category || 'Kategori yok'}`);
      console.log(`👤 Kaynak: ${data.source || 'Kaynak yok'}`);
      console.log(`⏰ Tarih: ${data.created_at?.toDate?.() || data.created_at || 'Tarih yok'}`);
      console.log(`🔗 AA ID: ${data.aa_id || 'AA ID yok'}`);
      console.log(`📊 Durum: ${data.status || 'Durum yok'}`);
      
      if (data.content) {
        const preview = data.content.substring(0, 200) + '...';
        console.log(`📄 İçerik önizleme: ${preview}`);
      }
      
      if (data.newsml_data) {
        console.log(`📋 NewsML Verileri mevcut: ${Object.keys(data.newsml_data).length} alan`);
      }
      
      console.log('-'.repeat(50));
    });
    
  } catch (error) {
    console.error('❌ Hata:', error.message);
  }
}

// Ana fonksiyonu çalıştır
getRecentNews();
