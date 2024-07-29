const NodeCache = require('node-cache');

const Comment = require('../models/commentModel');
const Blog = require('../models/blogModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { isValidId, purgeCache } = require('../utils/helpers');

// Initialize the cache
const commentCache = new NodeCache();

// add comment in global cache
globalThis.commentCache = commentCache;

exports.addComment = catchAsync(async (req, res, next) => {
  const { name, email, commentMessage, website, blogId } = req.body;

  if (!name || !email || !commentMessage || !blogId) {
    return next(new AppError('Please provide all required fields', 400));
  }

  if (!isValidId(blogId)) {
    return next(new AppError('Invalid blog id', 400));
  }

  const comment = await Comment.create({
    name,
    email,
    commentMessage,
    website,
    blog: blogId,
  });

  if (!comment) {
    return next(new AppError('Comment could not be created', 400));
  }

  // set the comment in blog's comments array
  const updatedBlog = await Blog.findOneAndUpdate(
    {
      _id: blogId,
    },
    {
      $push: { comments: comment._id },
    },
    {
      new: true,
    }
  );

  if (!updatedBlog) {
    return next(new AppError('Comment could not be created', 400));
  }

  // clear the cache
  purgeCache(commentCache);

  res.status(201).json({
    status: 'success',
    data: {
      comment,
    },
  });
});

exports.getComments = catchAsync(async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return next(new AppError('Only admin can get comments', 403));
  }

  // check if the comments are in the cache
  const cachedComments = commentCache.get('comments');
  if (cachedComments) {
    return res.status(200).json({
      status: 'success',
      message: 'Comments retrived successfully',
      results: cachedComments.length,
      data: {
        comments: cachedComments,
      },
    });
  }

  // if comments are not in the cache, fetch from the database
  const comments = await Comment.find({})
    .lean()
    .populate('blog', '-updatedAt -createdAt')
    .select('-updatedAt')
    .exec();

  if (!comments) {
    return next(new AppError('Comments could not be found', 404));
  }

  // set the comments in the cache
  commentCache.set('comments', comments);

  return res.status(200).json({
    status: 'success',
    message: 'Comments retrived successfully',
    results: comments.length,
    data: {
      comments,
    },
  });
});

exports.getComment = catchAsync(async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return next(new AppError('Only admin can get a comment', 403));
  }

  const { id } = req.params;

  if (!isValidId(id)) {
    return next(new AppError('Invalid comment id', 400));
  }

  const comment = await Comment.findById({ _id: id })
    .lean()
    .populate('blog', '-updatedAt -createdAt')
    .select('-updatedAt')
    .exec();

  if (!comment) {
    return next(new AppError('Comment could not be found', 404));
  }

  return res.status(200).json({
    status: 'success',
    data: {
      comment,
    },
  });
});

exports.updateComment = catchAsync(async (req, res, next) => {
  return res.status(200).json({
    status: 'success',
    message: 'This route is not yet implemented',
  });
});

exports.deleteComment = catchAsync(async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return next(new AppError('Only admin can delete a comment', 403));
  }

  const { id } = req.params;

  if (!isValidId(id)) {
    return next(new AppError('Invalid comment id', 400));
  }

  const comment = await Comment.findByIdAndDelete({ _id: id });

  if (!comment) {
    return next(new AppError('Comment could not be deleted', 400));
  }

  // remove the comment from the blog's comments array
  const updatedBlog = await Blog.findOneAndUpdate(
    {
      _id: comment.blog,
    },
    {
      $pull: { comments: comment._id },
    },
    {
      new: true,
    }
  );

  if (!updatedBlog) {
    return next(new AppError('Comment could not be deleted', 400));
  }

  // clear the cache
  purgeCache(commentCache);

  res.status(200).json({
    status: 'success',
    message: 'Comment deleted successfully',
    data: comment._id,
  });
});
