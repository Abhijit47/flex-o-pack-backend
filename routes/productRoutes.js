const { ClerkExpressWithAuth } = require('@clerk/clerk-sdk-node');
const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

router.route('/create-product').post(productController.createProduct);

router.route('/get-products').get(productController.getProducts);

router.route('/get-product/:id').get(productController.getProduct);

router.route('/update-product/:id').patch(productController.updateProduct);

router.route('/delete-product/:id').delete(productController.deleteProduct);

module.exports = router;
