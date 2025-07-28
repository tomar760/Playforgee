const firebaseConfig = {
  apiKey: "AIzaSyBnuhWybguIiv0IInLqL4fAz2lUR7KoBHA",
  authDomain: "playforgeee.firebaseapp.com",
  databaseURL: "https://playforgeee-default-rtdb.firebaseio.com",
  projectId: "playforgeee",
  storageBucket: "playforgeee.appspot.com",
  messagingSenderId: "1018790311417",
  appId: "1:1018790311417:web:00c3f038531a7e28c26a9f"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();
