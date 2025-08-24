const express = require('express');
const router = express.Router();

const { addAdmin, getAdmin } = require('../controllers/admin.controller');
const {authentication} = require('../middlewares/authentication.middleware');
const { adminAuthentication } = require('../middlewares/authentication.middleware');

router.post('/add', authentication, adminAuthentication, addAdmin);
router.get('/me', authentication, getAdmin)

module.exports = router;
