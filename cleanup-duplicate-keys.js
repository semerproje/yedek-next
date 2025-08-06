// Firebase'deki duplicate key'leri temizle

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, deleteDoc } = require('firebase/firestore');

const firebaseConfig = {
  projectId: 'net-next-news'
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function cleanupDuplicateKeys() {
  try {
    console.log('🔍 Firebase modülleri kontrol ediliyor...');
    
    const snapshot = await getDocs(collection(db, 'homepage_modules'));
    const modules = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      modules.push({ 
        id: doc.id, 
        component: data.component,
        key: data.key || data.component,
        name: data.name,
        order: data.order || 0,
        active: data.active
      });
    });
    
    console.log(`📊 Toplam ${modules.length} modül bulundu`);
    
    // Duplicate key kontrolü
    const keyGroups = {};
    
    modules.forEach(m => {
      const keyToUse = m.key || m.component;
      if (!keyGroups[keyToUse]) {
        keyGroups[keyToUse] = [];
      }
      keyGroups[keyToUse].push(m);
    });
    
    const duplicates = Object.entries(keyGroups).filter(([key, mods]) => mods.length > 1);
    
    if (duplicates.length === 0) {
      console.log('✅ Duplicate key bulunamadı!');
      return;
    }
    
    console.log(`❌ ${duplicates.length} duplicate key grubu bulundu:`);
    
    for (const [dupKey, dupModules] of duplicates) {
      console.log(`\n🔧 "${dupKey}" key'i için ${dupModules.length} duplicate:`);
      
      // En düşük order'a sahip olanı tut, diğerlerini sil
      dupModules.sort((a, b) => a.order - b.order);
      const keepModule = dupModules[0];
      const deleteModules = dupModules.slice(1);
      
      console.log(`✅ Korunacak: ${keepModule.name} (order: ${keepModule.order})`);
      
      for (const delMod of deleteModules) {
        console.log(`🗑️ Silinecek: ${delMod.name} (order: ${delMod.order})`);
        await deleteDoc(doc(db, 'homepage_modules', delMod.id));
        console.log(`   ✅ Silindi: ${delMod.id}`);
      }
    }
    
    console.log('\n🎉 Duplicate key temizliği tamamlandı!');
    
    // Final kontrol
    const finalSnapshot = await getDocs(collection(db, 'homepage_modules'));
    console.log(`📊 Kalan modül sayısı: ${finalSnapshot.size}`);
    
  } catch (error) {
    console.error('❌ Hata:', error.message);
  }
}

cleanupDuplicateKeys();
