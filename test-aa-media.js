// AA Medya Testi - Fotoğraflı haber test

async function testAAMediaNews() {
  try {
    console.log('🖼️ AA Medya Haberlerini Test Ediyorum...\n')
    
    // Fotoğraflı haberleri getir
    const searchResponse = await fetch('http://localhost:3001/api/aa-proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'search',
        params: {
          start_date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 saat
          end_date: 'NOW',
          filter_category: '1,2,3',
          filter_type: '2', // Sadece fotoğraf
          filter_language: '1',
          limit: 10
        }
      })
    })

    const searchData = await searchResponse.json()
    const photoNews = searchData.data?.data?.result || []
    
    console.log(`📸 ${photoNews.length} fotoğraflı haber bulundu`)
    
    if (photoNews.length === 0) {
      console.log('⚠️ Fotoğraflı haber bulunamadı, video test yapalım...')
      
      // Video haberleri dene
      const videoSearchResponse = await fetch('http://localhost:3001/api/aa-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'search',
          params: {
            start_date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
            end_date: 'NOW',
            filter_category: '1,2,3',
            filter_type: '3', // Sadece video
            filter_language: '1',
            limit: 5
          }
        })
      })

      const videoData = await videoSearchResponse.json()
      const videoNews = videoData.data?.data?.result || []
      
      console.log(`🎬 ${videoNews.length} videolu haber bulundu`)
      
      if (videoNews.length > 0) {
        const testVideo = videoNews[0]
        console.log(`🎬 Test video haberi: "${testVideo.title}"`)
        
        const detailResponse = await fetch('http://localhost:3001/api/aa-proxy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'document',
            newsId: testVideo.id,
            type: testVideo.type,
            format: 'web'
          })
        })

        const detailData = await detailResponse.json()
        
        if (detailData.success && detailData.details) {
          console.log('✅ Video detayları:')
          console.log(`📄 Başlık: ${detailData.details.title}`)
          console.log(`🎬 Video sayısı: ${detailData.details.videos?.length || 0}`)
          console.log(`📸 Fotoğraf sayısı: ${detailData.details.photos?.length || 0}`)
          
          if (detailData.details.videos?.length > 0) {
            console.log('🎥 Video URL\'leri:')
            detailData.details.videos.slice(0, 2).forEach((video, i) => {
              console.log(`  ${i + 1}. ${video.url}`)
            })
          }
        }
      }
      return
    }

    // İlk fotoğraflı haberi test et
    const testPhoto = photoNews[0]
    console.log(`📸 Test fotoğraf haberi: "${testPhoto.title}"`)
    console.log(`🆔 ID: ${testPhoto.id}`)
    console.log(`🏷️ Group ID: ${testPhoto.group_id}`)
    
    const detailResponse = await fetch('http://localhost:3001/api/aa-proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'document',
        newsId: testPhoto.id,
        type: testPhoto.type,
        format: 'web'
      })
    })

    const detailData = await detailResponse.json()
    
    if (detailData.success && detailData.details) {
      console.log('\n✅ Fotoğraf detayları alındı!')
      console.log(`📄 Başlık: ${detailData.details.title}`)
      console.log(`📝 Özet: ${detailData.details.summary?.substring(0, 100)}...`)
      console.log(`📸 Fotoğraf sayısı: ${detailData.details.photos?.length || 0}`)
      console.log(`🎬 Video sayısı: ${detailData.details.videos?.length || 0}`)
      
      if (detailData.details.photos?.length > 0) {
        console.log('\n📷 Fotoğraf URL\'leri:')
        detailData.details.photos.slice(0, 3).forEach((photo, i) => {
          console.log(`  ${i + 1}. ${photo.url}`)
          console.log(`     ${photo.desc}`)
        })
      }
      
      // Bu haber Firebase'e kaydedilebilir mi?
      const hasMedia = (detailData.details.photos?.length > 0) || (detailData.details.videos?.length > 0)
      console.log(`\n🔍 Medya kontrolü: ${hasMedia ? '✅ Medya var' : '❌ Medya yok'}`)
      
      if (hasMedia) {
        console.log('🎉 Bu haber AA Crawler tarafından Firebase\'e kaydedilebilir!')
      } else {
        console.log('⚠️ Bu haber medya içermiyor, atlanacak.')
      }
      
    } else {
      console.error('❌ Fotoğraf detayları alınamadı:', detailData.error)
    }

  } catch (error) {
    console.error('❌ Test hatası:', error)
  }
}

testAAMediaNews()
