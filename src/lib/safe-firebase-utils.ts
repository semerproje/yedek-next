import { doc, getDoc, updateDoc, DocumentReference } from 'firebase/firestore'

/**
 * Güvenli document update fonksiyonu
 * Document'in varlığını kontrol eder, sadece varsa update yapar
 */
export async function safeUpdateDoc(
  docRef: DocumentReference,
  data: { [x: string]: any }
): Promise<{ success: boolean; error?: string }> {
  try {
    // Document varlığını kontrol et
    const docSnap = await getDoc(docRef)
    
    if (!docSnap.exists()) {
      console.warn(`⚠️ Document doesn't exist, skipping update: ${docRef.path}`)
      return { 
        success: false, 
        error: `Document doesn't exist: ${docRef.path}` 
      }
    }
    
    // Document varsa update yap
    await updateDoc(docRef, data)
    console.log(`✅ Document updated successfully: ${docRef.path}`)
    return { success: true }
    
  } catch (error: any) {
    console.error(`❌ Update error for ${docRef.path}:`, error)
    return { 
      success: false, 
      error: error.message || 'Unknown error' 
    }
  }
}

/**
 * Güvenli batch update için yardımcı fonksiyon
 */
export async function safeBatchUpdate(
  updates: Array<{
    docRef: DocumentReference
    data: { [x: string]: any }
    description?: string
  }>
): Promise<{ success: number; failed: number; errors: string[] }> {
  let success = 0
  let failed = 0
  const errors: string[] = []
  
  for (const update of updates) {
    const result = await safeUpdateDoc(update.docRef, update.data)
    
    if (result.success) {
      success++
      if (update.description) {
        console.log(`✅ ${update.description}`)
      }
    } else {
      failed++
      const errorMsg = `${update.description || update.docRef.path}: ${result.error}`
      errors.push(errorMsg)
    }
  }
  
  return { success, failed, errors }
}
