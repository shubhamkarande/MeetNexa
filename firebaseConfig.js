// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAJunZ3zW5GHfpeRAE_52Mbxbv-p9eAm7w",
  authDomain: "meetnexa-meetings.firebaseapp.com",
  projectId: "meetnexa-meetings",
  storageBucket: "meetnexa-meetings.firebasestorage.app",
  messagingSenderId: "225672249017",
  appId: "1:225672249017:web:52022d96cd613fff1fa568"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
