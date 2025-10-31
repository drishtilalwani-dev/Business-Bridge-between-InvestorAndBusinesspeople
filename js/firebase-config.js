// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBf-3XJulM8ZW9lereIQhU-jJWVTxXPatQ",
  authDomain: "bridge-investor-business-56d46.firebaseapp.com",
  projectId: "bridge-investor-business-56d46",
  storageBucket: "bridge-investor-business-56d46.appspot.com",  
  messagingSenderId: "483812130177",
  appId: "1:483812130177:web:067aa629cf57229845fc80",
  measurementId: "G-J061VP7TBZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services to use in other JS files
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
