import { body, query, ValidationChain } from 'express-validator';

export const validateCreateOrg = [
  body('organization_name')
    .trim()
    .notEmpty()
    .withMessage('Organization name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Organization name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z0-9\s_-]+$/)
    .withMessage('Organization name can only contain letters, numbers, spaces, hyphens, and underscores'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

export const validateGetOrg = [
  query('organization_name')
    .trim()
    .notEmpty()
    .withMessage('Organization name is required'),
];

export const validateUpdateOrg = [
  body('organization_name')
    .trim()
    .notEmpty()
    .withMessage('Current organization name is required'),
  
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  
  body('new_organization_name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('New organization name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z0-9\s_-]+$/)
    .withMessage('Organization name can only contain letters, numbers, spaces, hyphens, and underscores'),
];

export const validateDeleteOrg = [
  query('organization_name')
    .trim()
    .notEmpty()
    .withMessage('Organization name is required'),
];

export const validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

