// Enhanced AA Crawler Test
// Bu script yeni enhanced endpoints'leri test eder

async function testEnhancedCrawler() {
  console.log('🚀 Enhanced AA Crawler Test Başlıyor...\n');

  const tests = [
    {
      name: 'Enhanced Media Search',
      endpoint: '/api/aa-proxy',
      body: { 
        action: 'search_enhanced', 
        params: { limit: 10, language: 'tr' } 
      }
    },
    {
      name: 'Photo Galleries',
      endpoint: '/api/aa-proxy',
      body: { 
        action: 'get_galleries', 
        params: { limit: 5 } 
      }
    },
    {
      name: 'Video Galleries',
      endpoint: '/api/aa-proxy',
      body: { 
        action: 'get_videos', 
        params: { limit: 5 } 
      }
    },
    {
      name: 'Standard Search (Updated)',
      endpoint: '/api/aa-proxy',
      body: { 
        action: 'search', 
        params: { limit: 10, language: 'tr' } 
      }
    }
  ];

  for (const test of tests) {
    console.log(`🔍 Test: ${test.name}`);
    console.log('-'.repeat(40));

    try {
      const response = await fetch(`http://localhost:3000${test.endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(test.body)
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.success) {
          console.log(`✅ ${test.name} başarılı`);
          
          // Sonuçları analiz et
          if (data.data) {
            if (data.data.summary) {
              console.log(`📊 Özet: ${JSON.stringify(data.data.summary)}`);
            }
            
            if (data.data.result && Array.isArray(data.data.result)) {
              console.log(`📰 ${data.data.result.length} haber bulundu`);
              
              // İlk haberin medya içeriğini kontrol et
              const firstNews = data.data.result[0];
              if (firstNews) {
                console.log(`📝 İlk haber: ${firstNews.title || 'Başlık yok'}`);
                console.log(`🎭 Tip: ${firstNews.type || 'Belirtilmemiş'}`);
                
                // Medya içeriği var mı?
                if (firstNews.images || firstNews.media || firstNews.gallery) {
                  console.log(`🖼️ Medya içeriği bulundu`);
                }
                
                if (firstNews.videos || firstNews.videoUrl) {
                  console.log(`🎬 Video içeriği bulundu`);
                }
              }
            }
            
            // Debug bilgisi
            if (data._debug) {
              console.log(`🔧 Debug: ${JSON.stringify(data._debug.summary || data._debug)}`);
            }
          }
        } else {
          console.log(`❌ ${test.name} başarısız: ${data.message}`);
        }
      } else {
        console.log(`❌ ${test.name} HTTP hatası: ${response.status}`);
      }
      
    } catch (error) {
      console.log(`💥 ${test.name} bağlantı hatası: ${error.message}`);
    }
    
    console.log(''); // Boş satır
    
    // Test'ler arası kısa bekleme
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('🏁 Enhanced crawler test tamamlandı');
  console.log('\n💡 Sonraki adımlar:');
  console.log('1. Dashboard\'da enhanced özellikleri etkinleştirin');
  console.log('2. Medya görüntüleme bileşenlerini ekleyin');
  console.log('3. Video oynatıcı bileşenlerini entegre edin');
  console.log('4. Galeri görüntüleme özelliklerini aktifleştirin');
}

testEnhancedCrawler();
