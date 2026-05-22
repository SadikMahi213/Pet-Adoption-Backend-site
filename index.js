const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./src/config/db');
const userRoutes = require('./src/routes/userRoutes');
const petRoutes = require('./src/routes/petRoutes');
const requestRoutes = require('./src/routes/requestRoutes');

dotenv.config();
connectDB();

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/requests', requestRoutes);

app.get('/', (req, res) => {
  res.send('Pet Adoption API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
