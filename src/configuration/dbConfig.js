// src/database/mongoose.js
const mongoose = require("mongoose");
const config = require("config");

mongoose.set("bufferCommands", false); // fail fast nếu truy vấn sớm

async function connectDB() {
  if (mongoose.connection.readyState === 1) return;

  const uri = config.get("db.mongodb");
  const opts = {
    serverSelectionTimeoutMS: 30000, // 30s  primary
    socketTimeoutMS: 45000, // 45s inactivity
    dbName: "utt_detai25",
  };

  try {
    await mongoose.connect(uri, opts);
    console.log("✅  MongoDB connected");
  } catch (err) {
    console.error("❌  Could not connect to MongoDB:", err.message);
    throw err;
  }
}

/* --- Graceful shutdown --- */
async function gracefulExit() {
  try {
    await mongoose.connection.close();
    console.log("💤  MongoDB connection closed");
    process.exit(0);
  } catch (err) {
    console.error("Error during MongoDB shutdown:", err);
    process.exit(1);
  }
}

process.on("SIGINT", gracefulExit).on("SIGTERM", gracefulExit);

module.exports = { mongoose, connectDB };
