const express = require('express');

const authMiddleware = require('../middlewares/authMiddleware');
const productController = require('../controllers/productController');
const specificationsController = require('../controllers/specificationsController');

const router = express.Router();

router.route('/create-product').post(productController.createProduct);

router.route('/get-products').get(productController.getProducts);

router.route('/get-product/:id').get(productController.getProduct);

router.route('/update-product/:id').patch(productController.updateProduct);

router.route('/delete-product/:id').delete(productController.deleteProduct);

router
  .route('/get-specifications')
  .get(specificationsController.getSpecifications);

router
  .route('/update-specifications/:id')
  .patch(specificationsController.updateSpecifications);

module.exports = router;
