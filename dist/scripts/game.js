import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import {
  getDatabase,
  ref,
  get,
  set,
  push,
  onValue,
  update,
  child
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

import { firebaseConfig } from "../firebase-config.js";

// 🔥 Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// 📌 Variables
let currentUser;
let selectedColor = null;
let roundNumber = 1;
let timer = 25;
let adminControl = false;
let manualWinningColor = null;

// 👤 Auth Check
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    document.getElementById("userEmail").innerText = user.email;
    loadUserData();
    loadAdminSettings();
    startNewRound();
  } else {
    window.location.href = "index.html";
  }
});

// 🎮 User Chooses Color
window.makeChoice = function (color) {
  selectedColor = color;
  alert("You chose " + color);
}

// 🧠 Load Admin Manual Control
function loadAdminSettings() {
  const adminRef = ref(db, "admin");
  onValue(adminRef, (snapshot) => {
    const data = snapshot.val();
    adminControl = data?.manualControl || false;
    manualWinningColor = data?.manualWinningColor || null;
  });
}

// 🪙 Load User Coins
function loadUserData() {
  const userRef = ref(db, "users/" + auth.currentUser.uid);
  onValue(userRef, (snapshot) => {
    if (snapshot.exists()) {
      document.getElementById("userCoins").innerText = snapshot.val().coins || 0;
    }
  });
}

// ⏳ Round Timer
function startNewRound() {
  timer = 25;
  document.getElementById("result").innerText = "New round started!";
  document.getElementById("countdown").innerText = `Next round in: ${timer}s`;
  const interval = setInterval(() => {
    timer--;
    document.getElementById("countdown").innerText = `Next round in: ${timer}s`;
    if (timer <= 0) {
      clearInterval(interval);
      determineWinner();
    }
  }, 1000);
}

// 🎯 Determine Result
function determineWinner() {
  let winningColor = "Red";
  if (adminControl && manualWinningColor) {
    winningColor = manualWinningColor;
  } else {
    const colors = ["Red", "Green", "Violet"];
    winningColor = colors[Math.floor(Math.random() * 3)];
  }

  const roundKey = `round-${Date.now()}`;

  // Save the round to DB
  const roundRef = ref(db, "rounds/" + roundKey);
  set(roundRef, {
    roundId: roundKey,
    winningColor: winningColor,
    choices: {
      [currentUser.uid]: selectedColor || "None"
    },
    timestamp: new Date().toISOString()
  });

  evaluateResult(winningColor);
}

// 🧾 Evaluate Result and Update Coins
function evaluateResult(winningColor) {
  const userRef = ref(db, "users/" + currentUser.uid);
  get(userRef).then((snap) => {
    if (!snap.exists()) return;

    let coins = snap.val().coins || 0;
    let win = selectedColor === winningColor;

    if (selectedColor === null) {
      document.getElementById("result").innerText = `❗ You didn't choose.`;
      return;
    }

    if (win) {
      coins += 20;
      document.getElementById("result").innerText = `🎉 You WON! Winning color: ${winningColor}`;
    } else {
      coins -= 10;
      document.getElementById("result").innerText = `❌ You LOST! Winning color: ${winningColor}`;
    }

    update(userRef, { coins: coins });
    selectedColor = null;

    const logRef = push(ref(db, "history/" + currentUser.uid));
    set(logRef, {
      color: selectedColor,
      win: win,
      result: winningColor,
      time: new Date().toLocaleString()
    });

    setTimeout(() => {
      document.getElementById("result").innerText = "-";
      startNewRound();
    }, 3000);
  });
}

// 🚪 Logout
window.logout = function () {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
};
