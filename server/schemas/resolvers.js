const { Book, User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');
const {ObjectId} = require('mongoose').Types

const resolvers = {
  Query: {
    // user: async (parent, { username }) => {
    //   return User.findOne({ username }).populate('savedBooks');
    // },
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('savedBooks');
      }
      throw AuthenticationError;
    },
    // savedBooks: async (parent, { username }) => {
    //   const params = username ? {ratingAuthor: username} : {};
    //   return Book.find(params).sort({ createdAt: -1 });
    // },
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


    saveBook: async (parent, { authors, description, title, bookId, image, link}, context) => {
    
      console.log(context.user)
    
      if (context.user) {

      const user = await User.findOneAndUpdate(
        { _id: new ObjectId(context.user._id)},
        { $addToSet:
         { savedBooks: {authors, description, title, bookId, image, link } }
        },
        { new: true, runValidators: true }
       );

          return user;
      }
      throw AuthenticationError;
      ('You need to be logged in!');
    },


    removeBook: async (parent, { bookId }, context) => {
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
