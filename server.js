require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const linkRoutes = require('./routes/link');
const admin = require('./firebase'); // Use the same admin instance for auth
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

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', linkRoutes);

app.get('/:short', async (req, res) => {
  const Link = require('./models/Link');
  const short = req.params.short;
  const link = await Link.findOne({ short });
  if (link) {
    res.status(302).set('Location', link.target).send();
  } else {
    res.status(404).send('Link not found');
  }
});

const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected successfully');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Endpoint to generate new short links
const crypto = require('crypto');
app.post('/generate', authenticateToken, async (req, res) => {
  const { target, senderUid, receiverUid } = req.body;
  if (!target || !senderUid || !receiverUid) return res.status(400).json({ error: 'Target, senderUid, receiverUid required' });
  const short = crypto.randomBytes(4).toString('hex');
  const Link = require('./models/Link');
  const link = new Link({ short, target, senderUid, receiverUid });
  await link.save();
  res.json({ short, target, senderUid, receiverUid, url: `${req.protocol}://${req.get('host')}/${short}` });
});
