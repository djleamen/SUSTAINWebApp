/*
Description: This file is the entry point for the server. It sets up the server and middleware.
*/

// Required modules
const express = require('express');
const cors = require('cors');
const app = express();
const sustainRoute = require('./routes/sustain'); // Ensure correct path

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/sustain', sustainRoute);

// Error handler
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});