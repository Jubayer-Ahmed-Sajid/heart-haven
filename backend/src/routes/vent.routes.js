const router = require('express').Router();
const { listVents, createVent } = require('../controllers/vent.controller');

router.get('/', listVents);
router.post('/', createVent);

module.exports = router;
