const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
  short: { type: String, required: true, unique: true },
  target: { type: String, required: true },
  senderUid: { type: String, required: true },
  receiverUid: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Link', linkSchema);
