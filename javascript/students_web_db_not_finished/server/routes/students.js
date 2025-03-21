const express = require('express'); 
const router = express.Router(); 

const studentsController = require('./../controllers/students.controller'); 

router.get('/', studentsController.list); 
router.post('/', studentsController.create);

module.exports = router; 