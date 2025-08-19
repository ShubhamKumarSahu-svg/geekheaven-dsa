import cors from 'cors';
import { config as doEnv } from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import connectThing from './db/connect_db.js';
import authRoutes from './routes/authRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import userRoutes from './routes/userRoutes.js';

doEnv();
const app = express();
const portNum = process.env.PORT || 5000;

app.set('trust proxy', 1);

app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true,
  })
);

app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const staticPath = path.join(__dirname, '../frontend/out');

app.use(express.static(staticPath));

app.use('/api/v1/content', contentRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);

app.get('*', (req, res, next) => {
  const indexFile = path.join(staticPath, 'index.html');
  res.sendFile(indexFile, (err) => {
    if (err) {
      next();
    }
  });
});

async function runServer() {
  try {
    await connectThing();
    console.log('db ok');

    app.listen(portNum, () => {
      console.log(`server up at http://localhost:${portNum}`);
    });
  } catch (err) {
    console.error('DB connection failed:', err.message);
    process.exit(1);
  }
}

runServer();
