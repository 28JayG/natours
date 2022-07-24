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
    ReviewController.setTourAndUserIds,
    ReviewController.createReview
  );

router
  .route('/:id')
  .get(ReviewController.getAReview)
  .patch(ReviewController.updateReview)
  .delete(ReviewController.deleteReview);

module.exports = router;
