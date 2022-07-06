// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB1bOH62oJ38juf8iv21mZCoHQ59TSZlBA",
  authDomain: "church-e366e.firebaseapp.com",
  projectId: "church-e366e",
  storageBucket: "church-e366e.appspot.com",
  messagingSenderId: "886610355908",
  appId: "1:886610355908:web:9c39258d8d346424b00b91",
  measurementId: "G-2VS8B3WW1C",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
