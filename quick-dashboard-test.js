// Basit Dashboard Test

async function quickDashboardTest() {
  console.log('🔍 Hızlı Dashboard Testi...\n');

  // Test edilecek endpoint'ler
  const endpoints = [
    'http://localhost:3000',
    'http://localhost:3000/admin/dashboard/aa-crawler',
    'http://localhost:3000/api/aa-crawler'
  ];

  for (const url of endpoints) {
    try {
      console.log(`📡 Test: ${url}`);
      
      const startTime = Date.now();
      const response = await fetch(url, {
        method: url.includes('/api/') ? 'POST' : 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        body: url.includes('/api/') ? JSON.stringify({ action: 'get_status' }) : undefined,
        signal: AbortSignal.timeout(5000) // 5 saniye timeout
      });
      
      const duration = Date.now() - startTime;
      
      if (response.ok) {
        console.log(`✅ Başarılı: ${response.status} (${duration}ms)`);
        
        // Response boyutunu kontrol et
        const contentLength = response.headers.get('content-length');
        if (contentLength) {
          console.log(`📏 İçerik boyutu: ${contentLength} bytes`);
        }
        
        // İçerik tipini kontrol et
        const contentType = response.headers.get('content-type');
        if (contentType) {
          console.log(`📄 İçerik tipi: ${contentType}`);
        }
        
      } else {
        console.log(`❌ Hata: ${response.status} ${response.statusText}`);
      }
      
    } catch (error) {
      console.log(`💥 Bağlantı hatası: ${error.message}`);
    }
    
    console.log(''); // Boş satır
  }
  
  console.log('🏁 Test tamamlandı.');
}

quickDashboardTest();
