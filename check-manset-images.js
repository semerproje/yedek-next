const admin = require('firebase-admin');

// Firebase Admin SDK'yı başlat
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(require('./serviceAccountKey.json'))
  });
}

const db = admin.firestore();

async function checkMansetImages() {
  console.log('🔍 Checking manşet images in Firestore...');
  
  try {
    // Featured News (manşet) haberlerini kontrol et
    const featuredNews = await db.collection('featuredNews')
      .where('active', '==', true)
      .limit(15)
      .get();
    
    console.log(`\n📰 Featured News (${featuredNews.docs.length} items):`);
    featuredNews.docs.forEach((doc, index) => {
      const data = doc.data();
      console.log(`${index + 1}. ${data.title?.substring(0, 50)}`);
      console.log(`   ImageURL: ${data.imageUrl || 'BOŞ'}`);
      console.log(`   Order: ${data.order || 'N/A'} | Active: ${data.active}`);
      console.log(`   Source: ${data.sourceCollection || 'N/A'}`);
      console.log('   ---');
    });
    
    // AA News haberlerinde görsel kontrolü
    const aaNews = await db.collection('aa_news')
      .orderBy('createdAt', 'desc')
      .limit(10)
      .get();
    
    console.log(`\n📰 AA News (latest ${aaNews.docs.length} items):`);
    aaNews.docs.forEach((doc, index) => {
      const data = doc.data();
      console.log(`${index + 1}. ${data.title?.substring(0, 50)}`);
      console.log(`   ImageURL: ${data.imageUrl || 'BOŞ'}`);
      console.log(`   Category: ${data.category || 'N/A'}`);
      console.log('   ---');
    });
    
    // Regular News haberlerinde görsel kontrolü
    const regularNews = await db.collection('news')
      .orderBy('createdAt', 'desc')
      .limit(10)
      .get();
    
    console.log(`\n📰 Regular News (latest ${regularNews.docs.length} items):`);
    regularNews.docs.forEach((doc, index) => {
      const data = doc.data();
      console.log(`${index + 1}. ${data.title?.substring(0, 50)}`);
      console.log(`   ImageURL: ${data.imageUrl || 'BOŞ'}`);
      console.log(`   Category: ${data.category || 'N/A'}`);
      console.log('   ---');
    });
    
    // İstatistikler
    const featuredWithImages = featuredNews.docs.filter(doc => doc.data().imageUrl).length;
    const aaWithImages = aaNews.docs.filter(doc => doc.data().imageUrl).length;
    const regularWithImages = regularNews.docs.filter(doc => doc.data().imageUrl).length;
    
    console.log('\n📊 GÖRSEL İSTATİSTİKLERİ:');
    console.log(`Featured News: ${featuredWithImages}/${featuredNews.docs.length} görselli`);
    console.log(`AA News: ${aaWithImages}/${aaNews.docs.length} görselli`);
    console.log(`Regular News: ${regularWithImages}/${regularNews.docs.length} görselli`);
    
  } catch (error) {
    console.error('❌ Hata:', error);
  }
}

checkMansetImages().catch(console.error);
