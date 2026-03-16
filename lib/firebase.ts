// Import the functions you need from the SDKs you need
import { FirebaseApp, FirebaseOptions, initializeApp } from "firebase/app";
import { Database, getDatabase } from "firebase/database";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig:FirebaseOptions = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "bot-or-not-688c2.firebaseapp.com",
  projectId: "bot-or-not-688c2",
  storageBucket: "bot-or-not-688c2.firebasestorage.app",
  messagingSenderId:process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const client:FirebaseApp = initializeApp(firebaseConfig);

const chatClient:Database = getDatabase(client);
// const analytics = getAnalytics(app);

export default chatClient;

// npm install firebase