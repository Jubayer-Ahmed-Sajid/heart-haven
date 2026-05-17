const mongoose = require('mongoose');

const VentPostSchema = new mongoose.Schema(
  {
    alias: { type: String, default: 'Anonymous' },
    body: { type: String, required: true, trim: true, maxlength: 1200 },
    mood: { type: String, default: 'heavy' },
    isAnonymous: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('VentPost', VentPostSchema);
