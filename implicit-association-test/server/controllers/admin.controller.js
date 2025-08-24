const bcrypt = require('bcrypt');
const Admin = require('../model/admin.model').model;

/**
 * Creates a new admin (super-admin only)
 * @async
 * @function addAdmin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Response object with status and message
 * @throws {Error} If authorization fails or server error occurs
 */
const addAdmin = async (req, res) => {
  try {
    const superAdminId = req.userId;
    const superAdmin = await Admin.findById(superAdminId);
    if (!superAdmin || !superAdmin.superAdmin)
      return res.status(403).json({ message: "Accès réservé au super-admin" });

    const { login, password, name } = req.body;

    const existing = await Admin.findOne({ login });
    if (existing) return res.status(409).json({ message: "Login déjà utilisé" });

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new Admin({ login, password: hashedPassword, name, superAdmin: false });
    await newAdmin.save();

    res.status(201).json({ message: "Nouvel admin ajouté avec succès" });

  } catch (err) {
    console.error("Erreur ajout admin :", err);
    res.status(500).json({ message: "Erreur interne" });
  }
};

/**
 * Gets admin profile information
 * @async
 * @function getAdmin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Response object with admin data
 * @throws {Error} If admin not found or server error occurs
 */
const getAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.userId);
    if (!admin) return res.status(404).json({ message: 'Admin introuvable' });

    res.status(200).json({
      login: admin.login,
      name: admin.name,
      superAdmin: admin.superAdmin
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération de l'admin" });
  }
};

module.exports =  {addAdmin, getAdmin}; ;
