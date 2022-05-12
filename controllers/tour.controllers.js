const Tour = require('../model/tours.model');
const APIFeatures = require('../utils/api-features');

exports.aliasTopTours = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';

  next();
};

exports.getAllTours = async (req, res) => {
  try {
    //Execute Query
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const tours = await features.query;

    res
      .status(200)
      .json({ status: 'success', results: tours.lenght, data: { tours } });
  } catch (error) {
    res.status(404).json({ status: 'fail', message: error });
  }
};

exports.getTour = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const tour = await Tour.findById(id);

    res.status(200).json({ status: 'success', data: { tour } });
  } catch (error) {
    res.status(404).json({ status: 'fail', message: error });
  }
};

exports.createTour = async (req, res) => {
  try {
    const tourData = req.body;
    const tour = await Tour.create(tourData);

    res.status(201).json({ status: 'success', data: tour });
  } catch (error) {
    res.status(400).jsno({ status: 'fail', message: err });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(201).json({ status: 'success', data: { tour: updatedTour } });
  } catch (error) {
    res.status(400).jsno({ status: 'fail', message: err });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    res.status(400).jsno({ status: 'fail', message: err });
  }
};
