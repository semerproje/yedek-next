#!/usr/bin/env node

// AA API Connection Test
const AA_CREDENTIALS = {
  username: '3010229',
  password: '8vWhT6Vt',
  baseUrl: 'https://api.aa.com.tr/abone'
}

function createAuthHeader() {
  const auth = Buffer.from(`${AA_CREDENTIALS.username}:${AA_CREDENTIALS.password}`).toString('base64')
  return `Basic ${auth}`
}

async function testAAConnection() {
  console.log('🔍 AA API Bağlantı Testi Başlıyor...\n')
  
  try {
    console.log('1️⃣ Discover endpoint test...')
    const discoverResponse = await fetch(`${AA_CREDENTIALS.baseUrl}/discover/tr_TR`, {
      method: 'GET',
      headers: {
        'Authorization': createAuthHeader(),
        'Content-Type': 'application/json'
      }
    })
    
    console.log(`Discover Status: ${discoverResponse.status}`)
    if (discoverResponse.ok) {
      const discoverData = await discoverResponse.json()
      console.log('✅ Discover başarılı!')
      console.log(`Kategoriler: ${discoverData.category?.length || 0}`)
      console.log(`Öncelikler: ${discoverData.priority?.length || 0}`)
      console.log(`Diller: ${discoverData.language?.length || 0}\n`)
    } else {
      const errorText = await discoverResponse.text()
      console.log('❌ Discover hatası:', errorText)
      return
    }

    console.log('2️⃣ Subscription endpoint test...')
    const subscriptionResponse = await fetch(`${AA_CREDENTIALS.baseUrl}/subscription/`, {
      method: 'GET',
      headers: {
        'Authorization': createAuthHeader(),
        'Content-Type': 'application/json'
      }
    })
    
    console.log(`Subscription Status: ${subscriptionResponse.status}`)
    if (subscriptionResponse.ok) {
      const subscriptionData = await subscriptionResponse.json()
      console.log('✅ Subscription başarılı!')
      console.log(`Arşiv günleri: ${subscriptionData.archive_days || 'N/A'}`)
      console.log(`İndirme limiti: ${subscriptionData.download_limit || 'N/A'}\n`)
    } else {
      const errorText = await subscriptionResponse.text()
      console.log('❌ Subscription hatası:', errorText)
    }

    console.log('3️⃣ Search endpoint test (son 1 saat)...')
    const now = new Date()
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
    
    const searchParams = {
      start_date: oneHourAgo.toISOString(),
      end_date: 'NOW',
      filter_type: '1',
      filter_language: '1',
      limit: 10,
      offset: 0
    }

    const searchResponse = await fetch(`${AA_CREDENTIALS.baseUrl}/search/`, {
      method: 'POST',
      headers: {
        'Authorization': createAuthHeader(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(searchParams)
    })

    console.log(`Search Status: ${searchResponse.status}`)
    if (searchResponse.ok) {
      const searchData = await searchResponse.json()
      console.log('✅ Search başarılı!')
      console.log(`Bulunan haber sayısı: ${searchData.documents?.length || 0}`)
      console.log(`Toplam haber: ${searchData.total || 0}`)
      
      if (searchData.documents && searchData.documents.length > 0) {
        console.log('\n📰 İlk haber:')
        const firstNews = searchData.documents[0]
        console.log(`Başlık: ${firstNews.title || 'N/A'}`)
        console.log(`Kategori: ${firstNews.category || 'N/A'}`)
        console.log(`Tarih: ${firstNews.date || 'N/A'}`)
      }
    } else {
      const errorText = await searchResponse.text()
      console.log('❌ Search hatası:', errorText)
    }

    console.log('\n4️⃣ Geniş arama testi (son 24 saat)...')
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    
    const wideSearchParams = {
      start_date: yesterday.toISOString(),
      end_date: 'NOW',
      filter_type: '1',
      filter_language: '1',
      limit: 50,
      offset: 0
    }

    const wideSearchResponse = await fetch(`${AA_CREDENTIALS.baseUrl}/search/`, {
      method: 'POST',
      headers: {
        'Authorization': createAuthHeader(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(wideSearchParams)
    })

    console.log(`Wide Search Status: ${wideSearchResponse.status}`)
    if (wideSearchResponse.ok) {
      const wideSearchData = await wideSearchResponse.json()
      console.log('✅ Geniş arama başarılı!')
      console.log(`Bulunan haber sayısı: ${wideSearchData.documents?.length || 0}`)
      console.log(`Toplam haber: ${wideSearchData.total || 0}`)
      
      if (wideSearchData.documents && wideSearchData.documents.length > 0) {
        console.log('\n📊 Kategori dağılımı:')
        const categoryCount = {}
        wideSearchData.documents.forEach(doc => {
          const cat = doc.category || 'Bilinmeyen'
          categoryCount[cat] = (categoryCount[cat] || 0) + 1
        })
        Object.entries(categoryCount).forEach(([cat, count]) => {
          console.log(`  ${cat}: ${count} haber`)
        })
      }
    } else {
      const errorText = await wideSearchResponse.text()
      console.log('❌ Geniş arama hatası:', errorText)
    }

  } catch (error) {
    console.error('🚨 Test hatası:', error.message)
  }
}

testAAConnection()
