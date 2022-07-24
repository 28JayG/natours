const Review = require('../model/reviews.modal');
const catchAsync = require('../utils/catch-async');
const Factory = require('./handler.factory')

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };

  reviews = await Review.find(filter);

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  const reviewData = req.body;
  const review = await Review.create({
    ...reviewData,
    user: reviewData.user ?? req.user._id,
    tour: reviewData.tour ?? req.params.tourId,
  });

  res.status(201).json({ status: 'success', data: review });
});

exports.deleteReview = Factory.deleteOne(Review)