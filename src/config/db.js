const mongoose = require('mongoose');

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  try {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
      cached.promise = mongoose.connect(process.env.MONGODB_URI);
    }

    cached.conn = await cached.promise;

    console.log("MongoDB Connected");
    return cached.conn;

  } catch (error) {
    console.error("MongoDB Error:", error.message);
    return null; // IMPORTANT for Vercel stability
  }
};

module.exports = connectDB;
