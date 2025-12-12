import { Request, Response, NextFunction } from 'express';
import { orgService } from '../services/orgService';
import { NotFoundError, ConflictError, ValidationError } from '../utils/errors';
import { AuthRequest } from '../middleware/auth';

export class OrgController {
  async createOrganization(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { organization_name, email, password } = req.body;

      const organization = await orgService.createOrganization(
        organization_name,
        email,
        password
      );

      res.status(201).json({
        success: true,
        message: 'Organization created successfully',
        data: {
          organizationName: organization.organizationName,
          collectionName: organization.collectionName,
          createdAt: organization.createdAt,
        },
      });
    } catch (error: any) {
      if (error.message.includes('already exists')) {
        next(new ConflictError(error.message));
      } else {
        next(error);
      }
    }
  }

  async getOrganization(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { organization_name } = req.query;

      if (!organization_name || typeof organization_name !== 'string') {
        throw new ValidationError('Organization name is required');
      }

      const organization = await orgService.getOrganizationByName(organization_name);

      if (!organization) {
        throw new NotFoundError('Organization not found');
      }

      res.json({
        success: true,
        data: {
          organizationName: organization.organizationName,
          collectionName: organization.collectionName,
          createdAt: organization.createdAt,
          updatedAt: organization.updatedAt,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateOrganization(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { organization_name, new_organization_name, email, password } = req.body;

      if (!organization_name) {
        throw new ValidationError('Current organization name is required');
      }

      const organization = await orgService.updateOrganization(
        organization_name,
        new_organization_name,
        email,
        password
      );

      res.json({
        success: true,
        message: 'Organization updated successfully',
        data: {
          organizationName: organization.organizationName,
          collectionName: organization.collectionName,
          updatedAt: organization.updatedAt,
        },
      });
    } catch (error: any) {
      if (error.message.includes('not found')) {
        next(new NotFoundError(error.message));
      } else if (error.message.includes('already')) {
        next(new ConflictError(error.message));
      } else {
        next(error);
      }
    }
  }

  async deleteOrganization(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { organization_name } = req.query;
      const organizationId = req.organizationId;

      if (!organization_name || typeof organization_name !== 'string') {
        throw new ValidationError('Organization name is required');
      }

      const organization = await orgService.getOrganizationByName(organization_name);
      if (!organization) {
        throw new NotFoundError('Organization not found');
      }

      if (organization._id.toString() !== organizationId) {
        throw new ValidationError('You can only delete your own organization');
      }

      await orgService.deleteOrganization(organization_name);

      res.json({
        success: true,
        message: 'Organization deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const orgController = new OrgController();

