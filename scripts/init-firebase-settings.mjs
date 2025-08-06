import { initializeApp } from 'firebase/app'
import { getFirestore, doc, setDoc, Timestamp } from 'firebase/firestore'

// Firebase configuration (update with your actual config)
const firebaseConfig = {
  apiKey: "AIzaSyA-rHCNYwu7T_LMWFS1YPlA_bZYLlGIrAg",
  authDomain: "haber-a62cf.firebaseapp.com",
  projectId: "haber-a62cf",
  storageBucket: "haber-a62cf.firebasestorage.app",
  messagingSenderId: "737652537003",
  appId: "1:737652537003:web:3d8db1c33b8c0e6b70e54a",
  measurementId: "G-2L9QZNHD8P"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function initializeSettings() {
  try {
    console.log('🔥 Initializing Firebase settings...')
    
    // Default AA crawler config
    const defaultAAConfig = {
      maxNewsPerCategory: 50,
      enabledCategories: ['1', '2', '3', '4', '5', '6', '7'], // All categories enabled
      crawlInterval: 30, // 30 minutes
      autoSave: true,
      lastCrawlTime: null,
      priority: '1', // Flaş önceliği
      language: 'tr_TR',
      searchType: '1', // Haber
      hoursBack: 24,
      maxTotalNews: 100,
      useAdvancedSearch: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    }
    
    // Create aa_crawler settings document
    await setDoc(doc(db, 'settings', 'aa_crawler'), defaultAAConfig, { merge: true })
    console.log('✅ AA crawler settings document created/updated')
    
    // Create general app settings document
    const generalSettings = {
      appVersion: '1.0.0',
      systemStatus: 'active',
      maintenanceMode: false,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    }
    
    await setDoc(doc(db, 'settings', 'general'), generalSettings, { merge: true })
    console.log('✅ General settings document created/updated')
    
    console.log('🎉 Firebase settings initialization completed!')
    process.exit(0)
    
  } catch (error) {
    console.error('❌ Firebase settings initialization failed:', error)
    process.exit(1)
  }
}

// Run initialization
initializeSettings()
