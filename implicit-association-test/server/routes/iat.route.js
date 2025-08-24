const express = require('express');
const router  = express.Router();
const { scoreDistribution } = require('../controllers/iat.controller');

router.get('/iat-results', scoreDistribution);

module.exports = router;
