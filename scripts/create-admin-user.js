// Firebase Admin SDK ile test kullanıcı oluşturmak için
// Bu script'i backend'de çalıştırabilirsiniz

const admin = require('firebase-admin');

// Firebase Admin SDK initialize
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: process.env.FIREBASE_PROJECT_ID || 'your-project-id'
  });
}

async function createTestAdminUser() {
  try {
    const email = 'admin@admin.local';
    const password = 'admin123';
    
    // Kullanıcı var mı kontrol et
    try {
      const userRecord = await admin.auth().getUserByEmail(email);
      console.log('Admin kullanıcı zaten mevcut:', userRecord.uid);
      return;
    } catch (error) {
      // Kullanıcı yoksa oluştur
      console.log('Admin kullanıcı bulunamadı, oluşturuluyor...');
    }
    
    // Yeni admin kullanıcı oluştur
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      emailVerified: true,
      disabled: false,
    });
    
    // Custom claims ekle (admin yetkisi için)
    await admin.auth().setCustomUserClaims(userRecord.uid, {
      admin: true,
      role: 'admin'
    });
    
    console.log('Admin kullanıcı başarıyla oluşturuldu:');
    console.log('Email:', email);
    console.log('Şifre:', password);
    console.log('UID:', userRecord.uid);
    
  } catch (error) {
    console.error('Admin kullanıcı oluşturulurken hata:', error);
  }
}

// Script'i çalıştır
if (require.main === module) {
  createTestAdminUser().then(() => {
    console.log('İşlem tamamlandı.');
    process.exit(0);
  });
}

module.exports = { createTestAdminUser };
