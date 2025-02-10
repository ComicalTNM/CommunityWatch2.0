// backend/src/index.ts
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import postRoutes from './routes/postRoutes';
import organizationRoutes from './routes/organizationRoutes';
import profileRoutes from './routes/profilesRoutes';
import authRoutes from './routes/authRoutes';
import seedData from './seedData';
import dotenv from 'dotenv';

dotenv.config({path: './info.env'});
console.log('Using MONGODB_URI:', process.env.MONGODB_URI);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cookieParser());
app.use(cors({
  origin: process.env.PUBLIC_URL,
  credentials: true
}));
app.use(express.json());

app.use('/api/posts', postRoutes);
app.use('/api/organizations', organizationRoutes)
app.use('/api/profiles/public', profileRoutes)
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Hello, TypeScript Express!');
});

app.get('/api/test', (req, res) => {
  const name = req.query.name || 'World';
  res.json({ message: `Hello, ${name}!` });
});

// In your main backend Express app
app.get('/health', (_, res) => {
  res.status(200).json({ status: 'healthy' });
});

mongoose.connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log('Connected to MongoDB');
    return seedData();
  })
  .then(() => {
    console.log("Seed data inserted");
    if (process.env.NODE_ENV !== 'test') {
      app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
      });
    }
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });


export default app;