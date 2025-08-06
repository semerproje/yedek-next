#!/usr/bin/env node

// Test the fully fixed AA API with correct response structure
async function testCompletelyFixed() {
  console.log('🧪 Tamamen Düzeltilmiş AA API Testi...\n')
  
  const baseUrl = 'http://localhost:3000'
  
  try {
    // Test with simple parameters that we know work
    const now = new Date()
    const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000)
    
    const searchParams = {
      start_date: tenDaysAgo.toISOString(),
      end_date: 'NOW',
      limit: 10,
      offset: 0
    }

    console.log('🔍 Arama parametreleri:', searchParams)

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
      
      console.log('\n🎯 Proxy Response:')
      console.log(`✅ Success: ${data.success}`)
      console.log(`📊 Total news: ${data.data?.data?.total || 0}`)
      console.log(`📝 Result count: ${data.data?.data?.result?.length || 0}`)
      
      if (data.data?.data?.result && data.data.data.result.length > 0) {
        console.log('\n🌟 AA API Response Structure Verified!')
        console.log('✅ Full path: data.data.data.result')
        console.log(`✅ Total: ${data.data.data.total}`)
        
        console.log('\n📰 İlk 5 haber:')
        data.data.data.result.slice(0, 5).forEach((item, i) => {
          console.log(`${i + 1}. ${item.title}`)
          console.log(`   ID: ${item.id} | Type: ${item.type} | Date: ${item.date}`)
        })
        
        // Test with text filter
        console.log('\n🔍 Text haberler için filtreleme testi...')
        const textParams = {
          start_date: tenDaysAgo.toISOString(),
          end_date: 'NOW',
          filter_type: '1', // Sadece text
          filter_language: '1', // Türkçe
          limit: 5,
          offset: 0
        }

        const textResponse = await fetch(`${baseUrl}/api/aa-proxy`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            action: 'search',
            params: textParams
          })
        })

        if (textResponse.ok) {
          const textData = await textResponse.json()
          console.log(`📝 Sadece text haberler: ${textData.data?.data?.result?.length || 0}/${textData.data?.data?.total || 0}`)
          
          if (textData.data?.data?.result?.length > 0) {
            console.log('🎯 Text haberler başarıyla filtrelendi!')
            textData.data.data.result.slice(0, 3).forEach((item, i) => {
              console.log(`  ${i + 1}. ${item.title}`)
            })
          }
        }
      }
    } else {
      console.log('❌ API çağrısı başarısız:', response.status)
    }

  } catch (error) {
    console.error('🚨 Test hatası:', error.message)
  }
}

testCompletelyFixed()
