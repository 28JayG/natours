const Review = require('../model/reviews.modal');
const catchAsync = require('../utils/catch-async');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();

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
  const review = await Review.create({ ...reviewData, user: req.user._id });

  res.status(201).json({ status: 'success', data: review });
});
