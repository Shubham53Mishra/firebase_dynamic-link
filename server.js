require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const linkRoutes = require('./routes/link');
const firebase = require('./firebase'); // Firebase connection

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', linkRoutes);

app.get('/:short', async (req, res) => {
  const Link = require('./models/Link');
  const short = req.params.short;
  const link = await Link.findOne({ short });
  if (link) {
    return res.redirect(link.target);
  } else {
    return res.status(404).send('Link not found');
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
app.post('/generate', async (req, res) => {
  const { target } = req.body;
  if (!target) return res.status(400).json({ error: 'Target URL required' });
  const short = crypto.randomBytes(4).toString('hex');
  const Link = require('./models/Link');
  const link = new Link({ short, target });
  await link.save();
  res.json({ short, target, url: `${req.protocol}://${req.get('host')}/${short}` });
});
