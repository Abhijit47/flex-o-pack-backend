const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.route('/sign-up').post(userController.signUp);
router.route('/sign-in').post(userController.signIn);
router.route('/forgot-password').post(userController.forgotPassword);
router.route('/reset-password/:token').post(userController.resetPassword);

module.exports = router;
