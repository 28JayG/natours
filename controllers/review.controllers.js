const Review = require('../model/reviews.modal');
const Factory = require('./handler.factory');

exports.setTourAndUserIds = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  if (!req.body.tour) req.body.tour = req.params.tourId;

  next();
};

exports.getAllReviews = Factory.getAll(Review);

exports.getAReview = Factory.getOne(Review);

exports.createReview = Factory.createOne(Review);

exports.updateReview = Factory.updateOne(Review);

exports.deleteReview = Factory.deleteOne(Review);
