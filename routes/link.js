const express = require('express');
const router = express.Router();
const Link = require('../models/Link');
const admin = require('../firebase');
const crypto = require('crypto');

// Middleware to authenticate Firebase ID token
async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized: No token' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
}

// POST /api/generate - create a new short link
router.post('/generate', authenticateToken, async (req, res) => {
  const { target, senderUid, receiverUid } = req.body;
  if (!target || !senderUid) return res.status(400).json({ error: 'Target and senderUid required' });
  const short = crypto.randomBytes(4).toString('hex');
  const link = new Link({ short, target, senderUid, receiverUid: receiverUid || null });
  await link.save();
  res.json({ short, target, senderUid, receiverUid: receiverUid || null, url: `${req.protocol}://${req.get('host')}/${short}` });
});

// GET /api/:short - redirect to target
router.get('/:short', async (req, res) => {
  const short = req.params.short;
  const link = await Link.findOne({ short });
  if (link) {
    res.status(302).set('Location', link.target).send();
  } else {
    res.status(404).send('Link not found');
  }
});

// (Optional) Get all links
router.get('/links', async (req, res) => {
  const links = await Link.find();
  res.json(links);
});

module.exports = router;
