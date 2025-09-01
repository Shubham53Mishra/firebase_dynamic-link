const admin = require('firebase-admin');
const serviceAccount = require('./config/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
  // databaseURL: "https://lifecycle-management-app-459ea.firebaseio.com" // (optional, for Realtime DB/Firestore)
});

module.exports = admin;
