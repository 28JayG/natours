const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/app-error');
const globalErrorHandler = require('./controllers/error.controllers');
const tourRouter = require('./routes/tour.route');
const userRouter = require('./routes/user.route');

const app = express();

//middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(` ${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
