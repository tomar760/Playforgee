import { firebaseConfig } from "./firebase-config.js";
firebase.initializeApp(firebaseConfig);

const db = firebase.database();
const user = firebase.auth().currentUser;

let currentColor = null;
let countdown = 25;
let timer;
let interval;
let userId;
let manualResult = null;

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    userId = user.uid;
    document.getElementById("welcome").innerText = `Welcome to PlayForge`;
    startGameLoop();
  } else {
    window.location.href = "index.html";
  }
});

function getRandomColor() {
  const colors = ["Red", "Green", "Violet"];
  return colors[Math.floor(Math.random() * colors.length)];
}

function setResultManually(color) {
  manualResult = color;
  db.ref("admin/manualResult").set({
    color: color,
    timestamp: Date.now()
  });
  alert(`Manual result set to ${color}`);
}

window.setManualResult = setResultManually;

function startGameLoop() {
  interval = setInterval(() => {
    countdown--;
    document.getElementById("timer").innerText = countdown;

    if (countdown === 0) {
      countdown = 25;
      playGameRound();
    }
  }, 1000);
}

function playGameRound() {
  // Step 1: Check if manual result is set
  db.ref("admin/manualResult").once("value", (snap) => {
    const data = snap.val();
    if (data && Date.now() - data.timestamp < 25000) {
      currentColor = data.color;
    } else {
      currentColor = getRandomColor();
    }

    // Step 2: Store result in DB
    const roundId = Date.now();
    db.ref("results/" + roundId).set({
      color: currentColor,
      time: roundId,
    });

    // Step 3: Check user bet
    db.ref("users/" + userId).once("value", (snapshot) => {
      const userData = snapshot.val();
      const userBet = userData.currentBet;

      let resultText = "";
      let coinChange = 0;

      if (userBet === currentColor) {
        coinChange = 20;
        resultText = `You WON! 🎉 +20 Coins`;
      } else {
        coinChange = -10;
        resultText = `You LOST! ❌ -10 Coins`;
      }

      const newCoin = (userData.coins || 0) + coinChange;

      // Update user coins and history
      db.ref("users/" + userId).update({
        coins: newCoin,
        currentBet: null,
      });

      db.ref("users/" + userId + "/history/" + roundId).set({
        bet: userBet,
        result: currentColor,
        time: roundId,
        change: coinChange
      });

      document.getElementById("result").innerText = `Winning Color: ${currentColor}\n${resultText}`;
      document.getElementById("coins").innerText = `Coins: ${newCoin}`;
    });
  });
}

window.placeBet = function (color) {
  db.ref("users/" + userId).update({
    currentBet: color,
  });
  alert("Bet placed: " + color);
};
