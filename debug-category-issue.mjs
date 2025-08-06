#!/usr/bin/env node

// Debug script to understand the AA API document structure and category issue

console.log('🔍 AA API Category Debug - Starting...')

const testAADocument = {
  "id": "20250731-1234567",
  "title": "Test Haber Başlığı",
  "content": "Test haber içeriği",
  "date": "2025-07-31T08:00:00Z",
  "type": "text",
  // Note: category field might be missing or undefined in some documents
  // "category": "1",
  "priority": "3",
  "language": "1",
  "package": "news"
}

console.log('📄 Test document structure:', testAADocument)
console.log('📄 Category field:', testAADocument.category)
console.log('📄 Category type:', typeof testAADocument.category)

// Simulate the category processing logic
const AA_CATEGORY_CODES = {
  '1': 'Genel',
  '2': 'Spor', 
  '3': 'Ekonomi',
  '4': 'Sağlık',
  '5': 'Bilim, Teknoloji',
  '6': 'Politika',
  '7': 'Kültür, Sanat, Yaşam'
}

const AA_TO_HEADER_CATEGORY_MAPPING = {
  'Genel': 'Gündem',
  'Spor': 'Spor',
  'Ekonomi': 'Ekonomi', 
  'Sağlık': 'Gündem',
  'Bilim, Teknoloji': 'Teknoloji',
  'Politika': 'Politika',
  'Kültür, Sanat, Yaşam': 'Kültür'
}

function processAADocument(doc) {
  console.log('\n🔍 Processing document:', {
    id: doc.id,
    category: doc.category,
    categoryType: typeof doc.category,
    allFields: Object.keys(doc)
  })

  // FIXED: Ensure category is never undefined
  const rawCategory = doc.category || '1' // Default to '1' (Genel) if undefined
  const aaCategoryName = AA_CATEGORY_CODES[rawCategory] || 'Genel'
  const headerCategory = AA_TO_HEADER_CATEGORY_MAPPING[aaCategoryName] || 'Gündem'

  console.log('🏷️ Category mapping:', {
    raw: rawCategory,
    aaName: aaCategoryName,
    headerCategory: headerCategory
  })

  const processedDoc = {
    id: doc.id || '',
    type: doc.type || 'text',
    title: doc.title || '',
    content: doc.content || '',
    date: doc.date || new Date().toISOString(),
    category: rawCategory, // This should never be undefined now
    categoryName: aaCategoryName,
    enhancedCategory: headerCategory,
    priority: doc.priority || '4',
    package: doc.package || '',
    language: doc.language || '1'
  }

  console.log('✅ Processed document validation:', {
    id: processedDoc.id,
    category: processedDoc.category,
    categoryType: typeof processedDoc.category,
    categoryDefined: processedDoc.category !== undefined
  })

  return processedDoc
}

// Test with document missing category
console.log('\n🧪 Testing document WITHOUT category field:')
const result1 = processAADocument(testAADocument)

// Test with document having category
console.log('\n🧪 Testing document WITH category field:')
const testDocWithCategory = { ...testAADocument, category: "2" }
const result2 = processAADocument(testDocWithCategory)

console.log('\n📊 Test Results Summary:')
console.log('Result 1 (no category):', {
  category: result1.category,
  categoryName: result1.categoryName,
  valid: result1.category !== undefined
})
console.log('Result 2 (with category):', {
  category: result2.category, 
  categoryName: result2.categoryName,
  valid: result2.category !== undefined
})

console.log('\n✅ Debug completed. The fix ensures category defaults to "1" when undefined.')
