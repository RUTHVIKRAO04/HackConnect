import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // Your Firebase config object goes here
  apiKey: "AIzaSyD74mNIuNAQEx66Ai5e9FK-0AcO_HJdewI",
  authDomain: "hackconnect-80570.firebaseapp.com",
  projectId: "hackconnect-80570",
  storageBucket: "hackconnect-80570.firebasestorage.app",
  messagingSenderId: "62109677210",
  appId: "1:62109677210:web:b7014efd67021e88085123"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 