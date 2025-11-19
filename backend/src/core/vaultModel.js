import mongoose from "mongoose";

const VaultSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  vaultName: String,
  description: String,
  passwords: [
    {
      site: String,
      username: String,
      password: String // Should be encrypted in production
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

export const Vault = mongoose.model("Vault", VaultSchema);
