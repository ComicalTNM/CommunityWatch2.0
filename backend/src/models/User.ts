// backend/src/models/User.ts
import mongoose, { Schema } from 'mongoose';
import { IUser } from '@shared/types';
import bcrypt from 'bcrypt';

interface IUserModel extends IUser {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema<IUserModel>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['donor', 'member', 'admin', 'owner'], default: 'donor' },
  organizationId: { type: Schema.Types.ObjectId, ref: 'Organization' },
  donorProfileId: { type: Schema.Types.ObjectId, ref: 'DonorProfile' },
  profilePicture: { type: String, required: false }
}, { timestamps: true });

UserSchema.pre<IUserModel>('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

UserSchema.methods.comparePassword = function(candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUserModel>('User', UserSchema);