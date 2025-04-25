import {Router} from 'express'
import User from '../models/User';
import {Request, Response} from 'express'

const router = Router();

//Route to get the user details by user ID
router.get('/:id', async( req: Request, res: Response) => {
    try
    {
        const userId = req.params.id; //Extract user ID from the route paramter

        //Find the user by their ID
        const user = await User.findById(userId).populate('registeredEvents completedEvents');

        //If no user is found, return a 404 error
        if(!user)
        {
            res.status(404).json({message: 'User not found'});
            return;
        }

        //Create an object with relevant user data
        const userData = {
            id: user._id,
            username: user.username,
            email: user.email,
            password: user.password,
            registeredEvents: user.registeredEvents, // Array of event IDs the user is registered for
            completedEvents: user.completedEvents, //Array of event ID the user has completed
            interests: user.interests //Array of the user's interests (tags)
        }
        res.status(200).json(userData);
    }
    catch(error)
    {
        console.error(error);
        res.status(500).json({message: 'Server error'});
        return;
    }
});

export default router;