const admin = require('firebase-admin');

// Replace with your Firebase service account JSON
const serviceAccount = require('./config/google-services.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
