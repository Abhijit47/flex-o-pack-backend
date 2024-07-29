const express = require('express');

const authController = require('../middlewares/authMiddleware');
const blogController = require('../controllers/blogController');

const router = express.Router();

router
  .route('/create-blog')
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    blogController.createBlog
  );

router.route('/get-blogs').get(blogController.getBlogs);

router.route('/get-blog/:id').get(blogController.getBlog);

router
  .route('/update-blog/:id')
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    blogController.updateBlog
  );

router
  .route('/delete-blog/:id')
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    blogController.deleteBlog
  );

module.exports = router;
