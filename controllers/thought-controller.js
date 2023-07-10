const { Thought, User } = require("../models");

module.exports = {
  
  // Get all thoughts
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

  // Get thought by ID
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


  // Create a new thought
  async createThought(req, res) {
    try {
      const userId = req.body.userId;

      // Create a new Thought
      const newThought = await Thought.create(req.body);

      // Check if the newThought is successfully created
      if (!newThought) {
        return res.status(404).json({ message: 'Unable to save thought.' });
      }

      // Update the user with the new thought
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $push: { thoughts: newThought._id } },
        { runValidators: true, new: true }
      );

      // Check if the user is successfully updated
      if (!updatedUser) {
        return res.status(404).json({ message: 'Unable to update user with new thought.' });
      }

      return res.status(200).json({ message: "Thought has been successfully created and added to the user's account." });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  },


    
   // Update thought 
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
          message: 'No thought with this id!',
        });
      }

      res.json({ message: 'Thought deleted!' });
    } catch (err) {
      res.status(500).json(err);
    }
  },



  // Add reaction
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



 // Delete reaction
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



