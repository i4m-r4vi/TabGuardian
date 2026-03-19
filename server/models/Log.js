const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tabletId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tablet', required: true },
  tabletName: { type: String, required: true },
  status: { type: String, enum: ['taken', 'missed'], default: 'taken' },
  imageUrl: { type: String, required: true },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
}, { timestamps: true });

module.exports = mongoose.model('Log', logSchema);
