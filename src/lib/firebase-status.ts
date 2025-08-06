// lib/firebase-status.ts
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function checkFirebaseConnection(): Promise<boolean> {
  if (!db) {
    console.warn('Firebase not initialized');
    return false;
  }

  try {
    // Try to read a simple document to test connection
    const testDoc = doc(db, '__status__', 'test');
    await getDoc(testDoc);
    return true;
  } catch (error) {
    console.error('Firebase connection test failed:', error);
    return false;
  }
}

export function logFirebaseStatus() {
  if (typeof window !== 'undefined') {
    checkFirebaseConnection().then(isConnected => {
      console.log(`🔥 Firebase Status: ${isConnected ? 'Connected ✅' : 'Disconnected ❌'}`);
    });
  }
}
