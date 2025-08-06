// Firebase Security Rules Check
// Bu script Firebase güvenlik kurallarını kontrol eder

console.log('🔐 Firebase Güvenlik Kuralları Kontrolü...\n');

console.log('📋 Firebase Console\'da kontrol edilmesi gerekenler:');
console.log('='.repeat(50));

console.log('\n1. 🔥 Firebase Console\'a gidin:');
console.log('   https://console.firebase.google.com/project/haber-a62cf');

console.log('\n2. 🗄️ Firestore Database bölümüne gidin');

console.log('\n3. 📐 Rules (Kurallar) tab\'ına tıklayın');

console.log('\n4. 🔍 Mevcut kuralları kontrol edin:');
console.log('   Şu kurallar olmalı:');
console.log(`
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // News collection'a herkes okuma izni
    match /news/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Diğer collection'lar
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
`);

console.log('\n5. 📊 Indexes (İndeksler) tab\'ına gidin');
console.log('   Şu index olmalı:');
console.log('   Collection: news');
console.log('   Fields: createdAt (Descending)');
console.log('   Status: Enabled');

console.log('\n6. 🗂️ Data tab\'ında news collection\'ı kontrol edin');
console.log('   5 document olmalı');

console.log('\n' + '='.repeat(50));
console.log('💡 SORUN GİDERME ADIMLARI:');
console.log('='.repeat(50));

console.log('\n📝 Eğer news collection\'a erişim yoksa:');
console.log('1. Rules\'ı yukarıdaki gibi güncelleyin');
console.log('2. "Publish" butonuna basın');
console.log('3. 1-2 dakika bekleyin');

console.log('\n📊 Eğer index hatası varsa:');
console.log('1. Indexes tab\'ına gidin');
console.log('2. "Add Index" butonuna basın');
console.log('3. Collection: news');
console.log('4. Field: createdAt, Order: Descending');
console.log('5. "Create" butonuna basın');

console.log('\n🔄 Test için:');
console.log('1. Browser cache\'ini temizleyin (Ctrl+Shift+R)');
console.log('2. http://localhost:3000/admin/dashboard/news sayfasını yenileyin');
console.log('3. Console\'da hata mesajlarını kontrol edin');

console.log('\n🧪 Manuel test:');
console.log('Firebase Console > Firestore > Data tab\'ında:');
console.log('1. news collection\'ına tıklayın');
console.log('2. 5 document görmelisiniz');
console.log('3. Her document\'ta title, category, author alanları olmalı');

console.log('\n' + '='.repeat(50));
console.log('✅ Bu kontrollerden sonra news dashboard çalışmalı!');
console.log('='.repeat(50));
