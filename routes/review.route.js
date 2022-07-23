const express = require('express');
const ReviewController = require('../controllers/review.controllers');
const AuthController = require('../controllers/auth.controllers');

const router = express.Router();

router
  .route('/')
  .get(ReviewController.getAllReviews)
  .post(
    AuthController.protect,
    AuthController.restrictTo('user'),
    ReviewController.createReview
  );

module.exports = router;
