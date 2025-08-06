#!/usr/bin/env node

// Test with specific package and provider filters based on subscription
async function testWithPackageFilters() {
  console.log('🧪 Package Filtresi ile AA API Testi...\n')
  
  const baseUrl = 'http://localhost:3000'
  
  try {
    // From subscription data: package 5 (Internet), provider 1 (Anadolu Ajansı)
    console.log('1️⃣ Package 5 (Internet) ile test...')
    const now = new Date()
    const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000)
    
    const packageParams = {
      start_date: tenDaysAgo.toISOString(),
      end_date: 'NOW',
      filter_type: '1',
      filter_language: '1',
      filter_package: '5', // Internet package
      limit: 50,
      offset: 0
    }

    let response = await fetch(`${baseUrl}/api/aa-proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'search',
        params: packageParams
      })
    })

    if (response.ok) {
      const data = await response.json()
      console.log(`Package 5 ile: ${data.data?.documents?.length || 0}/${data.data?.total || 0} haber`)
    }

    // Test 2: Try package 7 (Şirket)
    console.log('\n2️⃣ Package 7 (Şirket) ile test...')
    const package7Params = {
      start_date: tenDaysAgo.toISOString(),
      end_date: 'NOW',
      filter_type: '1',
      filter_language: '1',
      filter_package: '7', // Şirket package
      limit: 50,
      offset: 0
    }

    response = await fetch(`${baseUrl}/api/aa-proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'search',
        params: package7Params
      })
    })

    if (response.ok) {
      const data = await response.json()
      console.log(`Package 7 ile: ${data.data?.documents?.length || 0}/${data.data?.total || 0} haber`)
    }

    // Test 3: Try with provider filter
    console.log('\n3️⃣ Provider 1 (Anadolu Ajansı) ile test...')
    const providerParams = {
      start_date: tenDaysAgo.toISOString(),
      end_date: 'NOW',
      filter_type: '1',
      filter_language: '1',
      filter_provider: '1', // Anadolu Ajansı
      limit: 50,
      offset: 0
    }

    response = await fetch(`${baseUrl}/api/aa-proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'search',
        params: providerParams
      })
    })

    if (response.ok) {
      const data = await response.json()
      console.log(`Provider 1 ile: ${data.data?.documents?.length || 0}/${data.data?.total || 0} haber`)
    }

    // Test 4: Try without any filters except date and language
    console.log('\n4️⃣ Minimal filtre (sadece tarih ve dil)...')
    const minimalParams = {
      start_date: tenDaysAgo.toISOString(),
      end_date: 'NOW',
      filter_language: '1',
      limit: 50,
      offset: 0
    }

    response = await fetch(`${baseUrl}/api/aa-proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'search',
        params: minimalParams
      })
    })

    if (response.ok) {
      const data = await response.json()
      console.log(`Minimal filtre ile: ${data.data?.documents?.length || 0}/${data.data?.total || 0} haber`)
    }

    // Test 5: Try with photo type (type 2)
    console.log('\n5️⃣ Fotoğraf türü (type 2) ile test...')
    const photoParams = {
      start_date: tenDaysAgo.toISOString(),
      end_date: 'NOW',
      filter_type: '2', // Fotoğraf
      filter_language: '1',
      limit: 50,
      offset: 0
    }

    response = await fetch(`${baseUrl}/api/aa-proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'search',
        params: photoParams
      })
    })

    if (response.ok) {
      const data = await response.json()
      console.log(`Fotoğraf türü ile: ${data.data?.documents?.length || 0}/${data.data?.total || 0} haber`)
    }

    // Test 6: Try a very simple search to see if we get any response structure
    console.log('\n6️⃣ En basit arama (sadece tarih)...')
    const simpleParams = {
      start_date: tenDaysAgo.toISOString(),
      end_date: 'NOW',
      limit: 1,
      offset: 0
    }

    response = await fetch(`${baseUrl}/api/aa-proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'search',
        params: simpleParams
      })
    })

    if (response.ok) {
      const data = await response.json()
      console.log(`En basit arama: ${data.data?.documents?.length || 0}/${data.data?.total || 0} haber`)
      console.log('Full response structure:', JSON.stringify(data.data, null, 2))
    }

  } catch (error) {
    console.error('🚨 Test hatası:', error.message)
  }
}

testWithPackageFilters()
