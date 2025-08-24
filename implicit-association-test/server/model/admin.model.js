const mongoose = require('mongoose');


const adminSchema = new mongoose.Schema({
  login:   { 
    type: String, 
    required: true, 
    unique: true 
    },
  password: { 
    type: String, 
    required: true 
    },
  name:    { 
    type: String, 
    required: true 
    },
  superAdmin: { 
    type: Boolean, 
    default: false 
    }
});
  



module.exports = adminSchema;

const dbConnection = require('../controllers/db.controller');
const Admin = dbConnection.model('Admin',adminSchema,'admin');

module.exports.model = Admin;
