// Ultra Premium AA Manager Test Script
// Simple test to verify Firestore integration is working

// Load environment variables from .env.local
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local from the project root
const envPath = path.join(process.cwd(), '.env.local');
console.log('Loading environment from:', envPath);
const result = dotenv.config({ path: envPath });
if (result.error) {
  console.error('Error loading .env.local:', result.error);
} else {
  console.log('Environment loaded successfully');
  console.log('AA_API_USERNAME:', process.env.AA_API_USERNAME ? 'SET' : 'NOT SET');
  console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'SET' : 'NOT SET');
}

import { ultraPremiumAAService } from '@/lib/services/ultraPremiumAAService';
import { geminiService } from '@/lib/services/geminiService';
import { 
  AANewsService, 
  AACategoryService, 
  AAStatsService 
} from '@/lib/firebase/services';

const runSystemTest = async () => {
  console.log('🧪 Running Ultra Premium AA Manager System Test...');
  console.log('================================================');

  let passedTests = 0;
  let totalTests = 0;

  // Test 1: AA API Connection
  totalTests++;
  console.log('\n🔍 Test 1: AA API Connection');
  try {
    const aaTest = await ultraPremiumAAService.testConnection();
    if (aaTest.success) {
      console.log('✅ AA API connection successful');
      passedTests++;
    } else {
      console.log('⚠️ AA API connection failed:', aaTest.message);
    }
  } catch (error) {
    console.log('❌ AA API test error:', error);
  }

  // Test 2: Gemini AI Connection
  totalTests++;
  console.log('\n🔍 Test 2: Gemini AI Connection');
  try {
    const geminiTest = await geminiService.testConnection();
    if (geminiTest.success) {
      console.log('✅ Gemini AI connection successful');
      passedTests++;
    } else {
      console.log('⚠️ Gemini AI connection failed:', geminiTest.message);
    }
  } catch (error) {
    console.log('❌ Gemini AI test error:', error);
  }

  // Test 3: Firestore Category Service
  totalTests++;
  console.log('\n🔍 Test 3: Firestore Category Service');
  try {
    const categories = await AACategoryService.getAllMappings();
    console.log(`✅ Firestore category service working - found ${categories.length} mappings`);
    passedTests++;
  } catch (error) {
    console.log('❌ Firestore category service error:', error);
  }

  // Test 4: Firestore Stats Service
  totalTests++;
  console.log('\n🔍 Test 4: Firestore Stats Service');
  try {
    await AAStatsService.recalculateStats();
    const stats = await AAStatsService.getStats();
    if (stats) {
      console.log('✅ Firestore stats service working');
      console.log(`   📊 Total News: ${stats.totalNews}`);
      console.log(`   📰 Published: ${stats.publishedNews}`);
      console.log(`   📝 Drafts: ${stats.draftNews}`);
      passedTests++;
    } else {
      console.log('⚠️ Stats service returned null');
    }
  } catch (error) {
    console.log('❌ Firestore stats service error:', error);
  }

  // Test 5: News Service (Basic CRUD)
  totalTests++;
  console.log('\n🔍 Test 5: Firestore News Service');
  try {
    // Create a test news item
    const testNews = {
      aa_id: 'test_' + Date.now(),
      title: 'Test News Article',
      content: 'This is a test news article for system verification.',
      summary: 'Test summary',
      category: 'gündem',
      priority: 'rutin' as const,
      status: 'draft' as const,
      publishDate: new Date(),
      source: 'AA' as const,
      originalData: { test: true },
      aiEnhanced: false,
      hasPhotos: false,
      hasVideos: false,
      hasDocuments: false,
      viewCount: 0,
      shareCount: 0,
      author: 'System Test',
      tags: ['test', 'system']
    };

    const createdId = await AANewsService.createNews(testNews);
    console.log('✅ News creation successful, ID:', createdId);

    // Update the test news
    await AANewsService.updateNews(createdId, {
      status: 'published',
      viewCount: 1
    });
    console.log('✅ News update successful');

    // Delete the test news
    await AANewsService.deleteNews(createdId);
    console.log('✅ News deletion successful');

    passedTests++;
  } catch (error) {
    console.log('❌ Firestore news service error:', error);
  }

  // Test Summary
  console.log('\n================================================');
  console.log('🏁 Test Summary');
  console.log(`✅ Passed: ${passedTests}/${totalTests} tests`);
  console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests} tests`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Your Ultra Premium AA Manager is ready!');
  } else {
    console.log('⚠️ Some tests failed. Check the configuration.');
  }

  return {
    total: totalTests,
    passed: passedTests,
    success: passedTests === totalTests
  };
};

// Export for use in other scripts
export { runSystemTest };

// Self-executing script if run directly
if (typeof window === 'undefined') {
  runSystemTest().catch(console.error);
}
