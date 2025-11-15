import express from "express";
import cors from "cors";
import fs from "fs";
import { Keychain } from "./core/keychain.js";

const app = express();
app.use(cors());
app.use(express.json());

let keychain;
const vaultFile = "vault.json";

// Root endpoint
app.get("/", (req, res) => {
  res.send("Password Manager Backend is running!");
});
app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password required" });
  
  // For now, just return the user (no real authentication)
  return res.json({ success: true, user: { email } });
});
// Check if vault exists
app.get("/api/vault/exists", (req, res) => {
  const exists = fs.existsSync(vaultFile);
  res.json({ exists });
});

// Init or load vault
app.post("/api/vault/init", async (req, res) => {
  const { masterPassword, loadExisting } = req.body;

  if (!masterPassword) {
    return res.status(400).json({ error: "Master password is required" });
  }

  try {
    if (loadExisting && fs.existsSync(vaultFile)) {
      const vaultData = JSON.parse(fs.readFileSync(vaultFile, "utf8"));
      if (!vaultData.json || !vaultData.checksum) {
        return res.status(500).json({ error: "Vault file is corrupted" });
      }

      try {
        keychain = await Keychain.load(masterPassword, vaultData.json, vaultData.checksum);
        return res.json({ message: "Vault loaded successfully." });
      } catch (err) {
        // Catch incorrect master password specifically
        return res.status(401).json({ error: "Incorrect master password." });
      }
    } else {
      keychain = await Keychain.init(masterPassword);

      // Save new vault immediately
      const [json, checksum] = await keychain.dump();
      fs.writeFileSync(vaultFile, JSON.stringify({ json, checksum }, null, 2));

      return res.json({ message: "New vault created successfully." });
    }
  } catch (err) {
    console.error("Vault init error:", err);
    return res.status(500).json({ error: "Failed to initialize vault." });
  }
});

// Add password
app.post("/api/vault/password", async (req, res) => {
  if (!keychain) return res.status(400).json({ error: "Vault not initialized." });

  const { domain, password, username } = req.body;
  if (!domain || !password) return res.status(400).json({ error: "Domain and password required." });

  try {
    const { strToBuf, bufToBase64 } = await import("./core/encodingUtils.js");
    const { computeHMAC, generateIV, encryptAESGCM } = await import("./core/cryptoUtils.js");

    const domainBuf = strToBuf(domain);
    const domainHMAC = await computeHMAC(keychain.hmacKey, domainBuf);
    const domainKey = bufToBase64(domainHMAC);

    const iv = generateIV();
    const passwordBuf = strToBuf(password.padEnd(64, " "));
    const ciphertext = await encryptAESGCM(keychain.aesKey, passwordBuf, iv, domainHMAC);
    const ciphertextBase64 = bufToBase64(new Uint8Array(ciphertext));

    keychain.kvs[domainKey] = { ciphertext: ciphertextBase64, iv: bufToBase64(iv), site: domain, username };

    // Save updated vault
    const [json, checksum] = await keychain.dump();
    fs.writeFileSync(vaultFile, JSON.stringify({ json, checksum }, null, 2));

    return res.json({ message: "Password stored successfully.", domainKey });
  } catch (err) {
    console.error("Add password error:", err);
    return res.status(500).json({ error: "Failed to store password." });
  }
});

// Retrieve all passwords
app.get("/api/vault/passwords", async (req, res) => {
  if (!keychain) return res.status(400).json({ error: "Vault not initialized." });

  try {
    const { bufToStr, strToBuf } = await import("./core/encodingUtils.js");
    const { decryptAESGCM, computeHMAC } = await import("./core/cryptoUtils.js");

    const passwords = [];

    for (const [domainKey, entry] of Object.entries(keychain.kvs)) {
      try {
        const domainHMAC = await computeHMAC(keychain.hmacKey, strToBuf(entry.site));
        const decrypted = await decryptAESGCM(
          keychain.aesKey,
          new Uint8Array(Buffer.from(entry.ciphertext, "base64")),
          new Uint8Array(Buffer.from(entry.iv, "base64")),
          domainHMAC
        );
        passwords.push({
          id: domainKey,
          site: entry.site,
          username: entry.username || "",
          password: bufToStr(decrypted).trimEnd(),
        });
      } catch (err) {
        console.error("Failed to decrypt", domainKey, err);
      }
    }

    return res.json({ passwords });
  } catch (err) {
    console.error("Fetch passwords error:", err);
    return res.status(500).json({ error: "Failed to fetch passwords." });
  }
});

app.listen(5000, () => console.log("Backend running on http://localhost:5000"));
