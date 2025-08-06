const admin = require('firebase-admin');

// Firebase Admin SDK'yı başlat
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(require('./serviceAccountKey.json'))
  });
}

const db = admin.firestore();

async function checkCategories() {
  console.log('🔍 Checking news categories...');
  
  // AA News kategorilerini kontrol et
  const aaNews = await db.collection('aa_news').limit(10).get();
  console.log('\n📰 AA News categories:');
  aaNews.docs.forEach(doc => {
    const data = doc.data();
    console.log(`- ${data.category} | ${data.title?.substring(0, 50)}`);
  });
  
  // Regular News kategorilerini kontrol et
  const news = await db.collection('news').limit(10).get();
  console.log('\n📰 Regular News categories:');
  news.docs.forEach(doc => {
    const data = doc.data();
    console.log(`- ${data.category} | ${data.title?.substring(0, 50)}`);
  });
  
  // Tüm benzersiz kategorileri topla
  const allCategories = new Set();
  aaNews.docs.forEach(doc => {
    const category = doc.data().category;
    if (category) allCategories.add(category);
  });
  news.docs.forEach(doc => {
    const category = doc.data().category;
    if (category) allCategories.add(category);
  });
  
  console.log('\n🏷️ All unique categories:', Array.from(allCategories).sort());
}

checkCategories().catch(console.error);
