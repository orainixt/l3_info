const Users = require('./../model/user.model').model;
const Category = require('./../model/category.model').model;

/**
 * list all users from the dB 
 * uses fetch 
 */
module.exports.list = async (_, res) => {
  try {
    const allUsers = await Users.find();
    console.log(`=> users : ${allUsers}`);
    res.status(200).json(allUsers);
  } catch (error) {
    console.error('=> error while retrieving users');
    res.status(500).json({ error: 'fetch users error' });
  }
};

/**
 * create a new user using request parameters 
 * @param {Request} req - the request of the server
 * @param {Response} res -the response sent back to server 
 */
module.exports.create = async (req, res) => {
  const newUserData = { ...req.body };
  try {
    console.log(`${newUserData} in createUser()`);
    const createdUser = await Users.create(newUserData);
    res.status(200).json(createdUser);
  } catch (error) {
    console.error('=> error while creating user');
    res.status(500).json({ error: 'create user error' });
  }
};

/**
 * remove user using ID passed through request parameters
 * @param {Request} req - the request of the server
 * @param {Response} res -the response sent back to server 
 */
module.exports.delete = async (req, res) => {
  const userId = req.params.userId;
  try {
    await Users.findByIdAndDelete(userId);
    console.log(`=> user ${userId} deleted`);
    res.sendStatus(204);
  } catch (error) {
    console.error(`=> error while deleting user with ID ${userId}`);
    res.status(500).json({ error: 'delete user error' });
  }
};

/**
 * modify user using ID passed through request parameters 
 * @param {Request} req - the request of the server
 * @param {Response} res -the response sent back to server 
 */
module.exports.modify = async (req, res) => {
  const userData = { ...req.body };
  const userId = req.params.userId;
  try {
    const user = await Users.findByIdAndUpdate(
      userId,
      userData,
      { new: true }
    );
    console.log(`=> user with ID ${userId} modified`);
    res.status(200).json(user);
  } catch (error) {
    console.error(`=> error while updating user with ID ${userId}`);
    res.status(500).json({ error: 'update user error' });
  }
};

/**
 * create a category in the Category dB using request parameters 
 * name - name of the category (ex : age)
 * type - type of the category (ex : Int) 
 * allowedValues - list of user-selectable values 
 * @param {Request} req - the request of the server 
 * @param {Response} res -the response sent back to server 
 */
module.exports.categoryCreate = async (req, res) => {
  try {
    const { name, type, formNumber, allowedValues = [] } = req.body;
    const cat = await Category.create({ name, type, formNumber, allowedValues });
    res.status(201).json(cat);
  } catch (e) {
    console.error('=> error while creating category', e);
    res.status(400).json({ error: e.message });
  }
};
/**
 * list all categories in the Category dB 
 * @param {Request} req - the request of the server
 * @param {Response} res -the response sent back to server 
 */
module.exports.categoryList = async (req, res) => {
  try {
    const cats = await Category.find();
    res.status(200).json(cats);
  } catch (e) {
    console.error('=> error fetching categories', e);
    res.status(500).json({ error: e.message });
  }
};
/**
 * update existing category using ID passed through request parameters 
 * @param {Request} req - the request of the server
 * @param {Response} res -the response sent back to server 
 */
module.exports.categoryUpdate = async (req, res) => {
  try {
    const { name, type, allowedValues } = req.body;
    const updateData = { name, type };
    if (Array.isArray(allowedValues)) {
      updateData.allowedValues = allowedValues;
    }
    const cat = await Category.findByIdAndUpdate(
      req.params.categoryId,
      updateData,
      { new: true, runValidators: true }
    );
    if (!cat) return res.status(404).json({ error: 'Catégorie non trouvée' });
    res.status(200).json(cat);
  } catch (e) {
    console.error('=> error while updating category', e);
    res.status(400).json({ error: e.message });
  }
};

/**
 * delete category using ID passed through request parameters
 * @param {Request} req - the request of the server
 * @param {Response} res - the response sent back to server 
 */
module.exports.categoryDelete = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.categoryId);
    console.log(`=> category ${req.params.categoryId} deleted`);
    res.sendStatus(204);
  } catch (e) {
    console.error('=> error while deleting category', e);
    res.status(500).json({ error: e.message });
  }
};

/**
 * Gets the application schema including static and dynamic fields
 * @async
 * @function schema
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Schema definition with fields, types, and allowed values
 */
