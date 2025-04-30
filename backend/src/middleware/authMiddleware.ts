import {Request, Response, NextFunction} from 'express';
import jwt, {JwtPayload} from 'jsonwebtoken';
import User from '../models/User';
import dotenv from 'dotenv';
dotenv.config();

// Declares an interface to extend the Express Request object
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; 

    if(!token)
    {
        return res.status(401).json({message: 'Authentication token is required'});
    }

    if(!process.env.JWT_SECRET)
    {
        console.error('JWT_SECRET is not defined in your enviornment variables!');
        return res.status(500).json({message: 'Server configuration error'});
    }

    jwt.verify(token, process.env.JWT_SECRET, async(err, user) => {
        if(err)
        {
            console.error('Token verification error:', err);
            return res.status(403).json({message: 'Invalid token'});
        }

        try {
            const foundUser = await User.findById((user as JwtPayload).id);
            if(!foundUser)
            {
                return res.status(404).json({message: 'User not found'});
            }
            req.user = {id: foundUser._id, username: foundUser.username, email: foundUser.email, role: foundUser.role, organizationId: foundUser.organizationId};
            next();
        }
        catch(error)
        {
            console.error('Database error fetching user:', error);
            return res.status(500).json({message: 'Server error'});
        }
    });
};