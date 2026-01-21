// server.js

// 1. import libraries
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require("path");
const connectDB = require('./config/db');
const notificationRoutes = require("./routes/notificationRoutes");

// 2. load environment variables from .env file
dotenv.config();
connectDB();
// 3. create the express app
const app = express();


// 4. middleware
app.use(cors());         // allow requests from frontend
app.use(express.json()); // allow backend to read JSON from requests

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const postRoutes = require('./routes/postRoutes');
app.use('/api/posts', postRoutes);

app.use("/api/communities", require("./routes/communityRoutes"));


const messageRoutes = require("./routes/messageRoutes");
app.use("/api/messages", messageRoutes);

app.use("/api/notifications", notificationRoutes);

// 5. test route
app.get('/', (req, res) => {
  res.send('CampusConnect API is running...');
});


// 6. start the server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
