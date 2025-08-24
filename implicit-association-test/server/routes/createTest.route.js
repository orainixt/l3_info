const express = require('express');
const router = express.Router();
const { createTest, getAllTests, getTest, deleteTest } = require('../controllers/createTest.controller');
const { authentication, adminAuthentication } = require('../middlewares/authentication.middleware');

router.get('/tests', getAllTests);
router.get('/tests/:id', getTest); 
router.get('/create-test/:id', getTest);

router.post('/create-test', authentication, adminAuthentication, createTest);

router.delete('/create-test/:id', authentication, adminAuthentication, deleteTest);

module.exports = router;