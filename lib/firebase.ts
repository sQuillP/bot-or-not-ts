// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from "firebase/app";
import { Database, getDatabase } from "firebase/database";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAz89h_lacO0R1ZbHv3axZ-v0NsQJIfCKY",
  authDomain: "bot-or-not-493301.firebaseapp.com",
  projectId: "bot-or-not-493301",
  storageBucket: "bot-or-not-493301.firebasestorage.app",
  messagingSenderId: "226385038659",
  appId: "1:226385038659:web:60c24f149c01aa958ff3f6",
  measurementId: "G-0H4ZVK15T1"
};

// Initialize Firebase
const client:FirebaseApp = initializeApp(firebaseConfig);

const chatClient:Database = getDatabase(client);
// const analytics = getAnalytics(app);

export default chatClient;

// npm install firebase