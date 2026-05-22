const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

dotenv.config();

console.log("ENV CHECK:", process.env.MONGODB_URI ? "FOUND" : "MISSING");

const connectDB = require('./src/config/db');
const userRoutes = require('./src/routes/userRoutes');
const petRoutes = require('./src/routes/petRoutes');
const requestRoutes = require('./src/routes/requestRoutes');

connectDB().catch(err => console.log("DB ERROR:", err));

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/users', userRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/requests', requestRoutes);

app.get('/', (req, res) => {
  res.send('Pet Adoption API is running...');
});

module.exports = app;
