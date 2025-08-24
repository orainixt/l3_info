const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Admin = require('../model/admin.model').model;
const jwtConfig = require('../config/jwt.config');

/**
 * Handles admin login
 * @async
 * @function login
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Response object with status and message
 * @throws {Error} If authentication fails or server error occurs
 */
exports.login = async(req, res) => {
  try {
      const { login, password } = req.body;
      // find admin by login
      const admin = await Admin.findOne({ login });
      // Validate required admin
      if (!admin) {
        return res.status(401).json({ message: `Utilisateur ${login} inconnu` });
      }
      // Validate required password
      const validPassword = await bcrypt.compare(password, admin.password);
      if (!validPassword) {
        return res.status(401).json({ message: 'Mot de passe incorrect.' });
      }
      // Generate JWT token
      const token = jwt.sign({ id: admin._id }, jwtConfig.SECRET_TOKEN, {
        expiresIn: '1h'
      });

      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 3600000
      });

      res.status(200).json({ message: 'Connexion réussie' });

  } catch (err) {
      console.error("Erreur lors de la connexion :", err);
      res.status(500).json({ message: 'Erreur interne serveur' });
  }
};

/**
 * Handles admin logout
 * @function logout
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response object with status and message
 */
exports.logout = (req, res) => {
  // Clear the authentication cookie
  res.cookie('token', '', { maxAge: 2000, httpOnly: true, sameSite: 'strict' });
  // Optionally invalidate the token on server-side if using token blacklisting
  res.status(200).json({ message: 'utilisateur déconnecté' });
};
