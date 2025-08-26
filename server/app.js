/*
Description: This file is the entry point for the server. It sets up the server and middleware.
*/

// Required modules
const express = require('express');
const cors = require('cors');
const sustainRoutes = require('./routes/sustain');

const app = express();
const PORT = process.env.PORT || 8080;

// Configure CORS to allow requests from your frontend
const corsOptions = { 
  origin: ['https://sustainai.ca', 'http://localhost:3000'], // Add localhost for development
  optionsSuccessStatus: 200,
  credentials: true // Allow credentials if needed
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' })); // Limit request size

// Add security middleware
app.use((req, res, next) => {
  // Set security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

app.use('/api/sustain', sustainRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});