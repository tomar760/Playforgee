// firebase-config.js
const firebaseConfig = {
  apiKey: "AIzaSyDcJdokra81YJFijCzH3EvUpgjcbj7P9o0",
  authDomain: "playforgeee.firebaseapp.com",
  projectId: "playforgeee",
  DatabaseURL: "https://playforgeee-default-rtdb.firebaseio.com",
  storageBucket: "playforgeee.appspot.com",
  messagingSenderId: "440850239809",
  appId: "1:440850239809:web:5795270644cdb1437ed1c0",
  measurementId: "G-Y8S30GCX80"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();
