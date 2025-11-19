import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true }, // Store hashed password
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model("User", UserSchema);
