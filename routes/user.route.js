const express = require('express');
const userControllers = require('../controllers/user.controllers');
const authController = require('../controllers/auth.controllers');

const router = express.Router();

router.route('/sign-up').post(authController.signUp);
router.route('/login').post(authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);
router.patch(
  '/update-my-password',
  authController.protect,
  authController.updatePassword
);
router.patch(
  '/update-my-account',
  authController.protect,
  userControllers.updateMe
);
router.delete('/delete-me', authController.protect, userControllers.deleteMe);

router
  .route('/me')
  .get(authController.protect, userControllers.getMe, userControllers.getUser);

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
