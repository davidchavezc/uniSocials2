const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config({ path: path.join(__dirname, '../../credentials.env') });

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

app.use(express.static(path.join(__dirname, '../../public')));

app.get('/api-key', (req, res) => {
  res.json({ apiKey: process.env.API_KEY });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});