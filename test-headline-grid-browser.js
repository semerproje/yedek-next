// Test HeadlineNewsGrid component directly
const puppeteer = require('puppeteer');

async function testHeadlineGrid() {
  console.log('🧪 HeadlineNewsGrid bileşeni test ediliyor...');
  
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    
    console.log('📱 Homepage management sayfası açılıyor...');
    await page.goto('http://localhost:3000/admin/dashboard/homepage-management');
    
    // Wait for page to load
    await page.waitForTimeout(3000);
    
    console.log('🔍 HeadlineNewsGrid modül arama...');
    
    // Check if headline-grid module exists
    const headlineGridExists = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('*'))
        .some(el => el.textContent && el.textContent.includes('headline-grid'));
    });
    
    console.log('📊 HeadlineNewsGrid modülü:', headlineGridExists ? '✅ Bulundu' : '❌ Bulunamadı');
    
    // Take screenshot
    await page.screenshot({ path: 'homepage-test.png', fullPage: true });
    console.log('📷 Ekran görüntüsü alındı: homepage-test.png');
    
    await browser.close();
    
    console.log('✅ Test tamamlandı!');
    
  } catch (error) {
    console.error('❌ Test hatası:', error.message);
  }
}

// Run if called directly
if (require.main === module) {
  testHeadlineGrid()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('💥 Test başarısız:', error);
      process.exit(1);
    });
}

module.exports = { testHeadlineGrid };
