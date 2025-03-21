const mongoose = require('mongoose'); 

const setGroupBoundaries = 
    (value) => {
        return  Math.min(6, Math.max(1, value))
    };

const groupSchema = new mongoose.Schema({
    group: {
        type: Number,
        required: true,
        set: setGroupBoundaries
    }, 
    studentId: {
        type: mongoose.ObjectId, 
        required: true
    }
});

module.exports = groupSchema; 

const dbConnection = require('../controllers/db.controller'); 
const Groups = dbConnection.model('Group', groupSchema); 

module.exports.model = Groups;