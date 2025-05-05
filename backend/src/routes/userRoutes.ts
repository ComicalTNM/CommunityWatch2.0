import User from '../models/User';
import Organization from '../models/Organization';
import {Request, Response, Router, NextFunction, RequestHandler} from 'express';
import bcrypt from 'bcrypt';
import multer, {StorageEngine} from 'multer'; 
import path from 'path';
import { authenticateToken } from '@/middleware/authMiddleware';
import { appendFileSync } from 'fs';
import { isValidObjectId } from 'mongoose';

const router = Router();

//Multer storage configuration
const storage: StorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
    cb(null, 'uploads/');  //  Where to store the files
    },
    filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);  //  Get the file extension
    cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);  //  Name the file with extension
    },
});

//Multer setup (if handling file uploads)
const upload = multer({ storage: storage});

// Define a type for the request object that includes Multer's 'file'
type MulterRequest = Request & {
    file?: Express.Multer.File; // Definitely has 'file'
};

// Explicitly define the asyncHandler type to return Promise<void>
type AsyncRequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>; // Force return of Promise<void>
  
  const asyncHandler = (fn: AsyncRequestHandler): RequestHandler => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

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
            organizationId: user.organizationId,
            role: user.role,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            registeredEvents: user.registeredEvents, // Array of event IDs the user is registered for
            completedEvents: user.completedEvents, //Array of event ID the user has completed
            interests: user.interests, //Array of the user's interests (tags)
            points: user.points
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
        const userId = req.params.userId;
        const {username, email, password} = req.body;

        const updateFields: any = {username, email};  
        if(password)
        {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateFields.password = hashedPassword;
        }

        if(req.file)
        {
            //  Construct the full image URL
            const imageUrl = `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, '/')}`;  //  Important:  Replace backslashes for URLs
            updateFields.profilePicture = imageUrl;
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

//PATCH route for resetting points
router.patch('/:userId/points', (async(req, res) => {
    try{
        const updatedUser = await User.findByIdAndUpdate(
            req.params.userId,
            {points: 0},
            {new: true}
        );
        if(!updatedUser)
        {
            return res.status(404).json({message: 'User not found'});
        }

        res.json({message: 'Points reset successfully'});
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: 'Error resetting points'});
    }
}) as RequestHandler)

//DELETE route for deleting a user
router.delete('/:userId', (async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.userId);
        if(!deletedUser){
            return res.status(404).json({message: 'User not found'});
        }

        res.json({message: 'User deleted successfully'});
    }
    catch (error)
    {
        console.error(error);
        res.status(500).json({message: 'Error deleting user'});
    }
}) as RequestHandler)

router.post('/:userId/registerEvent', (async(req: Request, res: Response) => {
    try{
        const userId = req.params.userId;
        const {eventId} = req.body;

        if(!eventId)
        {
            return res.status(400).json({message: "EventID is required."});
        }

        const user = await User.findById(userId);

        if(!user)
        {
            return res.status(404).json({message: "User is not found"});
        }

        if(user.registeredEvents.includes(eventId))
        {
            return res.status(409).json({message: "User is already registered for this event"})
        }

        await User.updateOne({_id: userId}, {$push: {registeredEvents: eventId}});

        res.json({message: "Event registered successfully."});
    }
    catch(error)
    {
        console.error(error);
        res.status(500).json({message: "Error registering for event."});
    }
}) as RequestHandler)

// Get organizations for a user
router.get('/organizations/:userId', asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    try {
        // Assuming your authentication middleware (authenticateToken) adds a 'user' property to the request
        const userId = req.params.userId;
  
        const user = await User.findById(userId).populate('organizationId');
  
        if (!user) {
          res.status(404).json({ message: 'User not found' });
          return next();
        }
  
        // If organizationId is a single ObjectId, return it. If it's an array, return the array.
        const organizations = user.organizationId;
  
        res.json(organizations);
        return next();
      } catch (error) {
        console.error('Error fetching user organizations:', error);
        return next(error);
      }
}))

router.get('/admin/:userId', (async (req: Request, res: Response, next: NextFunction) => {
    try{
        const userId = req.params.userId;
        if(!userId)
        {
            return res.status(401).json({message: 'Unauthorized: no user ID provided!'})
        }

        const user = await User.findById(userId).populate('organizationId');

        if(!user)
        {
            return res.status(404).json({message: 'Admin user not found'});
        }

        // Role check
        if(user.role !== 'admin')
        {
            return res.status(403).json({message: 'Forbidden: User is not an admin!'});
        }

        //Send back the user data, including organizationId
        const adminData = {
            id: user._id,
            username: user.username,
            email: user.email,
            organizationId: user.organizationId,
            role: user.role
        }

        res.status(200).json(adminData);
    }
    catch(error)
    {
        console.error('Error fetching admin user data:', error);
        return next(error);
    }
})as RequestHandler)

// PUT route to change a member's role.
router.put('/:userId/role', (async (req, res) => {
    try {
        const userId = req.params.userId;
        const newRole = req.body.role;  // Assuming the request body contains { role: 'donor' }
        const organizationId = req.body.organizationId; // Expecting organizationId if adding member


        // Find the user by ID and update their role
        const user = await User.findByIdAndUpdate(userId, { role: newRole }, { new: true });


        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        if (newRole === 'member' && organizationId) {
            if (!isValidObjectId(organizationId)) {
                return res.status(400).json({ message: 'Invalid organization ID format' });
            }
            // Add the user to the organization's memberIds array
            const organization = await Organization.findByIdAndUpdate(
            organizationId,
            { $push: { memberIds: userId } },
            { new: true }
            );
           
          
            if (!organization) {
                console.log('Organization not found');
                return res.status(404).json({ message: 'Organization not found' });
            }
            console.log(`User ${userId} added to organization ${organization._id}`);
        } 
        else if (newRole === 'donor') {
            // If the role is changed to 'donor', remove the user from the organization's memberIds
            const organization = await Organization.findOneAndUpdate(
            { memberIds: userId },
            { $pull: { memberIds: userId } },
            { new: true }
            );
        
        
            if (organization) {
            console.log(`User ${userId} removed from organization ${organization._id}`);
            } else {
            console.log(`User ${userId} was not found in any organization's memberIds`);
            }
        }

        res.json({ message: 'Role updated successfully', user: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}) as RequestHandler);

// GET route to get all users with the role of donor.
router.get('/users/donor', (async (req: Request, res: Response) => {
    try {
        const donorUsers = User.find({ role: 'donor' }).select('_id username email').lean();
        res.json(donorUsers);
    } 
    catch (error) {
        console.error('Error fetching donor users:', error);
        res.status(500).json({ message: 'Server error fetching donor users' });
    }
}) as RequestHandler);

export default router;