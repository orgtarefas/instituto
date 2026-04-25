import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    doc, 
    getDoc, 
    getDocs, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    query, 
    where,
    setDoc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyA9ZmwCeOiZZ6zQHLlMk-lk5cHjRD8tDQo",
    authDomain: "acord-918da.firebaseapp.com",
    projectId: "acord-918da",
    storageBucket: "acord-918da.firebasestorage.app",
    messagingSenderId: "225286517086",
    appId: "1:225286517086:web:ea88ca0585446bf8b09fcf"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { 
    db, 
    auth, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    setDoc
};