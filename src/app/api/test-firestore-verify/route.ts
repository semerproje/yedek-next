import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

export async function GET() {
  try {
    console.log('🔍 Verifying Firestore news collection...');
    
    if (!db) {
      return NextResponse.json(
        { success: false, error: 'Firestore not initialized' },
        { status: 500 }
      );
    }
    
    // Get all news documents
    const newsQuery = query(
      collection(db, 'news'),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    
    const querySnapshot = await getDocs(newsQuery);
    const newsItems: any[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      newsItems.push({
        docId: doc.id,
        id: data.id,
        title: data.title,
        source: data.source,
        category: data.category,
        type: data.type,
        createdAt: data.createdAt?.toDate()?.toISOString() || 'Unknown'
      });
    });
    
    console.log(`📊 Found ${newsItems.length} news items in Firestore`);
    
    return NextResponse.json({ 
      success: true, 
      count: newsItems.length,
      news: newsItems
    });
    
  } catch (error) {
    console.error('❌ Verification error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