module.exports.schema = async (req, res) => {
  try {
    const staticPaths = Object
      .keys(Users.schema.paths)
      .filter(p => !['_id', '__v'].includes(p));


    const cats = await Category.find();
    const dynamicNames = cats.map(c => c.name);

    const fields = staticPaths.concat(dynamicNames);

    const types = {};
    staticPaths.forEach(p => {
      if (p === 'iatResult.scores') {
        types[p] = 'String';
      } else {
        const schemaType = Users.schema.paths[p];
        const inst = schemaType.instance === 'Array'
          ? schemaType.caster.instance
          : schemaType.instance;
        types[p] = inst;
      }
    });
    cats.forEach(c => {
      types[c.name] = c.type;
    });

    const allowedValues = cats.reduce((obj, c) => {
      obj[c.name] = c.allowedValues;
      return obj;
    }, {});

    allowedValues['iatResult.scores'] = [];

    return res.status(200).json({ fields, types, allowedValues });
  } catch (e) {
    console.error('=> error building schema', e);
    return res.status(500).json({ error: e.message });
  }
};

/**
 * Gets breakdown statistics for a specific category
 * @async
 * @function breakdown
 * @param {Object} req - Express request object
 * @param {string} req.query.category - Category to analyze
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Breakdown statistics
 */
module.exports.breakdown = async (req, res) => {
  const category = req.query.category;
  if (!category) return res.status(400).json({ error: 'Catégorie requise' });

  try {
    const users = await Users.find();
    const breakdown = {};

    users.forEach(user => {
      const value = category.includes('.')
        ? category.split('.').reduce((o,k) => o?.[k], user)
        : user[category];

      if (value != null) {
        breakdown[value] = (breakdown[value]||0) + 1;
      }
    });

    res.json({ breakdown });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

/**
 * Resets all user data 
 * @async
 * @function reset
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Operation result
 */
module.exports.reset = async (req, res) => {
  try {
    await Users.deleteMany({});
    console.log('✅ Tous les utilisateurs ont été supprimés');
    res.status(200).json({ message: 'Tous les utilisateurs ont été supprimés' });
  } catch (e) {
    console.error('Erreur lors de la suppression des utilisateurs', e);
    res.status(500).json({ error: 'Erreur lors de la réinitialisation des utilisateurs' });
  }
};

/**
 * Handles form submission from users
 * @async
 * @function formulaire
 * @param {Object} req - Express request object
 * @param {Object} req.body - Form data
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Created user ID
 */
module.exports.formulaire = async(req, res) =>{
  try {
    const newUser = await Users.create(req.body);
    return res.status(201).json({ _id: newUser._id });
  } catch (e) {
    console.error('Erreur lors du formulaire des utilisateurs', e);
    return res.status(500).json({ error: 'Erreur lors du formulaire des utilisateurs' });
  }
}

/**
 * Stores IAT test results for a user
 * @async
 * @function iat
 * @param {Object} req - Express request object
 * @param {string} req.params.id - User ID
 * @param {number} req.body.score - IAT test score
 * @param {Array} req.body.reactionTimes - Reaction time data
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Operation result
 */
module.exports.iat = async(req, res) =>{
  try {
    const userId = req.params.id;
    const { score, reactionTimes } = req.body;
    const updated = await Users.findByIdAndUpdate(
      userId,
      {
        $set: {
          'iatResult.scores': score,
          'iatResult.reactionTimes': reactionTimes
        }
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    return res.status(200).json({
      message:   'Résultat IAT enregistré',
      iatResult: updated.iatResult
    });
  } catch (e) {
    console.error("Erreur lors de l'enregistrement IAT", e);
    return res.status(500).json({ error: "Erreur lors de l'enregistrement IAT" });
  }
}

/**
 * Gets current authenticated admin's profile
 * @async
 * @function me
 * @param {Object} req - Express request object
 * @param {string} req.userId - Authenticated user ID
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} User profile
 */
exports.me = async (req, res) => {
  try {
    const user = await Users.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    return res.status(200).json({
      id:   user._id,
      name: user.name,   
      superAdmin: user.admin   
    });
  } catch (e) {
    console.error('Erreur userController.me', e);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}

/**
 * Gets aggregated IAT test results
 * @async
 * @function iatResults
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} IAT results distribution
 */
exports.iatResults = async (req, res) => {
  try {
    const users = await Users.find({ 'iatResult.scores': { $exists: true } });

    const dist = users.reduce((acc, u) => {
      const s = u.iatResult.score;
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    }, {});

    const labels = Object.keys(dist).sort((a, b) => {
      const na = isNaN(a) ? a : +a;
      const nb = isNaN(b) ? b : +b;
      return na < nb ? -1 : na > nb ? 1 : 0;
    });

    const data = labels.map(l => dist[l]);

    return res.json({ labels, data });
  } catch (err) {
    console.error('Erreur iatResults:', err);
    return res.status(500).json({ message: 'Impossible de récupérer les iat-results' });
  }
};