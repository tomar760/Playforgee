auth.onAuthStateChanged(user => {
  if (user) {
    const uid = user.uid;
    db.ref("users/" + uid).on("value", snapshot => {
      const data = snapshot.val();
      document.getElementById("email").innerText = data.email;
      document.getElementById("coins").innerText = data.coins;
    });
  } else {
    window.location.href = "index.html";
  }
});

function startGame() {
  const color = prompt("Choose color: red or green").toLowerCase();
  const result = Math.random() < 0.5 ? "red" : "green";
  const user = auth.currentUser;

  if (user) {
    const uid = user.uid;
    db.ref("users/" + uid).once("value").then(snapshot => {
      let coins = snapshot.val().coins;
      if (coins <= 0) return alert("Not enough coins!");

      if (color === result) {
        coins += 10;
        alert("You won! Result was: " + result);
      } else {
        coins -= 10;
        alert("You lost! Result was: " + result);
      }

      db.ref("users/" + uid).update({ coins });
    });
  }
}

function logout() {
  auth.signOut().then(() => window.location.href = "index.html");
}
