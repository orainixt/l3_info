const { sendFile } = require('../util/util.js');

const home = (_, res) => sendFile(res, 'index.html');
const openAccess = (_, res) => sendFile(res, 'accesLibre.html');
const protectedAccess = (_, res) => sendFile(res, 'html/admin.html');
const game = (_, res) => sendFile(res, 'html/game.html');
const informationGenerales = (_, res) => sendFile(res, 'html/informationGenerales.html'); 
const supportTechnique = (_, res) => sendFile(res, 'html/supportTechnique.html'); 
const lesSientifiques = (_, res) => sendFile(res, 'html/lesSientifiques.html'); 
const users = (_, res) => sendFile(res, 'html/users.html'); 
const words = (_, res) => sendFile(res, 'html/words.html'); 
const form = (_, res) => sendFile(res, 'html/form.html');
const create_test = (_,res) => sendFile(res, 'html/create_test.html');
const login = (_, res) => sendFile(res , 'html/login.html')

module.exports = {home,openAccess,protectedAccess,game,informationGenerales,supportTechnique,lesSientifiques,users,words,form, create_test, login}; 

