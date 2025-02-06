import mongoose from 'mongoose';
import config from './config';

/**
 * Connect to the MongoDB database using the URI from the config.
 */
const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string, {
            //Add any needed connection options here
        });
        console.log('MongoDB connected successfully.');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit the application if the database connection fails
    }
};

export default connectDB;
