// Test script for manual AA fetch with production Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCS6K2R4fLbGVCNrMLOOqjXUpgqoWn_K2A",
  authDomain: "haber-a62cf.firebaseapp.com",
  projectId: "haber-a62cf",
  storageBucket: "haber-a62cf.firebasestorage.app",
  messagingSenderId: "1058718267059",
  appId: "1:1058718267059:web:f7b2c8b24b1e6b2c8a9e4d",
  measurementId: "G-VXQNQ1QYQG"
};

async function testFirebaseConnection() {
  try {
    console.log('🔥 Firebase Connection Test Starting...');
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    console.log('✅ Firebase initialized successfully');
    
    // Test 1: Write a test document
    const testDoc = {
      message: 'Manual fetch test',
      timestamp: new Date().toISOString(),
      status: 'test'
    };
    
    await setDoc(doc(db, 'test', 'manual-fetch-test'), testDoc);
    console.log('✅ Test document written successfully');
    
    // Test 2: Read from aa_categories collection
    const categoriesRef = collection(db, 'aa_categories');
    const categoriesSnapshot = await getDocs(categoriesRef);
    
    console.log(`📂 Found ${categoriesSnapshot.size} categories in aa_categories collection`);
    
    categoriesSnapshot.forEach((doc) => {
      console.log('📁 Category:', doc.id, doc.data());
    });
    
    // Test 3: Read from news collection
    const newsRef = collection(db, 'news');
    const newsSnapshot = await getDocs(newsRef);
    
    console.log(`📰 Found ${newsSnapshot.size} news items in news collection`);
    
    if (newsSnapshot.size > 0) {
      let count = 0;
      newsSnapshot.forEach((doc) => {
        if (count < 3) { // Show first 3 news items
          console.log('📰 News:', doc.id, {
            title: doc.data().title,
            category: doc.data().category,
            createdAt: doc.data().createdAt
          });
          count++;
        }
      });
    }
    
    console.log('🎉 Firebase connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ Firebase connection test failed:', error);
    console.error('Error details:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
  }
}

// Run the test
testFirebaseConnection();
