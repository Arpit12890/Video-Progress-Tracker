// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import progressRoutes from './routes/progress.js';

dotenv.config();

const app = express();
const port=process.env.PORT || 4000;
app.use(cors());
app.use(express.json());

app.use('/progress', progressRoutes);

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('MongoDB connected');
  app.listen(port, () => console.log('Server started on port 5000'));
}).catch(err => console.error(err));
