import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import { Firestore, getFirestore } from 'firebase/firestore';
// import { Auth, getAuth, initializeAuth } from 'firebase/auth';
// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDWVDjP4mCYgDkDQR36OMGzqw7TUcS3zJY",
  authDomain: "work-wise-1fc2e.firebaseapp.com",
  projectId: "work-wise-1fc2e",
  storageBucket: "work-wise-1fc2e.firebasestorage.app",
  messagingSenderId: "954190400565",
  appId: "1:954190400565:web:321d47c4680c20b981357c"
};

let firebaseApp: FirebaseApp;
// let fireAuth: Auth;
let fireStore: Firestore;
// let fireStorage: FirebaseStorage;

if (getApps().length < 1) {
  firebaseApp = initializeApp(firebaseConfig);
  fireStore = getFirestore(firebaseApp);
} else {
  firebaseApp = getApp();
  fireStore = getFirestore(firebaseApp);
}

// Initialize Firebase
export const app = firebaseApp;
export const db = fireStore;
// export const auth = fireAuth;