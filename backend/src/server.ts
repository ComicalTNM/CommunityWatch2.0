import express from 'express';
import connectDB from './db'; // Import the DB connection function
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import config from './config';
import dotenv from 'dotenv';

dotenv.config({path: './info.env'}); //Ensures that environment variables are loaded before anything else

const app = express();
app.use(express.json()); // Middleware to parse JSON
app.use(cors()); //Allows the frontend to communicate with the backend


// Connect to MongoDB
connectDB();

// Use routes
app.use('/api/auth', authRoutes);

//Handle undefined routes
app.use((req, res, next) => {
    res.status(404).json({message: 'Route not found'});
});

//Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({message: 'Internal Server Error', error: err.message});
});

// Start server
app.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT} in ${config.NODE_ENV} mode.`);
});
