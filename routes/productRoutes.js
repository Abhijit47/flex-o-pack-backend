const express = require('express');

const authController = require('../middlewares/authMiddleware');
const productController = require('../controllers/productController');
const specificationsController = require('../controllers/specificationsController');

const router = express.Router();

router
  .route('/create-product')
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    productController.createProduct
  );

router.route('/get-products').get(productController.getProducts);

router.route('/get-product/:id').get(productController.getProduct);

router
  .route('/update-product/:id')
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    productController.updateProduct
  );

router
  .route('/delete-product/:id')
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    productController.deleteProduct
  );

router
  .route('/get-specifications')
  .get(specificationsController.getSpecifications);

router
  .route('/update-specifications/:id')
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    specificationsController.updateSpecifications
  );

module.exports = router;
