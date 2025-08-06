// AA Picture Format Test

async function testPictureFormats() {
  try {
    console.log('🖼️ AA Picture Format Test...\n')
    
    const pictureId = "aa:picture:20250731:38717493"
    
    console.log('1. Web format testi...')
    const webResponse = await fetch('http://localhost:3001/api/aa-proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'document',
        newsId: pictureId,
        type: 'picture',
        format: 'web'
      })
    })
    
    const webData = await webResponse.json()
    console.log('Web format response:', webData.success ? 'Success' : 'Failed')
    if (webData.details) {
      console.log(`  - Title: ${webData.details.title}`)
      console.log(`  - Photos: ${webData.details.photos?.length || 0}`)
    }
    
    console.log('\n2. NewsML29 format testi...')
    const newsmlResponse = await fetch('http://localhost:3001/api/aa-proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'document',
        newsId: pictureId,
        type: 'picture',
        format: 'newsml29'
      })
    })
    
    const newsmlData = await newsmlResponse.json()
    console.log('NewsML29 format response:', newsmlData.success ? 'Success' : 'Failed')
    if (newsmlData.details) {
      console.log(`  - Title: ${newsmlData.details.title}`)
      console.log(`  - Photos: ${newsmlData.details.photos?.length || 0}`)
    }
    
    console.log('\n3. Token format testi...')
    const tokenResponse = await fetch('http://localhost:3001/api/aa-proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'token',
        newsId: pictureId,
        format: 'web'
      })
    })
    
    const tokenData = await tokenResponse.json()
    console.log('Token format response:', tokenData.success ? 'Success' : 'Failed')
    console.log('Token data keys:', Object.keys(tokenData.data || {}))
    
  } catch (error) {
    console.error('❌ Test hatası:', error)
  }
}

testPictureFormats()
