// src/lib/firebase.ts - Firebase Configuration

import { initializeApp, getApps } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Production Firebase Configuration - haber-a62cf project
const firebaseConfig = {
  apiKey: "AIzaSyCS6K2R4fLbGVCNrMLOOqjXUpgqoWn_K2A",
  authDomain: "haber-a62cf.firebaseapp.com",
  projectId: "haber-a62cf",
  storageBucket: "haber-a62cf.firebasestorage.app",
  messagingSenderId: "1058718267059",
  appId: "1:1058718267059:web:f7b2c8b24b1e6b2c8a9e4d",
  measurementId: "G-VXQNQ1QYQG"
};

// Uygulamanın zaten başlatılıp başlatılmadığını kontrol et
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Firestore (veritabanı) - both client and server side
import { Firestore } from 'firebase/firestore';
import { Auth } from 'firebase/auth';
import { FirebaseStorage } from 'firebase/storage';

// Initialize Firebase services
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// PRODUCTION Firestore - Gerçek veri ile çalışır
console.log('🔥 Firebase initialized with PRODUCTION Firestore');
console.log('🔥 Project ID:', firebaseConfig.projectId);
console.log('🔥 Database initialized successfully');

export { app, db, auth, storage };
