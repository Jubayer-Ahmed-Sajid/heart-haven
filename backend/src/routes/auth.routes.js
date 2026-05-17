const router = require('express').Router();
const { createSupportSession } = require('../controllers/auth.controller');

router.post('/session', createSupportSession);

module.exports = router;
