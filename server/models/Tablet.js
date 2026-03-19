const mongoose = require('mongoose');

const tabletSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tabletName: { type: String, required: true },
  scheduleTime: { type: String, required: true },
  frequency: { type: String, default: 'daily' },
}, { timestamps: true });

module.exports = mongoose.model('Tablet', tabletSchema);
