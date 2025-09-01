
const express = require('express');
const router = express.Router();
const admin = require('../firebase');
require('dotenv').config();

// POST /api/generate-dynamic-link
router.post('/generate-dynamic-link', async (req, res) => {
  const { familyId, creatorId } = req.body;
  const deepLink = creatorId
    ? `dailynest://invite?familyId=${familyId}&creatorId=${creatorId}`
    : `dailynest://invite?familyId=${familyId}`;

  // Firebase Dynamic Links REST API endpoint
  const apiUrl = `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${process.env.FIREBASE_API_KEY}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dynamicLinkInfo: {
          domainUriPrefix: process.env.FIREBASE_DYNAMIC_LINK_DOMAIN,
          link: deepLink
        }
      })
    });
    const data = await response.json();
    if (data.shortLink) {
      res.json({ shortLink: data.shortLink });
    } else {
      res.status(500).json({ error: 'Failed to generate dynamic link', details: data });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error generating dynamic link', details: error.message });
  }
});

module.exports = router;
