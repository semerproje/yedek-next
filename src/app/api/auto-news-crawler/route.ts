import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';

// Otomatik haber çekim durumu
let isCrawling = false;
let lastCrawlTime: Date | null = null;
let crawlInterval: NodeJS.Timeout | null = null;
const crawlSettings = {
  enabled: false,
  intervalMinutes: 30, // Varsayılan 30 dakika
  lastRun: null as Date | null,
  totalNews: 0,
  errors: [] as string[]
};

// AA API'den haber çekme fonksiyonu
async function fetchNewsFromAA() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/aa-news/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: '',
        limit: 100
      })
    });

    if (!response.ok) {
      throw new Error(`AA API error: ${response.status}`);
    }

    const data = await response.json();
    return data.news || [];
  } catch (error) {
    console.error('AA API fetch error:', error);
    throw error;
  }
}

// Firestore'a haber kaydetme (duplicate kontrolü ile)
async function saveNewsToFirestore(newsItems: any[]) {
  const savedNews = [];
  const duplicates = [];
  const errors = [];

  for (const newsItem of newsItems) {
    try {
      // Duplicate kontrolü
      const existingQuery = query(
        collection(db, 'news'),
        where('id', '==', newsItem.id)
      );
      const existingDocs = await getDocs(existingQuery);

      if (existingDocs.empty) {
        // Detaylı haber bilgilerini hazırla (brief kullanarak)
        let detailedNews = { 
          ...newsItem,
          content: newsItem.brief || newsItem.title || '',
          summary: newsItem.brief || newsItem.title || '',
          images: [],
          location: '',
          tags: []
        };
        
        // Haber detayını fetch etmeye çalış (opsiyonel)
        try {
          if (newsItem.url) {
            const detailResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/aa-news/detail`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ url: newsItem.url })
            });

            if (detailResponse.ok) {
              const detailData = await detailResponse.json();
              if (detailData.success && detailData.article) {
                // Detay bilgilerini ekle (mevcut brief bilgisini override etme)
                detailedNews = {
                  ...detailedNews,
                  content: detailData.article.content || detailedNews.content,
                  summary: detailData.article.summary || detailedNews.summary,
                  images: detailData.article.images || [],
                  location: detailData.article.location || '',
                  tags: detailData.article.tags || []
                };
              }
            }
          }
        } catch (detailError) {
          // Detay çekme başarısız - brief ile devam et
          console.log(`Detail fetch failed for ${newsItem.id}, using brief data`);
        }

        // Yeni haber - kaydet
        try {
          console.log(`💾 Attempting to save news ${newsItem.id} to Firestore...`);
          
          const newsData = {
            ...detailedNews,
            source: 'AA',
            category: detailedNews.category || 'genel',
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
          };
          
          console.log(`📝 News data prepared:`, {
            id: newsItem.id,
            title: newsData.title?.substring(0, 50) + '...',
            category: newsData.category,
            source: newsData.source
          });
          
          const docRef = await addDoc(collection(db, 'news'), newsData);
          
          console.log(`✅ Successfully saved news ${newsItem.id} with Firestore doc ID: ${docRef.id}`);
          
          savedNews.push({
            ...detailedNews,
            docId: docRef.id
          });
        } catch (saveError: any) {
          console.error(`❌ Failed to save news ${newsItem.id} to Firestore:`, {
            error: saveError.message,
            code: saveError.code,
            details: saveError
          });
          errors.push(`${newsItem.id}: ${saveError.message}`);
        }
      } else {
        duplicates.push(newsItem.id);
      }
    } catch (error: any) {
      console.error(`Error saving news ${newsItem.id}:`, error);
      errors.push(`${newsItem.id}: ${error.message}`);
    }
  }

  return { savedNews, duplicates, errors };
}

// Otomatik çekim fonksiyonu
async function performAutoCrawl() {
  if (isCrawling) {
    console.log('Auto crawl already in progress, skipping...');
    return;
  }

  isCrawling = true;
  lastCrawlTime = new Date();
  crawlSettings.lastRun = lastCrawlTime;

  try {
    console.log(`🚀 Auto crawl started at ${lastCrawlTime.toISOString()}`);
    
    // AA'dan haberleri çek
    const newsItems = await fetchNewsFromAA();
    console.log(`📰 Fetched ${newsItems.length} news items from AA`);

    if (newsItems.length > 0) {
      // Firestore'a kaydet
      const result = await saveNewsToFirestore(newsItems);
      
      crawlSettings.totalNews += result.savedNews.length;
      
      console.log(`✅ Saved ${result.savedNews.length} new news items`);
      console.log(`⚠️ Skipped ${result.duplicates.length} duplicates`);
      
      if (result.errors.length > 0) {
        console.log(`❌ ${result.errors.length} errors occurred`);
        crawlSettings.errors.push(...result.errors.slice(0, 5)); // Son 5 hatayı sakla
      }
    }

  } catch (error: any) {
    console.error('Auto crawl error:', error);
    crawlSettings.errors.push(`${new Date().toISOString()}: ${error.message}`);
  } finally {
    isCrawling = false;
  }
}

// GET: Otomatik çekim durumunu getir
export async function GET() {
  return NextResponse.json({
    success: true,
    status: {
      enabled: crawlSettings.enabled,
      intervalMinutes: crawlSettings.intervalMinutes,
      isCrawling,
      lastRun: crawlSettings.lastRun,
      totalNews: crawlSettings.totalNews,
      errors: crawlSettings.errors.slice(-5), // Son 5 hata
      nextRun: crawlSettings.enabled && crawlSettings.lastRun 
        ? new Date(crawlSettings.lastRun.getTime() + crawlSettings.intervalMinutes * 60000)
        : null
    }
  });
}

// POST: Otomatik çekim ayarlarını değiştir
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, intervalMinutes } = body;

    switch (action) {
      case 'start':
        if (crawlSettings.enabled) {
          return NextResponse.json({
            success: false,
            message: 'Auto crawl is already running'
          });
        }

        crawlSettings.enabled = true;
        crawlSettings.intervalMinutes = intervalMinutes || 30;
        crawlSettings.errors = []; // Hataları temizle

        // İlk çekimi hemen başlat
        performAutoCrawl();

        // Interval ayarla
        crawlInterval = setInterval(performAutoCrawl, crawlSettings.intervalMinutes * 60000);

        return NextResponse.json({
          success: true,
          message: `Auto crawl started with ${crawlSettings.intervalMinutes} minute intervals`,
          status: crawlSettings
        });

      case 'stop':
        crawlSettings.enabled = false;
        
        if (crawlInterval) {
          clearInterval(crawlInterval);
          crawlInterval = null;
        }

        return NextResponse.json({
          success: true,
          message: 'Auto crawl stopped',
          status: crawlSettings
        });

      case 'manual':
        // Manuel çekim
        if (isCrawling) {
          return NextResponse.json({
            success: false,
            message: 'Auto crawl is currently running, please wait'
          });
        }

        performAutoCrawl();

        return NextResponse.json({
          success: true,
          message: 'Manual crawl started',
          status: crawlSettings
        });

      case 'update-interval':
        if (!intervalMinutes || intervalMinutes < 1) {
          return NextResponse.json({
            success: false,
            message: 'Interval must be at least 1 minute'
          });
        }

        crawlSettings.intervalMinutes = intervalMinutes;

        // Eğer çalışıyorsa interval'ı güncelle
        if (crawlSettings.enabled && crawlInterval) {
          clearInterval(crawlInterval);
          crawlInterval = setInterval(performAutoCrawl, crawlSettings.intervalMinutes * 60000);
        }

        return NextResponse.json({
          success: true,
          message: `Interval updated to ${intervalMinutes} minutes`,
          status: crawlSettings
        });

      case 'test-firestore':
        // Firestore bağlantı testi
        try {
          console.log('🔥 Testing Firestore connection from auto-crawler...');
          
          const testDoc = {
            title: 'Auto-Crawler Firestore Test',
            content: 'Test from auto-crawler at ' + new Date().toISOString(),
            source: 'AUTO_CRAWLER_TEST',
            category: 'test',
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
          };

          const docRef = await addDoc(collection(db, 'news'), testDoc);
          
          return NextResponse.json({
            success: true,
            message: 'Firestore test successful ✅',
            testDocId: docRef.id,
            timestamp: new Date().toISOString()
          });
          
        } catch (firestoreError: any) {
          console.error('❌ Firestore test failed:', firestoreError);
          
          return NextResponse.json({
            success: false,
            message: 'Firestore test failed ❌',
            error: firestoreError.message,
            errorCode: firestoreError.code
          });
        }

      default:
        return NextResponse.json({
          success: false,
          message: 'Invalid action. Use: start, stop, manual, update-interval, or test-firestore'
        });
    }

  } catch (error: any) {
    console.error('Auto news crawler error:', error);
    return NextResponse.json({
      success: false,
      message: 'Auto news crawler error',
      error: error.message
    }, { status: 500 });
  }
}
