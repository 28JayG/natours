const User = require('../model/users.model')
const catchAsync = require('../utils/catch-async')

exports.getAllUsers = catchAsync(async (req,res,next) => {
  const users = await User.find();

  res
    .status(200)
    .json({ status: 'success', results: users.lenght, data: { tours: users } });
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

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'route not defined',
  });
};
