import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, limit, Timestamp } from 'firebase/firestore';

export async function GET() {
  try {
    console.log('🔥 Testing Firestore connection...');
    
    // Test 1: Basit bir document ekle
    const testDoc = {
      title: 'Firestore Connection Test',
      content: 'Test içeriği - ' + new Date().toISOString(),
      timestamp: new Date().toISOString(),
      source: 'TEST',
      createdAt: Timestamp.now()
    };

    console.log('📝 Adding test document to Firestore...');
    const docRef = await addDoc(collection(db, 'news'), testDoc);
    console.log('✅ Test document added with ID:', docRef.id);

    // Test 2: Mevcut dökümanları oku
    console.log('📖 Reading existing documents...');
    const newsQuery = query(
      collection(db, 'news'),
      limit(3)
    );
    
    const querySnapshot = await getDocs(newsQuery);
    const docs: any[] = [];
    
    querySnapshot.forEach((doc) => {
      docs.push({
        id: doc.id,
        title: doc.data().title,
        source: doc.data().source,
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || 'No date'
      });
    });

    console.log('📊 Found documents:', docs.length);

    return NextResponse.json({
      success: true,
      message: 'Firestore connection successful ✅',
      testDocId: docRef.id,
      existingDocs: docs.length,
      sampleDocs: docs,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('❌ Firestore test error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Firestore connection failed ❌',
      error: error.message,
      errorCode: error.code || 'unknown',
      errorStack: error.stack?.split('\n').slice(0, 3).join('\n')
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { testData } = await request.json();
    
    console.log('🧪 Manual Firestore test with custom data...');
    
    const docData = {
      ...testData,
      addedAt: new Date().toISOString(),
      testId: Math.random().toString(36).substr(2, 9)
    };

    const docRef = await addDoc(collection(db, 'news'), docData);
    
    return NextResponse.json({
      success: true,
      message: 'Manual test document added',
      docId: docRef.id,
      data: docData
    });

  } catch (error: any) {
    console.error('❌ Manual Firestore test error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Manual test failed',
      error: error.message
    }, { status: 500 });
  }
}
