const express = require('express');
const router = express.Router();
const Link = require('../models/Link');

// Create a short link with Firebase Auth
const admin = require('../firebase-admin');
router.post('/shorten', async (req, res) => {
  const { target } = req.body;
  const idToken = req.headers.authorization?.split('Bearer ')[1];
  if (!idToken) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    // Verify Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    // Token is valid, create short link
    const short = Math.random().toString(36).substring(2, 8);
    const link = new Link({ short, target });
    await link.save();
    res.json({ short, target, uid: decodedToken.uid });
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
});

// Get all links
router.get('/links', async (req, res) => {
  const links = await Link.find();
  res.json(links);
});

module.exports = router;
