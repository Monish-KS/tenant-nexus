import { Organization, IOrganization } from '../models/Organization';
import { Admin } from '../models/Admin';
import { collectionService } from './collectionService';
import bcrypt from 'bcryptjs';

export class OrgService {
  async createOrganization(
    organizationName: string,
    email: string,
    password: string
  ): Promise<IOrganization> {
    const normalizedName = organizationName.toLowerCase().trim();

    const existing = await Organization.findOne({ organizationName: normalizedName });
    if (existing) {
      throw new Error('Organization with this name already exists');
    }

    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      throw new Error('Email is already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const collectionName = await collectionService.createCollection(organizationName);

    const admin = new Admin({
      email: email.toLowerCase(),
      password: hashedPassword,
      organizationId: null,
    });
    await admin.save();

    const organization = new Organization({
      organizationName: normalizedName,
      collectionName,
      adminId: admin._id,
    });
    await organization.save();

    admin.organizationId = organization._id;
    await admin.save();

    return organization;
  }

  async getOrganizationByName(organizationName: string): Promise<IOrganization | null> {
    const normalizedName = organizationName.toLowerCase().trim();
    return await Organization.findOne({ organizationName: normalizedName })
      .populate('adminId', 'email')
      .exec();
  }

  async updateOrganization(
    organizationName: string,
    newOrganizationName?: string,
    newEmail?: string,
    newPassword?: string
  ): Promise<IOrganization> {
    const normalizedName = organizationName.toLowerCase().trim();
    const organization = await Organization.findOne({ organizationName: normalizedName });
    
    if (!organization) {
      throw new Error('Organization not found');
    }

    let needsCollectionRename = false;
    let newCollectionName: string | undefined;

    if (newOrganizationName && newOrganizationName.toLowerCase().trim() !== normalizedName) {
      const newNormalizedName = newOrganizationName.toLowerCase().trim();
      
      const existing = await Organization.findOne({ organizationName: newNormalizedName });
      if (existing) {
        throw new Error('Organization with this name already exists');
      }

      organization.organizationName = newNormalizedName;
      newCollectionName = `org_${newNormalizedName.replace(/\s+/g, '_')}`;
      needsCollectionRename = true;
    }

    const admin = await Admin.findById(organization.adminId);
    if (!admin) {
      throw new Error('Admin user not found');
    }

    if (newEmail) {
      const existingAdmin = await Admin.findOne({ 
        email: newEmail.toLowerCase(),
        _id: { $ne: admin._id }
      });
      if (existingAdmin) {
        throw new Error('Email is already registered to another organization');
      }
      admin.email = newEmail.toLowerCase();
    }

    if (newPassword) {
      admin.password = await bcrypt.hash(newPassword, 10);
    }

    await admin.save();

    if (needsCollectionRename && newCollectionName) {
      await collectionService.renameCollection(organization.collectionName, newCollectionName);
      organization.collectionName = newCollectionName;
    }

    await organization.save();
    return organization;
  }

  async deleteOrganization(organizationName: string): Promise<void> {
    const normalizedName = organizationName.toLowerCase().trim();
    const organization = await Organization.findOne({ organizationName: normalizedName });
    
    if (!organization) {
      throw new Error('Organization not found');
    }

    await collectionService.dropCollection(organization.collectionName);
    await Admin.findByIdAndDelete(organization.adminId);
    await Organization.findByIdAndDelete(organization._id);
  }
}

export const orgService = new OrgService();

