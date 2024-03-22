const Product = require('../models/Product');

// create product
exports.createProduct = async (req, res, next) => {
  try {
    const {
      itemName,
      subCategory,
      modelNo,
      coverImage,
      image,
      images,
      specifications,
    } = req.body;

    const product = await Product.create({
      itemName,
      subCategory,
      modelNo,
      coverImage,
      image,
      images,
      specifications,
    });

    specifications.set('products', specifications.products);

    return res.status(200).json({
      status: 'success',
      message: 'product created successfully',
      data: product,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ status: 'fail', message: 'Internal server error' });
  }
};
