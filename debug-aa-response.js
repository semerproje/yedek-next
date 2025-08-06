// Debug AA API Response

async function debugAAResponse() {
  try {
    console.log('🔍 AA Subscription Response Debug...\n')
    
    const response = await fetch('http://localhost:3001/api/aa-proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'subscription'
      })
    })

    const data = await response.json()
    console.log('Subscription Full Response:')
    console.log(JSON.stringify(data, null, 2))
    
    console.log('\n🔍 AA Search Response Debug...\n')
    
    const searchResponse = await fetch('http://localhost:3001/api/aa-proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'search',
        params: {
          start_date: '2025-07-29T00:00:00Z',
          end_date: 'NOW',
          filter_category: '1',
          filter_language: '1',
          limit: 5
        }
      })
    })

    const searchData = await searchResponse.json()
    console.log('Search Full Response:')
    console.log(JSON.stringify(searchData, null, 2))
    
  } catch (error) {
    console.error('Debug hatası:', error)
  }
}

debugAAResponse()
