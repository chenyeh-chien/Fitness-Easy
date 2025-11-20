import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDVxCdSTDTcu8DvdP-declJIqxPki_qHco",
  authDomain: "fitness-easy-90373.firebaseapp.com",
  projectId: "fitness-easy-90373",
  storageBucket: "fitness-easy-90373.firebasestorage.app",
  messagingSenderId: "895713935540",
  appId: "1:895713935540:web:10d94986eab6fd5f7ad7e1",
  measurementId: "G-8RGL1Z8MNQ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);


