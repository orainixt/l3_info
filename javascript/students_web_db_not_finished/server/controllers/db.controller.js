
const mongoose = require('mongoose'); 
const dbURI = require('../config/db.config').DB_URI;
const dbConnection = mongoose.createConnection(dbURI);
module.exports = dbConnection;
dbConnection.on('connected',
    () => console.log(`db.controller.js : connected to ${dbURI}`)
  );
  dbConnection.on('disconnected',
    () => console.log(`db.controller.js : disconnected from ${dbURI}`)
  );
  dbConnection.on('error',
    err => console.log(`db.controller.js : connection error ${err} `)
  );
const shutdown = async msg => {    // fonction pour
  await dbConnection.close();     // fermer proprement la connexion
  console.log(` Mongoose shutdown : ${msg}`);
  process.exit(0);
}
process.on('SIGINT', () => shutdown('application ends') ); // application killed (Ctrl+c)
process.on('SIGTERM', () => shutdown('SIGTERM received') ); // process killed (POSIX)