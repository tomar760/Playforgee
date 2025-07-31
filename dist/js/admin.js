// js/admin.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Firebase config
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
const db = getFirestore(app);

const userList = document.getElementById("userList");
const logoutBtn = document.getElementById("logoutBtn");

// ✅ Replace with your real admin UID
const adminUID = "04jxGU0m0cMs8TOUF3inSt8tU9u1";

onAuthStateChanged(auth, async (user) => {
  if (!user || user.uid !== adminUID) {
    alert("Unauthorized access. Admins only.");
    window.location.href = "index.html";
    return;
  }

  // Fetch all users
  const usersCol = collection(db, "users");
  const snapshot = await getDocs(usersCol);

  snapshot.forEach(doc => {
    const data = doc.data();
    const div = document.createElement("div");
    div.className = "user-card";
    div.innerHTML = `
      <strong>Email:</strong> ${data.email || "N/A"}<br>
      <strong>Coins:</strong> ${data.coins ?? 0}
    `;
    userList.appendChild(div);
  });
});

logoutBtn.addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
});
