const Review = require('../model/reviews.modal');
const catchAsync = require('../utils/catch-async');
const Factory = require('./handler.factory');

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

exports.setTourAndUserIds = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  if (!req.body.tour) req.body.tour = req.params.tourId;

  next();
};

exports.getAReview = Factory.getOne(Review);

exports.createReview = Factory.createOne(Review);

exports.updateReview = Factory.updateOne(Review);

exports.deleteReview = Factory.deleteOne(Review);
