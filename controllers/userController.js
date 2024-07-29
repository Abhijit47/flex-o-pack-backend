const NodeCache = require('node-cache');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Initialize the cache
const userCache = new NodeCache({ stdTTL: 60 * 60 }); // 1 hour

// Set the cache in the global object
globalThis.userCache = userCache;

exports.signUp = catchAsync(async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return next(new AppError('Please provide the required fields', 400));
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
  });

  // Remove the password from the response
  user.toJSON();

  return res.status(201).json({
    status: 'success',
    message: 'User created successfully',
    data: {
      user,
    },
  });
});

exports.signIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide the required fields', 400));
  }

  const user = await User.findOne({ email: email }).select('+password');
  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // Remove the password from the response
  user.toJSON();

  // Generate a token
  const token = user.generateToken();

  return res.status(200).json({
    status: 'success',
    message: 'User signed in successfully',
    data: {
      user,
      token,
    },
  });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {});

exports.resetPassword = catchAsync(async (req, res, next) => {});

exports.getMe = catchAsync(async (req, res, next) => {
  if (!req.user) {
    return next(new AppError('You are not logged in', 401));
  }

  // Check if the user is in the cache
  const userCacheKey = `user_${req.user._id}`;
  const userCached = userCache.get(userCacheKey);

  if (userCached) {
    return res.status(200).json({
      status: 'success',
      message: 'User retrieved successfully',
      data: {
        user: userCached,
      },
    });
  }

  // If not in the cache, get the user from the database
  const user = await User.findById({ _id: req.user._id })
    .lean()
    .select('-updatedAt -createdAt -password')
    .populate('blogs', '-updatedAt -createdAt -author')
    .exec();

  // Remove the password from the response
  // user.toJSON();

  // Set the user in the cache
  userCache.set(userCacheKey, user, 60 * 60); // 1 hour

  return res.status(200).json({
    status: 'success',
    message: 'User retrieved successfully',
    data: {
      user,
    },
  });
});

exports.changeRole = catchAsync(async (req, res, next) => {
  const { role } = req.body;

  if (!role) {
    return next(new AppError('Please provide the required fields', 400));
  }

  const user = await User.findByIdAndUpdate(
    { _id: req.user._id },
    { role: role },
    { new: true }
  )
    .lean()
    .select('-updatedAt -createdAt -password')
    .exec();

  return res.status(200).json({
    status: 'success',
    message: 'User role updated successfully',
    data: {
      user,
    },
  });
});
