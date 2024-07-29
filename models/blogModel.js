const { Schema, model } = require('mongoose');

const { ObjectId } = Schema.Types;

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'A blog must have a title'],
    },
    content: {
      type: String,
      required: [true, 'A blog must have a content'],
    },
    author: {
      type: ObjectId,
      ref: 'User',
      required: [true, 'A blog must have a user'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Blog = model('Blog', blogSchema);

module.exports = Blog;
