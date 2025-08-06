// Manual HeadlineNewsGrid test component
import HeadlineNewsGrid from '@/components/homepage/HeadlineNewsGrid';

export default function TestHeadlineGrid() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">HeadlineNewsGrid Test</h1>
      
      <div className="space-y-8">
        {/* Test 1: Default settings */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Test 1: Varsayılan Ayarlar</h2>
          <HeadlineNewsGrid />
        </div>
        
        {/* Test 2: Custom settings */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Test 2: Özel Ayarlar (2 sütun)</h2>
          <HeadlineNewsGrid 
            newsCount={4}
            settings={{
              gridColumns: 2,
              showCategories: true,
              showAuthor: false,
              showDate: true
            }}
          />
        </div>
        
        {/* Test 3: 4 columns */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Test 3: 4 Sütun Grid</h2>
          <HeadlineNewsGrid 
            newsCount={8}
            settings={{
              gridColumns: 4,
              showCategories: false,
              showAuthor: true,
              showDate: false
            }}
          />
        </div>
      </div>
    </div>
  );
}
