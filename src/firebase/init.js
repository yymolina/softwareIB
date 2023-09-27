import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyDtyFXHGxfEYHvkzyvt7BPRd4f5cPvnyLw",
    authDomain: "software-de-inventario-ede5b.firebaseapp.com",
    projectId: "software-de-inventario-ede5b",
    storageBucket: "software-de-inventario-ede5b.appspot.com",
    messagingSenderId: "440308887269",
    appId: "1:440308887269:web:303a9d7bee1e1cdd8e6e0c"
  };

initializeApp(firebaseConfig);
const db = getFirestore();
export default db


