#!/usr/bin/env node

// Comprehensive AA API Test with Different Parameters
async function comprehensiveTest() {
  console.log('🧪 Kapsamlı AA API Testi...\n')
  
  const baseUrl = 'http://localhost:3000'
  
  try {
    // Test 1: Very wide time range (last week)
    console.log('1️⃣ Geniş zaman aralığı testi (son 7 gün)...')
    const now = new Date()
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    
    const wideParams = {
      start_date: lastWeek.toISOString(),
      end_date: 'NOW',
      filter_type: '1',
      filter_language: '1',
      limit: 100,
      offset: 0
    }

    const wideResponse = await fetch(`${baseUrl}/api/aa-proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'search',
        params: wideParams
      })
    })

    if (wideResponse.ok) {
      const wideData = await wideResponse.json()
      console.log(`Son 7 gün: ${wideData.data?.documents?.length || 0}/${wideData.data?.total || 0} haber`)
    }

    // Test 2: Without any filters except language
    console.log('\n2️⃣ Minimal filtre testi...')
    const minimalParams = {
      start_date: lastWeek.toISOString(),
      end_date: 'NOW',
      filter_language: '1',
      limit: 50,
      offset: 0
    }

    const minimalResponse = await fetch(`${baseUrl}/api/aa-proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'search',
        params: minimalParams
      })
    })

    if (minimalResponse.ok) {
      const minimalData = await minimalResponse.json()
      console.log(`Minimal filtre: ${minimalData.data?.documents?.length || 0}/${minimalData.data?.total || 0} haber`)
    }

    // Test 3: Different content types
    console.log('\n3️⃣ Farklı içerik türleri testi...')
    const contentTypes = {
      '1': 'Haber',
      '2': 'Fotoğraf',
      '3': 'Video',
      '4': 'Dosya',
      '5': 'Grafik'
    }

    for (const [typeId, typeName] of Object.entries(contentTypes)) {
      const typeParams = {
        start_date: lastWeek.toISOString(),
        end_date: 'NOW',
        filter_type: typeId,
        filter_language: '1',
        limit: 10,
        offset: 0
      }

      const typeResponse = await fetch(`${baseUrl}/api/aa-proxy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'search',
          params: typeParams
        })
      })

      if (typeResponse.ok) {
        const typeData = await typeResponse.json()
        console.log(`${typeName}: ${typeData.data?.documents?.length || 0}/${typeData.data?.total || 0}`)
      }
    }

    // Test 4: Category-based search
    console.log('\n4️⃣ Kategori bazlı arama testi...')
    const categories = {
      '1': 'Genel',
      '2': 'Spor',
      '3': 'Ekonomi',
      '6': 'Politika'
    }

    for (const [catId, catName] of Object.entries(categories)) {
      const catParams = {
        start_date: lastWeek.toISOString(),
        end_date: 'NOW',
        filter_category: catId,
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
        console.log(`${catName}: ${catData.data?.documents?.length || 0}/${catData.data?.total || 0}`)
      }
    }

    // Test 5: Check subscription limits
    console.log('\n5️⃣ Abonelik bilgisi testi...')
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
      console.log('Abonelik detayları:', {
        archiveDays: subData.data?.archive_days,
        downloadLimit: subData.data?.download_limit,
        packages: subData.data?.package?.length || 0,
        categories: subData.data?.category?.length || 0
      })
    }

    // Test 6: Very recent news (last 2 hours)
    console.log('\n6️⃣ Çok yakın tarihli haberler (son 2 saat)...')
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000)
    
    const recentParams = {
      start_date: twoHoursAgo.toISOString(),
      end_date: 'NOW',
      limit: 20,
      offset: 0
    }

    const recentResponse = await fetch(`${baseUrl}/api/aa-proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'search',
        params: recentParams
      })
    })

    if (recentResponse.ok) {
      const recentData = await recentResponse.json()
      console.log(`Son 2 saat: ${recentData.data?.documents?.length || 0}/${recentData.data?.total || 0}`)
      
      if (recentData.data?.documents?.length > 0) {
        console.log('📰 En son haber:', recentData.data.documents[0].title)
        console.log('📅 Tarih:', recentData.data.documents[0].date)
      }
    }

  } catch (error) {
    console.error('🚨 Test hatası:', error.message)
  }
}

comprehensiveTest()
