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

document.getElementById("logoutBtn").addEventListener("click", async () => {
  await signOut(auth);
  sessionStorage.clear();
  window.location.href = "/auth.html";
});
