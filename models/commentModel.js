const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema.Types;

const commentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A comment must have a name'],
    },
    email: {
      type: String,
      required: [true, 'A comment must have an email'],
    },
    commentMessage: {
      type: String,
      required: [true, 'A comment must have a message'],
    },
    website: {
      type: String,
      default: 'n/a',
    },
    blog: {
      type: ObjectId,
      ref: 'Blog',
      required: [true, 'A comment must have a blog'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'blog',
    select: 'title cover tags author images createdAt',
  });
  next();
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
