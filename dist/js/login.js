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

/* Firebase Config */
const firebaseConfig = {
  apiKey: "AIzaSyDcJdokra81YJFijCzH3EvUpgjcbj7P9o0",
  authDomain: "playforgeee.firebaseapp.com",
  projectId: "playforgeee",
  appId: "1:440850239809:web:5795270644cdb1437ed1c0"
};
const DASHBOARD_URL = "/dashboard.html";

/* Init */
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
await setPersistence(auth, browserLocalPersistence);

/* Elements */
const loginBox = document.getElementById("loginBox");
const registerBox = document.getElementById("registerBox");
const statusMsg = document.getElementById("status-message");
const loader = document.getElementById("loader");

const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");

const pinModal = document.getElementById("pinModal");
const pinCells = document.querySelectorAll(".pin-cell");
const pinSubmit = document.getElementById("pinSubmit");
const pinClear = document.getElementById("pinClear");
const pinMsg = document.getElementById("pinMsg");
const pinTitle = document.getElementById("pinTitle");

/* Switch forms */
document.getElementById("showRegister").onclick = () => {
  loginBox.classList.add("hidden");
  registerBox.classList.remove("hidden");
  statusMsg.innerText = "";
};
document.getElementById("showLogin").onclick = () => {
  registerBox.classList.add("hidden");
  loginBox.classList.remove("hidden");
  statusMsg.innerText = "";
};

/* Login */
loginBtn.addEventListener("click", async () => {
  loader.classList.remove("hidden");
  try {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    const cred = await signInWithEmailAndPassword(auth, email, password);

    if (!cred.user.emailVerified) {
      statusMsg.innerText = "Please verify your email first!";
      await signOut(auth);
      loader.classList.add("hidden");
      return;
    }
    sessionStorage.removeItem("pinVerified");
    await openPinGate(cred.user.uid);

  } catch (err) {
    statusMsg.innerText = err.message;
  } finally {
    loader.classList.add("hidden");
  }
});

/* Register */
registerBtn.addEventListener("click", async () => {
  loader.classList.remove("hidden");
  try {
    const email = document.getElementById("regEmail").value;
    const p1 = document.getElementById("regPassword").value;
    const p2 = document.getElementById("regPassword2").value;

    if (p1 !== p2) {
      statusMsg.innerText = "Passwords do not match!";
      loader.classList.add("hidden");
      return;
    }
    const cred = await createUserWithEmailAndPassword(auth, email, p1);
    await sendEmailVerification(cred.user);
    statusMsg.innerText = "Verification email sent! Check inbox.";
    registerBox.classList.add("hidden");
    loginBox.classList.remove("hidden");
  } catch (err) {
    statusMsg.innerText = err.message;
  } finally {
    loader.classList.add("hidden");
  }
});

/* PIN Gate */
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
  const ref = doc(db, "userSecrets", uid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    pinTitle.innerText = "Enter your 4-digit PIN";
  } else {
    pinTitle.innerText = "Set your 4-digit PIN";
  }

  pinModal.classList.remove("hidden");

  pinSubmit.onclick = async () => {
    const pin = Array.from(pinCells).map(c => c.value).join("");
    if (pin.length !== 4) {
      pinMsg.innerText = "Enter 4 digits!";
      return;
    }
    if (!snap.exists()) {
      const hashed = await hashPIN(pin);
      await setDoc(ref, { pin: hashed, createdAt: serverTimestamp() });
      sessionStorage.setItem("pinVerified", "true");
      window.location.href = DASHBOARD_URL;
    } else {
      if (await verifyPIN(pin, snap.data().pin)) {
        sessionStorage.setItem("pinVerified", "true");
        window.location.href = DASHBOARD_URL;
      } else {
        pinMsg.innerText = "Wrong PIN!";
      }
    }
  };
}

/* Hashing */
async function hashPIN(pin) {
  const enc = new TextEncoder();
  const digest = await crypto.subtle.digest("SHA-256", enc.encode(pin));
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, "0")).join("");
}
async function verifyPIN(pin, savedHash) {
  const hash = await hashPIN(pin);
  return hash === savedHash;
}

/* Guard */
onAuthStateChanged(auth, (user) => {
  if (user && sessionStorage.getItem("pinVerified") === "true") {
    window.location.href = DASHBOARD_URL;
  }
});
