// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
   authDomain: "mearn-blog-aa5ab.firebaseapp.com",
   projectId: "mearn-blog-aa5ab",
   storageBucket: "mearn-blog-aa5ab.appspot.com",
   messagingSenderId: "138849061552",
   appId: "1:138849061552:web:086c2b81b30de5d1aec975",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
