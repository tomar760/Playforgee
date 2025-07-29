// auth.js

const auth = firebase.auth();
const db = firebase.database();

function showMessage(msg) {
  document.getElementById("status").innerText = msg;
}

function register() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  if (!email || !password) return showMessage("Fill all fields!");

  auth.createUserWithEmailAndPassword(email, password)
    .then(cred => {
      return db.ref("users/" + cred.user.uid).set({
        email,
        coins: 100,
        uid: cred.user.uid
      });
    })
    .then(() => {
      showMessage("Registration successful! Please log in.");
    })
    .catch(error => showMessage(error.message));
}

function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  if (!email || !password) return showMessage("Fill all fields!");

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      window.location.href = "dashboard.html";
    })
    .catch(error => showMessage(error.message));
}
