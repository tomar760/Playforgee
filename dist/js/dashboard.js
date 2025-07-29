import { auth, db } from "./firebase-config.js";

let currentUser;
let userChoice = null;
let countdown = 25;
let interval;

// 👇 Listen for auth state
auth.onAuthStateChanged(user => {
  if (user) {
    currentUser = user;
    document.getElementById("welcomeUser").innerText = `Hi, ${user.email}`;
    fetchCoins();
    startGameLoop();
  } else {
    window.location.href = "index.html";
  }
});

// 👇 Get user coin balance
function fetchCoins() {
  db.ref(`users/${currentUser.uid}`).on("value", snap => {
    const data = snap.val();
    if (data && data.coins !== undefined) {
      document.getElementById("userCoins").innerText = data.coins;
    }
  });
}

// 👇 Make color choice
window.makeChoice = function(color) {
  userChoice = color;
  document.getElementById("result").innerText = `You selected ${color}`;
}

// 👇 Game loop every 25s
function startGameLoop() {
  interval = setInterval(() => {
    countdown = 25;
    const countdownEl = document.getElementById("countdown");
    const resultEl = document.getElementById("result");
    
    const timer = setInterval(() => {
      countdown--;
      countdownEl.innerText = `Next round in ${countdown}s`;
      if (countdown <= 0) {
        clearInterval(timer);
        const result = generateResult();
        resultEl.innerText = `Winning Color: ${result}`;
        handleResult(result);
        userChoice = null;
      }
    }, 1000);
  }, 25000);
}

// 👇 Random result generator (Admin logic can override this)
function generateResult() {
  const colors = ["Red", "Green", "Violet"];
  return colors[Math.floor(Math.random() * colors.length)];
}

// 👇 Handle win/loss and coin updates
function handleResult(result) {
  if (!userChoice) return;

  db.ref(`users/${currentUser.uid}`).once("value").then(snap => {
    let coins = snap.val().coins || 0;

    if (userChoice === result) {
      coins += 20;
      showResultMessage("You won! +20 coins 🏆", "green");
    } else {
      coins -= 10;
      showResultMessage("You lost! -10 coins ❌", "red");
    }

    db.ref(`users/${currentUser.uid}`).update({ coins });

    const history = {
      time: new Date().toLocaleTimeString(),
      result,
      userChoice,
      win: userChoice === result
    };

    db.ref(`history/${currentUser.uid}`).push(history);
  });
}

// 👇 Show message
function showResultMessage(msg, color) {
  const resultEl = document.getElementById("result");
  resultEl.innerText = msg;
  resultEl.style.color = color;
}

// 👇 Logout
window.logout = function() {
  auth.signOut().then(() => {
    window.location.href = "index.html";
  });
}
