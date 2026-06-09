import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCeOsh0QCApUiQfwcPeOf8mhsZTxmEgivg",
  appId: "1:875852523536:web:d06ab57ebf086886fe4295",
  authDomain: "summative-4f2ac.firebaseapp.com",
  measurementId: "G-JS87V3JGSP",
  messagingSenderId: "875852523536",
  projectId: "summative-4f2ac",
  storageBucket: "summative-4f2ac.firebasestorage.app",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore };
