const express = require('express');
const userControllers = require('../controllers/user.controllers');
const authController = require('../controllers/auth.controllers');

const router = express.Router();

router.route('/sign-up').post(authController.signUp);
router.route('/login').post(authController.login);
router.patch('/reset-password/:token', authController.resetPassword);
router.post('/forgot-password', authController.forgotPassword);

// this doesn't affect the above routes, only ALL routes below it
router.use(authController.protect);

router.patch('/update-my-password', authController.updatePassword);
router.patch('/update-my-account', userControllers.updateMe);
router.delete('/delete-me', userControllers.deleteMe);

router.route('/me').get(userControllers.getMe, userControllers.getUser);

router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userControllers.getAllUsers)
  .post(userControllers.createUser);

router
  .route('/:id')
  .get(userControllers.getUser)
  .patch(userControllers.updateUser)
  .delete(userControllers.deleteUser);

module.exports = router;
