// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyAzvf9coRhksEk8Zhcwuw4EVKjJgcQovgY",
  authDomain: "secondmemoryai.firebaseapp.com",
  databaseURL: "https://secondmemoryai-default-rtdb.firebaseio.com",
  projectId: "secondmemoryai",
  storageBucket: "secondmemoryai.firebasestorage.app",
  messagingSenderId: "499193830498",
  appId: "1:499193830498:web:2bde2b78e6d0d94c70053b",
  measurementId: "G-4GQJ2B5W9Q"
};


const firebaseapp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseapp);
export default firebaseapp;
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();