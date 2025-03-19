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
const corsOptions = { origin: 'https://sustainai.ca', optionsSuccessStatus: 200 };

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/sustain', sustainRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});