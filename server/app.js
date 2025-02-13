const express = require('express');
const cors = require('cors');
const app = express();
const sustainRoute = require('./routes/sustain'); // Ensure correct path

app.use(cors());
app.use(express.json());
app.use('/api/sustain', sustainRoute);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});