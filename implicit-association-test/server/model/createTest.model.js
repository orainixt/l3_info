categoryPairSchema = require('./categoryPair.model');
const mongoose = require('mongoose');

const createTestSchema = new mongoose.Schema({
    titre : {
        type: String,
        required: true
    },
    categories: [{type: String, required: true}],
    questions : [{type: String, required: true}],
    pair : [categoryPairSchema],
    congruence : [{type : String}]
});

module.exports = createTestSchema;

const dbConnection = require('../controllers/db.controller');
const CreateTestSchema = dbConnection.model('CreateTestSchema',createTestSchema,'createTestSchema');

module.exports.model = CreateTestSchema;