// News Dashboard API Test
// Bu script news dashboard'ının API endpoint'ini test eder

async function testNewsDashboardAPI() {
  console.log('📰 News Dashboard API Test Başlıyor...\n');

  try {
    // 1. News sayfasını kontrol et
    console.log('📡 News sayfası testi...');
    const newsPageResponse = await fetch('http://localhost:3000/admin/dashboard/news', {
      method: 'GET',
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (newsPageResponse.ok) {
      const html = await newsPageResponse.text();
      console.log(`✅ News sayfası yüklendi (${newsPageResponse.status})`);
      
      // React ve Firebase içerik kontrolü
      const hasReactRoot = html.includes('__NEXT_DATA__') || html.includes('react-dom');
      const hasFirebaseConfig = html.includes('firebase') || html.includes('firestore');
      
      console.log(`🔧 React içeriği: ${hasReactRoot ? '✅' : '❌'}`);
      console.log(`🔥 Firebase referansı: ${hasFirebaseConfig ? '✅' : '❌'}`);
      
      // HTML boyutu
      console.log(`📏 HTML boyutu: ${html.length} karakter`);
      
    } else {
      console.log(`❌ News sayfası hatası: ${newsPageResponse.status}`);
    }

    // 2. News API endpoint'i var mı kontrol et
    console.log('\n📡 News API endpoint testi...');
    try {
      const apiResponse = await fetch('http://localhost:3000/api/news', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (apiResponse.ok) {
        const apiData = await apiResponse.json();
        console.log(`✅ News API çalışıyor: ${apiData.length || 'bilinmeyen'} haber`);
        if (apiData.length) {
          console.log(`📝 İlk haber: ${apiData[0]?.title || 'Başlık yok'}`);
        }
      } else if (apiResponse.status === 404) {
        console.log(`⚠️ News API endpoint bulunamadı (404)`);
      } else {
        console.log(`❌ News API hatası: ${apiResponse.status}`);
      }
    } catch (apiError) {
      console.log(`💥 News API bağlantı hatası: ${apiError.message}`);
    }

    // 3. Client-side Firebase test için bir HTML sayfası oluştur
    console.log('\n🔧 Client-side Firebase test sayfası oluşturuluyor...');
    const testHTML = `
<!DOCTYPE html>
<html>
<head>
    <title>Firebase News Test</title>
    <script type="module">
        import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js';
        import { getFirestore, collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js';

        const firebaseConfig = {
          apiKey: "AIzaSyBKwVLWLTgLLfs8V0ptEvwywGoIwxm430A",
          authDomain: "haber-a62cf.firebaseapp.com",
          projectId: "haber-a62cf",
          storageBucket: "haber-a62cf.firebasestorage.app",
          messagingSenderId: "651640696907",
          appId: "1:651640696907:web:d7c012c1280a08e0c69dce",
        };

        async function testFirebase() {
            try {
                const app = initializeApp(firebaseConfig);
                const db = getFirestore(app);
                const newsCollection = collection(db, 'news');
                const snapshot = await getDocs(newsCollection);
                
                document.getElementById('result').innerHTML = 
                    \`✅ Firebase bağlantısı başarılı! \${snapshot.size} haber bulundu\`;
                
                snapshot.forEach(doc => {
                    const data = doc.data();
                    document.getElementById('newsList').innerHTML += 
                        \`<li>\${data.title} - \${data.category}</li>\`;
                });
            } catch (error) {
                document.getElementById('result').innerHTML = 
                    \`❌ Firebase hatası: \${error.message}\`;
            }
        }

        window.addEventListener('load', testFirebase);
    </script>
</head>
<body>
    <h1>Firebase News Test</h1>
    <div id="result">🔄 Test çalışıyor...</div>
    <h2>Haberler:</h2>
    <ul id="newsList"></ul>
</body>
</html>`;

    // Test HTML'ini dosyaya kaydet
    require('fs').writeFileSync('firebase-test.html', testHTML);
    console.log('✅ Test sayfası oluşturuldu: firebase-test.html');
    console.log('🌐 Bu sayfayı browser\'da açarak client-side test yapabilirsiniz');

  } catch (error) {
    console.error('💥 Test hatası:', error);
  }
}

testNewsDashboardAPI();
