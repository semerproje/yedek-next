import { NextRequest, NextResponse } from 'next/server';
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags?: string[];
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function GET() {
  try {
    // Son 2 gündeki tüm haberleri çek
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const newsQuery = query(
      collection(db, 'news'),
      where('status', '==', 'published'),
      where('createdAt', '>=', twoDaysAgo),
      orderBy('createdAt', 'desc'),
      limit(1000) // Google News max 1000 makale
    );

    const snapshot = await getDocs(newsQuery);
    const news: NewsArticle[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date()
    })) as NewsArticle[];

    // Google News XML formatı
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${news.map(article => `  <url>
    <loc>https://netnext.vercel.app/news/${article.id}</loc>
    <news:news>
      <news:publication>
        <news:name>NetNext Haber</news:name>
        <news:language>tr</news:language>
      </news:publication>
      <news:publication_date>${article.createdAt.toISOString()}</news:publication_date>
      <news:title><![CDATA[${article.title}]]></news:title>
      <news:keywords><![CDATA[${(article.tags || []).join(', ')}]]></news:keywords>
    </news:news>
    <lastmod>${article.updatedAt.toISOString()}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>`).join('\n')}
</urlset>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800'
      }
    });

  } catch (error) {
    console.error('Google News sitemap error:', error);
    return NextResponse.json({ error: 'Failed to generate Google News sitemap' }, { status: 500 });
  }
}
