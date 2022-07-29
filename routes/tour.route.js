const express = require('express');
const TourControllers = require('../controllers/tour.controllers');
const AuthController = require('../controllers/auth.controllers');
const reviewRouter = require('../routes/review.route');
const router = express.Router();

// redirects to review router
router.use('/:tourId/reviews', reviewRouter);

// router.param('id', TourControllers.checkId);
router
  .route('/top-5-cheap')
  .get(TourControllers.aliasTopTours, TourControllers.getAllTours);

router.route('/tours-stats').get(TourControllers.getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    AuthController.protect,
    AuthController.restrictTo('admin', 'lead-guide', 'guide'),
    TourControllers.getMonthlyPlan
  );

router
  .route('/')
  .get(TourControllers.getAllTours)
  .post(
    AuthController.protect,
    AuthController.restrictTo('admin', 'lead-guide'),
    TourControllers.createTour
  );

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(TourControllers.getToursWithin);

router.route('/distances/:latlng/unit/:unit').get(TourControllers.getDistances);

router
  .route('/:id')
  .get(TourControllers.getTour)
  .patch(
    AuthController.protect,
    AuthController.restrictTo('admin', 'lead-guide'),
    TourControllers.updateTour
  )
  .delete(
    AuthController.protect,
    AuthController.restrictTo('admin', 'lead-guide'),
    TourControllers.deleteTour
  );

module.exports = router;
