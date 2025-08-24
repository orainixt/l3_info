const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt.config');
const Admin = require('../model/admin.model').model;

const authentication = (req, res, next) => {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, jwtConfig.SECRET_TOKEN);
    req.userId = decoded.id;
    return next();
  } catch (err) {
    console.log(`JWT erreur : ${err.message}`);
    const isFetch = req.headers['sec-fetch-dest'] === 'empty'
                  || req.xhr
                  || req.headers.accept?.includes('application/json');

    if (isFetch) {
      return res.status(401).json({ message: 'Non authentifié' });
    } else {
      return res.redirect('/html/login.html');
    }
  }
};
const adminAuthentication = async (req, res, next) => {
  const admin = await Admin.findById(req.userId);
  if (admin?.superAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Accès refusé : non super-admin" });
  }
}


module.exports = { authentication, adminAuthentication }; 
