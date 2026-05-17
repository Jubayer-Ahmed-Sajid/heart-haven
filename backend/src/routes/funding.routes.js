const router = require('express').Router();
const { listFundingMocks } = require('../controllers/funding.controller');

router.get('/mock', listFundingMocks);

module.exports = router;
