// backend/src/routes/postRoutes.ts
import express, {Request, Response, RequestHandler} from 'express';
import { getPosts, createPost, getPostById, getPostsByOrganizationId } from '../controllers/postController';
import Post from '../models/Post';
import User from '../models/User';
import mongoose, { Types } from 'mongoose';

const router = express.Router();

router.post('/:userId', createPost);
router.get('/:id', getPostById);
router.get('/', getPosts);
router.get('/organization/:organizationID', getPostsByOrganizationId);
// router.delete('/:id', deletePost);

//Register a user for an event
const registerForEvent: RequestHandler<{ eventId: string }, any, { userId: string }, any> = async (req, res) => {
    const { eventId } = req.params;
    const { userId } = req.body;

    try {
        const post = await Post.findById(eventId);
        const user = await User.findById(userId);

        if (!post || !user)
        {
            res.status(400).json({ message: 'Event or user not found' });
            return;
        } 

        const eventObjectID = new Types.ObjectId(eventId);
        const userObjectID = new Types.ObjectId(userId);

        if (!user.registeredEvents.includes(eventObjectID)) {
            user.registeredEvents.push(eventObjectID);
            post.registeredUsers.push(userObjectID);
            await user.save();
            await post.save();
        }

        res.status(200).json({ message: 'User registered successfully for the event' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering for event', error });
    }
};

router.post('/:eventId/register', registerForEvent);

export default router;
console.log("Post Routes File Loaded");