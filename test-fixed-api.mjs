#!/usr/bin/env node

// Test the fixed AA API response handling
async function testFixedAPI() {
  console.log('🧪 AA API Düzeltilmiş Response Test...\n')
  
  const baseUrl = 'http://localhost:3000'
  
  try {
    // Test with the working simple search parameters
    const now = new Date()
    const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000)
    
    const searchParams = {
      start_date: tenDaysAgo.toISOString(),
      end_date: 'NOW',
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
      
      console.log('🎯 API Response yapısı:')
      console.log(`✅ Success: ${data.success}`)
      console.log(`📊 Total: ${data.data?.total || 0}`)
      console.log(`📝 Result array: ${data.data?.result?.length || 0} item`)
      
      if (data.data?.result && data.data.result.length > 0) {
        console.log('\n📰 İlk 5 haber:')
        data.data.result.slice(0, 5).forEach((item, i) => {
          console.log(`${i + 1}. ${item.title}`)
          console.log(`   Type: ${item.type} | Date: ${item.date}`)
        })
        
        // Tip dağılımı
        const typeCount = {}
        data.data.result.forEach(item => {
          typeCount[item.type] = (typeCount[item.type] || 0) + 1
        })
        
        console.log('\n📊 İçerik türü dağılımı:')
        Object.entries(typeCount).forEach(([type, count]) => {
          console.log(`   ${type}: ${count} adet`)
        })
      }
    } else {
      console.log('❌ API çağrısı başarısız')
    }

  } catch (error) {
    console.error('🚨 Test hatası:', error.message)
  }
}

testFixedAPI()
