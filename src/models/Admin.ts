import mongoose, { Schema, Document } from 'mongoose';

export interface IAdmin extends Document {
  email: string;
  password: string;
  organizationId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

AdminSchema.index({ email: 1 });
AdminSchema.index({ organizationId: 1 });

export const Admin = mongoose.model<IAdmin>('Admin', AdminSchema);

