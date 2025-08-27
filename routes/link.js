const express = require('express');
const router = express.Router();
const Link = require('../models/Link');

// Create a short link
router.post('/shorten', async (req, res) => {
  const { target } = req.body;
  const short = Math.random().toString(36).substring(2, 8);
  try {
    const link = new Link({ short, target });
    await link.save();
    res.json({ short, target });
  } catch (err) {
    res.status(500).json({ error: 'Could not create link' });
  }
});

// Get all links
router.get('/links', async (req, res) => {
  const links = await Link.find();
  res.json(links);
});

module.exports = router;
