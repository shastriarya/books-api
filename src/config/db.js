require("dotenv").config();
const mongoose = require("mongoose");
const debug = require("debug")("books-api:db");

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined");
    }

    await mongoose.connect(process.env.MONGO_URI);
    debug("connected to db");
    return mongoose.connection;
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    throw err;
  }
};

module.exports = connectDB;
