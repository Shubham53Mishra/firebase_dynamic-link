const express = require('express');
const router = express.Router();
const Link = require('../models/Link');
const crypto = require('crypto');

// POST /api/generate - create a new short link
router.post('/generate', async (req, res) => {
  const { target } = req.body;
  if (!target) return res.status(400).json({ error: 'Target required' });
  const short = crypto.randomBytes(4).toString('hex');
  const link = new Link({ short, target });
  await link.save();
  res.json({ short, target, url: `${req.protocol}://${req.get('host')}/${short}` });
});

// GET /api/:short - redirect to target and add user to family in Firebase (using ID token)
const admin = require('../firebase');
router.get('/:short', async (req, res) => {
  const short = req.params.short;
  const link = await Link.findOne({ short });
  if (!link) {
    return res.status(404).send('Link not found');
  }

  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  let userId = null;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const idToken = authHeader.split(' ')[1];
    try {
      const decoded = await admin.auth().verifyIdToken(idToken);
      userId = decoded.uid;
    } catch (e) {
      return res.status(401).send('Invalid or expired token');
    }
  }

  try {
    // Parse deep link to get familyId and creatorId
    const url = new URL(link.target.replace('dailynest://', 'http://dummy/'));
    const familyId = url.searchParams.get('familyId');
    const creatorId = url.searchParams.get('creatorId');

    if (familyId && creatorId && userId) {
      const familyRef = admin.firestore()
        .collection('users')
        .doc(creatorId)
        .collection('families')
        .doc(familyId);
      const familyDoc = await familyRef.get();
      if (familyDoc.exists) {
        const members = familyDoc.data().members || [];
        if (!members.includes(userId)) {
          await familyRef.update({
            members: admin.firestore.FieldValue.arrayUnion(userId)
          });
        }
      }
    }
  } catch (e) {
    // Ignore errors, still redirect
  }
  res.status(302).set('Location', link.target).send();
});

module.exports = router;
