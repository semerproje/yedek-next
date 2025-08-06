// Firestore Test Script
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBKwVLWLTgLLfs8V0ptEvwywGoIwxm430A",
  authDomain: "haber-a62cf.firebaseapp.com",
  projectId: "haber-a62cf",
  storageBucket: "haber-a62cf.firebasestorage.app",
  messagingSenderId: "651640696907",
  appId: "1:651640696907:web:d7c012c1280a08e0c69dce",
};

// Test Firestore connection
async function testFirestore() {
  try {
    console.log('🔍 Testing Firestore connection...');
    
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    const db = getFirestore(app);
    
    console.log('✅ Firebase app initialized');
    console.log('✅ Firestore instance created');
    
    // Test write
    console.log('📝 Testing write operation...');
    const testDoc = {
      test: true,
      message: 'Firestore test successful',
      timestamp: new Date().toISOString(),
      id: `test-${Date.now()}`
    };
    
    const docRef = await addDoc(collection(db, 'test'), testDoc);
    console.log('✅ Test document written with ID:', docRef.id);
    
    // Test read
    console.log('📖 Testing read operation...');
    const querySnapshot = await getDocs(collection(db, 'test'));
    console.log('✅ Read test documents:', querySnapshot.size);
    
    // Check news collection
    console.log('📰 Checking news collection...');
    const newsSnapshot = await getDocs(collection(db, 'news'));
    console.log(`📊 News collection has ${newsSnapshot.size} documents`);
    
    newsSnapshot.forEach((doc) => {
      const data = doc.data();
      console.log('📰 News doc:', {
        id: doc.id,
        title: data.title,
        source: data.source,
        category: data.category
      });
    });
    
    console.log('🎉 Firestore test completed successfully!');
    
  } catch (error) {
    console.error('❌ Firestore test failed:', error);
    
    if (error.code) {
      console.error('Error code:', error.code);
    }
    if (error.message) {
      console.error('Error message:', error.message);
    }
  }
}

testFirestore();
