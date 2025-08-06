// LÖSEV Umut Mesajları Test Verisi
// node add-hope-messages.js

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, serverTimestamp } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyDW4Lz8U4UyKlJB4yYI9Hcw6qE-z3nKl8M",
  authDomain: "netnext-20aa4.firebaseapp.com",
  projectId: "netnext-20aa4",
  storageBucket: "netnext-20aa4.firebasestorage.app",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const hopeMessages = [
  {
    newsId: 'FukW4V8qMsB3knTX473x',
    message: 'LÖSEV\'e desteklerimiz devam ediyor. Her çocuğun gülümsemesi bizim için değerli. Doğtaş\'ın bu sosyal sorumluluk projesine katılmaktan mutluluk duyuyorum. #gülümseyencocuklar',
    authorName: 'Zeynep Kaya',
    isAnonymous: false,
    likes: 15
  },
  {
    newsId: 'FukW4V8qMsB3knTX473x',
    message: 'Her yorum bir umut... LÖSEV\'li çocuklarımız için elimizden geleni yapmalıyız. Bu kampanya çok anlamlı. Doğtaş\'a teşekkürler. #gülümseyencocuklar',
    authorName: '',
    isAnonymous: true,
    likes: 8
  },
  {
    newsId: 'FukW4V8qMsB3knTX473x',
    message: 'Lösemili çocuklarımızın iyileşmesi ve gülümsemeleri için dualarımız ve desteklerimiz sürecek. LÖSEV harika bir kuruluş. #gülümseyencocuklar',
    authorName: 'Mehmet Demir',
    isAnonymous: false,
    likes: 22
  },
  {
    newsId: 'FukW4V8qMsB3knTX473x',
    message: 'Umudumuz hiç tükenmeyecek. Her çocuk yaşama hakkına sahip. LÖSEV ile birlikte bu mücadelede yer almak gurur verici. #gülümseyencocuklar',
    authorName: 'Ayşe Yılmaz',
    isAnonymous: false,
    likes: 31
  },
  {
    newsId: 'FukW4V8qMsB3knTX473x',
    message: 'Sosyal sorumluluk projelerinin artması gerekiyor. Doğtaş\'ın LÖSEV ile bu işbirliği çok değerli. Her mesaj gerçekten umut. #gülümseyencocuklar',
    authorName: '',
    isAnonymous: true,
    likes: 12
  },
  {
    newsId: 'FukW4V8qMsB3knTX473x',
    message: 'Çocuklarımızın sağlığı için elimizden geleni yapmaya devam edeceğiz. LÖSEV\'e bağışlarımız ve dualarımız hiç eksilmeyecek. #gülümseyencocuklar',
    authorName: 'Fatma Öztürk',
    isAnonymous: false,
    likes: 18
  },
  {
    newsId: 'FukW4V8qMsB3knTX473x',
    message: 'Her yorum bir umut, her destek bir hayat demek. LÖSEV\'in yanındayız, çocuklarımızın yanındayız. Bu kampanyayı başlattığınız için teşekkürler. #gülümseyencocuklar',
    authorName: 'Ali Çelik',
    isAnonymous: false,
    likes: 26
  }
];

async function addHopeMessages() {
  console.log('🌟 LÖSEV Umut Mesajları ekleniyor...');
  
  try {
    for (const message of hopeMessages) {
      const messageData = {
        ...message,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, 'hope_messages'), messageData);
      console.log(`✅ Umut mesajı eklendi: ${docRef.id} - ${message.authorName || 'Anonim'}`);
    }
    
    console.log('🎉 Tüm umut mesajları başarıyla eklendi!');
    console.log('📊 Toplam mesaj sayısı:', hopeMessages.length);
    console.log('🔗 Test URL: http://localhost:3000/haber/FukW4V8qMsB3knTX473x');
    
  } catch (error) {
    console.error('❌ Umut mesajları eklenirken hata:', error);
  }
}

// Fonksiyonu çalıştır
addHopeMessages().then(() => {
  console.log('🏁 İşlem tamamlandı!');
}).catch(console.error);
