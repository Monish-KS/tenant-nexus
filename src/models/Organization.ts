import mongoose, { Schema, Document } from 'mongoose';

export interface IOrganization extends Document {
  organizationName: string;
  collectionName: string;
  adminId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const OrganizationSchema = new Schema<IOrganization>(
  {
    organizationName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    collectionName: {
      type: String,
      required: true,
      unique: true,
    },
    adminId: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

OrganizationSchema.index({ organizationName: 1 });

export const Organization = mongoose.model<IOrganization>('Organization', OrganizationSchema);

