const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema.Types;

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A blog must have a title'],
    },
    content: {
      type: String,
      required: [true, 'A blog must have a content'],
    },
    cover: {
      type: String,
      required: [true, 'A blog must have a cover image'],
    },
    tags: {
      type: [String],
      required: [true, 'A blog must have tags'],
    },
    images: {
      type: [String],
      default: [],
    },
    author: {
      type: ObjectId,
      ref: 'User',
      required: [true, 'A blog must have a user'],
    },
    comments: [
      {
        type: ObjectId,
        ref: 'Comment',
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

blogSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'author',
    select: 'firstName lastName email',
  });

  next();
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
