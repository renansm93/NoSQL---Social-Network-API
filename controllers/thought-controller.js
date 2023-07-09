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

  // get thought by ID
  async getThoughtById(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.id })
        .populate({ path: 'reactions', select: '-__v' })        
        .select('-__v');

      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

    // create a new thought
    async createThought(req, res) {
      try {
        const thought = await Thought.create(req.body);
        res.json(thought);
      } catch (err) {
        res.status(500).json(err);
      }
    },
    
   // update thought 
   async updateThought(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.id },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!thought) {
        return res.status(404).json({ message: 'No thought with this id!' });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Delete a thought
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findOneAndDelete({ _id: req.params.id });
  
      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }

      // BONUS: get ids of user's `thoughts` and delete them all
      // $in to find specific things  
      const user = await User.findOneAndUpdate(
        { thoughts: req.params.id },
        { $pull: { thoughts: req.params.id } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({
          message: 'Thought deleted, but no user found',
        });
      }

      res.json({ message: 'User deleted!' });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // add reaction
  async addReaction({ params, body }, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $addToSet: { reactions: body } },
        { new: true, runValidators: true }
      )

      if (!thought) {
        return res.status(404).json({ message: 'No thought with this id' });
      }

      res.json(thought);

    } catch (err) {
      res.status(500).json(err);
    }
  },

 // delete reaction
 async removeReaction({ params }, res) {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true}
    )

    if (!thought) {
      return res.status(404).json({ message: 'No reaction with this id!' });
    }

    res.json(thought);

  } catch (err) {
    res.status(500).json(err);
  }
},
  
};



  // // delete reaction
  // removeReaction({ params }, res) {
  //   Thought.findOneAndUpdate(
  //     { _id: params.thoughtId },
  //     { $pull: { reactions: { reactionId: params.reactionId } } },
  //     { new: true }
  //   )
  //     .then((dbThoughtData) => res.json(dbThoughtData))
  //     .catch((err) => res.json(err));
  // },
