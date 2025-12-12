import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin';
import { UnauthorizedError } from '../utils/errors';
import bcrypt from 'bcryptjs';

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      const admin = await Admin.findOne({ email: email.toLowerCase() }).exec();

      if (!admin) {
        throw new UnauthorizedError('Invalid email or password');
      }

      if (!admin.organizationId) {
        throw new UnauthorizedError('Admin not associated with an organization');
      }

      const isPasswordValid = await bcrypt.compare(password, admin.password);
      if (!isPasswordValid) {
        throw new UnauthorizedError('Invalid email or password');
      }

      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error('JWT_SECRET is not configured');
      }

      const token = jwt.sign(
        {
          adminId: admin._id.toString(),
          organizationId: admin.organizationId.toString(),
          email: admin.email,
        },
        jwtSecret,
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          admin: {
            email: admin.email,
            organizationId: admin.organizationId.toString(),
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();

