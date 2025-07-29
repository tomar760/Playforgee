import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
  onValue,
  get,
  child
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
import { firebaseConfig } from "../firebase-config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Auth check
onAuthStateChanged(auth, (user) => {
  if (user) {
    if (user.email !== "admin@playforge.com") {
      alert("Access denied.");
      window.location.href = "dashboard.html";
    } else {
      loadUserHistory();
    }
  } else {
    window.location.href = "index.html";
  }
});

// Manual color control
window.setColor = function () {
  const selected = document.getElementById("winningColor").value;
  const adminRef = ref(db, "admin");
  set(adminRef, {
    manualControl: selected !== "",
    manualWinningColor: selected
  }).then(() => {
    alert("Winning color updated!");
  });
};

// Logout
window.logout = function () {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
};

// Load recent history (last 5 entries for all users)
function loadUserHistory() {
  const historyRef = ref(db, "history");
  onValue(historyRef, (snapshot) => {
    const historyDisplay = document.getElementById("historyDisplay");
    historyDisplay.innerHTML = "";
    const data = snapshot.val();
    if (data) {
      for (let uid in data) {
        const userLogs = data[uid];
        for (let key in userLogs) {
          const log = userLogs[key];
          const logElement = document.createElement("div");
          logElement.classList.add("history-entry");
          logElement.innerHTML = `
            <strong>User:</strong> ${uid}<br/>
            <strong>Choice:</strong> ${log.color}<br/>
            <strong>Result:</strong> ${log.result}<br/>
            <strong>Win:</strong> ${log.win ? "✅" : "❌"}<br/>
            <strong>Time:</strong> ${log.time}<br/><hr/>
          `;
          historyDisplay.appendChild(logElement);
        }
      }
    } else {
      historyDisplay.innerText = "No game history available yet.";
    }
  });
}
