import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment } 
from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

export const firebaseConfig = {
  apiKey: "AIzaSyCToNn1VqYZrZjjbbBA2KW126ZBso-0D80",
  authDomain: "adtonx-bot.firebaseapp.com",
  projectId: "adtonx-bot",
  storageBucket: "adtonx-bot.firebasestorage.app",
  messagingSenderId: "290170776005",
  appId: "1:290170776005:web:82f88036aa42d080e2c3ac"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export async function getUser(uid) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      balance: 0,
      ads_watched: 0,
      today_earnings: 0,
      created_at: new Date().toISOString()
    });
  }
  return ref;
}
