import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, getDocs, query, limit } from 'firebase/firestore'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Debug API: Testing Firestore collections...')
    
    if (!db) {
      console.error('❌ Firebase DB not initialized')
      return NextResponse.json({
        success: false,
        error: 'Firebase DB not initialized',
        data: null
      })
    }

    // AA News collection test
    const aaNewsRef = collection(db, 'aa_news')
    const aaQuery = query(aaNewsRef, limit(10))
    const aaSnapshot = await getDocs(aaQuery)
    console.log(`✅ AA News collection: ${aaSnapshot.size} documents`)
    
    // Regular News collection test
    const newsRef = collection(db, 'news')
    const newsQuery = query(newsRef, limit(10))
    const newsSnapshot = await getDocs(newsQuery)
    console.log(`✅ Regular News collection: ${newsSnapshot.size} documents`)
    
    // Sample data from both collections - show ALL fields
    const aaNewsData = aaSnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        availableFields: Object.keys(data),
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt
      }
    })
    
    const regularNewsData = newsSnapshot.docs.map(doc => ({
      id: doc.id,
      title: doc.data().title,
      category: doc.data().category,
      source: doc.data().source || 'Regular',
      createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate().toISOString() : null
    }))
    
    // Category analysis
    const allCategories = [
      ...aaNewsData.map((n: any) => n.category).filter(Boolean),
      ...regularNewsData.map((n: any) => n.category).filter(Boolean)
    ]
    
    const categoryCount = allCategories.reduce((acc, cat) => {
      acc[cat] = (acc[cat] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    console.log('📊 Category distribution:', categoryCount)
    
    return NextResponse.json({
      success: true,
      data: {
        collections: {
          aa_news: {
            count: aaSnapshot.size,
            sample: aaNewsData
          },
          news: {
            count: newsSnapshot.size,
            sample: regularNewsData
          }
        },
        categoryDistribution: categoryCount,
        totalNews: aaSnapshot.size + newsSnapshot.size,
        uniqueCategories: Object.keys(categoryCount)
      }
    })
    
  } catch (error) {
    console.error('❌ Debug API error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      data: null
    }, { status: 500 })
  }
}
