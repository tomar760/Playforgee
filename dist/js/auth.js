import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getAuth, setPersistence, browserLocalPersistence,
  signInWithEmailAndPassword, createUserWithEmailAndPassword,
  sendPasswordResetEmail, sendEmailVerification,
  onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import {
  getFirestore, doc, getDoc, setDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

/* Config */
const firebaseConfig = {
  apiKey: "AIzaSyDcJdokra81YJFijCzH3EvUpgjcbj7P9o0",
  authDomain: "playforgeee.firebaseapp.com",
  projectId: "playforgeee",
  appId: "1:440850239809:web:5795270644cdb1437ed1c0"
};
const DASHBOARD_URL = "/dashboard.html";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
await setPersistence(auth, browserLocalPersistence);

/* Elements */
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const loginMsg = document.getElementById("loginMsg");
const registerMsg = document.getElementById("registerMsg");
const loader = document.getElementById("loader");
const pinModal = document.getElementById("pinModal");
const pinCells = document.querySelectorAll(".pin-cell");
const pinSubmit = document.getElementById("pinSubmit");
const pinMsg = document.getElementById("pinMsg");
const pinClear = document.getElementById("pinClear");

/* Switch forms with animation */
document.getElementById("showRegister").onclick = () => {
  loginForm.classList.remove("active");
  registerForm.classList.add("active");
};
document.getElementById("showLogin").onclick = () => {
  registerForm.classList.remove("active");
  loginForm.classList.add("active");
};

/* Login */
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  loader.classList.remove("hidden");
  try {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    const cred = await signInWithEmailAndPassword(auth, email, password);

    if (!cred.user.emailVerified) {
      loginMsg.textContent = "Please verify your email first!";
      await signOut(auth);
      loader.classList.add("hidden");
      return;
    }
    sessionStorage.removeItem("pinVerified");
    await openPinGate(cred.user.uid);
  } catch (err) {
    loginMsg.textContent = err.message;
  } finally {
    loader.classList.add("hidden");
  }
});

/* Register */
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  loader.classList.remove("hidden");
  try {
    const email = document.getElementById("regEmail").value;
    const p1 = document.getElementById("regPassword").value;
    const p2 = document.getElementById("regPassword2").value;
    if (p1 !== p2) {
      registerMsg.textContent = "Passwords do not match!";
      loader.classList.add("hidden");
      return;
    }
    const cred = await createUserWithEmailAndPassword(auth, email, p1);
    await sendEmailVerification(cred.user);
    registerMsg.textContent = "Verification email sent!";
  } catch (err) {
    registerMsg.textContent = err.message;
  } finally {
    loader.classList.add("hidden");
  }
});

/* Forgot password */
document.getElementById("forgotPass").onclick = async () => {
  const email = document.getElementById("loginEmail").value;
  if (!email) {
    loginMsg.textContent = "Enter your email first!";
    return;
  }
  await sendPasswordResetEmail(auth, email);
  loginMsg.textContent = "Password reset email sent!";
};

/* PIN gate */
pinCells.forEach((cell, idx) => {
  cell.addEventListener("input", () => {
    if (cell.value.length && idx < pinCells.length - 1) pinCells[idx + 1].focus();
  });
});
pinClear.addEventListener("click", () => {
  pinCells.forEach(c => (c.value = ""));
  pinCells[0].focus();
});

async function openPinGate(uid) {
  pinModal.classList.remove("hidden");
  const ref = doc(db, "userSecrets", uid);
  const snap = await getDoc(ref);
  pinSubmit.onclick = async () => {
    const pin = Array.from(pinCells).map(c => c.value).join("");
    if (pin.length !== 4) {
      pinMsg.textContent = "Enter 4 digits!";
      return;
    }
    if (!snap.exists()) {
      await setDoc(ref, { pin, createdAt: serverTimestamp() });
      sessionStorage.setItem("pinVerified", "true");
      window.location.href = DASHBOARD_URL;
    } else {
      if (snap.data().pin === pin) {
        sessionStorage.setItem("pinVerified", "true");
        window.location.href = DASHBOARD_URL;
      } else {
        pinMsg.textContent = "Wrong PIN!";
      }
    }
  };
}

onAuthStateChanged(auth, (user) => {
  if (user && sessionStorage.getItem("pinVerified") === "true") {
    window.location.href = DASHBOARD_URL;
  }
});
