import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';

export async function GET() {
  try {
    console.log('🔍 AA haberlerini content durumuna göre analiz ediliyor...');
    
    // En son 10 AA haberini al
    const aaNewsQuery = query(
      collection(db, 'aa_news'),
      orderBy('created_at', 'desc'),
      limit(10)
    );
    
    const snapshot = await getDocs(aaNewsQuery);
    
    const analysis = {
      total: snapshot.size,
      with_content: 0,
      without_content: 0,
      by_type: {},
      news: []
    };
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      const hasContent = !!(data.content && data.content.trim() && data.content.length > 10);
      const hasRealContent = data.content && data.content !== 'İçerik yok' && data.content.trim().length > 50;
      
      if (hasRealContent) {
        analysis.with_content++;
      } else {
        analysis.without_content++;
      }
      
      const type = data.type || 'unknown';
      if (!analysis.by_type[type]) {
        analysis.by_type[type] = { total: 0, with_content: 0 };
      }
      analysis.by_type[type].total++;
      if (hasRealContent) {
        analysis.by_type[type].with_content++;
      }
      
      analysis.news.push({
        id: doc.id,
        aa_id: data.aa_id,
        title: data.title,
        type: data.type,
        content_length: data.content ? data.content.length : 0,
        has_real_content: hasRealContent,
        content_preview: data.content ? data.content.substring(0, 100) + '...' : 'Yok',
        summary_length: data.summary ? data.summary.length : 0,
        created_at: data.created_at,
        newsml_available: !!data.newsml_data
      });
    });
    
    return NextResponse.json({
      success: true,
      analysis,
      latest_with_content: analysis.news.filter(n => n.has_real_content).slice(0, 3)
    });
    
  } catch (error: any) {
    console.error('❌ Content analizi hatası:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
