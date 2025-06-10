// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier,signInWithPhoneNumber } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to us
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBD4HcXg3_f19rniAudN-qjsycl-NfPmtQ",
  authDomain: "hostel-project-725c4.firebaseapp.com",
  projectId: "hostel-project-725c4",
  storageBucket: "hostel-project-725c4.firebasestorage.app",
  messagingSenderId: "854343032587",
  appId: "1:854343032587:web:1888bc45aac6f96a4acc0e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const db = getFirestore(app);


export { auth, RecaptchaVerifier,signInWithPhoneNumber };
