import express from 'express';
import connectDB from './db'; // Import the DB connection function
import authRoutes from './routes/authRoutes';
import config from './config';
import dotenv from 'dotenv';

const app = express();
app.use(express.json()); // Middleware to parse JSON
dotenv.config();

// Connect to MongoDB
connectDB();

// Use routes
app.use('/api/auth', authRoutes);

// Start server
app.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT} in ${config.NODE_ENV} mode.`);
});
