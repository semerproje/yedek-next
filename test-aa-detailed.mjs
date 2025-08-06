#!/usr/bin/env node

// Detailed AA API Subscription and Discovery Test
async function detailedTest() {
  console.log('🧪 AA API Detaylı Abonelik Testi...\n')
  
  const baseUrl = 'http://localhost:3000'
  
  try {
    // Test 1: Detailed Discover
    console.log('1️⃣ Detaylı Discover testi...')
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

    if (discoverResponse.ok) {
      const discoverData = await discoverResponse.json()
      console.log('✅ Discover başarılı!')
      console.log('Discover tam response:', JSON.stringify(discoverData.data, null, 2))
    } else {
      console.log('❌ Discover başarısız')
    }

    // Test 2: Detailed Subscription
    console.log('\n2️⃣ Detaylı Subscription testi...')
    const subResponse = await fetch(`${baseUrl}/api/aa-proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'subscription'
      })
    })

    if (subResponse.ok) {
      const subData = await subResponse.json()
      console.log('✅ Subscription başarılı!')
      console.log('Subscription tam response:', JSON.stringify(subData.data, null, 2))
    } else {
      const errorText = await subResponse.text()
      console.log('❌ Subscription başarısız:', errorText)
    }

    // Test 3: Test with different date formats
    console.log('\n3️⃣ Farklı tarih formatları testi...')
    
    const dateTests = [
      {
        name: 'ISO format - son 30 gün',
        start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        end_date: 'NOW'
      },
      {
        name: 'ISO format - son 90 gün',
        start_date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        end_date: 'NOW'
      },
      {
        name: 'Fixed date range',
        start_date: '2025-07-01T00:00:00Z',
        end_date: '2025-07-31T23:59:59Z'
      }
    ]

    for (const dateTest of dateTests) {
      console.log(`\n📅 ${dateTest.name}:`)
      
      const searchParams = {
        start_date: dateTest.start_date,
        end_date: dateTest.end_date,
        limit: 10,
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
        console.log(`   Sonuç: ${data.data?.documents?.length || 0}/${data.data?.total || 0} haber`)
        
        if (data.data?.total > 0) {
          console.log('   ✅ Bu tarih aralığında haber bulundu!')
          if (data.data.documents?.length > 0) {
            console.log('   📰 İlk haber:', data.data.documents[0].title)
          }
        }
      } else {
        console.log('   ❌ Arama başarısız')
      }
    }

    // Test 4: Check if it's a timing issue
    console.log('\n4️⃣ API yanıt süresi testi...')
    const startTime = Date.now()
    
    const timeTestResponse = await fetch(`${baseUrl}/api/aa-proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'search',
        params: {
          start_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          end_date: 'NOW',
          limit: 1,
          offset: 0
        }
      })
    })
    
    const endTime = Date.now()
    console.log(`API yanıt süresi: ${endTime - startTime}ms`)

  } catch (error) {
    console.error('🚨 Test hatası:', error.message)
  }
}

detailedTest()
