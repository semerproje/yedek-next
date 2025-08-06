// API Route to test Firebase connection and manual fetch
import { NextRequest, NextResponse } from 'next/server';
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function POST(request: NextRequest) {
  try {
    console.log('🔥 Firebase Manual Fetch Test Starting...');
    
    // Test 1: Write a test document
    const testDoc = {
      message: 'Manual fetch test from API route',
      timestamp: new Date().toISOString(),
      status: 'active',
      testType: 'manual-fetch-api'
    };
    
    await setDoc(doc(db, 'test', 'manual-fetch-api-test'), testDoc);
    console.log('✅ Test document written successfully');
    
    // Test 2: Read from aa_categories collection
    const categoriesRef = collection(db, 'aa_categories');
    const categoriesSnapshot = await getDocs(categoriesRef);
    
    console.log(`📂 Found ${categoriesSnapshot.size} categories in aa_categories collection`);
    
    const categories: any[] = [];
    categoriesSnapshot.forEach((doc) => {
      categories.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Test 3: Read from news collection
    const newsRef = collection(db, 'news');
    const newsSnapshot = await getDocs(newsRef);
    
    console.log(`📰 Found ${newsSnapshot.size} news items in news collection`);
    
    const newsItems: any[] = [];
    let count = 0;
    newsSnapshot.forEach((doc) => {
      if (count < 5) { // Show first 5 news items
        newsItems.push({
          id: doc.id,
          title: doc.data().title,
          category: doc.data().category,
          createdAt: doc.data().createdAt
        });
        count++;
      }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Firebase connection test completed successfully!',
      data: {
        categoriesCount: categoriesSnapshot.size,
        categories: categories,
        newsCount: newsSnapshot.size,
        sampleNews: newsItems,
        testDocument: testDoc
      }
    });
    
  } catch (error: any) {
    console.error('❌ Firebase connection test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error?.message || 'Unknown error occurred',
      code: error?.code || 'UNKNOWN_ERROR',
      message: 'Firebase manual fetch test failed'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Firebase Manual Fetch Test API',
    usage: 'Send POST request to test Firebase connection and manual fetch capabilities',
    timestamp: new Date().toISOString()
  });
}
