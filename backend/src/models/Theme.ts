import mongoose, { Schema } from 'mongoose';
import { IPostTheme } from '@shared/types';

const ThemeSchema = new Schema({
    borderFrom: { type: String, required: true },
    borderTo: { type: String, required: true },
    glowColor: { type: String, required: true }
  }, { _id: false }); // _id: false prevents Mongoose from creating an _id for nested objects

export default mongoose.model<IPostTheme>("PostTheme", ThemeSchema);