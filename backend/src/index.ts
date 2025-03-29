// backend/src/index.ts
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import postRoutes from './routes/postRoutes';
import organizationRoutes from './routes/organizations';
import profileRoutes from './routes/profilesRoutes';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import seedData from './seedData';
import dotenv from 'dotenv';

dotenv.config({path: './info.env'});
console.log('Using MONGODB_URI:', process.env.MONGODB_URI);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Content-Type, x-csrf-token');
    next();
});
app.use(express.json());

console.log("Checking Organization Router: ", organizationRoutes.stack.map((layer) => layer.route?.path));
app.use('/api/posts', postRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/profiles/public', profileRoutes);
app.use('/api/auth', authRoutes);
app.use('api/users', userRoutes);

console.log("Registered Routes in Express:");
app._router.stack.forEach((middleware: any) => {
  if(middleware.route)
  {
    //Directly registered route
    console.log(`${Object.keys(middleware.route.methods).join(',').toUpperCase()} - ${middleware.route.path}`);
  }
  else if(middleware.name === "router" && middleware.handle.stack)
  {
      //Mounted Routers (e.g. /api/organizations)
      const basePath = middleware.regxp ? middleware.regxp.source.replace("^\\", "").replace("\\/?(?=\\/|$)", "") : ""; //Extracts the base path
      middleware.handle.stack.forEach((layer: any) => {
      if(layer.route)
      {
        console.log(`${Object.keys(layer.route.methods).join(',').toUpperCase()} - ${basePath}${layer.route.path}`);
      }
    });
  }
});

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

  //Test to see if the organizations route is present
  app._router.stack.forEach((r:any) => {
    if(r.route && r.route.path)
    {
      console.log(r.route.path);
    }
  });

export default app;