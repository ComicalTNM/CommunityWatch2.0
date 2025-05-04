// backend/src/routes/postRoutes.ts
import express, {Request, Response, RequestHandler} from 'express';
import { getPosts, createPost, getPostById, getPostsByOrganizationId } from '../controllers/postController';
import Post from '../models/Post';
import User from '../models/User';
import mongoose, { Types } from 'mongoose';
import { IPromisedItem } from '../../../shared/src/types';

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

//POST route to register a volunteer for an event
router.post('/registerVolunteer/:eventId', (async (req, res) => {
    const {userId, volunteerDate, promisedItems} = req.body as {
        userId: string;
        volunteerDate?: string;
        promisedItems?: { item: string; quantity: number }[];
    };
    const {eventId} = req.params;

    try{
        const user = await User.findById(userId);
        const event = await Post.findById(eventId);

        if (!event || !user)
        {
            return res.status(404).json({ message: 'Event or user not found' });
        } 

        let volunteerDateObject: Date | null = null;
        if (volunteerDate) {
            volunteerDateObject = new Date(volunteerDate);
        } else {
            return res.status(400).json({ message: 'Volunteer date is required.' });
        }

        // Add event to user's registeredEvents
        if(!user.registeredEvents.includes(new Types.ObjectId(eventId))) {
            user.registeredEvents.push(new Types.ObjectId(eventId));
            await user.save();
        }

        // Add user to event's registeredUsers
        if(!event.registeredUsers.includes(new Types.ObjectId(userId))) 
        {
            event.registeredUsers.push(new Types.ObjectId(userId));
            await event.save();
        }

        // Add promised items 
        if(promisedItems && Array.isArray(promisedItems)) {
            promisedItems.forEach(promisedItem => {
                const existingPromise = event.itemsPromised.find(
                    (p: { user: Types.ObjectId; item: string; quantity: number }) =>
                        p.user.toString() === userId && p.item === promisedItem.item
                );
                if(existingPromise) {
                    existingPromise.quantity += promisedItem.quantity;
                }
                else{
                    event.itemsPromised.push({ user: new Types.ObjectId(userId), item: promisedItem.item, quantity: promisedItem.quantity });
                }
            });
            await event.save();
    
        }
        
        // Check if volunteer date matches event date for attendance
        if(event.eventDate && volunteerDate)
        {
            const eventDate = new Date(event.eventDate);
            const volunteerDateObj = new Date(volunteerDate);
    
            // Compare dates, ignoring time
            if (
                eventDate.getFullYear() === volunteerDateObj.getFullYear() &&
                eventDate.getMonth() === volunteerDateObj.getMonth() &&
                eventDate.getDate() === volunteerDateObj.getDate()
            ) {
                event.volunteersAttending = (event.volunteersAttending || 0) + 1;
                await event.save();
            }
        }

        return res.status(200).json({ message: 'Successfully registered for the event.' });
    }
    catch(error)
    {
        console.error('Error registering volunteer:', error);
        res.status(500).json({ message: 'Failed to register for the event.'});
    }
}) as RequestHandler)

export default router;
console.log("Post Routes File Loaded");