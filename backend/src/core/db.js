import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

let MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  MONGO_URI = "mongodb://localhost:27017/password_manager";
  console.warn("WARNING: MONGO_URI not set in .env, using local MongoDB. Set your Atlas URI in backend/.env!");
} else {
  console.log("MongoDB URI from .env:", MONGO_URI);
}

export function connectDB() {
  mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  mongoose.connection.on("connected", () => {
    console.log("MongoDB connected");
  });
  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
  });
}
