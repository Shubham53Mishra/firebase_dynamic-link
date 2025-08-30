const firebase = require('firebase/app');
require('firebase/auth'); // If you need authentication
require('firebase/firestore'); // If you need Firestore
require('firebase/database'); // If you need Realtime Database
require('firebase/storage');  // If you need Storage

const firebaseConfig = {
  apiKey: "AIzaSyBisoTANGdB8to8jWonfKFSwBYiWpB9v1Q",
  authDomain: "dailynest-e2487.firebaseapp.com",
  databaseURL: "https://dailynest-e2487-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "dailynest-e2487",
  storageBucket: "dailynest-e2487.firebasestorage.app",
  messagingSenderId: "435420807936",
  appId: "1:435420807936:android:ea967b1d797980311d69e5"
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);

module.exports = firebase;
