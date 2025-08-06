'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { EyeOff, Eye, Loader2, Shield, User, Lock } from 'lucide-react'

function AdminLoginContent() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [firebaseReady, setFirebaseReady] = useState(false)
  const [debugInfo, setDebugInfo] = useState('Initializing...')
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  // Component mount kontrolü
  useEffect(() => {
    setMounted(true)
    console.log('🔥 ADMIN COMPONENT STARTING')
    console.log('Window object available:', typeof window !== 'undefined')
    console.log('Current URL:', typeof window !== 'undefined' ? window.location.href : 'SSR')
    console.log('Firebase auth object:', !!auth)
    
    // TEMPORARY: Auto-redirect to dashboard for development
    console.log('🚀 AUTO-REDIRECTING TO DASHBOARD (BYPASS MODE)')
    router.push('/admin/dashboard')
    
  }, [router])

  // Firebase hazır mı kontrol et
  useEffect(() => {
    if (!mounted) return

    console.log('Admin page mounting...')
    setDebugInfo('Checking Firebase...')
    
    let cleanup: (() => void) | undefined

    // Basit Firebase kontrolü
    const initializeFirebase = async () => {
      try {
        console.log('=== Firebase initialization attempt ===')
        console.log('Auth object:', auth)
        console.log('Auth type:', typeof auth)
        console.log('Window available:', typeof window !== 'undefined')
        
        if (typeof window !== 'undefined') {
          if (auth) {
            console.log('✅ Firebase auth available')
            setFirebaseReady(true)
            setDebugInfo('Firebase ready!')
            
            // Auth state listener - GEÇİCİ OLARAK KAPALI
            /*
            const unsubscribe = onAuthStateChanged(auth, (user) => {
              console.log('Auth state changed:', !!user)
              setDebugInfo(`Auth state: ${user ? 'Logged in' : 'Logged out'}`)
              
              if (user) {
                console.log('User found, redirecting to dashboard...')
                router.push('/admin/dashboard')
              }
            })

            cleanup = unsubscribe
            */
            setFirebaseReady(true) // Manuel login'e izin ver
            setDebugInfo('Auth listener disabled - manual login only')
          } else {
            console.log('❌ Firebase auth not available, retrying...')
            setDebugInfo('Firebase not ready, retrying...')
            setTimeout(initializeFirebase, 500)
          }
        } else {
          console.log('⚠️ Window not available (SSR)')
          setDebugInfo('Server-side rendering detected')
        }
      } catch (error) {
        console.error('❌ Firebase initialization error:', error)
        setDebugInfo(`Firebase error: ${error}`)
        setFirebaseReady(true) // Allow manual login attempt
      }
    }

    initializeFirebase()

    return () => {
      if (cleanup) cleanup()
    }
  }, [mounted, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!form.username || !form.password) {
      setError('Lütfen kullanıcı adı ve şifreyi girin.')
      return
    }

    setLoading(true)
    setError('')
    setDebugInfo('Attempting login...')

    try {
      // Firebase hazır değilse hata ver
      if (!auth) {
        throw new Error('Firebase henüz yüklenmedi. Lütfen sayfayı yenileyin.')
      }

      // Email formatına çevir
      const email = form.username.includes('@') 
        ? form.username 
        : `${form.username}@admin.local`

      console.log('Attempting login with email:', email)
      setDebugInfo(`Logging in with: ${email}`)

      // Giriş dene
      const userCredential = await signInWithEmailAndPassword(auth, email, form.password)
      console.log('Login successful:', userCredential.user.email)
      setDebugInfo('Login successful! Redirecting...')
      
      // Başarılı giriş sonrası yönlendir
      router.push('/admin/dashboard')
      
    } catch (error: any) {
      console.error('Giriş hatası:', error)
      let message = 'Giriş başarısız. Bilgilerinizi kontrol edin.'
      
      if (error.code === 'auth/user-not-found') {
        message = 'Kullanıcı bulunamadı. Admin kullanıcısı oluşturuluyor...'
        setDebugInfo('User not found, creating admin user...')
        
        // Kullanıcı yoksa oluştur
        try {
          if (!auth) throw new Error('Firebase not available')
          
          const { createUserWithEmailAndPassword } = await import('firebase/auth')
          const newUserCredential = await createUserWithEmailAndPassword(auth, 'admin@admin.local', 'admin123')
          console.log('Admin kullanıcısı oluşturuldu:', newUserCredential.user.email)
          setDebugInfo('Admin user created successfully! Redirecting...')
          router.push('/admin/dashboard')
          return
        } catch (createError: any) {
          console.error('Admin oluşturma hatası:', createError)
          message = 'Admin kullanıcısı oluşturulamadı: ' + createError.message
        }
      } else if (error.code === 'auth/wrong-password') {
        message = 'Hatalı şifre.'
      } else if (error.code === 'auth/invalid-email') {
        message = 'Geçersiz email formatı.'
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Çok fazla deneme. Lütfen bekleyin.'
      } else if (error.code === 'auth/invalid-credential') {
        message = 'Geçersiz kimlik bilgileri. Kullanıcı adı: admin, Şifre: admin123'
      } else if (error.message) {
        message = error.message
      }
      
      setError(message)
      setDebugInfo(`Login failed: ${error.code || 'unknown'} - ${error.message || 'No details'}`)
    } finally {
      setLoading(false)
    }
  }

  // Component henüz mount olmadıysa hiçbir şey render etme
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-white mx-auto mb-4" />
          <p className="text-white text-lg">Sayfa Yükleniyor...</p>
        </div>
      </div>
    )
  }

  // Firebase yüklenene kadar loading göster
  if (!firebaseReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-white mx-auto mb-4" />
          <p className="text-white text-lg">Admin Panel Yükleniyor...</p>
          <p className="text-purple-300 text-sm mt-2">{debugInfo}</p>
          
          {/* Firebase yüklenmiyorsa manuel devam seçeneği */}
          <div className="mt-6">
            <button
              onClick={() => setFirebaseReady(true)}
              className="text-sm text-purple-300 hover:text-white underline"
            >
              Firebase yüklenmiyor mu? Manuel devam et
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo ve Başlık */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm border border-white/20">
              <Shield className="h-8 w-8 text-purple-300" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-purple-200">NetNext Yönetim Sistemi</p>
        </div>

        {/* Giriş Formu */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Kullanıcı Adı */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-purple-200 mb-2">
                Kullanıcı Adı
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-purple-300" />
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                  placeholder="admin"
                  required
                />
              </div>
            </div>

            {/* Şifre */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-purple-200 mb-2">
                Şifre
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-purple-300" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-purple-300 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Hata Mesajı */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            {/* Debug Panel */}
            <div className="bg-gray-800/50 border border-gray-600/50 rounded-lg p-4">
              <h4 className="text-white text-sm font-medium mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                System Debug Panel
              </h4>
              
              <div className="space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Component:</span>
                    <span className={mounted ? 'text-green-400' : 'text-red-400'}>
                      {mounted ? '✅ Mounted' : '❌ Loading'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Firebase:</span>
                    <span className={firebaseReady ? 'text-green-400' : 'text-yellow-400'}>
                      {firebaseReady ? '✅ Ready' : '⏳ Loading'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Auth Object:</span>
                    <span className={auth ? 'text-green-400' : 'text-red-400'}>
                      {auth ? '✅ Available' : '❌ Missing'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Environment:</span>
                    <span className="text-blue-400">
                      {typeof window !== 'undefined' ? '🌐 Client' : '🖥️ SSR'}
                    </span>
                  </div>
                </div>
                
                <div className="pt-2 border-t border-gray-600">
                  <span className="text-gray-400 block mb-1">Latest Status:</span>
                  <p className="text-white text-xs break-words font-mono bg-black/20 p-2 rounded">
                    {debugInfo}
                  </p>
                </div>
              </div>
            </div>

            {/* Giriş Butonu */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Giriş Yapılıyor...
                </>
              ) : (
                'Giriş Yap'
              )}
            </button>
          </form>

          {/* Test Bilgileri */}
          <div className="mt-6 pt-6 border-t border-white/20">
            <p className="text-sm text-purple-200 text-center mb-2">Test için:</p>
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-xs text-purple-300 text-center">
                Kullanıcı: <span className="text-white font-mono">admin</span> | 
                Şifre: <span className="text-white font-mono">admin123</span>
              </p>
              <p className="text-xs text-purple-300 text-center mt-2">
                Firebase Status: <span className="text-white">{firebaseReady ? '✅ Bağlı' : '❌ Bağlı değil'}</span>
              </p>
              {typeof window !== 'undefined' && (
                <p className="text-xs text-purple-300 text-center mt-1">
                  Browser: <span className="text-white">✅ Ready</span>
                </p>
              )}
            </div>
            
            <div className="mt-3 text-center space-y-2">
              <button
                type="button"
                onClick={async () => {
                  setDebugInfo('Testing Firebase connection...')
                  try {
                    if (auth) {
                      setDebugInfo('✅ Firebase Auth is available')
                      // Test admin kullanıcısı oluşturmayı dene
                      const { createUserWithEmailAndPassword } = await import('firebase/auth')
                      try {
                        await createUserWithEmailAndPassword(auth, 'admin@admin.local', 'admin123')
                        setDebugInfo('✅ Test admin user created successfully!')
                      } catch (error: any) {
                        if (error.code === 'auth/email-already-in-use') {
                          setDebugInfo('✅ Admin user already exists - ready to login!')
                        } else {
                          setDebugInfo(`❌ Error: ${error.code}`)
                        }
                      }
                    } else {
                      setDebugInfo('❌ Firebase Auth not available')
                    }
                  } catch (error: any) {
                    setDebugInfo(`❌ Connection test failed: ${error.message}`)
                  }
                }}
                className="text-xs text-purple-300 hover:text-white underline"
              >
                🔧 Firebase Bağlantısını Test Et
              </button>
              
              <div className="text-xs text-purple-400">
                <p>Sorun mu yaşıyorsun?</p>
                <button
                  type="button"
                  onClick={() => {
                    setForm({ username: 'admin', password: 'admin123' })
                    setError('')
                    setDebugInfo('Form auto-filled for testing')
                  }}
                  className="text-purple-300 hover:text-white underline"
                >
                  Test bilgilerini otomatik doldur
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-purple-300 text-sm">
            NetNext Admin Panel © 2024
          </p>
        </div>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return <AdminLoginContent />
}
