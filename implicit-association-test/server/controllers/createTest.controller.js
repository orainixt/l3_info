const CreateTest = require('../model/createTest.model').model;

/**
 * Creates a new IAT test configuration
 * @async
 * @function createTest
 * @param {Object} req - Express request object
 * @param {Object} req.body - Test configuration data
 * @param {string} req.body.titre - Test title
 * @param {Array<string>} req.body.categories - Categories used in the test
 * @param {Array<string>} req.body.questions - Question types included
 * @param {Array<Object>} req.body.pairs - Category pairs for the test
 * @param {Array<string>} req.body.congruence - Congruent category associations
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Response with status and created test ID
 */
exports.createTest = async (req, res) => {
  try {
    const { titre, categories, questions, pairs, congruence } = req.body;

    const newTest = await CreateTest.create({
      titre,
      categories,
      questions,
      pair: pairs,    
      congruence
    });

    res.status(201).json({ message: 'Test créé avec succès', testId: newTest._id });
  } catch (err) {
    console.error('Erreur création test :', err);
    res.status(500).json({ message: 'Erreur serveur lors de la création du test.' });
  }
};

/**
 * Retrieves all test configurations sorted by creation date
 * @async
 * @function getAllTests
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Array>} List of all test configurations
 */
exports.getAllTests = async (req, res) => {
  try {
    const tests = await CreateTest.find().sort({ createdAt: -1 });
    res.json(tests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des tests.' });
  }
};

/**
 * Retrieves a specific test configuration by ID
 * @async
 * @function getTest
 * @param {Object} req - Express request object
 * @param {string} req.params.id - Test ID
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Complete test configuration
 */
exports.getTest = async (req, res) => {
  try {
    const test = await CreateTest.findById(req.params.id);
    if (!test) return res.status(404).json({ message: 'Test non trouvé.' });
    res.json(test);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération du test.' });
  }
};

/**
 * Deletes a test configuration by ID
 * @async
 * @function deleteTest
 * @param {Object} req - Express request object
 * @param {string} req.params.id - Test ID to delete
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Confirmation message
 */
exports.deleteTest = async (req, res) => {
  try {
    const result = await CreateTest.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Test non trouvé.' });
    res.json({ message: 'Test supprimé.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur lors de la suppression.' });
  }
};