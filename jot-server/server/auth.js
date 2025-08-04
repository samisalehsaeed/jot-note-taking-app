import { initializeApp } from "firebase/app";
import {getAuth,signInAnonymously,onAuthStateChanged} from "firebase/auth";
import dotenv from "dotenv";
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};


const auth = getAuth();
const app = initializeApp(firebaseConfig);

signInAnonymously(auth).then(()=>{
    console.log("User is signed in")
}).catch ((error)=>{
    console.error("Error")
})

onAuthStateChanged(auth,(user)=>{
    if(user){
        const uid = user.uid
        console.log(uid)
    } else {
        console.log("User is not signed in")
    }
})


export {app,auth};

