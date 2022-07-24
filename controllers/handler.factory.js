const AppError = require('../utils/app-error');
const catchAsync = require('../utils/catch-async');

/** Model is a mongoose mongodb model */
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    //doc any document of a particular model
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found by that ID', 404));
    }

    res.status(204).json({ status: 'success', data: null });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const updatedDoc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedDoc) {
      return next(new AppError('No document found by that ID', 404));
    }

    res.status(201).json({ status: 'success', data: { doc: updatedDoc } });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({ status: 'success', data: doc });
  });

exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    let query = Model.findById(id);
    if (populateOptions) query.populate(populateOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found by that ID', 404));
    }

    res.status(200).json({ status: 'success', data: { doc } });
  });

