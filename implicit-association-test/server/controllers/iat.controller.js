const User = require('../model/user.model').model;

exports.scoreDistribution = async (req, res) => {
  try {
    const users = await User.find({ 'iatResult.scores': { $exists: true } }, 'iatResult.scores');
    const dist = users.reduce((acc, { iatResult }) => {
      const s = iatResult.scores;
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    }, {});
    const labels = Object.keys(dist);
    const data   = labels.map(l => dist[l]);
    res.json({ labels, data });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Impossible de charger la distribution des scores' });
  }
};
