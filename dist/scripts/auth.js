// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA-CJkXLs5iB...YOUR_API_KEY_HERE...",
  authDomain: "playforgeee.firebaseapp.com",
  databaseURL: "https://playforgeee-default-rtdb.firebaseio.com",
  projectId: "playforgeee",
  storageBucket: "playforgeee.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_ID",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);

// REGISTER
document.getElementById("registerBtn").addEventListener("click", () => {
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      alert("✅ Registered Successfully!");
      window.location.href = "dashboard.html";
    })
    .catch(error => {
      alert("❌ " + error.message);
    });
});

// LOGIN
document.getElementById("loginBtn").addEventListener("click", () => {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      alert("✅ Login Successful!");
      window.location.href = "dashboard.html";
    })
    .catch(error => {
      alert("❌ " + error.message);
    });
});
