// AA Gerçek Fotoğraf Test

async function testRealPhotoNews() {
  try {
    console.log('🔍 Gerçek fotoğraf haberlerini arıyorum...\n')
    
    const searchResponse = await fetch('http://localhost:3001/api/aa-proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'search',
        params: {
          start_date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 saat
          end_date: 'NOW',
          filter_category: '2', // Sadece spor
          filter_type: '2', // Sadece fotoğraf
          filter_language: '1',
          limit: 20
        }
      })
    })

    const searchData = await searchResponse.json()
    const allNews = searchData.data?.data?.result || []
    
    console.log(`📊 Toplam ${allNews.length} haber bulundu`)
    console.log('🔍 İlk 10 haberin tiplerini kontrol ediyorum:\n')
    
    allNews.slice(0, 10).forEach((news, i) => {
      console.log(`${i + 1}. [${news.type}] ${news.title} (${news.id})`)
    })
    
    // Gerçek picture tipindeki haberi bul
    const photoNews = allNews.filter(news => news.type === 'picture')
    console.log(`\n📸 ${photoNews.length} gerçek fotoğraf haberi bulundu`)
    
    if (photoNews.length > 0) {
      const testPhoto = photoNews[0]
      console.log(`\n🖼️ Test edilen fotoğraf haberi:`)
      console.log(`📄 Başlık: ${testPhoto.title}`)
      console.log(`🆔 ID: ${testPhoto.id}`)
      console.log(`🏷️ Tip: ${testPhoto.type}`)
      console.log(`📅 Tarih: ${new Date(testPhoto.date).toLocaleString('tr-TR')}`)
      
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
        console.log('\n✅ Detaylar başarıyla alındı!')
        console.log(`📄 Başlık: ${detailData.details.title}`)
        console.log(`📝 Özet: ${detailData.details.summary?.substring(0, 150)}...`)
        console.log(`📸 Fotoğraf sayısı: ${detailData.details.photos?.length || 0}`)
        console.log(`🎬 Video sayısı: ${detailData.details.videos?.length || 0}`)
        
        if (detailData.details.photos?.length > 0) {
          console.log('\n📷 Fotoğraf URL\'leri:')
          detailData.details.photos.slice(0, 2).forEach((photo, i) => {
            console.log(`  ${i + 1}. ${photo.url}`)
            if (photo.desc) console.log(`     Açıklama: ${photo.desc}`)
          })
          
          console.log('\n🎉 Bu haber medya içeriyor ve Firebase\'e kaydedilebilir!')
        } else {
          console.log('\n⚠️ Fotoğraf haberi olmasına rağmen medya bulunamadı')
        }
      } else {
        console.error('❌ Detay alınamadı:', detailData.error)
      }
    } else {
      console.log('❌ Hiç fotoğraf haberi bulunamadı')
    }
    
  } catch (error) {
    console.error('❌ Test hatası:', error)
  }
}

testRealPhotoNews()
