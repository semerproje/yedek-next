// Firebase Firestore Initialization Script
// Run this to set up initial data and collections for the Ultra Premium AA Manager

import { 
  AANewsService, 
  AACategoryService, 
  AAScheduleService, 
  AAStatsService,
  AISettingsService 
} from '@/lib/firebase/services';

const initializeFirestore = async () => {
  console.log('🔥 Initializing Firestore for Ultra Premium AA Manager...');

  try {
    // 1. Initialize category mappings
    console.log('📂 Setting up category mappings...');
    await AACategoryService.initializeDefaultMappings();
    console.log('✅ Category mappings initialized');

    // 2. Initialize AI settings
    console.log('🤖 Setting up AI settings...');
    const defaultAISettings = {
      geminiApiKey: process.env.GEMINI_API_KEY || '',
      enhanceTitle: true,
      enhanceContent: true,
      generateSummary: true,
      generateTags: true,
      seoOptimization: true,
      autoTranslate: false,
      contentQuality: 'balanced' as const,
      maxTokens: 4000,
      temperature: 0.7,
      topP: 0.9,
      frequencyPenalty: 0.0,
      presencePenalty: 0.0
    };
    await AISettingsService.updateSettings(defaultAISettings);
    console.log('✅ AI settings initialized');

    // 3. Create sample auto schedule
    console.log('⏰ Setting up sample auto schedule...');
    await AAScheduleService.createSchedule({
      name: 'Günlük Haber Çekimi',
      category: 'gündem',
      interval: 60, // 60 minutes (1 hour)
      enabled: false,
      maxNews: 20,
      priority: 'rutin',
      aiEnhance: false,
      photoDownload: true,
      videoDownload: false,
      categories: ['gündem', 'ekonomi', 'spor'],
      newsCount: 20,
      aiEnhancement: false,
      seoOptimization: false,
      autoPublish: false
    });
    console.log('✅ Sample schedule created');

    // 4. Initialize stats
    console.log('📊 Calculating initial stats...');
    await AAStatsService.recalculateStats();
    console.log('✅ Stats calculated');

    console.log('🎉 Firestore initialization completed successfully!');
    console.log('');
    console.log('📋 Summary:');
    console.log('- Category mappings: ✅ Set up');
    console.log('- AI settings: ✅ Configured');
    console.log('- Auto schedules: ✅ Sample created');
    console.log('- Stats: ✅ Initialized');
    console.log('');
    console.log('🚀 Your Ultra Premium AA Manager is ready to use!');

  } catch (error) {
    console.error('❌ Firestore initialization failed:', error);
    throw error;
  }
};

// Export for use in other scripts
export { initializeFirestore };

// Self-executing script if run directly
if (typeof window === 'undefined') {
  // Running in Node.js environment
  initializeFirestore().catch(console.error);
}
