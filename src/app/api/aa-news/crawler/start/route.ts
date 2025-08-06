import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where, orderBy, limit } from 'firebase/firestore';

// Global crawler state
const crawlerState = {
  isRunning: false,
  interval: null as NodeJS.Timeout | null,
  config: null as any,
  stats: {
    totalProcessed: 0,
    successCount: 0,
    errorCount: 0,
    duplicateCount: 0
  },
  lastRun: null as string | null,
  nextRun: null as string | null
};

export async function POST(request: NextRequest) {
  try {
    const config = await request.json();
    
    if (crawlerState.isRunning) {
      return NextResponse.json({
        success: false,
        message: 'Crawler is already running'
      });
    }

    // Start the crawler
    crawlerState.isRunning = true;
    crawlerState.config = config;
    crawlerState.lastRun = new Date().toISOString();
    
    // Calculate next run
    const nextRunDate = new Date();
    nextRunDate.setMinutes(nextRunDate.getMinutes() + config.interval);
    crawlerState.nextRun = nextRunDate.toISOString();

    // Run immediately first time
    await runCrawlerCycle(config);

    // Set up interval
    crawlerState.interval = setInterval(async () => {
      try {
        await runCrawlerCycle(config);
        crawlerState.lastRun = new Date().toISOString();
        
        const nextRunDate = new Date();
        nextRunDate.setMinutes(nextRunDate.getMinutes() + config.interval);
        crawlerState.nextRun = nextRunDate.toISOString();
      } catch (error) {
        console.error('Crawler cycle error:', error);
        crawlerState.stats.errorCount++;
      }
    }, config.interval * 60 * 1000); // Convert minutes to milliseconds

    return NextResponse.json({
      success: true,
      message: `Auto crawler started with ${config.interval} minute interval`,
      nextRun: crawlerState.nextRun
    });

  } catch (error) {
    console.error('Crawler start error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

async function runCrawlerCycle(config: any) {
  console.log('🤖 Starting crawler cycle...', new Date().toISOString());
  
  try {
    // Search for news across all configured categories
    for (const category of config.categories) {
      const searchParams = {
        category,
        language: config.language,
        type: '1,2,3', // All types
        limit: config.limit
      };

      // Fetch news from AA API
      const response = await fetch('https://api.aa.com.tr/abone/search/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(`${process.env.AA_USERNAME}:${process.env.AA_PASSWORD}`).toString('base64')}`
        },
        body: JSON.stringify({
          filter_category: category,
          filter_language: config.language,
          filter_type: '1,2,3',
          limit: config.limit
        })
      });

      if (!response.ok) {
        console.error(`AA API error for category ${category}:`, response.status);
        crawlerState.stats.errorCount++;
        continue;
      }

      const data = await response.json();
      const newsItems = Array.isArray(data?.data?.result) ? data.data.result : [];
      
      console.log(`📰 Found ${newsItems.length} news items in category: ${category}`);

      // Process each news item
      for (const item of newsItems) {
        try {
          crawlerState.stats.totalProcessed++;
          
          // Check for duplicates if enabled
          if (config.duplicateCheck) {
            const duplicate = await checkDuplicate(item.title, item.brief);
            if (duplicate.isDuplicate) {
              console.log(`⚠️ Duplicate found: ${item.title}`);
              crawlerState.stats.duplicateCount++;
              continue;
            }
          }

          // Get full news detail
          const detailResponse = await fetch(`https://api.aa.com.tr/abone/document/${item.id}/newsml29`, {
            headers: {
              'Authorization': `Basic ${Buffer.from(`${process.env.AA_USERNAME}:${process.env.AA_PASSWORD}`).toString('base64')}`
            }
          });

          let fullContent = item.brief;
          if (detailResponse.ok) {
            const xmlData = await detailResponse.text();
            const contentMatch = xmlData.match(/<p[^>]*>([\s\S]*?)<\/p>/g);
            if (contentMatch) {
              fullContent = contentMatch.map(p => p.replace(/<[^>]*>/g, '')).join('\n\n');
            }
          }

          // Prepare news data
          let newsData: any = {
            id: item.id,
            title: item.title,
            content: fullContent,
            brief: item.brief,
            category,
            language: config.language,
            type: item.type,
            priority: item.priority,
            publishedAt: item.pubdate || new Date().toISOString(),
            source: 'AA',
            slug: generateSlug(item.title),
            status: config.autoPublish ? 'published' : 'draft',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          // AI Enhancement if enabled
          if (config.enableAI) {
            try {
              const aiResponse = await fetch('/api/ai/enhance-content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newsData)
              });

              if (aiResponse.ok) {
                const aiData = await aiResponse.json();
                newsData = { ...newsData, ...aiData.enhanced };
                console.log(`🤖 AI enhanced: ${item.title}`);
              }
            } catch (aiError) {
              console.error('AI enhancement error:', aiError);
            }
          }

          // Get/Add photos if enabled
          if (config.enableUnsplash && (!item.photos || item.photos.length === 0)) {
            try {
              const photoResponse = await fetch('/api/unsplash/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: extractKeywords(item.title) })
              });

              if (photoResponse.ok) {
                const photoData = await photoResponse.json();
                if (photoData.photos && photoData.photos.length > 0) {
                  newsData = { 
                    ...newsData, 
                    featuredImage: photoData.photos[0].urls.regular,
                    photos: photoData.photos.slice(0, 3) // Max 3 photos
                  };
                  console.log(`📸 Added Unsplash photos: ${item.title}`);
                }
              }
            } catch (photoError) {
              console.error('Unsplash photo error:', photoError);
            }
          }

          // Save to Firebase
          await addDoc(collection(db, 'news'), newsData);
          crawlerState.stats.successCount++;
          
          console.log(`✅ Processed: ${item.title}`);

          // Small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000));

        } catch (itemError) {
          console.error(`Error processing item ${item.id}:`, itemError);
          crawlerState.stats.errorCount++;
        }
      }
    }

    console.log(`🏁 Crawler cycle completed. Stats:`, crawlerState.stats);

  } catch (error) {
    console.error('Crawler cycle error:', error);
    crawlerState.stats.errorCount++;
  }
}

async function checkDuplicate(title: string, content: string): Promise<{ isDuplicate: boolean; existingId?: string }> {
  try {
    const q = query(
      collection(db, 'news'),
      where('title', '==', title),
      limit(1)
    );
    
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      return { isDuplicate: true, existingId: snapshot.docs[0].id };
    }

    return { isDuplicate: false };
  } catch (error) {
    console.error('Duplicate check error:', error);
    return { isDuplicate: false };
  }
}

function extractKeywords(title: string): string {
  const stopWords = ['ve', 'ile', 'için', 'bir', 'bu', 'şu', 'o', 'da', 'de', 'ta', 'te'];
  const words = title.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(' ')
    .filter(word => word.length > 2 && !stopWords.includes(word))
    .slice(0, 3);
  
  return words.join(' ');
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
