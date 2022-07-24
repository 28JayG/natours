const User = require('../model/users.model');
const AppError = require('../utils/app-error');
const catchAsync = require('../utils/catch-async');
const Factory = require('./handler.factory');

const filterObj = (body, ...allowedFields) => {
  const newObj = {};

  Object.keys(body).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = body[el];
  });

  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res
    .status(200)
    .json({ status: 'success', results: users.length, data: { users } });
});

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'route not defined',
  });
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'route not defined',
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'route not defined',
  });
};

exports.deleteUser = Factory.deleteOne(User);

exports.updateMe = catchAsync(async (req, res, next) => {
  // create error if user posts password data
  if (req.body.password || req.body.passwordConfirm)
    return next(new AppError('This route is not for updating password', 400));

  // filter only required fields,
  const filteredObject = filterObj(req.body, 'name', 'email');
  // update user document
  const newUser = await User.findByIdAndUpdate(req.user._id, filteredObject, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: newUser,
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  const newUser = await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(200).json({
    status: 'success',
    data: null,
  });
});
