const router = require('express').Router();
const { getStreak, checkIn, weaknessQuote } = require('../controllers/noContact.controller');

router.get('/:sessionId', getStreak);
router.post('/:sessionId/check-in', checkIn);
router.get('/:sessionId/weak', weaknessQuote);

module.exports = router;
