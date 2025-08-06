// Development script to create admin user
import { initializeApp } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBKwVLWLTgLLfs8V0ptEvwywGoIwxm430A",
  authDomain: "haber-a62cf.firebaseapp.com",
  projectId: "haber-a62cf",
  storageBucket: "haber-a62cf.firebasestorage.app",
  messagingSenderId: "651640696907",
  appId: "1:651640696907:web:d7c012c1280a08e0c69dce",
}

async function createAdminUser() {
  try {
    console.log('🔥 Firebase başlatılıyor...')
    const app = initializeApp(firebaseConfig)
    const auth = getAuth(app)
    
    console.log('👤 Admin kullanıcısı oluşturuluyor...')
    
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        'admin@admin.local',
        'admin123'
      )
      
      console.log('✅ Admin kullanıcısı başarıyla oluşturuldu!')
      console.log('📧 Email:', userCredential.user.email)
      console.log('🆔 UID:', userCredential.user.uid)
      
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log('ℹ️  Admin kullanıcısı zaten mevcut')
        
        // Test girişi yap
        try {
          const testLogin = await signInWithEmailAndPassword(auth, 'admin@admin.local', 'admin123')
          console.log('✅ Test girişi başarılı!')
          console.log('📧 Giriş yapılan email:', testLogin.user.email)
        } catch (loginError) {
          console.log('❌ Test girişi başarısız:', loginError.message)
        }
      } else {
        throw error
      }
    }
    
    console.log('')
    console.log('🔐 Admin Panel Giriş Bilgileri:')
    console.log('   URL: http://localhost:3000/admin')
    console.log('   Kullanıcı adı: admin')
    console.log('   Şifre: admin123')
    
  } catch (error) {
    console.error('❌ Hata:', error.message)
    console.error('🔧 Kod:', error.code)
  }
}

createAdminUser().then(() => {
  console.log('\n🎉 İşlem tamamlandı!')
  process.exit(0)
}).catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
