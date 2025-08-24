const express = require('express');
const router = express.Router();
const path = require('path');

const controller = require('../controllers/access.controller');

router.get('/login', (req, res) => {
  res.sendFile('login.html', { root: path.join(__dirname, '../public/html') });
});

router.post('/login' , controller.login);
router.post('/logout', controller.logout);

module.exports = router;