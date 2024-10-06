import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";  
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyClaOTMSBDQVPIL3rg2ZS4cDlCWbThmTqE",
  authDomain: "invoice-app-d2334.firebaseapp.com",
  projectId: "invoice-app-d2334",
  storageBucket: "invoice-app-d2334.appspot.com",
  messagingSenderId: "540661345108",
  appId: "1:540661345108:web:c9d13890178269ce6176c1",
  measurementId: "G-L30N5VWLJD"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore(app);
