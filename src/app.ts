import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import orgRoutes from './routes/orgRoutes';
import authRoutes from './routes/authRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

app.use('/org', orgRoutes);
app.use('/admin', authRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;

