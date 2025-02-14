/*
Description: This file is the entry point for the server. It sets up the server and middleware.
*/

// Required modules
const express = require('express');
const cors = require('cors');
const sustainRoutes = require('./routes/sustain');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Ensure this line mounts ALL sustain.js routes
app.use('/api/sustain', sustainRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});