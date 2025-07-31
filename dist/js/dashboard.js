import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDcJdokra81YJFijCzH3EvUpgjcbj7P9o0",
  authDomain: "playforgeee.firebaseapp.com",
  projectId: "playforgeee",
  appId: "1:440850239809:web:5795270644cdb1437ed1c0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
  if (!user || sessionStorage.getItem("pinVerified") !== "true") {
    window.location.href = "/auth.html";
  } else {
    document.getElementById("userEmail").textContent = user.email;
  }
});
// dashboard.js
firebase.auth().onAuthStateChanged(user => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  const uid = user.uid;
  const balanceElement = document.getElementById("coinBalance");
  const resultStrip = document.getElementById("resultStrip");

  const userRef = firebase.database().ref("users/" + uid);
  userRef.on("value", snapshot => {
    const data = snapshot.val();
    if (data) {
      balanceElement.innerText = data.coins ?? 0;
    }
  });

  const resultRef = firebase.database().ref("game/results");
  resultRef.limitToLast(20).on("value", snapshot => {
    resultStrip.innerHTML = ""; // clear old
    snapshot.forEach(child => {
      const result = child.val();
      const div = document.createElement("div");
      div.classList.add("result-box", result.winningColor);
      div.textContent = result.winningColor[0].toUpperCase(); // R/G/V
      resultStrip.prepend(div);
    });
  });
});

function logout() {
  firebase.auth().signOut().then(() => {
    window.location.href = "index.html";
  });
}


document.getElementById("logoutBtn").addEventListener("click", async () => {
  await signOut(auth);
  sessionStorage.clear();
  window.location.href = "/auth.html";
});
