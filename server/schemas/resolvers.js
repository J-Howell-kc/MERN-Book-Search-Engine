const { Thought } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const resolvers = {
  Query: {
    Me: async (parent, args, context) => {
      const foundUser = await User.findOne({
        _id: context.user._id,
      });
      return foundUser;
    },
  },

  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError("Invalid Credentials.");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Invalid Credentials.");
      }
      const token = signToken(user);
      return { token, user };
    },
    addUser: async (parent, args) => {
      const user = await User.create(args);

      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, { bookData }, context) => {
      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: bookData } },
          { new: true, runValidators: true }
        );
        return updatedUser;
      } catch (err) {
        console.log(err);
        throw new AuthenticationError("Invalid Credentials.");
      }
    },
    removeBook: async (parent, { bookId}, context) => {
      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $pull: { savedBooks: { bookId} } },
        { new: true }
      );
      if (!updatedUser) {
        throw new AuthenticationError("Invalid Credentials.");
      }
      return updatedUser;
    },
  },
};

module.exports = resolvers;
