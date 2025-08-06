// AA Crawler Test - Firebase Entegrasyonu

async function testAACrawlerComplete() {
  try {
    console.log('🚀 AA Crawler Tam Fonksiyon Testi Başlatılıyor...\n')
    
    // 1. AA Search ile haberler getir
    console.log('🔍 Son 1 saat içindeki haberleri getiriyorum...')
    
    const endDate = new Date()
    const startDate = new Date(endDate.getTime() - (1 * 60 * 60 * 1000)) // 1 saat önce
    
    const searchResponse = await fetch('http://localhost:3001/api/aa-proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'search',
        params: {
          start_date: startDate.toISOString(),
          end_date: 'NOW',
          filter_category: '1,2,3', // Genel, Spor, Ekonomi
          filter_type: '2,3', // Sadece fotoğraf ve video
          filter_language: '1',
          limit: 5
        }
      })
    })

    const searchData = await searchResponse.json()
    
    if (!searchData.success || !searchData.data?.data?.result) {
      console.error('❌ Haber arama başarısız:', searchData.error)
      return
    }

    const newsList = searchData.data.data.result
    console.log(`✅ ${newsList.length} haber bulundu`)
    console.log(`📊 Toplam mevcut haber: ${searchData.data.data.total || 'Bilinmiyor'}`)
    
    if (newsList.length === 0) {
      console.log('ℹ️ Son 1 saatte medya içerikli haber bulunamadı')
      return
    }

    // 2. İlk haberin detayını al
    const firstNews = newsList[0]
    console.log(`\n📰 Test haberi: "${firstNews.title}"`)
    console.log(`🏷️ Tip: ${firstNews.type}`)
    console.log(`📅 Tarih: ${new Date(firstNews.date).toLocaleString('tr-TR')}`)
    
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
    
    if (!detailData.success || !detailData.details) {
      console.error('❌ Haber detayı alınamadı:', detailData.error)
      return
    }

    console.log('✅ Haber detayları alındı!')
    console.log(`📄 Başlık: ${detailData.details.title}`)
    console.log(`📝 Özet: ${detailData.details.summary?.substring(0, 150)}...`)
    console.log(`📸 Fotoğraf sayısı: ${detailData.details.photos?.length || 0}`)
    console.log(`🎬 Video sayısı: ${detailData.details.videos?.length || 0}`)

    // 3. Kategori eşleştirme
    const categoryMapping = {
      '1': 'genel',
      '2': 'spor', 
      '3': 'ekonomi',
      '4': 'saglik',
      '5': 'teknoloji',
      '6': 'politika',
      '7': 'kultur'
    }
    
    const mappedCategory = categoryMapping[firstNews.category?.toString()] || 'genel'
    console.log(`🏷️ AA Kategori: ${firstNews.category} → Bizim kategori: ${mappedCategory}`)

    // 4. Firebase test data oluştur
    const testNewsData = {
      // Temel bilgiler
      title: detailData.details.title,
      content: detailData.details.content || detailData.details.summary,
      summary: detailData.details.summary || detailData.details.title,
      category: mappedCategory,
      originalCategory: firstNews.category || '',
      
      // Medya
      imageUrl: detailData.details.imageUrl || '',
      images: detailData.details.photos || [],
      videos: detailData.details.videos || [],
      hasMedia: (detailData.details.photos?.length > 0) || (detailData.details.videos?.length > 0),
      
      // AA bilgileri
      source: 'anadolu_ajansi',
      originalId: firstNews.id,
      aaType: firstNews.type,
      groupId: firstNews.group_id || '',
      
      // Metadata
      author: detailData.details.author || 'AA',
      tags: detailData.details.tags || [],
      publishedAt: new Date(firstNews.date),
      
      // Durum
      status: 'published',
      featured: false,
      
      // Test ID
      testData: true,
      crawledAt: new Date()
    }

    console.log('\n� Firebase\'e kaydedilecek test verisi:')
    console.log(JSON.stringify(testNewsData, null, 2))

    console.log('\n🎉 AA Crawler testi basariyla tamamlandi!')
    console.log('📋 Test Ozeti:')
    console.log(`✅ Haber arama: Basarili (${newsList.length} haber)`)
    console.log(`✅ Haber detayi: Basarili`)
    console.log(`✅ Kategori eslestirme: ${mappedCategory}`)
    console.log(`✅ Medya kontrolu: ${testNewsData.hasMedia ? 'Medya var' : 'Medya yok'}`)
    console.log(`✅ Data yapisi: Hazir`)
    
    console.log('\n📱 AA Crawler arayuzunu http://localhost:3001/admin/dashboard/aa-crawler adresinden test edebilirsiniz!')

  } catch (error) {
    console.error('❌ Test hatası:', error)
  }
}

testAACrawlerComplete()
