// Fix duplicate keys in Firebase homepage modules

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, deleteDoc, updateDoc } = require('firebase/firestore');

const firebaseConfig = {
  projectId: 'net-next-news'
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fixDuplicateKeys() {
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
        order: data.order || 0
      });
    });
    
    console.log(`📊 Toplam ${modules.length} modül bulundu:`);
    modules.forEach(m => console.log(`  ${m.id}: ${m.component} (key: ${m.key})`));
    
    // Duplicate key kontrolü
    const keyCount = {};
    const duplicates = [];
    
    modules.forEach(m => {
      if (keyCount[m.key]) {
        keyCount[m.key].push(m);
        if (keyCount[m.key].length === 2) {
          duplicates.push(m.key);
        }
      } else {
        keyCount[m.key] = [m];
      }
    });
    
    console.log('\n🔍 Key analizi:');
    Object.entries(keyCount).forEach(([key, mods]) => {
      if (mods.length > 1) {
        console.log(`❌ DUPLICATE: ${key} (${mods.length} adet)`);
        mods.forEach(mod => console.log(`   - ${mod.id}: ${mod.name}`));
      } else {
        console.log(`✅ ${key}: ${mods[0].name}`);
      }
    });
    
    if (duplicates.length > 0) {
      console.log('\n🧹 Duplicate key\'ler temizleniyor...');
      
      for (const dupKey of duplicates) {
        const dupModules = keyCount[dupKey];
        console.log(`\n🔧 "${dupKey}" key'i için ${dupModules.length} duplicate bulundu:`);
        
        // En eski olanı tut, diğerlerini sil
        dupModules.sort((a, b) => a.order - b.order);
        const keepModule = dupModules[0];
        const deleteModules = dupModules.slice(1);
        
        console.log(`✅ Korunacak: ${keepModule.id} (${keepModule.name})`);
        
        for (const delMod of deleteModules) {
          console.log(`🗑️ Silinecek: ${delMod.id} (${delMod.name})`);
          await deleteDoc(doc(db, 'homepage_modules', delMod.id));
          console.log(`   ✅ Silindi: ${delMod.id}`);
        }
      }
      
      console.log('\n🎉 Duplicate key\'ler temizlendi!');
    } else {
      console.log('\n✅ Duplicate key bulunamadı, temizlik gerekmiyor.');
    }
    
    // Final kontrolü
    console.log('\n📋 Final durum:');
    const finalSnapshot = await getDocs(collection(db, 'homepage_modules'));
    const finalModules = [];
    
    finalSnapshot.forEach(doc => {
      const data = doc.data();
      finalModules.push({ 
        id: doc.id, 
        component: data.component,
        key: data.key || data.component,
        name: data.name,
        order: data.order || 0,
        active: data.active
      });
    });
    
    finalModules.sort((a, b) => a.order - b.order);
    console.log(`📊 Kalan ${finalModules.length} modül:`);
    finalModules.forEach((m, index) => {
      console.log(`  ${index + 1}. ${m.name} (${m.component}) - ${m.active ? 'Aktif' : 'Pasif'}`);
    });
    
  } catch (error) {
    console.error('❌ Hata:', error.message);
  }
}

fixDuplicateKeys();
