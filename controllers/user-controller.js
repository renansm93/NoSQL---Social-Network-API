const { User, Thought } = require("../models");

module.exports = {
  // get all users
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

   // get user by ID
  async getUserById(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.id })
        .populate({ path: 'thoughts', select: '-__v' })
        .populate({ path: 'friends', select: '-__v' })
        .select('-__v');

      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // create a new user
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

   // update user   
  async updateUser(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.id },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!user) {
        return res.status(404).json({ message: 'No user with this id!' });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Delete a user
  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndDelete({ _id: req.params.id });

      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }

      await Thought.deleteMany({ _id: { $in: user.thoughts } });
      res.json({ message: 'User and thought deleted!' });
    } catch (err) {
      res.status(500).json(err);
    }
  },



};


//  // delete user
//  deleteUser({ params }, res) {
//   User.findOneAndDelete({ _id: params.id })
//     .then((dbUserData) => {
//       if (!dbUserData) {
//         return res.status(404).json({ message: "No user with this id!" });
//       }
//       // BONUS: get ids of user's `thoughts` and delete them all
//       // $in to find specific things
//       return Thought.deleteMany({ _id: { $in: dbUserData.thoughts } });
//     })
//     .then(() => {
//       res.json({ message: "User and associated thoughts deleted!" });
//     })
//     .catch((err) => res.json(err));
// },






