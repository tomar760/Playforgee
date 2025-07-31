import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

// DOM elements (✅ fix kiya yaha)
const balanceText = document.getElementById("coinBalance"); // sahi ID
const logoutBtn = document.getElementById("logoutBtn");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    // Not logged in
    window.location.href = "index.html";
    return;
  }

  const userId = user.uid;
  const userRef = doc(db, "users", userId);

  // ✅ Real-time coin updates
  onSnapshot(userRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      balanceText.textContent = `${data.coins ?? 0} Coins`;
    } else {
      balanceText.textContent = "0 Coins";
    }
  });
});

// ✅ Logout button working
logoutBtn.addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  }).catch((error) => {
    alert("Error logging out: " + error.message);
  });
});
