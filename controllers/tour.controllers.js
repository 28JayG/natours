const Tour = require('../model/tours.model');
const catchAsync = require('../utils/catch-async');
const APIFeatures = require('../utils/api-features');
const AppError = require('../utils/app-error');
const Factory = require('./handler.factory');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';

  next();
};

exports.getAllTours = async (req, res, next) => {
  //Execute Query
  try {
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const tours = await features.query;

    res
      .status(200)
      .json({ status: 'success', results: tours.length, data: { tours } });
  } catch (err) {
    res.status(400).json({ status: 'fail', results: err });
  }
};

exports.getTour = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const tour = await Tour.findById(id).populate('reviews');

  if (!tour) {
    return next(new AppError('No tour found by that ID', 404));
  }

  res.status(200).json({ status: 'success', data: { tour } });
});

exports.createTour = catchAsync(async (req, res, next) => {
  const tourData = req.body;
  const tour = await Tour.create(tourData);

  res.status(201).json({ status: 'success', data: tour });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedTour) {
    return next(new AppError('No tour found by that ID', 404));
  }

  res.status(201).json({ status: 'success', data: { tour: updatedTour } });
});

// exports.deleteTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndDelete(req.params.id);

//   if (!tour) {
//     return next(new AppError('No tour found by that ID', 404));
//   }

//   res.status(204).json({ status: 'success', data: null });
// });

exports.deleteTour = Factory.deleteOne(Tour);

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: '$difficulty',
        numRating: { $sum: '$ratingsQuantity' },
        numTours: { $sum: 1 },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);

  res.status(200).json({ status: 'success', data: { stats } });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;

  const stats = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numToursStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    { $project: { _id: 0 } },
    {
      $sort: {
        _id: 1,
      },
    },
  ]);

  res.status(200).json({ status: 'success', data: { stats } });
});
