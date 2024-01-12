import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBml5lbBvT2veZpht2SNPItdbTgnFd-mEM",
  authDomain: "videocall-7c82b.firebaseapp.com",
  projectId: "videocall-7c82b",
  storageBucket: "videocall-7c82b.appspot.com",
  messagingSenderId: "371444632623",
  appId: "1:371444632623:web:9173c128bbc6c33e030ada"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export {auth,provider}