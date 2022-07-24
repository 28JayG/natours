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
