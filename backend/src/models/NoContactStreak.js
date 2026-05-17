const mongoose = require('mongoose');

const NoContactStreakSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    streakDays: { type: Number, default: 0 },
    lastContactAt: { type: Date, default: null },
    lastCheckInAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('NoContactStreak', NoContactStreakSchema);
