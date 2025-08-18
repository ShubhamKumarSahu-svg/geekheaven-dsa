import cors from 'cors';
import { config as doEnv } from 'dotenv';
import express from 'express';
import connectThing from './db/connect_db.js';
import authStuff from './routes/authRoutes.js';
import contentStuff from './routes/contentRoutes.js';
import userStuff from './routes/userRoutes.js';

doEnv();
const myApp = express();
myApp.use(cors({}));
myApp.use(express.json());
let portNum = process.env.PORT || 5000;

myApp.use('/api/v1/content', contentStuff);
myApp.use('/api/v1/auth', authStuff);
myApp.use('/api/v1/user', userStuff);

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
