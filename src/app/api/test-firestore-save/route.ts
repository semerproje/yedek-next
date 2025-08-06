import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Test Firestore Save API called');
    
    const newsItem = await request.json();
    console.log('📄 News item received:', newsItem);
    
    if (!db) {
      console.error('❌ Firestore database not initialized');
      return NextResponse.json(
        { success: false, error: 'Firestore not initialized' },
        { status: 500 }
      );
    }
    
    const newsData = {
      ...newsItem,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      status: 'test'
    };
    
    console.log('💾 Saving to Firestore...', newsData);
    
    const docRef = await addDoc(collection(db, 'news'), newsData);
    console.log('✅ Document saved with ID:', docRef.id);
    
    return NextResponse.json({ 
      success: true, 
      message: 'News item saved successfully',
      docId: docRef.id 
    });
    
  } catch (error) {
    console.error('❌ Test save error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : 'No stack trace'
      },
      { status: 500 }
    );
  }
}
