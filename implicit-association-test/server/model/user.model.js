const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    iatResult: {
        scores: String,         
        reactionTimes: [Number]
  }
}, { strict: false });


module.exports = userSchema;

const dbConnection = require('../controllers/db.controller');
const User = dbConnection.model('User',userSchema,'user');

module.exports.model = User;
