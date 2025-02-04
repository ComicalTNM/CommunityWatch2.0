// backend/src/models/User.ts
import mongoose, { Schema } from 'mongoose';
import { IUser } from '@shared/types';
import bcrypt from 'bcrypt';

//An interface to insure that any class that extends the IUserModel interface has the comparePassword function present with the exact same syntax.
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

//When the save function is called on a user object, the password is encrypted 
UserSchema.pre<IUserModel>('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

//Uses the bcrypt compare function to compare the two encrypted passwords to see if they are the same or not.
UserSchema.methods.comparePassword = function(candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUserModel>('User', UserSchema);