import { Router } from 'express';
import { orgController } from '../controllers/orgController';
import { authenticate } from '../middleware/auth';
import {
  validateCreateOrg,
  validateGetOrg,
  validateUpdateOrg,
  validateDeleteOrg,
} from '../utils/validation';
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
  '/create',
  validateCreateOrg,
  handleValidationErrors,
  orgController.createOrganization.bind(orgController)
);

router.get(
  '/get',
  validateGetOrg,
  handleValidationErrors,
  orgController.getOrganization.bind(orgController)
);

router.put(
  '/update',
  validateUpdateOrg,
  handleValidationErrors,
  orgController.updateOrganization.bind(orgController)
);

router.delete(
  '/delete',
  authenticate,
  validateDeleteOrg,
  handleValidationErrors,
  orgController.deleteOrganization.bind(orgController)
);

export default router;

