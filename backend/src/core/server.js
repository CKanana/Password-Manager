import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/status", (req, res) => {
  res.json({ message: "Backend is up and running " });
});

app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }


  return res.json({
    success: true,
    user: { email },
  });
});
//add vault route
app.post("/api/vaults", (req, res) => {
  const { vaultName, description } = req.body;

  if (!vaultName) {
    return res.status(400).json({ error: "Vault name is required" });
  }

  // TEMP STORAGE (replace with DB later)
  const newVault = {
    id: Date.now(),
    vaultName,
    description,
  };

  res.json({ message: "Vault created!", vault: newVault });
});

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});
