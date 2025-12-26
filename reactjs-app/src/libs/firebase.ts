import { initializeApp, getApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Firebase configuration for image upload (economic project)
const firebaseConfig = {
  apiKey: "AIzaSyA8CKFfVxJyto2PDzibbSnXgDCCxRMXVeA",
  authDomain: "cenima-2300.firebaseapp.com",
  projectId: "cenima-2300",
  storageBucket: "cenima-2300.appspot.com",
  messagingSenderId: "804992089940",
  appId: "1:804992089940:web:bf76dcc2bf5b72831c92c1",
  measurementId: "G-G9QXD9H6ZF"
};

// Create a separate Firebase app instance for image uploads
// This prevents conflicts with the chat app's Firebase configuration
const getImageUploadApp = () => {
  const appName = "image-upload-app";

  try {
    // Try to get existing app first
    return getApp(appName);
  } catch (error) {
    // If app doesn't exist, create new one with specific name
    return initializeApp(firebaseConfig, appName);
  }
};

const imageUploadApp = getImageUploadApp();

// Initialize Firebase Storage for image uploads
export const storage = getStorage(imageUploadApp);

// Initialize Firestore
export const db = getFirestore(imageUploadApp);

export default imageUploadApp;
