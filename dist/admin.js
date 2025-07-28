function updateCoins() {
  const uid = document.getElementById("userId").value;
  const coins = parseInt(document.getElementById("coins").value);
  db.ref("users/" + uid).update({ coins }).then(() => {
    document.getElementById("status").innerText = "Coins updated!";
  }).catch(err => {
    document.getElementById("status").innerText = err.message;
  });
}
