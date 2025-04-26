import User from '../models/User';
import {Request, Response, Router, NextFunction, RequestHandler} from 'express';
import bcrypt from 'bcrypt';
import multer from 'multer'; 


const router = Router();

//Multer setup (if handling file uploads)
const upload = multer({ dest: 'uploads/'});

// Define a type for the request object that includes Multer's 'file'
type MulterRequest = Request & {
    file?: Express.Multer.File; // Definitely has 'file'
};

//Route to get the user details by user ID
router.get('/:id', async( req: Request, res: Response, next: NextFunction) => {
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
        return next(error);
    }
});

//PATCH route to update user details
router.patch('/:userId', upload.single('profilePicture'), (async(req: MulterRequest, res: Response, next: NextFunction) => {
    try{
        const userId = req.params.id;
        const {username, email, password} = req.body;

        const updateFields: any = {username, email};  
        if(password)
        {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateFields.password = hashedPassword;
        }

        if(req.file)
        {
            updateFields.profilePicture = req.file.path;
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateFields,
            {new: true, runValidators: true} // Returns the updated document
        );

        if(!updatedUser)
        {
            return res.status(404).json({message: 'User not found'});
        }
        res.json(updatedUser);
    }
    catch(error)
    {
        console.error(error);
        res.status(500).json({message: 'Error updating user'});
        return next(error);
    }
}) as RequestHandler);

export default router;