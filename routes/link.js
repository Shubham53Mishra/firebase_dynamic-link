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

module.exports = router;
