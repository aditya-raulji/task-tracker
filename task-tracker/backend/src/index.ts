import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import { connectDB } from './config/db';
import authRoutes from './routes/auth';

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);

// Health check
app.get('/', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong on the server' });
});

const PORT = process.env.PORT || 5000;

// Connect to DB and start server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
