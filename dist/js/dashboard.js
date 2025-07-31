<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My Profile - PlayForge</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="css/dashboard.css">
</head>
<body>
  <header>
    <h1>My Profile</h1>
    <button onclick="window.location.href='dashboard.html'">Back</button>
  </header>

  <section class="balance-section">
    <h2>Email</h2>
    <div id="userEmail">Loading...</div>
    <h2>Coins</h2>
    <div id="userCoins">Loading...</div>
  </section>

  <script type="module">
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
    import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
    import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

    const emailBox = document.getElementById("userEmail");
    const coinsBox = document.getElementById("userCoins");

    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        window.location.href = "index.html";
      } else {
        emailBox.textContent = user.email;
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          coinsBox.textContent = snap.data().coins ?? "0";
        } else {
          coinsBox.textContent = "0";
        }
      }
    });
  </script>
</body>
</html>
