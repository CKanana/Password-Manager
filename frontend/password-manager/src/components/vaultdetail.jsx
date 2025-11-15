import React, { useState, useEffect } from "react";
import PasswordItem from "./passitem";

function VaultDetail({ vault, goBack }) {
  const [passwords, setPasswords] = useState([]);
  const [site, setSite] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [vaultReady, setVaultReady] = useState(false);
  const [masterPassword, setMasterPassword] = useState("");
  const [askingPassword, setAskingPassword] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [vaultExists, setVaultExists] = useState(null); // null = unknown, true/false = known

  // Check if vault exists
  useEffect(() => {
    const checkVault = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/vault/exists");
        const data = await res.json();
        setVaultExists(data.exists);
      } catch (err) {
        console.error("Failed to check vault:", err);
      }
    };
    checkVault();
  }, []);

  const initVault = async (password, loadExisting) => {
    try {
      const res = await fetch("http://localhost:5000/api/vault/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ masterPassword: password, loadExisting }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to load vault. Wrong password?");
        return false;
      }

      setVaultReady(true);
      fetchPasswords();
      return true;
    } catch (err) {
      console.error("Vault initialization failed:", err);
      alert("Error initializing vault. See console.");
      return false;
    }
  };

  const handleMasterPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!masterPassword) return alert("Enter your master password");

    const success = await initVault(masterPassword, vaultExists);
    if (success) setAskingPassword(false);
  };

  const fetchPasswords = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/vault/passwords");
      const data = await res.json();
      setPasswords(data.passwords || []);
    } catch (err) {
      console.error("Failed to fetch passwords:", err);
    }
  };

  const addPassword = async (e) => {
    e.preventDefault();
    if (!site || !password) return;

    try {
      const res = await fetch("http://localhost:5000/api/vault/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: site, password, username }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("Failed to add password:", data);
        alert(data.error || "Failed to add password");
        return;
      }

      setSite("");
      setUsername("");
      setPassword("");
      setShowAddForm(false);
      fetchPasswords();
    } catch (err) {
      console.error("Failed to add password:", err);
    }
  };

  if (askingPassword) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-900 via-black to-purple-800 text-gray-200">
        <h2 className="text-2xl font-bold mb-6">
          {vaultExists ? "Enter Master Password" : "Create Master Password"}
        </h2>
        <form onSubmit={handleMasterPasswordSubmit} className="flex flex-col gap-4 w-full max-w-md">
          <input
            type="password"
            placeholder="Master Password"
            value={masterPassword}
            onChange={(e) => setMasterPassword(e.target.value)}
            className="p-3 rounded-lg text-black"
            required
          />
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg"
          >
            {vaultExists ? "Unlock Vault" : "Create Vault"}
          </button>
        </form>
        <button onClick={goBack} className="mt-4 text-purple-400 hover:underline">
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-900 via-black to-purple-800 text-gray-200">
      <button
        onClick={goBack}
        className="mb-4 px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700"
      >
        Back
      </button>

      <h2 className="text-2xl font-bold mb-6">{vault.vaultName} Vault</h2>

      {passwords.length === 0 ? (
        <p className="text-gray-400 italic mb-6">No passwords yet. Click below to add.</p>
      ) : (
        <div className="space-y-3 mb-6 w-full max-w-md">
          {Object.entries(passwords).map(([key, entry]) => (
            <PasswordItem
              key={key}
              site={entry.site}
              username={entry.username || ""}
              password={entry.password}
            />
          ))}
        </div>
      )}

      <button
        onClick={() => setShowAddForm(!showAddForm)}
        className="mb-4 bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg text-white"
      >
        {showAddForm ? "Cancel" : "Add Password"}
      </button>

      {showAddForm && (
        <form onSubmit={addPassword} className="flex flex-col gap-3 max-w-md w-full mb-6">
          <input
            type="text"
            placeholder="Site"
            value={site}
            onChange={(e) => setSite(e.target.value)}
            className="p-2 rounded-lg text-black"
            required
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-2 rounded-lg text-black"
          />
          <input
            type="text"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 rounded-lg text-black"
            required
          />
          <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg">
            Save Password
          </button>
        </form>
      )}
    </div>
  );
}

export default VaultDetail;
