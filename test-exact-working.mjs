#!/usr/bin/env node

// Test with exact same parameters that worked before
async function testExactWorking() {
  console.log('🧪 Exact Working Parameters Test...\n')
  
  const baseUrl = 'http://localhost:3000'
  
  try {
    const now = new Date()
    const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000)
    
    // Exact same parameters from the working test
    const searchParams = {
      start_date: tenDaysAgo.toISOString(),
      end_date: 'NOW',
      limit: 1,
      offset: 0
    }

    console.log('🔍 Test parameters:', searchParams)

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
      
      console.log('🎯 Raw API Response:')
      console.log(JSON.stringify(data, null, 2))
      
    } else {
      console.log('❌ API çağrısı başarısız:', response.status)
    }

  } catch (error) {
    console.error('🚨 Test hatası:', error.message)
  }
}

testExactWorking()
