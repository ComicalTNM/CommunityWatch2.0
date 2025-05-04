// backend/src/models/Post.ts
import mongoose, { Schema , Model, Document} from 'mongoose';
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
  //Fields for tracking registrations and completions
  registeredUsers: [{type: Schema.Types.ObjectId, ref: 'User', default: []}],  //Users who registered for this event
  completedUsers: [{type: Schema.Types.ObjectId, ref: 'User', default: []}],  //Users who completed this event
  itemsPromised: [{
      user: { type: Schema.Types.ObjectId, ref: 'User' },
      item: String,
      quantity: Number
  }],
  volunteersAttending: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model<IPost & Document>('Post', PostSchema);