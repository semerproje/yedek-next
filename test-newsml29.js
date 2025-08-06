// NewsML 2.9 Test Script
import { ultraPremiumAAService } from '../src/services/ultraPremiumAAService.js';
import { newsml29Service } from '../src/services/newsml29.service.js';

async function testNewsML29Integration() {
  console.log('🔄 NewsML 2.9 Integration Test Started\n');

  try {
    // 1. Test AA API connection
    console.log('1️⃣ Testing AA API connection...');
    const discoverData = await ultraPremiumAAService.discover();
    if (discoverData) {
      console.log('✅ AA API connection successful');
      console.log(`   - Providers: ${Object.keys(discoverData.provider).length}`);
      console.log(`   - Categories: ${Object.keys(discoverData.category).length}`);
    } else {
      console.log('❌ AA API connection failed');
      return;
    }

    // 2. Test recent news search
    console.log('\n2️⃣ Searching for recent news...');
    const searchResult = await ultraPremiumAAService.search({
      limit: 5,
      start_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    });

    if (searchResult?.data?.result?.length > 0) {
      console.log(`✅ Found ${searchResult.data.result.length} recent news`);
      
      // 3. Test NewsML 2.9 conversion
      console.log('\n3️⃣ Testing NewsML 2.9 conversion...');
      const firstNews = searchResult.data.result[0];
      console.log(`   - Converting news: ${firstNews.title.substring(0, 50)}...`);
      
      const newsmlXML = await ultraPremiumAAService.convertToNewsML29(firstNews.id);
      if (newsmlXML) {
        console.log('✅ NewsML 2.9 conversion successful');
        console.log(`   - XML length: ${newsmlXML.length} characters`);
        
        // 4. Test Firestore save
        console.log('\n4️⃣ Testing Firestore save...');
        const documentId = await ultraPremiumAAService.fetchAndSaveNewsML29(firstNews.id);
        if (documentId) {
          console.log(`✅ NewsML 2.9 document saved to Firestore: ${documentId}`);
          
          // 5. Test document retrieval
          console.log('\n5️⃣ Testing document retrieval...');
          const document = await newsml29Service.getDocument(documentId);
          if (document) {
            console.log('✅ Document retrieval successful');
            console.log(`   - Headline: ${document.newsml.newsItem[0]?.contentMeta?.headline}`);
            console.log(`   - Provider: ${document.searchFields.provider}`);
            console.log(`   - Status: ${document.processing.status}`);
          } else {
            console.log('❌ Document retrieval failed');
          }
        } else {
          console.log('❌ Firestore save failed');
        }
      } else {
        console.log('❌ NewsML 2.9 conversion failed');
      }
    } else {
      console.log('❌ No recent news found');
    }

    // 6. Test analytics
    console.log('\n6️⃣ Testing analytics...');
    const analytics = await newsml29Service.getAnalytics();
    if (analytics) {
      console.log('✅ Analytics retrieved successfully');
      console.log(`   - Total documents: ${analytics.totalDocuments}`);
      console.log(`   - Documents today: ${analytics.documentsToday}`);
    } else {
      console.log('❌ Analytics retrieval failed');
    }

    console.log('\n🎉 NewsML 2.9 Integration Test Completed Successfully!');

  } catch (error) {
    console.error('\n❌ Test failed with error:', error);
  }
}

// Sample NewsML 2.9 XML structure for reference
const sampleNewsML29 = `<?xml version="1.0" encoding="UTF-8"?>
<newsMessage xmlns="http://iptc.org/std/NewsML-G2/2.9/">
  <header>
    <sent>2024-01-15T10:30:00Z</sent>
    <sender>Anadolu Ajansı</sender>
    <transmitId>AA_123456_1705312200</transmitId>
    <priority>3</priority>
    <origin>aa.com.tr</origin>
  </header>
  <itemSet>
    <newsItem guid="urn:newsml:aa.com.tr:2024-01-15T10:30:00Z:123456" version="1">
      <itemMeta>
        <itemClass qcode="ninat:text"/>
        <provider qcode="aa"/>
        <versionCreated>2024-01-15T10:30:00Z</versionCreated>
        <pubStatus qcode="stat:usable"/>
      </itemMeta>
      <contentMeta>
        <urgency>3</urgency>
        <headline>Sample NewsML 2.9 Headline</headline>
        <language tag="tr"/>
        <subject type="cpnat:abstract" qcode="cat:1">
          <name>Politika</name>
        </subject>
      </contentMeta>
      <contentSet>
        <inlineXML>
          <html xmlns="http://www.w3.org/1999/xhtml">
            <body>
              <section class="main">
                <p>Sample NewsML 2.9 content...</p>
              </section>
            </body>
          </html>
        </inlineXML>
      </contentSet>
    </newsItem>
  </itemSet>
</newsMessage>`;

console.log('📋 Sample NewsML 2.9 Structure:');
console.log(sampleNewsML29);
console.log('\n' + '='.repeat(50));

// Run test
testNewsML29Integration();
