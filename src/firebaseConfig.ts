import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyC1lHHN6nmrX8y2OLG6rmMJbJ7rnSicbzs",
    authDomain: "my-react-firebase-mobx-app.firebaseapp.com",
    projectId: "my-react-firebase-mobx-app",
    storageBucket: "my-react-firebase-mobx-app.appspot.com",
    messagingSenderId: "291959484682",
    appId: "1:291959484682:web:ee5e64b1504597ef0a0af3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
