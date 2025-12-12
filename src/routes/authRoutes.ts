import { Router } from 'express';
import { authController } from '../controllers/authController';
import { validateLogin } from '../utils/validation';
import { validationResult } from 'express-validator';

const router = Router();

const handleValidationErrors = (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array(),
    });
  }
  next();
};

router.post(
  '/login',
  validateLogin,
  handleValidationErrors,
  authController.login.bind(authController)
);

export default router;

