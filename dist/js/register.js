import {
  createUserWithEmailAndPassword,
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  setDoc,
  doc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Auth & Firestore setup assumed
const auth = getAuth();
const db = getFirestore();

// Your register function
const handleRegister = async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 👇 Firestore me user data banao
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      coins: 100,
      createdAt: serverTimestamp()
    });

    // 👇 Email verify
    await sendEmailVerification(user);
    alert("Registered! Verify your email and then login.");
    window.location.href = "index.html";

  } catch (error) {
    alert("Error: " + error.message);
  }
};
