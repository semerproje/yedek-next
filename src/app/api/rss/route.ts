import { NextResponse } from 'next/server';
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  summary: string;
  category: string;
  imageUrl?: string;
  author?: string;
  tags?: string[];
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function GET() {
  try {
    const newsQuery = query(
      collection(db, 'news'),
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const snapshot = await getDocs(newsQuery);
    const news: NewsArticle[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date()
    })) as NewsArticle[];

    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>NetNext Haber</title>
    <description>Güncel haberler ve son dakika gelişmeleri</description>
    <link>https://netnext.vercel.app</link>
    <language>tr-TR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://netnext.vercel.app/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>https://netnext.vercel.app/logo.png</url>
      <title>NetNext Haber</title>
      <link>https://netnext.vercel.app</link>
    </image>
${news.map(article => `    <item>
      <title><![CDATA[${article.title}]]></title>
      <description><![CDATA[${article.summary || article.content.substring(0, 300) + '...'}]]></description>
      <link>https://netnext.vercel.app/news/${article.id}</link>
      <guid>https://netnext.vercel.app/news/${article.id}</guid>
      <pubDate>${article.createdAt.toUTCString()}</pubDate>
      <author>${article.author || 'NetNext Editörü'}</author>
      <category>${article.category}</category>
      ${article.imageUrl ? `<media:content url="${article.imageUrl}" type="image/jpeg"/>` : ''}
      ${article.tags ? `<keywords>${article.tags.join(', ')}</keywords>` : ''}
    </item>`).join('\n')}
  </channel>
</rss>`;

    return new NextResponse(rssXml, {
      headers: {
        'Content-Type': 'application/rss+xml',
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=900'
      }
    });

  } catch (error) {
    console.error('RSS feed error:', error);
    return NextResponse.json({ error: 'Failed to generate RSS feed' }, { status: 500 });
  }
}
