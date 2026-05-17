const router = require('express').Router();

router.use('/auth', require('./auth.routes'));
router.use('/vents', require('./vent.routes'));
router.use('/resources', require('./resource.routes'));
router.use('/no-contact', require('./noContact.routes'));
router.use('/support', require('./support.routes'));
router.use('/funding', require('./funding.routes'));

module.exports = router;
