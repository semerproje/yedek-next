import { NextResponse } from 'next/server';

export async function GET() {
  const robotsTxt = `User-agent: *
Allow: /

# Google News Bot
User-agent: Googlebot-News
Allow: /
Crawl-delay: 1

# Google Bot
User-agent: Googlebot
Allow: /
Crawl-delay: 1

# Bing Bot
User-agent: Bingbot
Allow: /
Crawl-delay: 2

# Yandex Bot
User-agent: YandexBot
Allow: /
Crawl-delay: 2

# Block admin areas
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /private/

# Sitemaps
Sitemap: https://netnext.vercel.app/sitemap.xml
Sitemap: https://netnext.vercel.app/google-news.xml
Sitemap: https://netnext.vercel.app/rss.xml

# Host
Host: https://netnext.vercel.app`;

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200'
    }
  });
}
