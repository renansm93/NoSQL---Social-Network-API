const { User, Thought } = require("../models");

module.exports = {
  async getAllUser(req, res) {
    try {
      const users = await User.find({})
        .populate({ path: 'friends', select: '-__v' })
        .select('-__v');
      res.json(users);
    } catch (err) {
      console.error({ message: err });
      res.status(500).json(err);
    }
  },
};