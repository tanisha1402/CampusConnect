// server.js

// 1. import libraries
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// 2. load environment variables from .env file
dotenv.config();
connectDB();
// 3. create the express app
const app = express();

// 4. middleware
app.use(cors());         // allow requests from frontend
app.use(express.json()); // allow backend to read JSON from requests

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);


// 5. test route
app.get('/', (req, res) => {
  res.send('CampusConnect API is running...');
});

// 6. start the server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
