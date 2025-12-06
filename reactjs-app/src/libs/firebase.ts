import { initializeApp, getApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Firebase configuration for image upload (economic project)
const firebaseConfig = {
  apiKey: "AIzaSyB4lQsAr2_OxOse6R_ZfDAIAkCLNsb60rA",
  authDomain: "economic-e3c75.firebaseapp.com",
  projectId: "economic-e3c75",
  storageBucket: "economic-e3c75.appspot.com",
  messagingSenderId: "1097189893918",
  appId: "1:1097189893918:web:8459347d9cf74609030b0f",
  measurementId: "G-4D6DZV8ZWW",
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

export default imageUploadApp;
