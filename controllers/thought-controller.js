const { Thought, User } = require("../models");

module.exports = {
  async getAllThoughts(req, res) {
    try {
      const thoughts = await Thought.find({})
        .populate({ path: 'reactions', select: '-__v' })
        .select('-__v');
      res.json(thoughts);
    } catch (err) {
      console.error({ message: err });
      res.status(500).json(err);
    }
  },
};