const mongoose = require('mongoose');

const setFirstnames = 
    firstnames => {
        return firstnames.map( firstname => {
            const good_format = firstname.trim(); 
            return good_format.charAt(0).toUpperCase() + good_format.slice(1).toLowerCase();
        });
    }


const studentSchema = new mongoose.Schema({
    ine: {
        type: String,
        unique: true
    },
    firstnames: {
        type: [String],
        get: (v) => v.join(','),
    },
    surname: {
        type: String,
        uppercase: true, 
        required: true
    }
});

const dbConnection = require('../controllers/db.controller'); 
const Students = dbConnection.model('Student', studentSchema); 

module.exports.model = Students;