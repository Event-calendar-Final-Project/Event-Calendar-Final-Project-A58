// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBGJPCK8ls9saRdc7Q1Vrtg3z_24rgBRsw",
  authDomain: "event-calendar-47f95.firebaseapp.com",
  projectId: "event-calendar-47f95",
  storageBucket: "event-calendar-47f95.appspot.com",
  messagingSenderId: "55947550436",
  appId: "1:55947550436:web:555c51a9ab46a6604a96f1",
  databaseURL: "https://event-calendar-47f95-default-rtdb.europe-west1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// the Authentication handler
export const auth = getAuth(app);
// the Realtime Database handler
export const db = getDatabase(app);