import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDb } from './database';
import { createAuthRoutes } from './presentation/routes/AuthRoutes';
import { createWatchedItemRoutes } from './presentation/routes/WatchedItemRoutes';
import { createExternalMediaRoutes } from './presentation/routes/ExternalMediaRoutes';

dotenv.config();

const app = express();
const port = 3001;

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

initDb().catch((err) => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});

app.use('/api/auth', createAuthRoutes());
app.use('/api/watched', createWatchedItemRoutes());
app.use('/api/external', createExternalMediaRoutes());

app.get('/', (req, res) => {
  res.send('Hello from the server!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
