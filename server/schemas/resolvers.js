const { Book, User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');
const {ObjectId} = require('mongoose').Types

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('savedBooks');
      }
      throw AuthenticationError;
    },
  },



  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },



    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw AuthenticationError;
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw AuthenticationError;
      }

      const token = signToken(user);

      return { token, user };
    },


    saveBook: async (parent, { [authors], description, title, bookId, image, link}, context) => {
      if (context.user) {
    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id},
      { $addToSet:
        { savedBooks: {[authors], description, title, bookId, image, link } }
      },
      { new: true, runValidators: true }
    );

    return updatedUser;
  }
  throw AuthenticationError;
  ('You need to be logged in!');
},


deletBook: async (parent, { bookId }, context) => {
  if (context.user) {
   
    const user = await User.findOneAndUpdate(
       { _id: (context.user._id)},
       { $pull: { savedBooks: { bookId: bookId } } }
      );

  return user ;
}
throw AuthenticationError;
('You need to be logged in!');
},

  },
};

   

module.exports = resolvers;
