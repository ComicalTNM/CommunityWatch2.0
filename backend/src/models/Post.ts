// backend/src/models/Post.ts
import mongoose, { Schema } from 'mongoose';
import { IPost } from '@shared/types';

const PostSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: String }],
  tags: [{ type: String }],
  organization: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  itemsNeeded: [{ item: String, quantity: Number }],
  volunteersNeeded: { type: Number },
  eventDate: { type: Date },
}, { timestamps: true });

export default mongoose.model<IPost>('Post', PostSchema);