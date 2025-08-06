// BreakingNewsBar test component - Updated to use Singleton Manager
import SingletonBreakingNewsBar from '@/components/homepage/SingletonBreakingNewsBar';

export default function TestBreakingNewsBar() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold mb-6">BreakingNewsBar Test - Anti-Spam Version</h1>
      
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
        <h3 className="font-semibold text-blue-800 mb-2">📋 Test Info</h3>
        <p className="text-sm text-blue-600">
          Bu sayfada 3 adet breaking news bar komponenti bulunuyor ancak Singleton Manager sayesinde 
          sadece 1 kez Firebase'den veri çekilir ve konsol spam'ı önlenir. Her komponent 30 saniye boyunca 
          aynı cache'lenmiş veriyi kullanır.
        </p>
      </div>
      
      <div className="space-y-8">
        {/* Test 1: Default settings */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Test 1: Varsayılan Ayarlar (Kırmızı)</h2>
          <SingletonBreakingNewsBar testId="test-1-red" />
        </div>
        
        {/* Test 2: Blue theme */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Test 2: Mavi Tema</h2>
          <SingletonBreakingNewsBar 
            testId="test-2-blue"
            newsCount={3}
            settings={{
              autoRotate: true,
              rotateInterval: 3000,
              showIcon: true,
              backgroundColor: 'blue'
            }}
          />
        </div>
        
        {/* Test 3: Black theme, no rotation */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Test 3: Siyah Tema, Otomatik Dönüş Kapalı</h2>
          <SingletonBreakingNewsBar 
            testId="test-3-black"
            newsCount={2}
            settings={{
              autoRotate: false,
              showIcon: false,
              backgroundColor: 'black'
            }}
          />
        </div>

        {/* Manager status indicator */}
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">🔧 Singleton Manager Status</h3>
          <p className="text-sm text-gray-600">
            Konsolu kontrol edin. Sadece 1 kez "Breaking News Manager: Fetching fresh data" mesajı görmelisiniz.
            Diğer istekler cache'den döner. Her 30 saniyede bir yeni istek yapılır.
          </p>
        </div>
      </div>
    </div>
  );
}
