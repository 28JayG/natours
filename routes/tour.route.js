const express = require('express');
const TourControllers = require('../controllers/tour.controllers');
const AuthController = require('../controllers/auth.controllers');

const router = express.Router();

// router.param('id', TourControllers.checkId);
router
  .route('/top-5-cheap')
  .get(TourControllers.aliasTopTours, TourControllers.getAllTours);

router.route('/tours-stats').get(TourControllers.getTourStats);
router.route('/monthly-plan/:year').get(TourControllers.getMonthlyPlan);

router
  .route('/')
  .get(AuthController.protect, TourControllers.getAllTours)
  .post(TourControllers.createTour);

router
  .route('/:id')
  .get(TourControllers.getTour)
  .patch(TourControllers.updateTour)
  .delete(TourControllers.deleteTour);

module.exports = router;
