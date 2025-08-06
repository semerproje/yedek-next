#!/usr/bin/env node

// Test the AA API Proxy directly
async function testProxy() {
  console.log('🧪 AA API Proxy Test Başlıyor...\n')
  
  const baseUrl = 'http://localhost:3000'
  
  try {
    // Test 1: Discover
    console.log('1️⃣ Discover proxy test...')
    const discoverResponse = await fetch(`${baseUrl}/api/aa-proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'discover',
        params: { language: 'tr_TR' }
      })
    })
    
    console.log(`Proxy Discover Status: ${discoverResponse.status}`)
    if (discoverResponse.ok) {
      const discoverData = await discoverResponse.json()
      console.log('✅ Discover proxy başarılı!', {
        success: discoverData.success,
        hasData: !!discoverData.data,
        categories: discoverData.data?.category?.length || 0
      })
    } else {
      const errorText = await discoverResponse.text()
      console.log('❌ Discover proxy hatası:', errorText)
      return
    }

    // Test 2: Search with last 24 hours
    console.log('\n2️⃣ Search proxy test (son 24 saat)...')
    const now = new Date()
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    
    const searchParams = {
      start_date: yesterday.toISOString(),
      end_date: 'NOW',
      filter_type: '1',
      filter_language: '1',
      limit: 10,
      offset: 0
    }

    const searchResponse = await fetch(`${baseUrl}/api/aa-proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'search',
        params: searchParams
      })
    })

    console.log(`Proxy Search Status: ${searchResponse.status}`)
    if (searchResponse.ok) {
      const searchData = await searchResponse.json()
      console.log('✅ Search proxy başarılı!', {
        success: searchData.success,
        hasData: !!searchData.data,
        documents: searchData.data?.documents?.length || 0,
        total: searchData.data?.total || 0
      })
      
      if (searchData.data?.documents?.length > 0) {
        console.log('📰 İlk haber başlığı:', searchData.data.documents[0].title)
      }
    } else {
      const errorText = await searchResponse.text()
      console.log('❌ Search proxy hatası:', errorText)
    }

    // Test 3: Different time ranges
    console.log('\n3️⃣ Farklı zaman aralıkları testi...')
    
    const timeRanges = [
      { hours: 1, name: 'Son 1 saat' },
      { hours: 6, name: 'Son 6 saat' },
      { hours: 12, name: 'Son 12 saat' },
      { hours: 48, name: 'Son 48 saat' }
    ]

    for (const range of timeRanges) {
      const startTime = new Date(now.getTime() - range.hours * 60 * 60 * 1000)
      
      const rangeParams = {
        start_date: startTime.toISOString(),
        end_date: 'NOW',
        filter_type: '1',
        filter_language: '1',
        limit: 5,
        offset: 0
      }

      const rangeResponse = await fetch(`${baseUrl}/api/aa-proxy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'search',
          params: rangeParams
        })
      })

      if (rangeResponse.ok) {
        const rangeData = await rangeResponse.json()
        console.log(`${range.name}: ${rangeData.data?.documents?.length || 0}/${rangeData.data?.total || 0} haber`)
      } else {
        console.log(`${range.name}: Hata`)
      }
    }

  } catch (error) {
    console.error('🚨 Proxy test hatası:', error.message)
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Çözüm önerisi: Development server çalışıyor mu?')
      console.log('   Şu komutu çalıştırın: npm run dev')
    }
  }
}

testProxy()
