import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { User } from "./userModel.js";
import { Vault } from "./vaultModel.js";
import { connectDB } from "./db.js";

connectDB();
const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/status", (req, res) => {
  res.json({ message: "Backend is up and running " });
});

// Signup route
app.post("/auth/signup", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ message: "User already exists" });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({ email, passwordHash });
  await user.save();
  res.json({ success: true, user: { email } });
});

// Login route
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  res.json({ success: true, user: { email } });
});

// Create or update vault
app.post("/api/vaults", async (req, res) => {
  const { userEmail, vaultName, description, passwords } = req.body;
  if (!userEmail || !vaultName) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  // Encrypt each password before saving
  function encrypt(text) {
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const tag = cipher.getAuthTag().toString('hex');
    return { encrypted, iv: iv.toString('hex'), key: key.toString('hex'), tag };
  }
  const encryptedPasswords = passwords.map(p => ({
    site: p.site,
    username: p.username,
    ...encrypt(p.password)
  }));
  let vault = await Vault.findOne({ userEmail, vaultName });
  if (vault) {
    vault.description = description;
    vault.passwords = encryptedPasswords;
    await vault.save();
  } else {
    vault = new Vault({ userEmail, vaultName, description, passwords: encryptedPasswords });
    await vault.save();
  }
  res.json({ message: "Vault saved!", vault });
});

// Get all vaults for a user
app.get("/api/vaults", async (req, res) => {
  const { userEmail } = req.query;
  if (!userEmail) {
    return res.status(400).json({ error: "Missing userEmail" });
  }
  function decrypt(enc) {
    const key = Buffer.from(enc.key, 'hex');
    const iv = Buffer.from(enc.iv, 'hex');
    const tag = Buffer.from(enc.tag, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);
    let decrypted = decipher.update(enc.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
  const vaults = await Vault.find({ userEmail });
  // Decrypt passwords for each vault
  const decryptedVaults = vaults.map(vault => ({
    ...vault.toObject(),
    passwords: vault.passwords.map(p => {
      if (p.encrypted && p.iv && p.key && p.tag) {
        return {
          site: p.site,
          username: p.username,
          password: decrypt(p)
        };
      } else {
        // If not encrypted, return as-is (plaintext or incomplete)
        return {
          site: p.site,
          username: p.username,
          password: p.password || ""
        };
      }
    })
  }));
  res.json({ vaults: decryptedVaults });
});

// Delete a vault
app.delete("/api/vaults/:id", async (req, res) => {
  const { id } = req.params;
  await Vault.findByIdAndDelete(id);
  res.json({ message: "Vault deleted" });
});

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});
