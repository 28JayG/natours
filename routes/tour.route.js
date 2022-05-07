const express = require('express');
const TourControllers = require('../controllers/tour.controllers');

const router = express.Router();

router.param('id', TourControllers.checkId);

router
  .route('/')
  .get(TourControllers.getAllTours)
  .post(TourControllers.validateTour, TourControllers.createTour);

router
  .route('/:id')
  .get(TourControllers.getTour)
  .patch(TourControllers.updateTour)
  .delete(TourControllers.deleteTour);

module.exports = router;
