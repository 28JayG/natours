const express = require('express');
const ReviewController = require('../controllers/review.controllers');
const AuthController = require('../controllers/auth.controllers');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(ReviewController.getAllReviews)
  .post(
    AuthController.protect,
    AuthController.restrictTo('user'),
    ReviewController.createReview
  );

router
  .route('/:id')
  .patch(ReviewController.updateReview)
  .delete(ReviewController.deleteReview);

module.exports = router;