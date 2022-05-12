const Tour = require('../model/tours.model');

// exports.validateTour = (req, res, next) => {
//   const tourData = req.body;

//   if (!tourData.price | !tourData.name)
//     return res
//       .status(400)
//       .json({ status: 'fail', message: 'Missing name or price' });

//   next();
// };

exports.getAllTours = async (req, res) => {
  try {
    //Build Query
    // 1) filtering
    const queryObject = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObject[el]);

    // 2) filtering advanced
    let queryStr = JSON.stringify(queryObject);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    const query = Tour.find(JSON.parse(queryStr));

    //Execute Query
    const Tour = await query;

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
