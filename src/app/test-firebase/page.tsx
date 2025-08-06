// Firebase Authentication ve Connection Test
'use client'

import { useEffect, useState } from 'react'
import { auth, db } from '@/lib/firebase'
import { signInWithEmailAndPassword, onAuthStateChanged, User } from 'firebase/auth'
import { doc, getDoc, collection, getDocs } from 'firebase/firestore'

interface TestResult {
  test: string;
  status: 'success' | 'error' | 'warning';
  message: string;
}

export default function FirebaseTestPage() {
  const [user, setUser] = useState<User | null>(null)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
      if (user) {
        runTests(user)
      }
    })

    return () => unsubscribe()
  }, [])

  const runTests = async (user: User) => {
    const results: TestResult[] = []
    
    // Test 1: Firestore Connection
    try {
      const testCollection = collection(db, 'test')
      await getDocs(testCollection)
      results.push({
        test: 'Firestore Connection',
        status: 'success',
        message: 'Connection successful'
      })
    } catch (error) {
      results.push({
        test: 'Firestore Connection',
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    }

    // Test 2: User Role Check
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      if (userDoc.exists()) {
        const userData = userDoc.data()
        results.push({
          test: 'User Role',
          status: 'success',
          message: `Role: ${userData.role || 'No role set'}`
        })
      } else {
        results.push({
          test: 'User Role',
          status: 'warning',
          message: 'User document not found'
        })
      }
    } catch (error) {
      results.push({
        test: 'User Role',
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    }

    // Test 3: Homepage Modules Access
    try {
      const modulesCollection = collection(db, 'homepage_modules')
      const snapshot = await getDocs(modulesCollection)
      results.push({
        test: 'Homepage Modules',
        status: 'success',
        message: `Found ${snapshot.size} modules`
      })
    } catch (error) {
      results.push({
        test: 'Homepage Modules',
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    }

    setTestResults(results)
  }

  const loginAsAdmin = async () => {
    try {
      await signInWithEmailAndPassword(auth, 'admin@admin.local', 'admin123')
    } catch (error) {
      console.error('Login error:', error)
      setTestResults(prev => [...prev, {
        test: 'Admin Login',
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }])
    }
  }

  if (loading) {
    return <div className="p-4">Loading Firebase...</div>
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">🔥 Firebase Test Dashboard</h1>
      
      {/* Authentication Status */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">👤 Authentication Status</h2>
        {user ? (
          <div className="text-green-600">
            <p>✅ Logged in as: {user.email}</p>
            <p>🆔 UID: {user.uid}</p>
          </div>
        ) : (
          <div>
            <p className="text-red-600 mb-4">❌ Not logged in</p>
            <button 
              onClick={loginAsAdmin}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Login as Admin
            </button>
          </div>
        )}
      </div>

      {/* Test Results */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">🧪 Test Results</h2>
        {testResults.length === 0 ? (
          <p className="text-gray-500">No tests run yet</p>
        ) : (
          <div className="space-y-3">
            {testResults.map((result, index) => (
              <div key={index} className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded text-sm ${
                  result.status === 'success' ? 'bg-green-100 text-green-800' :
                  result.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {result.status === 'success' ? '✅' : 
                   result.status === 'warning' ? '⚠️' : '❌'} {result.test}
                </span>
                <span className="text-gray-600">{result.message}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Firebase Rules Info */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-6">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">🚨 Firebase Security Rules</h3>
        <p className="text-yellow-700 mb-2">
          Eğer "Missing or insufficient permissions" hatası alıyorsanız:
        </p>
        <ol className="list-decimal list-inside text-yellow-700 space-y-1">
          <li>Firebase Console → Firestore Database → Rules</li>
          <li>Geliştirme için geçici olarak: <code>allow read, write: if true;</code></li>
          <li>Veya admin kullanıcısı oluşturun ve role atayın</li>
        </ol>
      </div>
    </div>
  )
}
