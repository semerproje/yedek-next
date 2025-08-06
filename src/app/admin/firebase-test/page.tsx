'use client';

import { useState } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function FirebaseTestPage() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const testFirebaseConnection = async () => {
    setLoading(true);
    setStatus('Testing Firebase connection...');
    
    try {
      // Test 1: Basit bağlantı testi
      setStatus('✅ Firebase initialized successfully');
      
      // Test 2: Firestore okuma testi
      const categoriesRef = collection(db, 'categories');
      const snapshot = await getDocs(categoriesRef);
      setStatus(prev => prev + '\n✅ Firestore read access successful');
      setStatus(prev => prev + `\n📊 Categories found: ${snapshot.size}`);
      
      // Test 3: Basit yazma testi (test koleksiyonu)
      const testDoc = await addDoc(collection(db, 'test'), {
        message: 'Firebase test successful',
        timestamp: new Date()
      });
      setStatus(prev => prev + '\n✅ Firestore write access successful');
      setStatus(prev => prev + `\n📝 Test document ID: ${testDoc.id}`);
      
    } catch (error: any) {
      console.error('Firebase test error:', error);
      setStatus(prev => prev + `\n❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Firebase Connection Test</h1>
        
        <button
          onClick={testFirebaseConnection}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          {loading ? 'Testing...' : 'Test Firebase Connection'}
        </button>
        
        {status && (
          <div className="mt-6 p-4 bg-white rounded-lg border">
            <h3 className="font-semibold mb-2">Test Results:</h3>
            <pre className="whitespace-pre-wrap text-sm text-gray-700">
              {status}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
