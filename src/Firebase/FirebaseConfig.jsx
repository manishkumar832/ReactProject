
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDC82HZmDRAZIpDLbYASr7LcCGcFbvDw4o",
  authDomain: "venueverse-8b04f.firebaseapp.com",
  projectId: "venueverse-8b04f",
  storageBucket: "venueverse-8b04f.firebasestorage.app",
  messagingSenderId: "333467366479",
  appId: "1:333467366479:web:920cfec9f85990d7a8663a",
  measurementId: "G-N7ZLX3BE2Z"
};


const app = initializeApp(firebaseConfig);
export const authentication=getAuth(app)
export const db=getFirestore(app)