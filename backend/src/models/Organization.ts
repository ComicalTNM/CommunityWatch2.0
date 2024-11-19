// backend/src/models/Organization.ts
import mongoose, { Schema } from 'mongoose';
import { IOrganization } from '@shared/types';


const OrganizationSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  longBio: { type: String, required: true },
  bannerImage: { type: String, required: true },
  profileImage: { type: String, required: true },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  adminIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  memberIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  website: { type: String },
  contactEmail: { type: String, required: true },
  contactPhone: { type: String },
  socialMedia: {
    facebook: { type: String },
    twitter: { type: String },
    instagram: { type: String },
    linkedin: { type: String },
  },
  causes: [{ type: String }],
  foundedYear: { type: Number },
}, { timestamps: true });

export default mongoose.model<IOrganization>('Organization', OrganizationSchema);