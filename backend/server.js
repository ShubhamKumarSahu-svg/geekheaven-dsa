import cors from 'cors';
import { config as doEnv } from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import connectThing from './db/connect_db.js';
import authStuff from './routes/authRoutes.js';
import contentStuff from './routes/contentRoutes.js';
import userStuff from './routes/userRoutes.js';

doEnv();
const myApp = express();
const portNum = process.env.PORT || 5000;

// CORS (restrict in prod with CLIENT_URL env var)
myApp.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true,
  })
);

myApp.use(express.json());

// __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to static Next.js export
const staticPath = path.join(__dirname, '../frontend/out');

// Serve static files *only if they exist*
myApp.use(express.static(staticPath));

// API routes
myApp.use('/api/v1/content', contentStuff);
myApp.use('/api/v1/auth', authStuff);
myApp.use('/api/v1/user', userStuff);

// Catch-all route: send index.html if export exists
myApp.get('*', (req, res, next) => {
  const indexFile = path.join(staticPath, 'index.html');
  res.sendFile(indexFile, (err) => {
    if (err) {
      // If out/index.html doesn’t exist, skip → avoids crashing
      next();
    }
  });
});

async function runServer() {
  try {
    await connectThing();
    console.log('✅ db ok');

    myApp.listen(portNum, () => {
      console.log(`🚀 server up at http://localhost:${portNum}`);
    });
  } catch (err) {
    console.error('❌ DB connection failed:', err.message);
    process.exit(1);
  }
}

runServer();
