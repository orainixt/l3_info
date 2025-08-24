
const express = require('express');
const controller     = require('../controllers/index.controller');
const {authentication} = require('../middlewares/authentication.middleware');

const router = express.Router();

router.get('/',       controller.home);
router.get('/game',       controller.game);
router.get('/informationGenerales',       controller.informationGenerales);
router.get('/supportTechnique',       controller.supportTechnique);
router.get('/lesSientifiques',       controller.lesSientifiques);
router.get('/form',             controller.form);
router.get('/users',authentication       ,controller.users);
router.get('/words', authentication      ,controller.words);
router.get('/form', controller.form);
router.get('/admin',  authentication, controller.protectedAccess);
router.get('/create_test', controller.create_test);
router.get('/login' , controller.login);

module.exports = router;
