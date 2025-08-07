// fiirebase.js
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push ,get ,set} from "firebase/database";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDExDXM86xZerqOJ5QXwObbIK74hIWsB5Y",
  authDomain: "nonseam-9dc13.firebaseapp.com",
  projectId: "nonseam-9dc13",
  databaseURL: "https://nonseam-9dc13-default-rtdb.firebaseio.com/",
  storageBucket: "nonseam-9dc13.firebasestorage.app",
  messagingSenderId: "851590839234",
  appId: "1:851590839234:web:984db7e1230eed8ddd745b"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, push , get ,set}; 