import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, setDoc, doc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDcJdokra81YJFijCzH3EvUpgjcbj7P9o0",
  authDomain: "playforgeee.firebaseapp.com",
  projectId: "playforgeee",
  storageBucket: "playforgeee.appspot.com",
  messagingSenderId: "440850239809",
  appId: "1:440850239809:web:5795270644cdb1437ed1c0",
  measurementId: "G-Y8S30GCX80"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // ✅ Create Firestore user doc with default values
    await setDoc(doc(db, "users", user.uid), {
      coins: 100,
      createdAt: serverTimestamp(),
      pin: ""
    });

    alert("Registration successful! Logging you in...");
    window.location.href = "dashboard.html";
  } catch (error) {
    alert("Error: " + error.message);
  }
});
