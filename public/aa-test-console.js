// AA API Enhanced Test Console Script
// Bu dosyayı browser console'da çalıştırın

console.log('🔥 AA API Enhanced Test Başlatılıyor...')

async function testAAApiProxy() {
  const tests = [
    {
      name: 'Discover API',
      action: 'discover',
      params: { language: 'tr_TR' }
    },
    {
      name: 'Subscription API', 
      action: 'subscription',
      params: {}
    },
    {
      name: 'Search API',
      action: 'search',
      params: {
        start_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        end_date: 'NOW',
        filter_type: '1',
        filter_language: '1', 
        limit: 5,
        offset: 0
      }
    }
  ]

  const results = {}

  for (const test of tests) {
    try {
      console.log(`\n🔄 ${test.name} test ediliyor...`)
      
      const response = await fetch('/api/aa-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: test.action,
          params: test.params
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      
      if (result.success) {
        console.log(`✅ ${test.name} BAŞARILI`)
        console.log('📊 Data:', result.data)
        results[test.action] = { success: true, data: result.data }
      } else {
        console.log(`❌ ${test.name} BAŞARISIZ: ${result.error}`)
        results[test.action] = { success: false, error: result.error }
      }

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 500))

    } catch (error) {
      console.error(`❌ ${test.name} HATA:`, error)
      results[test.action] = { success: false, error: error.message }
    }
  }

  console.log('\n🎯 TEST SONUÇLARI:')
  console.table(Object.entries(results).map(([action, result]) => ({
    API: action,
    Status: result.success ? '✅ Başarılı' : '❌ Başarısız',
    Error: result.error || '-'
  })))

  return results
}

// Global test fonksiyonu
window.testAAProxy = testAAApiProxy

console.log('✨ Test hazır! Şu komutu çalıştırın: testAAProxy()')
