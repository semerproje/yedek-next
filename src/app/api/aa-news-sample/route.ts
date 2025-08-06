import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

export async function GET() {
  try {
    console.log('🔍 AA haberi detayları getiriliyor...');
    
    // Son eklenen AA haberini al
    const aaNewsQuery = query(
      collection(db, 'aa_news'),
      orderBy('created_at', 'desc'),
      limit(1)
    );
    
    const snapshot = await getDocs(aaNewsQuery);
    
    if (snapshot.empty) {
      return NextResponse.json({
        success: false,
        message: 'AA haberi bulunamadı!'
      });
    }
    
    const doc = snapshot.docs[0];
    const data = doc.data();
    
    // Tam veriyi döndür
    return NextResponse.json({
      success: true,
      message: 'AA haber detayı',
      document_id: doc.id,
      collection: 'aa_news',
      data: {
        // Ana alanlar
        id: data.id,
        aa_id: data.aa_id,
        title: data.title,
        summary: data.summary,
        content: data.content,
        
        // Meta veriler
        source: data.source,
        category: data.category,
        status: data.status,
        created_at: data.created_at,
        updated_at: data.updated_at,
        
        // AA spesifik
        group_id: data.group_id,
        category_id: data.category_id,
        type: data.type,
        priority: data.priority,
        
        // NewsML verileri
        newsml_data: data.newsml_data ? {
          available: true,
          fields_count: Object.keys(data.newsml_data).length,
          sample_fields: Object.keys(data.newsml_data).slice(0, 5),
          // İlk few alanı göster
          guid: data.newsml_data.guid,
          version: data.newsml_data.version,
          language: data.newsml_data.language,
          pubDate: data.newsml_data.pubDate
        } : null,
        
        // AI veriler
        ai_content: data.ai_content ? {
          available: true,
          enhanced_title: data.ai_content.enhanced_title,
          enhanced_summary: data.ai_content.enhanced_summary,
          enhanced_content: data.ai_content.enhanced_content ? 
            data.ai_content.enhanced_content.substring(0, 200) + '...' : null,
          seo_title: data.ai_content.seo_title,
          seo_description: data.ai_content.seo_description,
          tags: data.ai_content.tags,
          optimization_date: data.ai_content.optimization_date
        } : null,
        
        // Medya
        images: data.images || [],
        videos: data.videos || [],
        
        // SEO
        slug: data.slug,
        meta_title: data.meta_title,
        meta_description: data.meta_description,
        
        // İstatistikler
        view_count: data.view_count || 0,
        like_count: data.like_count || 0,
        share_count: data.share_count || 0
      }
    });
    
  } catch (error: any) {
    console.error('❌ AA haber detay hatası:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
