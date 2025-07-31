// js/admin.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

// ✅ Your admin UID here
const adminUID = "04jxGU0m0cMs8TOUF3inSt8tU9u1";

onAuthStateChanged(auth, async (user) => {
  if (!user || user.uid !== adminUID) {
    alert("Unauthorized. Admins only.");
    window.location.href = "index.html";
    return;
  }

  // Load all users
  const usersCol = collection(db, "users");
  const snapshot = await getDocs(usersCol);
  userList.innerHTML = ""; // clear

  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const userId = docSnap.id;

    const card = document.createElement("div");
    card.className = "user-card";
    card.innerHTML = `
      <p><strong>Email:</strong> ${data.email || "N/A"}</p>
      <p><strong>Coins:</strong> <span id="coins-${userId}">${data.coins ?? 0}</span></p>
      <input type="number" id="input-${userId}" placeholder="New coins..." />
      <button onclick="updateCoins('${userId}')">Update</button>
    `;
    userList.appendChild(card);
  });
});

// Logout
logoutBtn.addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
});

// Expose updateCoins globally
window.updateCoins = async (userId) => {
  const input = document.getElementById(`input-${userId}`);
  const newCoins = parseInt(input.value);

  if (isNaN(newCoins)) {
    alert("Please enter a valid number");
    return;
  }

  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { coins: newCoins });

    // Update text instantly
    document.getElementById(`coins-${userId}`).textContent = newCoins;
    input.value = "";
    alert("Coins updated ✅");
  } catch (err) {
    alert("Failed to update coins ❌");
    console.error(err);
  }
};
