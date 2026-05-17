const router = require('express').Router();
const { listResources } = require('../controllers/resource.controller');

router.get('/', listResources);

module.exports = router;
