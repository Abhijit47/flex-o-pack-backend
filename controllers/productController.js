const Product = require('../models/Product');
const Specifications = require('../models/Specification');

// create product
exports.createProduct = async (req, res, next) => {
  try {
    // extract specifications from req.body
    const {
      products,
      noOfTracks,
      weighHeadNos,
      feedingStyle,
      fillingSystem,
      fillingAccuracy,
      sealType,
      fillingRange,
      packingMaterial,
      laminateSpecs,
      lengthOfPouch,
      pouchDimensions,
      powerConsumption,
      compressedAirRequired,
      touchScreen,
      productionOutput,
      weight,
      materialOfChasis,
      hopper,
      conveyor,
      thicknessOfBucket,
      machineSize,
    } = req.body.specifications;

    // extract other fields from req.body
    const { itemName, subCategory, modelNo, coverImage, image, images } =
      req.body;

    // create specifications
    const addSpecifications = await Specifications.create({
      products: products,
      noOfTracks: noOfTracks,
      weighHeadNos: weighHeadNos,
      feedingStyle: feedingStyle,
      fillingSystem: fillingSystem,
      fillingAccuracy: fillingAccuracy,
      sealType: sealType,
      fillingRange: fillingRange,
      packingMaterial: packingMaterial,
      laminateSpecs: laminateSpecs,
      lengthOfPouch: lengthOfPouch,
      pouchDimensions: pouchDimensions,
      powerConsumption: powerConsumption,
      compressedAirRequired: compressedAirRequired,
      touchScreen: touchScreen,
      productionOutput: productionOutput,
      weight: weight,
      materialOfChasis: materialOfChasis,
      hopper: hopper,
      conveyor: conveyor,
      thicknessOfBucket: thicknessOfBucket,
      machineSize: machineSize,
    });

    // create product
    const product = await Product.create({
      itemName,
      subCategory,
      modelNo,
      coverImage,
      image,
      images,
      specifications: addSpecifications._id,
    });

    // send response to client
    return res.status(200).json({
      status: 'success',
      message: 'product created successfully',
      data: product,
      // data: req.body,
    });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: err.message,
    });
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    // find all products
    const products = await Product.find({})
      .lean()
      .populate('specifications', '-_id -createdAt -updatedAt')
      .select('-updatedAt');

    // send response to client
    res.status(200).json({
      status: 'success',
      message: 'All products fetched successfully',
      data: products,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: err.message,
    });
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    // extract id from req.params
    const { id } = req.params;

    // check if id is valid or not
    if (id.length < 24) {
      return res.status(400).json({
        status: 'fail',
        message: 'Bad request, invalid id',
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

    return res.status(200).json({
      status: 'success',
      message: 'Product fetched successfully',
      data: product,
    });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: err.message,
    });
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    // check if id is valid or not
    if (id.length < 24) {
      return res.status(400).json({
        status: 'fail',
        message: 'Bad request, invalid id',
      });
    }

    // extract specifications from req.body
    const {
      products,
      noOfTracks,
      weighHeadNos,
      feedingStyle,
      fillingSystem,
      fillingAccuracy,
      sealType,
      fillingRange,
      packingMaterial,
      laminateSpecs,
      lengthOfPouch,
      pouchDimensions,
      powerConsumption,
      compressedAirRequired,
      touchScreen,
      productionOutput,
      weight,
      materialOfChasis,
      hopper,
      conveyor,
      thicknessOfBucket,
      machineSize,
    } = req.body.specifications;

    // extract other fields from req.body
    const { itemName, subCategory, modelNo, coverImage, image, images } =
      req.body;

    // check if product exists
    const existingProduct = await Product.findById({ _id: id }).lean();

    if (!existingProduct) {
      return res.status(404).json({
        status: 'fail',
        message: 'No product found with this id',
      });
    }

    // update specifications
    await Specifications.findByIdAndUpdate(
      { _id: existingProduct.specifications },
      {
        $set: {
          products,
          noOfTracks,
          weighHeadNos,
          feedingStyle,
          fillingSystem,
          fillingAccuracy,
          sealType,
          fillingRange,
          packingMaterial,
          laminateSpecs,
          lengthOfPouch,
          pouchDimensions,
          powerConsumption,
          compressedAirRequired,
          touchScreen,
          productionOutput,
          weight,
          materialOfChasis,
          hopper,
          conveyor,
          thicknessOfBucket,
          machineSize,
        },
      },
      { new: true }
    );

    // update product
    const updateProduct = await Product.findByIdAndUpdate(
      { _id: existingProduct._id },
      {
        $set: {
          itemName,
          subCategory,
          modelNo,
          coverImage,
          image,
          images,
        },
      },
      { new: true }
    );

    // send response to client
    return res.status(200).json({
      status: 'success',
      message: 'Product updated successfully',
      data: updateProduct,
    });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: err.message,
    });
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    // extract id from req.params
    const { id } = req.params;

    // check if id is valid or not
    if (id.length < 24) {
      return res.status(400).json({
        status: 'fail',
        message: 'Bad request, invalid id',
      });
    }

    // delete product
    const product = await Product.findByIdAndDelete({ _id: id, new: true });

    if (!product) {
      return res.status(404).json({
        status: 'fail',
        message: 'No product found with this id',
      });
    }

    // delete specifications also
    await Specifications.findByIdAndDelete({
      _id: product.specifications,
      new: true,
    });

    // send response to client
    return res.status(200).json({
      status: 'success',
      message: 'Product deleted successfully',
      data: product,
    });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};
