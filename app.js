const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/app-error');
const globalErrorHandler = require('./controllers/error.controllers');
const tourRouter = require('./routes/tour.route');
const userRouter = require('./routes/user.route');
const reviewRouter = require('./routes/review.route');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
//serving static files
app.use(express.static(path.join(__dirname, 'public')));

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Limit for requests passed, try again after 1 hour!',
});

//middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//set security limit to api calling
app.use('/api', limiter);
//set security http header
app.use(helmet());
//reading data from body
app.use(express.json());
//data sanitization against noSQL query injection
app.use(mongoSanitize());
// data sanitization against XSS
app.use(xss());
// prevent parameter pollution
app.use(
  hpp({
    whitelist: ['duration'],
  })
);
//custom middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.get('/', (req, res) => {
  res.status(200).render('base');
});

//routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
