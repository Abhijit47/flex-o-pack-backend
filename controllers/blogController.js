const NodeCache = require('node-cache');

const Blog = require('../models/blogModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { purgeCache, isValidId } = require('../utils/helpers');

const blogCache = new NodeCache({ stdTTL: 60 * 60 }); // 1 hour

exports.createBlog = catchAsync(async (req, res, next) => {
  const { title, content, cover, tags, images } = req.body;

  if (!title || !content || !cover || !tags) {
    return next(
      new AppError('Please provide title, content, cover and tags', 400)
    );
  }

  // check the admin id from the protect middleware
  // and assign it to the author field
  if (req.user.role !== 'admin') {
    return next(new AppError('Only admin can create a blog', 403));
  }

  const blog = await Blog.create({
    title,
    content,
    cover,
    tags,
    images,
    author: req.user._id,
  });

  if (!blog) {
    return next(new AppError('Blog could not be created', 400));
  }

  // set the blog in user's blogs array
  const user = await User.findOneAndUpdate(
    {
      _id: req.user._id,
    },
    {
      $push: { blogs: blog._id },
    },
    {
      new: true,
    }
  );

  if (!user) {
    return next(new AppError('Blog could not be created', 400));
  }

  // clear the cache
  purgeCache(blogCache);
  purgeCache(userCache);
  purgeCache(commentCache);

  res.status(201).json({
    status: 'success',
    message: 'Blog created successfully',
    data: {
      blog,
    },
  });
});

exports.getBlogs = catchAsync(async (req, res, next) => {
  // check if the blogs are in the cache
  const cacheKey = 'blogs';
  const cachedBlogs = blogCache.get(cacheKey);

  if (cachedBlogs) {
    return res.status(200).json({
      status: 'success',
      results: cachedBlogs.length,
      data: {
        blogs: cachedBlogs,
      },
    });
  }

  // if not in the cache, get the blogs from the database
  const blogs = await Blog.find({})
    .lean()
    .select('-updatedAt')
    .populate('comments', 'name')
    .exec();

  if (!blogs) {
    return next(new AppError('No blogs found', 404));
  }

  // set the blogs in the cache
  blogCache.set(cacheKey, blogs, 60 * 60); // 1 hour

  res.status(200).json({
    status: 'success',
    results: blogs.length,
    data: {
      blogs,
    },
  });
});

exports.getBlog = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!isValidId(id)) {
    return next(new AppError('Please provide a blog id', 400));
  }

  // check if the blog is in the cache
  const cachedKey = `blog-${id}`;
  const cachedBlog = blogCache.get(cachedKey);

  if (cachedBlog) {
    return res.status(200).json({
      status: 'success',
      data: {
        blog: cachedBlog,
      },
    });
  }

  // if not in the cache, get the blog from the database
  const blog = await Blog.findById(id).lean({}).select('-updatedAt');

  if (!blog) {
    return next(new AppError('Blog not found', 404));
  }

  // set the blog in the cache
  blogCache.set(cachedKey, blog, 60 * 60); // 1 hour

  res.status(200).json({
    status: 'success',
    data: {
      blog,
    },
  });
});

exports.updateBlog = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { title, content, cover, tags, images } = req.body;

  if (!isValidId(id)) {
    return next(new AppError('Please provide a blog id', 400));
  }

  if (!title && !content && !cover && !tags) {
    return next(
      new AppError('Please provide title, content, cover and tags', 400)
    );
  }

  // check the admin id from the protect middleware
  // and assign it to the author field
  if (req.user.role !== 'admin') {
    return next(new AppError('Only admin can update a blog', 403));
  }

  // find the existing blog
  const existingBlog = await Blog.findById({ _id: id }).lean();
  if (!existingBlog) {
    return next(new AppError('Blog not found for update', 404));
  }

  const blog = await Blog.findByIdAndUpdate(
    { _id: existingBlog._id },
    {
      title: title || existingBlog.title,
      content: content || existingBlog.content,
      cover: cover || existingBlog.cover,
      tags: tags || existingBlog.tags,
      images: images || existingBlog.images,
      author: req.user._id,
    },
    { new: true }
  );

  if (!blog) {
    return next(new AppError('Blog could not be updated', 400));
  }

  // clear the cache
  purgeCache(blogCache);
  purgeCache(userCache);

  res.status(200).json({
    status: 'success',
    message: 'Blog updated successfully',
    data: {
      blog,
    },
  });
});

exports.deleteBlog = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!isValidId(id)) {
    return next(new AppError('Please provide a blog id', 400));
  }

  // check the admin id from the protect middleware
  // and assign it to the author field
  if (req.user.role !== 'admin') {
    return next(new AppError('Only admin can delete a blog', 403));
  }

  // find the existing blog
  const existingBlog = await Blog.findById({ _id: id }).lean();

  if (!existingBlog) {
    return next(new AppError('Blog not found for delete', 404));
  }

  const blog = await Blog.findByIdAndDelete({ _id: existingBlog._id });

  if (!blog) {
    return next(new AppError('Blog could not be deleted', 400));
  }

  // remove the blog from the user's blogs array
  const userBlogs = await User.findOneAndUpdate(
    {
      _id: req.user._id,
    },
    {
      $pull: { blogs: blog._id },
    },
    {
      new: true,
    }
  );

  if (!userBlogs) {
    return next(new AppError('Blog could not be deleted', 400));
  }

  // clear the cache
  purgeCache(blogCache);
  purgeCache(userCache);

  res.status(200).json({
    status: 'success',
    message: 'Blog deleted successfully',
    data: blog._id,
  });
});

async function deleteAll() {
  const [blogs, users] = await Promise.all([
    Blog.deleteMany(),
    User.deleteMany(),
  ]);

  if (!blogs || !users) {
    return next(new AppError('Blogs and users could not be deleted', 400));
  }

  // clear the cache
  purgeCache(blogCache);

  console.log('Blogs and users deleted successfully');
  console.log(blogs, users);
  console.log('Cache cleared');
  console.log(blogCache.keys());

  return {
    blogs,
    users,
  };
}

// deleteAll();
