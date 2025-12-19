// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "contest-hub-a11.firebaseapp.com",
    projectId: "contest-hub-a11",
    storageBucket: "contest-hub-a11.firebasestorage.app",
    messagingSenderId: "900866099136",
    appId: "1:900866099136:web:181d1f2df559087925aa25"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);