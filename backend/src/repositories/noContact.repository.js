const NoContactStreak = require('../models/NoContactStreak');

class NoContactRepository {
  findOrCreate(sessionId) {
    return NoContactStreak.findOneAndUpdate(
      { sessionId },
      { $setOnInsert: { sessionId } },
      { new: true, upsert: true }
    );
  }

  updateCheckIn(sessionId, streakDays, lastContactAt = null) {
    return NoContactStreak.findOneAndUpdate(
      { sessionId },
      { $set: { streakDays, lastCheckInAt: new Date(), lastContactAt } },
      { new: true, upsert: true }
    );
  }
}

module.exports = new NoContactRepository();
