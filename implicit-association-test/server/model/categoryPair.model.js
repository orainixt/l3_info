const mongoose = require('mongoose');


const categoryPairSchema = new mongoose.Schema({
    left : {
      type : String,
      required : true
   },
    right : {
    type : String,
    required : true
   }
});



module.exports = categoryPairSchema;

const dbConnection = require('../controllers/db.controller');
const CategoryPairSchema = dbConnection.model('CategoryPairSchema',categoryPairSchema,'categoryPairSchema');

