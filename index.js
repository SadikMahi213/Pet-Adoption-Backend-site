const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

dotenv.config();

const connectDB = require('./src/config/db');

const userRoutes = require('./src/routes/userRoutes');
const petRoutes = require('./src/routes/petRoutes');
const requestRoutes = require('./src/routes/requestRoutes');

const app = express();

// middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// --------------------
// INIT DB ON START (IMPORTANT FIX)
// --------------------
connectDB()
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB ERROR:", err));

// routes
app.use('/api/users', userRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/requests', requestRoutes);

// test route
app.get('/', (req, res) => {
  res.send('Pet Adoption API is running...');
});

// Vercel export
module.exports = (req, res) => {
  app(req, res);
};
