import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, getDocs } from 'firebase/firestore';

export async function GET() {
  try {
    console.log('🔍 AA haber tiplerini analiz ediliyor...');
    
    const aaNewsQuery = query(collection(db, 'aa_news'));
    const snapshot = await getDocs(aaNewsQuery);
    
    const typeAnalysis = {};
    const contentAnalysis = {
      with_content: 0,
      without_content: 0,
      with_summary: 0,
      without_summary: 0
    };
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      
      // Tip analizi
      const type = data.type || 'unknown';
      if (!typeAnalysis[type]) {
        typeAnalysis[type] = {
          count: 0,
          samples: []
        };
      }
      typeAnalysis[type].count++;
      
      if (typeAnalysis[type].samples.length < 2) {
        typeAnalysis[type].samples.push({
          id: data.aa_id,
          title: data.title,
          has_content: !!(data.content && data.content.trim()),
          has_summary: !!(data.summary && data.summary.trim()),
          content_length: data.content ? data.content.length : 0,
          summary_length: data.summary ? data.summary.length : 0
        });
      }
      
      // İçerik analizi
      if (data.content && data.content.trim()) {
        contentAnalysis.with_content++;
      } else {
        contentAnalysis.without_content++;
      }
      
      if (data.summary && data.summary.trim()) {
        contentAnalysis.with_summary++;
      } else {
        contentAnalysis.without_summary++;
      }
    });
    
    return NextResponse.json({
      success: true,
      total_news: snapshot.size,
      type_analysis: typeAnalysis,
      content_analysis: contentAnalysis,
      recommendation: {
        problem: "Picture tipindeki haberler content/summary içermiyor",
        solution: "Text tipindeki haberler çekmek için filter_type: [1] kullanın",
        current_filter: "Mevcut sistem tüm tipleri çekiyor (picture, text, video)",
        suggested_fix: "fetch-real-news endpoint'inde content_types parametresini sadece text için ayarlayın"
      }
    });
    
  } catch (error: any) {
    console.error('❌ AA tip analizi hatası:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
