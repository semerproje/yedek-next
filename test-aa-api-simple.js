// AA Crawler API Test - Simple Node.js version

async function testAASubscription() {
  try {
    console.log('🔄 AA API Subscription test ediliyor...')
    
    const response = await fetch('http://localhost:3001/api/aa-proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'subscription'
      })
    })

    const data = await response.json()
    
    if (data.success) {
      console.log('✅ AA API çalışıyor!')
      console.log('📊 Subscription bilgileri:', {
        totalDocuments: data.data?.total_count || 'Bilinmiyor',
        categories: data.data?.categories?.length || 0,
        languages: data.data?.languages?.length || 0
      })
      return true
    } else {
      console.error('❌ AA API hatası:', data.error)
      return false
    }
  } catch (error) {
    console.error('❌ Bağlantı hatası:', error.message)
    return false
  }
}

async function testAASearch() {
  try {
    console.log('\n🔍 AA Haber arama test ediliyor...')
    
    const endDate = new Date()
    const startDate = new Date(endDate.getTime() - (2 * 60 * 60 * 1000)) // 2 saat önce
    
    const response = await fetch('http://localhost:3001/api/aa-proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'search',
        params: {
          start_date: startDate.toISOString(),
          end_date: 'NOW',
          filter_category: '1,2,3',
          filter_type: '2,3', // Sadece fotoğraf ve video
          filter_language: '1',
          limit: 10
        }
      })
    })

    const data = await response.json()
    
    if (data.success && data.data?.documents) {
      console.log('✅ Haber arama başarılı!')
      console.log(`📰 Son 2 saatte ${data.data.documents.length} haber bulundu`)
      console.log(`📊 Toplam haber sayısı: ${data.data.total || 'Bilinmiyor'}`)
      
      if (data.data.documents.length > 0) {
        console.log('\n📋 Örnek haberler:')
        data.data.documents.slice(0, 3).forEach((doc, i) => {
          console.log(`  ${i + 1}. ${doc.title} [${doc.type}] [Kategori: ${doc.category}]`)
        })
        
        // Bir haberin detayını test et
        const firstNews = data.data.documents[0]
        console.log(`\n🔍 Haber detayı test ediliyor: ${firstNews.title}`)
        
        const detailResponse = await fetch('http://localhost:3001/api/aa-proxy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'document',
            newsId: firstNews.id,
            type: firstNews.type,
            format: firstNews.type === 'text' ? 'newsml29' : 'web'
          })
        })

        const detailData = await detailResponse.json()
        
        if (detailData.success && detailData.details) {
          console.log('✅ Haber detayı alındı!')
          console.log(`📄 Başlık: ${detailData.details.title}`)
          console.log(`📝 Özet: ${detailData.details.summary?.substring(0, 100)}...`)
          console.log(`📸 Fotoğraf sayısı: ${detailData.details.photos?.length || 0}`)
          console.log(`🎬 Video sayısı: ${detailData.details.videos?.length || 0}`)
        } else {
          console.log('⚠️ Haber detayı alınamadı')
        }
      }
      
      return true
    } else {
      console.error('❌ Haber arama hatası:', data.error)
      return false
    }
  } catch (error) {
    console.error('❌ Arama hatası:', error.message)
    return false
  }
}

async function runTest() {
  console.log('🚀 AA Crawler API Test Başlatılıyor...\n')
  
  const subscriptionOk = await testAASubscription()
  const searchOk = await testAASearch()
  
  console.log('\n📋 Test Sonuçları:')
  console.log(`AA Subscription: ${subscriptionOk ? '✅' : '❌'}`)
  console.log(`AA Search: ${searchOk ? '✅' : '❌'}`)
  
  if (subscriptionOk && searchOk) {
    console.log('\n🎉 AA API tam çalışır durumda!')
    console.log('📱 http://localhost:3001/admin/dashboard/aa-crawler adresinden AA Crawler\'ı kullanabilirsiniz.')
  } else {
    console.log('\n⚠️ Bazı API fonksiyonları çalışmıyor.')
  }
}

runTest().catch(console.error)
