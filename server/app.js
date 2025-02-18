/*
Description: This file is the entry point for the server. It sets up the server and middleware.
*/

// Required modules
const express = require('express');
const cors = require('cors');
const sustainRoutes = require('./routes/sustain');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Ensure this line mounts ALL sustain.js routes
app.use('/api/sustain', sustainRoutes);

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});