// backend/src/controllers/profilesController.ts
import { Request, Response } from 'express';
import Post from '../models/Post';
import Organization from '../models/Organization';
import User from '../models/User';
import { IMember, IOrganization, IOrganizationProfile, IPost } from '@shared/types';
import { Types } from 'mongoose';

export const getOrganizationProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("Got organization profile request.");
        const organization: IOrganization | null = await Organization.findById(req.params.id);
        if (!organization) {
            res.status(404).json({ message: 'Organization not found' });
            return;
        }

        // Fetch active posts
        const activePosts: IPost[] = await Post.find({
            organization: new Types.ObjectId(organization._id),
            // Add any other conditions to determine if a post is active
            // For example: status: 'active', endDate: { $gt: new Date() }
        }).sort({ createdAt: -1 }).limit(10); // Limit to 10 most recent active posts

        // Fetch team members
        const teamMembers: IMember[] = await User.find({
            _id: { $in: [...organization.adminIds, ...organization.memberIds] }
        }).select('name profilePicture role');

        const publicProfile: IOrganizationProfile = {
            ...organization.toObject(),
            activePosts: activePosts,
            teamMembers: teamMembers,
        };

        console.log("Sending public organization profile: ", JSON.stringify(publicProfile));
        res.json(publicProfile);
    } catch (error) {
        console.error('Error fetching organization public profile:', error);
        res.status(500).json({ message: 'Error fetching organization public profile', error: error instanceof Error ? error.message : 'Unknown error' });
    }
};