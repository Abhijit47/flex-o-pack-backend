const NodeCache = require('node-cache');

const Product = require('../models/productModel');
const Specifications = require('../models/specificationModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { specifications } = require('../utils');
const {
  purgeCache,
  isValidSpecifications,
  isValidId,
} = require('../utils/helpers');

// Initialize cache
const productCache = new NodeCache({ stdTTL: 3600 });

// create product
exports.createProduct = catchAsync(async (req, res, next) => {
  // check specifications array that key are exists in req.body or not
  if (!isValidSpecifications(specifications, req.body.specifications)) {
    return next(new AppError('Invalid specifications', 400));
  }

  // extract other fields from req.body
  const { itemName, subCategory, modelNo, coverImage, image, images } =
    req.body;

  if (
    !itemName &&
    !subCategory &&
    !modelNo &&
    !coverImage &&
    !image &&
    !images
  ) {
    return next(new AppError('Invalid fields', 400));
  }

  // create specifications
  const newSpecifications = await Specifications.create({
    products: req.body.specifications.products,
    noOfTracks: req.body.specifications.noOfTracks,
    weighHeadNos: req.body.specifications.weighHeadNos,
    feedingStyle: req.body.specifications.feedingStyle,
    fillingSystem: req.body.specifications.fillingSystem,
    fillingAccuracy: req.body.specifications.fillingAccuracy,
    sealType: req.body.specifications.sealType,
    fillingRange: req.body.specifications.fillingRange,
    packingMaterial: req.body.specifications.packingMaterial,
    laminateSpecs: req.body.specifications.laminateSpecs,
    lengthOfPouch: req.body.specifications.lengthOfPouch,
    pouchDimensions: req.body.specifications.pouchDimensions,
    powerConsumption: req.body.specifications.powerConsumption,
    compressedAirRequired: req.body.specifications.compressedAirRequired,
    touchScreen: req.body.specifications.touchScreen,
    productionOutput: req.body.specifications.productionOutput,
    weight: req.body.specifications.weight,
    materialOfChasis: req.body.specifications.materialOfChasis,
    hopper: req.body.specifications.hopper,
    conveyor: req.body.specifications.conveyor,
    thicknessOfBucket: req.body.specifications.thicknessOfBucket,
    machineSize: req.body.specifications.machineSize,
  });

  if (!newSpecifications) {
    return next(new AppError('Specifications not created', 400));
  }

  // create product
  const product = await Product.create({
    itemName,
    subCategory,
    modelNo,
    coverImage,
    image,
    images,
    specifications: newSpecifications._id,
  });

  // update specifications with product id
  const updateSpecifications = await Specifications.findByIdAndUpdate(
    { _id: newSpecifications._id },
    {
      $set: { productId: product._id },
    },
    { new: true }
  );

  if (!product || !updateSpecifications) {
    return next(new AppError('Product not created', 400));
  }

  // clear cache
  purgeCache(productCache);

  // send response to client
  return res.status(201).json({
    status: 'success',
    message: 'product created successfully',
    data: product,
    // data: req.body,
  });
});

exports.getProducts = catchAsync(async (req, res, next) => {
  const cachekey = 'products';
  const cachedProducts = productCache.get(cachekey);

  if (cachedProducts) {
    return res.status(200).json({
      status: 'success',
      message: 'All products fetched successfully',
      data: cachedProducts,
    });
  }

  // find all products
  const products = await Product.find({})
    .lean()
    .populate('specifications', '-_id -createdAt -updatedAt')
    .select('-updatedAt');

  // check if products exists
  if (!products) {
    return next(new AppError('No products found', 404));
  }

  // set cache
  productCache.set(cachekey, products, 3600);

  // send response to client
  res.status(200).json({
    status: 'success',
    message: 'All products fetched successfully',
    data: products,
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  // extract id from req.params
  const { id } = req.params;
  if (!isValidId(id)) {
    return next(new AppError('Invalid Id provided', 400));
  }

  const cachekey = `product-${id}`;
  const cachedProduct = productCache.get(cachekey);

  if (cachedProduct) {
    return res.status(200).json({
      status: 'success',
      message: 'Product fetched successfully',
      data: cachedProduct,
    });
  }

  // find product by id
  const product = await Product.findById(id)
    .lean()
    .populate('specifications', '-_id -createdAt -updatedAt')
    .select('-updatedAt');

  // check if product exists
  if (!product) {
    return res.status(404).json({
      status: 'fail',
      message: 'No product found with this id',
    });
  }

  // set cache
  productCache.set(cachekey, product, 3600);

  return res.status(200).json({
    status: 'success',
    message: 'Product fetched successfully',
    data: product,
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // check if id is valid or not
  if (!isValidId(id)) {
    return next(new AppError('Invalid id', 400));
  }

  // extract other fields from req.body
  const { itemName, subCategory, modelNo, coverImage, image, images } =
    req.body;

  if (
    !itemName &&
    !subCategory &&
    !modelNo &&
    !coverImage &&
    !image &&
    !images
  ) {
    return next(new AppError('Invalid update fields', 400));
  }

  // check specifications array that key are exists in req.body or not
  if (!isValidSpecifications(specifications, req.body.specifications)) {
    return next(new AppError('Invalid specifications', 400));
  }

  // extract specifications from req.body
  // const {
  //   products,
  //   noOfTracks,
  //   weighHeadNos,
  //   feedingStyle,
  //   fillingSystem,
  //   fillingAccuracy,
  //   sealType,
  //   fillingRange,
  //   packingMaterial,
  //   laminateSpecs,
  //   lengthOfPouch,
  //   pouchDimensions,
  //   powerConsumption,
  //   compressedAirRequired,
  //   touchScreen,
  //   productionOutput,
  //   weight,
  //   materialOfChasis,
  //   hopper,
  //   conveyor,
  //   thicknessOfBucket,
  //   machineSize,
  // } = req.body.specifications;

  // check if product exists
  const existingProduct = await Product.findById({ _id: id }).lean();

  if (!existingProduct) {
    return next(new AppError('Product not found for update', 404));
  }

  const newSpecifications = {
    products:
      req.body.specifications.products ||
      existingProduct.specifications.products,
    noOfTracks:
      req.body.specifications.noOfTracks ||
      existingProduct.specifications.noOfTracks,
    weighHeadNos:
      req.body.specifications.weighHeadNos ||
      existingProduct.specifications.weighHeadNos,
    feedingStyle:
      req.body.specifications.feedingStyle ||
      existingProduct.specifications.feedingStyle,
    fillingSystem:
      req.body.specifications.fillingSystem ||
      existingProduct.specifications.fillingSystem,
    fillingAccuracy:
      req.body.specifications.fillingAccuracy ||
      existingProduct.specifications.fillingAccuracy,
    sealType:
      req.body.specifications.sealType ||
      existingProduct.specifications.sealType,
    fillingRange:
      req.body.specifications.fillingRange ||
      existingProduct.specifications.fillingRange,
    packingMaterial:
      req.body.specifications.packingMaterial ||
      existingProduct.specifications.packingMaterial,
    laminateSpecs:
      req.body.specifications.laminateSpecs ||
      existingProduct.specifications.laminateSpecs,
    lengthOfPouch:
      req.body.specifications.lengthOfPouch ||
      existingProduct.specifications.lengthOfPouch,
    pouchDimensions:
      req.body.specifications.pouchDimensions ||
      existingProduct.specifications.pouchDimensions,
    powerConsumption:
      req.body.specifications.powerConsumption ||
      existingProduct.specifications.powerConsumption,
    compressedAirRequired:
      req.body.specifications.compressedAirRequired ||
      existingProduct.specifications.compressedAirRequired,
    touchScreen:
      req.body.specifications.touchScreen ||
      existingProduct.specifications.touchScreen,
    productionOutput:
      req.body.specifications.productionOutput ||
      existingProduct.specifications.productionOutput,
    weight:
      req.body.specifications.weight || existingProduct.specifications.weight,
    materialOfChasis:
      req.body.specifications.materialOfChasis ||
      existingProduct.specifications.materialOfChasis,
    hopper:
      req.body.specifications.hopper || existingProduct.specifications.hopper,
    conveyor:
      req.body.specifications.conveyor ||
      existingProduct.specifications.conveyor,
    thicknessOfBucket:
      req.body.specifications.thicknessOfBucket ||
      existingProduct.specifications.thicknessOfBucket,
    machineSize:
      req.body.specifications.machineSize ||
      existingProduct.specifications.machineSize,
  };

  // update specifications
  const updateSpecifications = await Specifications.findByIdAndUpdate(
    { _id: existingProduct.specifications },
    {
      $set: newSpecifications,
    },
    { new: true }
  );

  if (!updateSpecifications) {
    return next(new AppError('Specifications not updated', 400));
  }

  const newProduct = {
    itemName: req.body.itemName || existingProduct.itemName,
    subCategory: req.body.subCategory || existingProduct.subCategory,
    modelNo: req.body.modelNo || existingProduct.modelNo,
    coverImage: req.body.coverImage || existingProduct.coverImage,
    image: req.body.image || existingProduct.image,
    images: req.body.images || existingProduct.images,
  };

  // update product
  const updateProduct = await Product.findByIdAndUpdate(
    { _id: existingProduct._id },
    {
      $set: newProduct,
    },
    { new: true }
  );

  if (!updateProduct) {
    return next(new AppError('Product not updated', 400));
  }

  // send response to client
  return res.status(200).json({
    status: 'success',
    message: 'Product updated successfully',
    data: updateProduct,
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  // extract id from req.params
  const { id } = req.params;

  // check if id is valid or not
  if (!isValidId(id)) {
    return next(new AppError('Invalid id', 400));
  }

  // delete product
  const product = await Product.findByIdAndDelete({ _id: id, new: true });

  if (!product) {
    return next(new AppError('Product not found for delete.', 400));
  }

  // delete specifications also
  const deleteSpecifications = await Specifications.findByIdAndDelete({
    _id: product.specifications,
    new: true,
  });

  if (!deleteSpecifications) {
    return next(new AppError('Specifications not deleted', 400));
  }

  // send response to client
  return res.status(200).json({
    status: 'success',
    message: 'Product deleted successfully',
    data: product._id,
  });
});

// delete all testing products and specifications
async function deleteAll() {
  // delete all products

  const [products, specifications] = await Promise.all([
    Product.deleteMany({}),
    Specifications.deleteMany({}),
  ]);

  if (!products || !specifications) {
    console.log('Products not deleted');
    console.log('Specifications not deleted');
    // return new AppError('Products not deleted', 400);
    console.log('Products', products);
    console.log('Specifications', specifications);
  }
  console.log('Products', products);
  console.log('Specifications', specifications);

  console.log('All products deleted successfully');
  console.log('All specifications deleted successfully');
}

// deleteAll();
