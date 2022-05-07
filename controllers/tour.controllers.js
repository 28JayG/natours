const fs = require('fs');
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkId = (req, res, next, val) => {
  if (val * 1 > tours.length) {
    return res.status(404).json({ status: 'fail', message: 'invalid id' });
  }

  next();
};

exports.validateTour = (req, res, next) => {
  const tourData = req.body;

  if (!tourData.price | !tourData.name)
    return res
      .status(400)
      .json({ status: 'fail', message: 'Missing name or price' });

  next();
};

exports.getAllTours = (req, res) => {
  res
    .status(200)
    .json({ status: 'success', results: tours.lenght, data: { tours } });
};

exports.getTour = (req, res) => {
  const { id } = req.params;
  const tour = tours.find((tour) => tour.id === id);

  res.status(200).json({ status: 'success', data: { tour } });
};

exports.createTour = (req, res) => {
  const tourData = req.body;

  res.status(201).json({ status: 'success', data: tourData });
};

exports.updateTour = (req, res) => {
  res.status(200).json({ status: 'success', data: '<Updated tour data>' });
};

exports.deleteTour = (req, res) => {
  res.status(200).json({ status: 'success', data: null });
};
