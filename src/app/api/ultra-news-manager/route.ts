import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where, orderBy, limit, Timestamp, deleteDoc, doc } from 'firebase/firestore';

// Enhanced news management API
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'list';
    const category = searchParams.get('category');
    const priority = searchParams.get('priority');
    const type = searchParams.get('type');
    const limitParam = searchParams.get('limit') || '100';
    
    if (action === 'list') {
      // Build query
      let newsQuery = query(
        collection(db, 'news'),
        where('source', '==', 'AA'),
        orderBy('createdAt', 'desc'),
        limit(parseInt(limitParam))
      );

      // Apply filters
      if (category) {
        newsQuery = query(
          collection(db, 'news'),
          where('source', '==', 'AA'),
          where('category', '==', category),
          orderBy('createdAt', 'desc'),
          limit(parseInt(limitParam))
        );
      }

      const querySnapshot = await getDocs(newsQuery);
      const news: any[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        news.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString(),
          updatedAt: data.updatedAt?.toDate?.()?.toISOString()
        });
      });

      // Calculate statistics
      const stats = {
        totalNews: news.length,
        categoryCounts: {} as Record<string, number>,
        priorityCounts: {} as Record<string, number>,
        typeCounts: {} as Record<string, number>,
        lastUpdate: news.length > 0 ? news[0].createdAt : null
      };

      // Count by categories, priorities, types
      news.forEach(item => {
        const cat = String(item.category || 'unknown');
        const pri = String(item.priority || 'unknown');
        const typ = String(item.type || 'unknown');
        
        stats.categoryCounts[cat] = (stats.categoryCounts[cat] || 0) + 1;
        stats.priorityCounts[pri] = (stats.priorityCounts[pri] || 0) + 1;
        stats.typeCounts[typ] = (stats.typeCounts[typ] || 0) + 1;
      });

      return NextResponse.json({
        success: true,
        news,
        stats,
        timestamp: new Date().toISOString()
      });
    }

    if (action === 'stats') {
      // Get statistics only
      const newsQuery = query(
        collection(db, 'news'),
        where('source', '==', 'AA'),
        orderBy('createdAt', 'desc'),
        limit(1000)
      );

      const querySnapshot = await getDocs(newsQuery);
      const stats = {
        totalNews: querySnapshot.size,
        categoryCounts: {} as Record<string, number>,
        priorityCounts: {} as Record<string, number>,
        typeCounts: {} as Record<string, number>,
        lastUpdate: null as string | null,
        averagePerHour: 0
      };

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const cat = String(data.category || 'unknown');
        const pri = String(data.priority || 'unknown');
        const typ = String(data.type || 'unknown');
        
        stats.categoryCounts[cat] = (stats.categoryCounts[cat] || 0) + 1;
        stats.priorityCounts[pri] = (stats.priorityCounts[pri] || 0) + 1;
        stats.typeCounts[typ] = (stats.typeCounts[typ] || 0) + 1;

        if (!stats.lastUpdate && data.createdAt) {
          stats.lastUpdate = data.createdAt.toDate().toISOString();
        }
      });

      return NextResponse.json({
        success: true,
        stats,
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json({
      success: false,
      message: 'Invalid action'
    });

  } catch (error: any) {
    console.error('News management API error:', error);
    return NextResponse.json({
      success: false,
      message: 'API error',
      error: error.message
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, newsData, filters, duplicateCheck = true } = await request.json();

    if (action === 'bulk-save' || action === 'bulk-save-unique' || action === 'bulk-save-overwrite') {
      // Bulk save news with enhanced duplicate checking
      let savedCount = 0;
      let duplicateCount = 0;
      let updatedCount = 0;
      let overwrittenCount = 0;
      const errors: string[] = [];

      console.log(`🚀 Starting ${action} with ${newsData.length} items, duplicateCheck: ${duplicateCheck}`);

      for (const item of newsData) {
        try {
          console.log(`📝 Processing news: ${item.title?.substring(0, 50)}...`);
          
          // Duplicate kontrolü artık aaId üzerinden yapılacak
          let duplicateQuery;
          if (item.aaId) {
            duplicateQuery = query(
              collection(db, 'news'),
              where('aaId', '==', item.aaId),
              limit(1)
            );
          } else {
            // Fallback: başlık ve kaynak ile kontrol
            duplicateQuery = query(
              collection(db, 'news'),
              where('title', '==', item.title),
              where('source', '==', 'AA'),
              limit(1)
            );
          }

          const duplicateSnapshot = await getDocs(duplicateQuery);

          if (duplicateSnapshot.empty) {
            // No duplicate found, save the news
            const newsDoc = {
              ...item,
              source: 'AA',
              category: item.category || '1', // Default to Genel
              priority: item.priority || 4, // Default to Rutin
              type: item.type || 1, // Default to Text
              createdAt: Timestamp.now(),
              updatedAt: Timestamp.now()
            };

            console.log(`💾 Saving new to Firestore:`, {
              id: newsDoc.id,
              title: newsDoc.title?.substring(0, 50),
              category: newsDoc.category,
              priority: newsDoc.priority,
              type: newsDoc.type,
              publishDate: newsDoc.publishDate
            });

            const docRef = await addDoc(collection(db, 'news'), newsDoc);
            
            console.log(`✅ Successfully saved with ID: ${docRef.id}`);
            savedCount++;
          } else {
            // Duplicate found - handle based on action type
            const existingDoc = duplicateSnapshot.docs[0];
            const existingData = existingDoc.data();
            
            if (action === 'bulk-save-overwrite') {
              // Always overwrite existing news with new data
              const updatedNewsDoc = {
                ...item,
                source: 'AA',
                category: item.category || existingData.category || '1',
                priority: item.priority || existingData.priority || 4,
                type: item.type || existingData.type || 1,
                createdAt: existingData.createdAt || Timestamp.now(), // Keep original creation time
                updatedAt: Timestamp.now()
              };

              // Delete old document and create new one
              await deleteDoc(doc(db, 'news', existingDoc.id));
              const docRef = await addDoc(collection(db, 'news'), updatedNewsDoc);
              
              console.log(`🔄 Overwritten existing news: ${docRef.id} (was: ${existingDoc.id})`);
              overwrittenCount++;
            } else if (action === 'bulk-save-unique' && item.publishDate) {
              // Check if the new item is newer
              const existingDate = new Date(existingData.publishDate || existingData.createdAt?.toDate() || 0);
              const newDate = new Date(item.publishDate);
              
              if (newDate > existingDate) {
                // Update with newer data
                const updatedNewsDoc = {
                  ...item,
                  source: 'AA',
                  category: item.category || existingData.category || '1',
                  priority: item.priority || existingData.priority || 4,
                  type: item.type || existingData.type || 1,
                  createdAt: existingData.createdAt, // Keep original creation time
                  updatedAt: Timestamp.now()
                };

                await deleteDoc(doc(db, 'news', existingDoc.id));
                const docRef = await addDoc(collection(db, 'news'), updatedNewsDoc);
                
                console.log(`🔄 Updated duplicate with newer data: ${docRef.id}`);
                updatedCount++;
              } else {
                console.log(`⚠️ Duplicate found with same/older date, skipping: ${item.title?.substring(0, 50)}`);
                duplicateCount++;
              }
            } else {
              console.log(`⚠️ Duplicate found, skipping: ${item.title?.substring(0, 50)}`);
              duplicateCount++;
            }
          }
        } catch (itemError: any) {
          console.error(`❌ Error saving item:`, itemError);
          errors.push(`${item.title?.substring(0, 50)}: ${itemError.message}`);
        }
      }

      return NextResponse.json({
        success: true,
        message: `${action} completed`,
        savedCount,
        duplicateCount,
        updatedCount,
        overwrittenCount,
        errorCount: errors.length,
        errors: errors.slice(0, 5), // Return first 5 errors
        summary: {
          total: newsData.length,
          saved: savedCount,
          duplicates: duplicateCount,
          updated: updatedCount,
          overwritten: overwrittenCount,
          errors: errors.length
        },
        timestamp: new Date().toISOString()
      });
    }

    if (action === 'single-save') {
      // Save single news item
      const newsDoc = {
        ...newsData,
        source: 'AA',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      const docRef = await addDoc(collection(db, 'news'), newsDoc);

      return NextResponse.json({
        success: true,
        message: 'News saved successfully',
        docId: docRef.id,
        timestamp: new Date().toISOString()
      });
    }

    if (action === 'delete') {
      // Delete news item
      const { newsId } = await request.json();
      await deleteDoc(doc(db, 'news', newsId));

      return NextResponse.json({
        success: true,
        message: 'News deleted successfully',
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json({
      success: false,
      message: 'Invalid action'
    });

  } catch (error: any) {
    console.error('News management POST error:', error);
    return NextResponse.json({
      success: false,
      message: 'POST API error',
      error: error.message
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const newsId = searchParams.get('id');

    if (!newsId) {
      return NextResponse.json({
        success: false,
        message: 'News ID required'
      }, { status: 400 });
    }

    await deleteDoc(doc(db, 'news', newsId));

    return NextResponse.json({
      success: true,
      message: 'News deleted successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('News delete error:', error);
    return NextResponse.json({
      success: false,
      message: 'Delete error',
      error: error.message
    }, { status: 500 });
  }
}
