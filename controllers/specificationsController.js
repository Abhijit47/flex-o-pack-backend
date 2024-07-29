const NodeCache = require('node-cache');

const Specifications = require('../models/specificationModel');
const Product = require('../models/productModel');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Initialize the cache
const SpecificationsCache = new NodeCache({ stdTTL: 3600 });

exports.getSpecifications = catchAsync(async (req, res, next) => {
  // check if the cache has the data
  const cacheKey = 'specifications';
  const cacheValue = SpecificationsCache.get(cacheKey);

  // If the cache has the data, return it
  if (cacheValue) {
    return res.status(200).json({
      status: 'success',
      message: 'Specifications fetched successfully',
      data: cacheValue,
    });
  }

  // If the cache does not have the data, fetch it from the database
  const specifications = await Specifications.find({})
    .lean()
    .select('-updatedAt -createdAt')
    .populate('productId', 'itemName modelNo')
    .exec();

  // If there are no specifications, return an error
  if (!specifications) {
    return next(new AppError('No specifications found', 404));
  }

  // Store the data in the cache
  SpecificationsCache.set(cacheKey, specifications, 3600);

  // Return the data
  return res.status(200).json({
    status: 'success',
    message: 'Specifications fetched successfully',
    data: specifications,
  });
});

exports.updateSpecifications = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { body } = req;

  return res.status(200).json({
    status: 'success',
    message: 'This route is not yet implemented',
  });
});
