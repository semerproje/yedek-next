import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../src/lib/firebase'

async function createTestAdmin() {
  try {
    if (!auth) {
      console.error('Firebase auth not initialized')
      return
    }

    // Test admin kullanıcısı oluştur
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      'admin@admin.local', 
      'admin123'
    )
    
    console.log('Test admin kullanıcısı oluşturuldu:', userCredential.user.email)
    console.log('UID:', userCredential.user.uid)
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('Admin kullanıcısı zaten mevcut')
    } else {
      console.error('Admin oluşturma hatası:', error)
    }
  }
}

// Browser ortamında çalıştır
if (typeof window !== 'undefined') {
  createTestAdmin()
}

export default createTestAdmin
