const express = require('express');

const authController = require('../middlewares/authMiddleware');
const commentController = require('../controllers/commentController');

const router = express.Router();

router.route('/add-comment').post(commentController.addComment);

router
  .route('/get-comments')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    commentController.getComments
  );

router
  .route('/get-comment/:id')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    commentController.getComment
  );

router
  .route('/update-comment/:id')
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    commentController.updateComment
  );

router
  .route('/delete-comment/:id')
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    commentController.deleteComment
  );

module.exports = router;
