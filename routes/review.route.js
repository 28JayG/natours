const express = require('express');
const ReviewController = require('../controllers/review.controllers');
const AuthController = require('../controllers/auth.controllers');

const router = express.Router({ mergeParams: true });

router.use(AuthController.protect);

router
  .route('/')
  .get(ReviewController.getAllReviews)
  .post(
    AuthController.restrictTo('user'),
    ReviewController.setTourAndUserIds,
    ReviewController.createReview
  );

router
  .route('/:id')
  .get(ReviewController.getAReview)
  .patch(
    AuthController.restrictTo('user', 'admin'),
    ReviewController.updateReview
  )
  .delete(
    AuthController.restrictTo('user', 'admin'),
    ReviewController.deleteReview
  );

module.exports = router;
