const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catch-async');
const User = require('../model/users.model');
const AppError = require('../utils/app-error');
const sendEmail = require('../utils/email');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signUp = catchAsync(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    photo: req.body.photo,
    confirmPassword: req.body.confirmPassword,
  });

  const token = signToken(user._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // if email and passwords exist,
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }
  //check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');
  const correct = user
    ? await user.correctPassword(password, user.password)
    : false;

  if (!user || !correct)
    return next(new AppError('Incorrect email or password', 401));

  //if all good send JWT
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) get token and check if it exists
  const { authorization } = req.headers;

  let token;
  if (authorization && authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]; //"Bearer ncuevr;fb" ->["Bearer", "ncuevr;fb"]
  }
  if (!token) return next(new AppError('User not logged in.', 401));

  // 2) validate token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) check user exists
  const user = await User.findById(decoded.id);
  if (!user)
    return next(new AppError('user belonging to token does not exist', 401));

  // 4) check if user has changed password after JWT has been issued
  if (user.changedPasswordAfter(decoded.iat))
    return next(
      new AppError('user recently changed password. Please login again', 401)
    );

  //Grant access to protected route
  req.user = user;
  next();
});

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    // roles ['admin', 'lead-guide']
    const { user } = req;
    if (!roles.includes(user.role))
      return next(new AppError('Permission Denied', 403));

    next();
  };

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) get user on the email
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return next(new AppError('User not found', 404));

  // 2) generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/reset-password/${resetToken}`;
  const message = `Submit a PATCH request in with a new password to: ${resetURL}.`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset email.(valid for 10 minutes)',
      message,
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending email. Try again later')
    );
  }

  res.status(200).json({
    status: 'success',
    message: 'Token sent to email',
  });
});

exports.resetPassword = (req, res, next) => {};
