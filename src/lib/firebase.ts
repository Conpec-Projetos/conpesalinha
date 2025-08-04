// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA7JNHkmWJD4WpUQqgTVbBpfrGykp60ABo",
  authDomain: "salinha-e4c32.firebaseapp.com",
  projectId: "salinha-e4c32",
  storageBucket: "salinha-e4c32.firebasestorage.app",
  messagingSenderId: "764733492296",
  appId: "1:764733492296:web:095815943df72e78109c7d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { app, db };