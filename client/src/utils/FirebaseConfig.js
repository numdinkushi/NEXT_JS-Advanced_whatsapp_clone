import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyC-ldVJmQmpZn9rdWJEAPYDiNCEfdZCzyw",
    authDomain: "whats-app-clone-b1738.firebaseapp.com",
    projectId: "whats-app-clone-b1738",
    storageBucket: "whats-app-clone-b1738.appspot.com",
    messagingSenderId: "3281367011",
    appId: "1:3281367011:web:d981aefeddc4c2f53dfad6",
    measurementId: "G-FZBXTB7RZJ"
  };

  const app = initializeApp(firebaseConfig);
  export const firebaseAuth = getAuth(app);