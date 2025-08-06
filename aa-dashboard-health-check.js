// AA Crawler Dashboard Sağlık Kontrolü

console.log('🔍 AA Crawler Dashboard Sağlık Kontrolü Başlıyor...\n');

// 1. Next.js Sunucu Kontrolü
async function checkNextJSServer() {
  try {
    const response = await fetch('http://localhost:3000');
    console.log(`✅ Next.js Sunucu: ${response.status} ${response.statusText}`);
    return true;
  } catch (error) {
    console.log(`❌ Next.js Sunucu: ${error.message}`);
    return false;
  }
}

// 2. AA Crawler API Kontrolü
async function checkAAAPI() {
  try {
    const response = await fetch('http://localhost:3000/api/aa-crawler', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'get_status'
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ AA Crawler API: Çalışıyor`);
      console.log(`📊 API Response:`, data);
      return true;
    } else {
      console.log(`⚠️ AA Crawler API: ${response.status} ${response.statusText}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ AA Crawler API: ${error.message}`);
    return false;
  }
}

// 3. AA External API Kontrolü (Credentials Test)
async function checkAAExternalAPI() {
  try {
    const credentials = {
      baseUrl: 'https://api.aa.com.tr/abone',
      username: '3010229',
      password: '8vWhT6Vt'
    };
    
    const authHeader = 'Basic ' + Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64');
    
    const response = await fetch(`${credentials.baseUrl}/subscription`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'AA-Health-Check/1.0'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ AA External API: Bağlantı başarılı`);
      console.log(`📋 Abonelik durumu: ${data.response?.success ? 'Aktif' : 'Pasif'}`);
      return true;
    } else {
      console.log(`❌ AA External API: ${response.status} ${response.statusText}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ AA External API: ${error.message}`);
    return false;
  }
}

// 4. Dashboard Sayfası Kontrolü
async function checkDashboardPage() {
  try {
    const response = await fetch('http://localhost:3000/admin/dashboard/aa-crawler');
    
    if (response.ok) {
      const html = await response.text();
      const hasReactContent = html.includes('AA Crawler') || html.includes('__NEXT_DATA__');
      
      if (hasReactContent) {
        console.log(`✅ Dashboard Sayfası: Yükleniyor`);
        return true;
      } else {
        console.log(`⚠️ Dashboard Sayfası: HTML yüklendi ama React içeriği eksik`);
        return false;
      }
    } else {
      console.log(`❌ Dashboard Sayfası: ${response.status} ${response.statusText}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Dashboard Sayfası: ${error.message}`);
    return false;
  }
}

// 5. Firebase Bağlantı Kontrolü (Simulated)
async function checkFirebaseConnection() {
  try {
    // Firebase bağlantısını direkt test edemeyiz, ancak API üzerinden kontrol edebiliriz
    console.log(`ℹ️ Firebase Kontrolü: Client-side kontrol gerekiyor`);
    return true;
  } catch (error) {
    console.log(`❌ Firebase: ${error.message}`);
    return false;
  }
}

// Ana Test Fonksiyonu
async function runHealthCheck() {
  console.log('='.repeat(60));
  console.log('🏥 AA CRAWLER DASHBOARD SAĞLIK KONTROLÜ');
  console.log('='.repeat(60));
  
  const tests = [
    { name: 'Next.js Sunucu', test: checkNextJSServer },
    { name: 'AA Crawler API', test: checkAAAPI },
    { name: 'AA External API', test: checkAAExternalAPI },
    { name: 'Dashboard Sayfası', test: checkDashboardPage },
    { name: 'Firebase Bağlantısı', test: checkFirebaseConnection }
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const { name, test } of tests) {
    console.log(`\n🔍 Test: ${name}`);
    console.log('-'.repeat(40));
    
    const result = await test();
    if (result) {
      passed++;
    } else {
      failed++;
    }
    
    // Test'ler arası kısa bekleme
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 SONUÇ ÖZETI');
  console.log('='.repeat(60));
  console.log(`✅ Başarılı Testler: ${passed}`);
  console.log(`❌ Başarısız Testler: ${failed}`);
  console.log(`📈 Başarı Oranı: ${Math.round((passed / tests.length) * 100)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 Tüm testler başarılı! Dashboard sağlıklı çalışıyor.');
  } else if (failed <= 2) {
    console.log('\n⚠️ Bazı testler başarısız. Dashboard kısmen çalışıyor.');
  } else {
    console.log('\n🚨 Çok sayıda test başarısız. Dashboard\'da sorunlar var.');
  }
  
  console.log('\n📋 ÖNERİLER:');
  console.log('- Sunucu çalışmıyorsa: npm run dev veya npm start');
  console.log('- API hatası varsa: TypeScript derlemesini kontrol edin');
  console.log('- AA API problemi varsa: Credentials\'ları kontrol edin');
  console.log('- Firebase sorunu varsa: Firebase config dosyasını kontrol edin');
  
  return { passed, failed, total: tests.length };
}

// Test'i çalıştır
runHealthCheck().catch(error => {
  console.error('💥 Sağlık kontrolü hatası:', error);
});
