import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration - Replace with your own Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA0kP5RPlf-BuK2_pFqPn4XxWT2Vcbi_ag",
  authDomain: "eventa-b1e93.firebaseapp.com",
  databaseURL: "https://eventa-b1e93-default-rtdb.firebaseio.com",
  projectId: "eventa-b1e93",
  storageBucket: "eventa-b1e93.firebasestorage.app",
  messagingSenderId: "933678928170",
  appId: "1:933678928170:web:79e1c40de382d0e6e6ce53"
};

// Initialize Firebase - check if already initialized to prevent duplicate app error
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Initialize Auth with AsyncStorage persistence
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} catch (error) {
  // If auth is already initialized, get the existing instance
  if (error.code === 'auth/already-initialized') {
    auth = getAuth(app);
  } else {
    throw error;
  }
}

// Initialize Firestore
const db = getFirestore(app);

export { app, auth, db };
