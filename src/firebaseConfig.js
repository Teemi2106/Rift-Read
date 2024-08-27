import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA2BHKmok5M1uJty08p3SY-ZhlwhyJ-BRA",
  authDomain: "rift-read.firebaseapp.com",
  projectId: "rift-read",
  storageBucket: "rift-read.appspot.com",
  messagingSenderId: "752870478370",
  appId: "1:752870478370:web:e3034f66ba37393306b07b",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore

export { auth, db };
