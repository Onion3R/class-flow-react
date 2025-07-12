import {getAuth} from "firebase/auth"
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDIATV13rzF42C4dlgyWDVkXKnWQjj15jE",
  authDomain: "classflow-33635.firebaseapp.com",
  projectId: "classflow-33635",
  storageBucket: "classflow-33635.firebasestorage.app",
  messagingSenderId: "150188053891",
  appId: "1:150188053891:web:ad78bdb09c630ef0f352b6",
  measurementId: "G-MZJT5HD21N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app)

export {app, auth};