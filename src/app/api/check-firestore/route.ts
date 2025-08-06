import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

export async function GET() {
  try {
    console.log('🔍 Firestore\'dan son haberler getiriliyor...');
    
    // AA haberlerini kontrol et (aa_news koleksiyonu)
    const aaNewsQuery = query(
      collection(db, 'aa_news'),
      orderBy('created_at', 'desc'),
      limit(3)
    );
    
    const aaSnapshot = await getDocs(aaNewsQuery);
    
    // Ana news koleksiyonunu da kontrol et
    const newsQuery = query(
      collection(db, 'news'),
      orderBy('created_at', 'desc'),
      limit(3)
    );
    
    const newsSnapshot = await getDocs(newsQuery);
    
    const result = {
      aa_news: {
        collection: 'aa_news',
        count: aaSnapshot.size,
        news: [] as any[]
      },
      main_news: {
        collection: 'news', 
        count: newsSnapshot.size,
        news: [] as any[]
      }
    };
    
    // AA News verilerini ekle
    aaSnapshot.forEach((doc) => {
      const data = doc.data();
      result.aa_news.news.push({
        id: doc.id,
        title: data.title || 'Başlık yok',
        source: data.source || 'AA',
        aa_id: data.aa_id || 'AA ID yok',
        created_at: data.created_at?.toDate?.() || data.created_at || 'Tarih yok',
        status: data.status || 'Durum yok',
        category: data.category || 'Kategori yok',
        content_preview: data.content ? data.content.substring(0, 150) + '...' : 'İçerik yok',
        has_newsml: !!data.newsml_data,
        newsml_fields: data.newsml_data ? Object.keys(data.newsml_data).length : 0,
        has_ai_content: !!data.ai_content,
        slug: data.slug || null
      });
    });
    
    // Ana News verilerini ekle
    newsSnapshot.forEach((doc) => {
      const data = doc.data();
      result.main_news.news.push({
        id: doc.id,
        title: data.title || 'Başlık yok',
        source: data.source || 'Kaynak yok',
        created_at: data.created_at?.toDate?.() || data.created_at || 'Tarih yok',
        status: data.status || 'Durum yok',
        category: data.category || 'Kategori yok',
        content_preview: data.content ? data.content.substring(0, 150) + '...' : 'İçerik yok',
        slug: data.slug || null
      });
    });
    
    return NextResponse.json({
      success: true,
      message: `AA: ${result.aa_news.count}, Ana: ${result.main_news.count} haber bulundu`,
      ...result
    });
    
  } catch (error: any) {
    console.error('❌ Firestore kontrol hatası:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      message: 'Firestore kontrol edilemedi'
    }, { status: 500 });
  }
}
