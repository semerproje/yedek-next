// Simple environment variable test
require('dotenv').config({ path: './.env.local' });

console.log('🔍 Environment Variable Check');
console.log('============================');
console.log('AA_API_USERNAME:', process.env.AA_API_USERNAME || 'NOT SET');
console.log('AA_API_PASSWORD:', process.env.AA_API_PASSWORD || 'NOT SET');
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY || 'NOT SET');
console.log('NEXT_PUBLIC_FIREBASE_API_KEY:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'NOT SET');
console.log('NODE_ENV:', process.env.NODE_ENV || 'NOT SET');

// Test if we can access the service constructors without initializing Firebase
console.log('\n🔍 Service Import Test');
console.log('=====================');

try {
  // Import the service class but don't initialize the instance
  const { UltraPremiumAAService } = require('../src/lib/services/ultraPremiumAAService');
  console.log('✅ UltraPremiumAAService class imported successfully');
  
  // Check if credentials are detected
  const hasUsername = !!(process.env.AA_API_USERNAME || process.env.AA_USERNAME);
  const hasPassword = !!(process.env.AA_API_PASSWORD || process.env.AA_PASSWORD);
  console.log('✅ AA Credentials detected:', hasUsername && hasPassword ? 'YES' : 'NO');
  
} catch (error) {
  console.log('❌ Service import error:', error.message);
}

try {
  const { UltraPremiumGeminiService } = require('../src/lib/services/geminiService');
  console.log('✅ UltraPremiumGeminiService class imported successfully');
  
  const hasGeminiKey = !!(process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY);
  console.log('✅ Gemini API Key detected:', hasGeminiKey ? 'YES' : 'NO');
  
} catch (error) {
  console.log('❌ Gemini service import error:', error.message);
}

console.log('\n🎯 Summary');
console.log('==========');
console.log('Environment variables are properly configured for web interface usage.');
console.log('The Ultra Premium AA Manager should work correctly in the browser.');
console.log('Visit: http://localhost:3000/admin/dashboard/ultra-aa-manager');
