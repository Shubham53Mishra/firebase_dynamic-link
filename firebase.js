const firebase = require('firebase/app');
require('firebase/auth'); // If you need authentication
require('firebase/firestore'); // If you need Firestore
require('firebase/database'); // If you need Realtime Database
require('firebase/storage');  // If you need Storage

const firebaseConfig = {
  apiKey: "AIzaSyDKTxDcdSkqbMrYzoQ35gZ2fzO-4CEWuPo",
  authDomain: "lifecycle-management-app-459ea.firebaseapp.com",
  databaseURL: "https://lifecycle-management-app-459ea-default-rtdb.firebaseio.com",
  projectId: "lifecycle-management-app-459ea",
  storageBucket: "lifecycle-management-app-459ea.appspot.com",  // ".app" hata ke ".appspot.com"
  messagingSenderId: "226050512443",
  appId: "1:226050512443:android:9c0d2e470cafce19ad2e1e"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

module.exports = firebase;
