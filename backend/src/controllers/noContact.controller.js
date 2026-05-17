const NoContactRepository = require('../repositories/noContact.repository');
const { getRandomComfortQuote } = require('../utils/comfortQuotes');

async function getStreak(req, res, next) {
  try {
    const { sessionId } = req.params;
    const streak = await NoContactRepository.findOrCreate(sessionId);
    res.json({ item: streak });
  } catch (error) {
    next(error);
  }
}

async function checkIn(req, res, next) {
  try {
    const { sessionId } = req.params;
    const contactedEx = Boolean(req.body.contactedEx);
    const current = await NoContactRepository.findOrCreate(sessionId);

    const updated = await NoContactRepository.updateCheckIn(
      sessionId,
      contactedEx ? 0 : current.streakDays + 1,
      contactedEx ? new Date() : current.lastContactAt
    );

    res.json({
      item: updated,
      quote: contactedEx ? getRandomComfortQuote() : null,
    });
  } catch (error) {
    next(error);
  }
}

async function weaknessQuote(_req, res) {
  res.json({ quote: getRandomComfortQuote() });
}

module.exports = { getStreak, checkIn, weaknessQuote };
