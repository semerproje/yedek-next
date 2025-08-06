import { db } from '@/lib/firebase'
import { collection, getDocs, query, limit } from 'firebase/firestore'

// Debug fonksiyonu
async function debugFirestore() {
  if (!db) {
    console.error('❌ Firebase DB not initialized')
    return
  }

  try {
    console.log('🔍 Testing Firestore connections...')
    
    // AA News collection test
    const aaNewsRef = collection(db, 'aa_news')
    const aaQuery = query(aaNewsRef, limit(5))
    const aaSnapshot = await getDocs(aaQuery)
    console.log(`✅ AA News collection: ${aaSnapshot.size} documents`)
    
    if (aaSnapshot.size > 0) {
      const firstDoc = aaSnapshot.docs[0].data()
      console.log('📄 Sample AA news:', {
        id: aaSnapshot.docs[0].id,
        title: firstDoc.title,
        category: firstDoc.category,
        source: firstDoc.source
      })
    }
    
    // Regular News collection test
    const newsRef = collection(db, 'news')
    const newsQuery = query(newsRef, limit(5))
    const newsSnapshot = await getDocs(newsQuery)
    console.log(`✅ Regular News collection: ${newsSnapshot.size} documents`)
    
    if (newsSnapshot.size > 0) {
      const firstDoc = newsSnapshot.docs[0].data()
      console.log('📄 Sample regular news:', {
        id: newsSnapshot.docs[0].id,
        title: firstDoc.title,
        category: firstDoc.category,
        source: firstDoc.source
      })
    }
    
    return {
      aaNewsCount: aaSnapshot.size,
      regularNewsCount: newsSnapshot.size,
      total: aaSnapshot.size + newsSnapshot.size
    }
    
  } catch (error) {
    console.error('❌ Firestore connection error:', error)
    return null
  }
}

export { debugFirestore }
