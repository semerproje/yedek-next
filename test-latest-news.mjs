#!/usr/bin/env node

// Test the updated getLatestNews with wider date range
async function testLatestNews() {
  console.log('🧪 GetLatestNews Geniş Tarih Aralığı Testi...\n')
  
  const baseUrl = 'http://localhost:3000'
  
  try {
    // Test with 10 days back
    console.log('1️⃣ Son 10 gün arama testi...')
    const now = new Date()
    const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000)
    
    const searchParams = {
      start_date: tenDaysAgo.toISOString(),
      end_date: 'NOW',
      filter_type: '1',
      filter_language: '1',
      limit: 50,
      offset: 0
    }

    const response = await fetch(`${baseUrl}/api/aa-proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'search',
        params: searchParams
      })
    })

    if (response.ok) {
      const data = await response.json()
      console.log(`Son 10 gün: ${data.data?.documents?.length || 0}/${data.data?.total || 0} haber`)
      
      if (data.data?.documents?.length > 0) {
        console.log('✅ Haberler bulundu!')
        console.log('📰 İlk 3 haber:')
        data.data.documents.slice(0, 3).forEach((doc, i) => {
          console.log(`   ${i + 1}. ${doc.title}`)
          console.log(`      Kategori: ${doc.category} | Tarih: ${doc.date}`)
        })
      }
    }

    // Test with 15 days back (maximum archive)
    console.log('\n2️⃣ Son 15 gün (maksimum arşiv) arama testi...')
    const fifteenDaysAgo = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000)
    
    const maxSearchParams = {
      start_date: fifteenDaysAgo.toISOString(),
      end_date: 'NOW',
      filter_type: '1',
      filter_language: '1',
      limit: 50,
      offset: 0
    }

    const maxResponse = await fetch(`${baseUrl}/api/aa-proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'search',
        params: maxSearchParams
      })
    })

    if (maxResponse.ok) {
      const maxData = await maxResponse.json()
      console.log(`Son 15 gün: ${maxData.data?.documents?.length || 0}/${maxData.data?.total || 0} haber`)
      
      if (maxData.data?.documents?.length > 0) {
        console.log('✅ Maksimum arşivde haberler bulundu!')
        
        // Kategori analizi
        const categoryCount = {}
        maxData.data.documents.forEach(doc => {
          const cat = doc.category || 'Bilinmeyen'
          categoryCount[cat] = (categoryCount[cat] || 0) + 1
        })
        
        console.log('\n📊 Kategori dağılımı:')
        Object.entries(categoryCount).forEach(([cat, count]) => {
          console.log(`   ${cat}: ${count} haber`)
        })
      }
    }

    // Test specific categories
    console.log('\n3️⃣ Spesifik kategori testleri...')
    const categories = [
      { id: '1', name: 'Genel' },
      { id: '2', name: 'Spor' },
      { id: '3', name: 'Ekonomi' }
    ]

    for (const cat of categories) {
      const catParams = {
        start_date: fifteenDaysAgo.toISOString(),
        end_date: 'NOW',
        filter_category: cat.id,
        filter_type: '1',
        filter_language: '1',
        limit: 10,
        offset: 0
      }

      const catResponse = await fetch(`${baseUrl}/api/aa-proxy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'search',
          params: catParams
        })
      })

      if (catResponse.ok) {
        const catData = await catResponse.json()
        console.log(`${cat.name}: ${catData.data?.documents?.length || 0}/${catData.data?.total || 0} haber`)
      }
    }

  } catch (error) {
    console.error('🚨 Test hatası:', error.message)
  }
}

testLatestNews()
