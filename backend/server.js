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
myApp.use(cors({}));
myApp.use(express.json());
let portNum = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

myApp.use(express.static(path.join(__dirname, '../client/out')));

myApp.use('/api/v1/content', contentStuff);
myApp.use('/api/v1/auth', authStuff);
myApp.use('/api/v1/user', userStuff);

myApp.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/out/index.html'));
});

async function runServer() {
  try {
    await connectThing();
    console.log('db ok');
    myApp.listen(portNum, function () {
      console.log('server up at', portNum);
    });
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
}
runServer();
