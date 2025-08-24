const express = require('express'); 
const router = express.Router(); 

const userController = require('./../controllers/user.controller');

router.get('/', userController.list); 
router.get('/schema', userController.schema);
router.get('/schema/category', userController.categoryList);
router.get('/breakdown', userController.breakdown);
router.get('/me', userController.me);
router.get('/iat-results', userController.iatResults);

router.post('/', userController.create);
router.post('/schema/category', userController.categoryCreate);
router.post('/form', userController.formulaire);

router.delete('/reset', userController.reset);
router.delete('/:userId', userController.delete); 
router.delete('/schema/category/:categoryId', userController.categoryDelete);

router.patch('/schema/category/:categoryId', userController.categoryUpdate)
router.patch('/:userId', userController.modify);
router.patch('/iat/:id', userController.iat); 

module.exports = router; 