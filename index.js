import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import fileRoutes from './routes/fileRoutes.js';

import path from 'path';
dotenv.config();

const app = express();
app.use(express.json());

app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));

app.use('/auth', authRoutes);
app.use('/files', fileRoutes)


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });