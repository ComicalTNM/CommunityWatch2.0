// shared/types.ts
import { Types, Document } from 'mongoose';

export interface IItem {
  item: string;
  quantity: number;
}


export interface IOrganization extends Document {
  _id: string;
  name: string;
  description: string;
  longBio: string;
  bannerImage: string;
  profileImage: string;
  ownerId: Types.ObjectId;
  adminIds: Types.ObjectId[];
  memberIds: Types.ObjectId[];
  website: string;
  contactEmail: string;
  contactPhone: string;
  socialMedia: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  causes: string[];
  foundedYear: number;
}

export type OrganizationPreview = {
  _id: Types.ObjectId
  name: string;
  description: string;
  profileImage: string;
}


export interface IPost extends Document {
  _id: string,
  title: string;
  description: string;
  images: string[];
  tags: string[];
  organization: Types.ObjectId | OrganizationPreview;
  itemsNeeded?: IItem[];
  volunteersNeeded?: number;
  eventDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  theme?: IPostTheme;
}

export interface IPostTheme {
  borderFrom: string;
  borderTo: string;
  glowColor: string;
}

export interface IOrganizationProfile extends IOrganization {
  activePosts: IPost[],
  teamMembers: IMember[],
}

export interface IMember {
  _id: string;
  name: string;
  profilePicture?: string;
  role: string;
}


export interface IUser extends Document {
  _id: string;
  username: string;
  email: string;
  password: string;
  role: 'donor' | 'member' | 'admin' | 'owner';
  organizationId?: Types.ObjectId;
  donorProfileId?: Types.ObjectId;
  profilePicture?: string;
}

export interface IDonorProfile extends Document {
  userId: Types.ObjectId;
  bio?: string;
  interests: string[];
  donationHistory: {
    organizationId: Types.ObjectId;
    amount: number;
    date: Date;
  }[];
  preferredCauses: string[];
  volunteerHistory?: {
    organizationId: Types.ObjectId;
    hours: number;
    date: Date;
  }[];
}

export interface ThemeSettings {
  backgroundFrom: string;
  backgroundTo: string;
  allowOverride: boolean;
  direction: string;
}

export interface UserSettings {
  theme: ThemeSettings;
}