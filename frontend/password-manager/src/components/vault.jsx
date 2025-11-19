import React, { useState } from "react";
import { Lock } from "lucide-react";

function AddVaultForm({ addVault }) {
  const [vaultName, setVaultName] = useState("");
  const [description, setDescription] = useState("");
  const [masterPassword, setMasterPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!masterPassword) return alert("Master password is required");

    // Initialize vault on backend
    try {
      const res = await fetch("http://localhost:5000/api/vault/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ masterPassword, loadExisting: false }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Vault creation failed");
        return;
      }
      alert("Vault created successfully!");
      addVault({ vaultName, description });
      setVaultName("");
      setDescription("");
      setMasterPassword("");
    } catch (err) {
      console.error("Vault initialization failed:", err);
      alert("Error creating vault. See console.");
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto mt-10 p-8 rounded-2xl backdrop-blur-xl 
                    bg-black/40 border border-purple-700/40 shadow-lg shadow-purple-800/30 text-gray-200">
      <div className="flex items-center justify-center mb-6">
        <Lock size={40} className="text-purple-400 animate-bounce-slow" />
      </div>

      <h2 className="text-2xl font-bold text-center text-purple-300 mb-4">
        Create a New Vault
      </h2>
      <p className="text-center text-gray-400 mb-8">
        Organize and secure your passwords inside vaults.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-gray-200">
        <input
          type="text"
          placeholder="Vault Name"
          value={vaultName}
          onChange={(e) => setVaultName(e.target.value)}
          className="p-3 rounded-lg bg-black/40 border border-purple-700/40 text-gray-200 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          required
        />

        <textarea
          placeholder="Vault Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="p-3 rounded-lg bg-black/40 border border-purple-700/40 text-gray-200 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition h-24 resize-none"
        ></textarea>

        <input
          type="password"
          placeholder="Master Password"
          value={masterPassword}
          onChange={(e) => setMasterPassword(e.target.value)}
          className="p-3 rounded-lg bg-black/40 border border-purple-700/40 text-gray-200 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          required
        />

        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-gray-100 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-purple-600/40"
        >
          Add Vault
        </button>
      </form>

      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce-slow { animation: bounce-slow 3s infinite; }
      `}</style>
    </div>
  );
}

export default AddVaultForm;
