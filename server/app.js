/**
 * server/app.js
 * 
 * This is the main server file for the SUSTAIN web application.
 * It sets up the Express server, configures middleware, and defines routes.
 * The server listens for incoming requests on a specified port.
 * 
 * Author: SUSTAIN Development Team
 * Last Modified: Jan 2026
 */

const express = require('express');
const cors = require('cors');
const sustainRoutes = require('./routes/sustain');

const app = express();
const PORT = process.env.PORT || 8080;

// Configure CORS to allow requests from frontend
const corsOptions = { 
  origin: ['https://sustainai.ca', 'http://localhost:3000'], // localhost for development
  optionsSuccessStatus: 200,
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));

app.use((req, res, next) => {
  /**
   * Middleware to set security headers for all responses.
   * 
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @param {Function} next - Next middleware function.
   */
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

app.use('/api/sustain', sustainRoutes);

app.listen(PORT, () => {
  /**
   * Starts the Express server and listens on the specified port.
   * 
   * @param {number} PORT - The port number to listen on.
   */
  console.log(`Server is running on port ${PORT}`);
});
