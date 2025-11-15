import React, { useState } from "react";
import PasswordItem from "./passitem";

function VaultDetail({ vault, goBack }) {
  const [passwords, setPasswords] = useState(vault.passwords || []);
  const [showForm, setShowForm] = useState(false);
  const [site, setSite] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const addPassword = (e) => {
    e.preventDefault();
    setPasswords([...passwords, { site, username, password, id: Date.now() }]);
    setSite("");
    setUsername("");
    setPassword("");
    setShowForm(false); // hide form after adding
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-black to-purple-800 text-gray-200 p-4">
      <div className="w-full max-w-2xl bg-black/40 backdrop-blur-xl border border-purple-700/40 rounded-2xl p-6 shadow-lg shadow-purple-800/30">

        {/* Back Button */}
        <button
          onClick={goBack}
          className="mb-4 px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition"
        >
          Back
        </button>

        {/* Vault Title */}
        <h2 className="text-2xl font-bold mb-6 text-center text-purple-300">
          {vault.vaultName} Vault
        </h2>

        {/* Show "Add Password" button if form is hidden */}
        {!showForm && (
          <div className="mb-4 text-center">
            <p className="mb-2">
              {passwords.length === 0
                ? "No passwords yet."
                : `You have ${passwords.length} saved password(s).`}
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition"
            >
              Add Password
            </button>
          </div>
        )}

        {/* Password Entry Form */}
        {showForm && (
          <form onSubmit={addPassword} className="mb-6 flex flex-col gap-3">
            <input
              type="text"
              placeholder="Site"
              value={site}
              onChange={(e) => setSite(e.target.value)}
              className="p-3 rounded-lg text-black"
              required
            />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="p-3 rounded-lg text-black"
              required
            />
            <input
              type="text"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-3 rounded-lg text-black"
              required
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg flex-1 transition"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg flex-1 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Password List */}
        <div className="space-y-3">
          {passwords.map((p) => (
            <PasswordItem
              key={p.id}
              site={p.site}
              username={p.username}
              password={p.password}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default VaultDetail;
