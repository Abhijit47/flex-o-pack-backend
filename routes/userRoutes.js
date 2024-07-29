const express = require('express');

const authMiddleware = require('../middlewares/authMiddleware');
const userController = require('../controllers/userController');

const router = express.Router();

router.route('/sign-up').post(userController.signUp);

router.route('/sign-in').post(userController.signIn);

router.route('/forgot-password').post(userController.forgotPassword);

router.route('/reset-password/:token').post(userController.resetPassword);

router
  .route('/get-me')
  .get(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin', 'moderator', 'user'),
    userController.getMe
  );

router
  .route('/change-role')
  .patch(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    userController.changeRole
  );

module.exports = router;
