import { Request, Response } from 'express';  // Importing Request and Response types
import jwt from 'jsonwebtoken';
import User from '../models/User';  // Assuming your User model is in this location
import { IUser } from '@shared/types'; // Assuming you have an IUser interface

// Register a new user
export const register = async (req: Request, res: Response): Promise<void> => {
    console.log('Received CSRF Token:', req.headers['x-csrf-token']);
    console.log('Received Cookies:', req.cookies);
    console.log('Received Request Body:', req.body);
    try {
        const { username, email, password } = req.body;

        // Ensure the email is unique
        const existingUser = await User.findOne({ email });
        //If the email is already in the database, notify the user that the email is already in use.
        if (existingUser) {
            res.status(400).json({ message: 'Email already in use' });
            return;  // Early return to stop further execution
        }

        // Create and save the new user
        const user = new User({ username, email, password });
        await user.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' });
    }
};

// Login an existing user
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        //If the user's email is not found or the user's password is not the same as the one in the database, prevent them from logging in.
        if (!user || !(await user.comparePassword(password))) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;  // Early return to stop further execution
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1d' });

        // Prepare user response data without sensitive information (e.g., password)
        const userResponse: Partial<IUser> = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            role: user.role
        };

        res.json({ token, user: userResponse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Login failed", error: error instanceof Error ? error.message : 'Unknown error' });
    }
};

// Reset password functionality
export const resetPassword =  async(req: Request, res: Response): Promise<void> => {
    try{
        const {email, newPassword} = req.body;
        
        //Find user by email
        const user = await User.findOne({email});
        if(!user)
        {
            res.status(404).json({message: "User not found."});
            return;
        }

        //Update the password, the password should be hashed when the save function is called.
        user.password = newPassword;
        await user.save();

        res.status(200).json({message: "Password successfully reset."})
    }
    catch (error){
        console.error("Reset Password Error:", error);
        res.status(500).json({message: "Internal server error."});
    }
}