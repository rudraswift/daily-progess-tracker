const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/daily_tracker';

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173', // local dev
    'https://daily-progess-tracker.vercel.app', // your Vercel URL
  ],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api', require('./routes/api'));
app.use('/api/auth', require('./routes/auth'));

// Database Connection
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB gracefully.');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
  });
