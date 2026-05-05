import express from 'express';
import { body } from 'express-validator';
import { signup, login } from '../controllers/authController';

const router = express.Router();

router.post(
  '/signup',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Please enter a password with 6 or more characters'),
  ],
  signup
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').exists().withMessage('Password is required'),
  ],
  login
);

export default router;
