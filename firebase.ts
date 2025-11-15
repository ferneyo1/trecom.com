// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Add your own Firebase configuration from your project settings
const firebaseConfig = {
apiKey: "AIzaSyAe7wGw0L6A7qa2emoUC9GfefvEJ4bsph8",
  authDomain: "trecomiendo-91b8e.firebaseapp.com",
  projectId: "trecomiendo-91b8e",
  storageBucket: "trecomiendo-91b8e.firebasestorage.app",
  messagingSenderId: "1007801307346",
  appId: "1:1007801307346:web:8ab34d8deb7886e2549d0b",
  measurementId: "G-9QYTE7JGRH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };